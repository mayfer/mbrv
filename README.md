# [mbrv.org](https://mbrv.org): Murat's Bun, React & Vite template
by [murat](https://twitter.com/mayfer)

# Intro

Most TypeScript bundlers that support UI hot reloads require running server & client on different processes/ports, leading to a cascade of problems.

MBRV runs on a single `bun` process without sacrificing dev or prod features, such as hot reloads or server-side rendering.

 * `bun run dev` provides hot reloads & source maps
 * `bun run prod` builds & serves optimized version
 * `bun run build` builds only (into `dist/`)
 * `bun run.ts --help` to run without bundlers or hot reloads

## Single port convenience
- Server and client run on the same port
- No proxies or CORS issues

## Bun's flexibility
- Speed aside, bun makes running TypeScript a pleasure
- run.ts as single clear entry point, no blackbox scripts or commands

## React hot module reloads
- Edit and save `client/App.tsx` to test component hot reloads
- Server will also reload when `server/` or `shared/` are saved, using nodemon to restart the bun process

## Shared files
- Server & client can use shared interfaces, types, and functions via `shared/` folder

## Sane server-side rendering
- SSR is done with explicit code, no framework magic
- Enabled by default, with all relevant code in `run.ts` & `server/ssr.tsx`

## Express & socket.io
- Express router in `server/apis/http.ts`
- Socket.io setup in `server/apis/sockets.ts`

