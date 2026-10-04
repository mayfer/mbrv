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

const preferred_port: number = args.port;
const mode: 'development' | 'production' = args.mode;
const ssr_enabled: boolean = args.ssr;

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const index_html_path_dev = path.resolve(__dirname, '../client/index.html');
const index_html_path_prod = path.resolve(__dirname, '../dist/client/client/index.html');
const ssr_path_dev = path.resolve(__dirname, '../server/ssr.tsx');
const ssr_path_prod = path.resolve(__dirname, '../dist/server/ssr.js');
const client_dir_prod = path.resolve(__dirname, '../dist/client');

function listenOnAvailablePort(server: http.Server, preferredPort: number): Promise<number> {
  return new Promise((resolve, reject) => {
    const tryPort = (port: number) => {
      const onError = (error: NodeJS.ErrnoException) => {
        server.removeListener('listening', onListening)

        if (error.code === 'EADDRINUSE') {
          console.warn(`Port ${port} is busy; trying ${port + 1}...`)
          tryPort(port + 1)
          return
        }

        reject(error)
      }

      const onListening = () => {
        server.removeListener('error', onError)
        resolve(port)
      }

      server.once('error', onError)
      server.once('listening', onListening)
      server.listen(port)
    }

    tryPort(preferredPort)
  })
}

export async function createServer() {
  if(mode === 'production') {
    if (!fs.existsSync(index_html_path_prod) || !fs.existsSync(ssr_path_prod)) {
      console.error('Production build not found. Please run `bun run build` first.')
      process.exit(1)
    }
  }
  const app = express()

  const http_server = http.createServer(app);
  const io = new SocketIOServer(http_server, {});
  setup_sockets(io);
  setup_routes(app, io);

  // Bind first so dev HMR uses the port this instance actually got.
  const port = await listenOnAvailablePort(http_server, preferred_port)

  let vite;
  if(mode === 'development') {
    vite = await createViteServer({
        configFile: path.resolve(__dirname, '../config/vite.config.ts'),
        server: {
          middlewareMode: true,
          port,
          // Share the application server instead of opening a second HMR port.
          hmr: { server: http_server, clientPort: port },
        },
        base: '/',
    })
    console.log('Vite server created, base: ', vite.config.base)
  } else if (mode === 'production') {
    app.use('/client', express.static(client_dir_prod))
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

    const skip_prefixes = [
      '/client',
      '/shared',
      '/node_modules',
      '/@vite',
      '/@react-refresh',
      '/@'
    ];
    
    if (skip_prefixes.some(prefix => url.startsWith(prefix))) {
      return next();
    }

    const initial_state = await getMainProps(req);
  
    try {
      let template = fs.readFileSync(
        path.resolve(__dirname, mode === 'production' ? index_html_path_prod : index_html_path_dev),
        'utf-8',
      )

      if(mode === 'development') {
        template = await vite.transformIndexHtml(url, template)
      }
  
      let html = '';

      if(ssr_enabled && mode === 'development') {
        const { render } = await vite.ssrLoadModule(ssr_path_dev)
        
        const ssr_parts = await render(url, initial_state);
        const {body, head} = ssr_parts;

        html = template.replace(`<!--ssr-outlet-->`, body)
          .replace(`<!--ssr-head-->`, head)
          .replace(`'<!--ssr-state-->'`, JSON.stringify(initial_state))
      } else if(ssr_enabled && mode === 'production') {
        const { render } = require(ssr_path_prod)
        const ssr_parts = await render(url, initial_state);
        const {body, head} = ssr_parts;

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
      if(mode === 'development') {
        vite.ssrFixStacktrace(e)
      }
      next(e)
    }
  })

  if(mode === 'development') {
    app.use(vite.middlewares)
  }

  console.log(`Server and HMR listening on http://localhost:${port}`)

  return app
}
