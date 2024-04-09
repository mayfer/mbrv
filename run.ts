import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import express from "express";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import { createServer as createViteServer } from 'vite'

// app specific imports
import args from "server/args";
import { setup_routes } from "server/apis/http";
import { setup_sockets } from "server/apis/sockets";
import { getMainProps } from "server/main_props";

const port = args.port;
const mode = args.mode; // development or production
const ssr_enabled = args.ssr;

const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function createServer() {
  const app = express()

  const http_server = http.createServer(app);
  const io = new SocketIOServer(http_server, {});
  setup_sockets(io);
  setup_routes(app, io);

  const vite = await createViteServer({
        appType: 'custom',
        server: {
          middlewareMode: true,
          hmr: mode === 'development',
        },
        base: '/',
        clearScreen: false,
  })

  if (mode === 'production') {
    app.use('/client', express.static(path.resolve(__dirname, 'dist')))
  }

  // vite exposes all files at root by default, this is to prevent accessing server files
  app.use(async (req, res, next) => {
    const url = req.originalUrl
    let cleaned_url = url.split('?')[0]
    // remove leading slashes
    cleaned_url = cleaned_url.replace(/^\/+/, '')

    const allowed_prefixes = ['client', 'shared', 'node_modules', 'socket.io'];
    if (cleaned_url == '' || allowed_prefixes.some(prefix => cleaned_url.startsWith(prefix))) {
      return next();
    } else {
      // check if file with exact path exists
      const file_path = path.join(__dirname, cleaned_url);
      const exists = fs.existsSync(file_path);
      if(exists) {
        res.status(404).send('Not found');
      } else {
        next();
      }
    }
  })


  app.get('*', async (req, res, next) => {
    const url = req.originalUrl

    const skip_prefixes = ['/client', '/node_modules', '/@vite', '/@react-refresh'];
    if (skip_prefixes.some(prefix => url.startsWith(prefix))) {
      return next();
    }

    const initial_state = await getMainProps(req);
  
    try {
      let template = fs.readFileSync(
        path.resolve(__dirname, mode === 'production' ? './dist/index.html' : './index.html'),
        'utf-8',
      )

      // Apply Vite HTML transforms. This injects the Vite HMR client,
      //    and also applies HTML transforms from Vite plugins, e.g. global
      //    preambles from @vitejs/plugin-react
      if(mode === 'development') {
        template = await vite.transformIndexHtml(url, template)
      }
  
      let html = '';

      if(ssr_enabled) {
        // ssr.tsx exports render() which returns a string body (and other metadata)
        const { render } = await vite.ssrLoadModule('/server/ssr.tsx')
        
        const ssr_parts = await render(url, initial_state);
        const {body, head} = ssr_parts;

        // Inject the app-rendered HTML & head tags (for css etc) into the template.
        html = template.replace(`<!--ssr-outlet-->`, body)
          .replace(`<!--ssr-head-->`, head)
          .replace(`'<!--ssr-state-->'`, JSON.stringify(initial_state))
      } else {
        html = template.replace(`<!--ssr-outlet-->`, '')
          .replace(`<!--ssr-head-->`, '')
          .replace(`'<!--ssr-state-->'`, '{}')
      }

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
      
    } catch (e) {
      // If an error is caught, let Vite fix the stack trace so it maps back
      // to your actual source code.
      vite.ssrFixStacktrace(e)
      next(e)
    }
  })

  if(mode === 'development') {
    app.use(vite.middlewares)
  }

  http_server.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`)
  })

  return app
}

const app = await createServer();
