# [MBRV](https://mbrv.org): Murat's Bun, React & Vite template
by [murat](https://twitter.com/mayfer)

# Intro

I got sick of trading one simplicity for another complexity.

This is a single full-stack TypeScript boilerplate that runs on `bun`. Vite's bundler and HMR features are served by the same `bun` backend, so it doesn't use any external commands or scripts.

 * `bun dev` provides hot reloads & source maps
 * `bun prod` builds & serves production
 * `bun run build` to build for production
 * `bun run.ts` to run without build step


## Single port convenience
- Server and client run on the same port
- No proxies or CORS issues

## Bun's flexibility
- Speed aside, bun makes running TypeScript a pleasure
- run.ts as single clear entry point

## React hot module reloads
- Edit and save `client/App.tsx` to test component hot reloads
- Server will also reload when `server/` or `shared/` are saved, using nodemon to restart the bun process

## Shared files
- Server & client can use shared interfaces, types, and functions via `shared/` folder

## Sane server-side rendering
- SSR is done with explicit code, no framework magic
- Enabled by default, with all relevant code in `run.ts` & `server/ssr.tsx`

## Express & socket.io
- Express router in `server/http.ts`
- Socket.io setup in `server/sockets.ts`

