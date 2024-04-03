
import express from "express";
import http from "http";
import { Server } from "socket.io";
import args from "server/args";
import { setup_routes } from "server/http";
import { setup_sockets } from "server/sockets";

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { createServer as createViteServer } from 'vite'

import { getMainProps } from "server/ssr_props";

const port = args.port;
const mode = args.mode;

const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function createServer() {
  const app = express()


  // Create Vite server in middleware mode and configure the app type as
  // 'custom', disabling Vite's own HTML serving logic so parent server
  // can take control

  const vite = await createViteServer({
        appType: 'custom',
        server: {
          middlewareMode: true,
          hmr: mode === 'development',
        },
        base: '/',
  })

  if (mode === 'production') {
    app.use('/client', express.static(path.resolve(__dirname, 'client')))
    app.use('/dist', express.static(path.resolve(__dirname, 'dist')))
    app.use('/dist/client', express.static(path.resolve(__dirname, 'client')))
  }

  // start socket.io server on same server instance
  const http_server = http.createServer(app);
  const io = new Server(http_server, {
    // cors: {
    //   origin: '*',
    // },
  });
  setup_sockets(io);
  setup_routes(app, io);

  // Use vite's connect instance as middleware. If you use your own
  // express router (express.Router()), you should use router.use
  // When the server restarts (for example after the user modifies
  // vite.config.js), `vite.middlewares` is still going to be the same
  // reference (with a new internal stack of Vite and plugin-injected
  // middlewares). The following is valid even after restarts.
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
    // next()
  })

  if(mode === 'development') {
    app.use(vite.middlewares)
  }

  app.use('*', async (req, res, next) => {
    const url = req.originalUrl
    const initial_state = await getMainProps(req);
  
    try {
      // 1. Read index.html
      let template = fs.readFileSync(
        // path.resolve(__dirname, './index.html'),
        path.resolve(__dirname, mode === 'production' ? './dist/index.html' : './index.html'),
        'utf-8',
      )
  
      // 2. Apply Vite HTML transforms. This injects the Vite HMR client,
      //    and also applies HTML transforms from Vite plugins, e.g. global
      //    preambles from @vitejs/plugin-react
      if(mode === 'development') {
        template = await vite.transformIndexHtml(url, template)
      }
  
      // 3a. Load the server entry. ssrLoadModule automatically transforms
      //    ESM source code to be usable in Node.js! There is no bundling
      //    required, and provides efficient invalidation similar to HMR.
      
      const { render } = await vite.ssrLoadModule('/server/ssr.tsx')

      // 3b. Since Vite 5.1, you can use the experimental createViteRuntime API
      //    instead.
      //    It fully supports HMR and works in a simillar way to ssrLoadModule
      //    More advanced use case would be creating a runtime in a separate
      //    thread or even a different machine using ViteRuntime class
      // const runtime = await vite.createViteRuntime(vite)
      // const { render } = await runtime.executeEntrypoint('/src/entry-server.js')
  
      // 4. render the app HTML. This assumes entry-server.js's exported
      //     `render` function calls appropriate framework SSR APIs,
      //    e.g. ReactDOMServer.renderToString()
      
      const {body, head} = await render(url, initial_state)

      // 5. Inject the app-rendered HTML into the template.
      const html = template.replace(`<!--ssr-outlet-->`, body)
        .replace(`<!--ssr-head-->`, head)
        .replace(`'<!--ssr-state-->'`, JSON.stringify(initial_state))
  
      // 6. Send the rendered HTML back.
      res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
    } catch (e) {
      // If an error is caught, let Vite fix the stack trace so it maps back
      // to your actual source code.
      vite.ssrFixStacktrace(e)
      next(e)
    }
  })

  http_server.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`)
  })

  return app
}

const app = await createServer();