# [mbrv.org](https://mbrv.org): Murat's Bun, React & Vite template
by [murat](https://twitter.com/mayfer)

Most TypeScript bundlers that support UI hot reloads require running server & client on different processes/ports, leading to a cascade of problems.

MBRV runs on a single `bun` process without sacrificing dev or prod features, such as hot reloads or server-side rendering.

## Setup
- `bun i` to install packages
- `bun run dev` provides hot reloads & source maps
- `bun run build` prepares production build
- `bun run prod` serves production

## Make changes
- `client/` contains React UI code
- `shared/` folder contains shared interfaces, types, and functions that both client & server can use
- `server/` contains http & socket APIs
  - Express endpoints in `server/apis/http.ts`
  - Socket.io setup in `server/apis/sockets.ts`

# Benefits

## Single port convenience
- Server & client run on the same process, same port
- No proxies or CORS issues

## Bun's flexibility
- Speed aside, bun makes it a pleasure to run TypeScript without a transpiler
- `run.ts` as single entry point

## React hot module reloads
- UI code changes appear instantly in the browser
- Page will reload if any server code is changed

## Shared files
- Server & client can use shared TypeScript interfaces, types, and functions via `shared/` folder

## Sane server-side rendering
- SSR is done with explicit code, no framework magic
- Enabled by default, with entry point in `server/ssr.tsx`
- Use `--ssr=false` to disable SSR

