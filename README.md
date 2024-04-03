# MBRV
## Murat's Bun + React + Vite template

I got sick of trading one simplicity for another complexity.

This is a single full-stack server that uses `bun` runtime. Vite's bundler and HMR features are served by the same `bun` backend, so it doesn't use any external commands or scripts.

# Instructions
- `bun dev` for hot reloads and source maps.
- `bun prod` to build and serve the application.
- `bun run.ts` to run the application without a build step.


## Single Port Convenience
- Server and client run on the same port, simplifying setup.
- Eliminates common network configuration issues like CORS or the need for proxies.

## Bun's Flexibility
- Runs TypeScript directly without a separate transpiler, streamlining development.
- Utilizes `run.ts` as a straightforward entry point.

## React Hot Module Reloads (HMR)
- Facilitates immediate UI updates upon saving changes in `App.tsx`.
- Server-side code in `server/` or `shared/` directories auto-reloads with `nodemon`, enhancing development flow.

## Shared Files
- Supports code reuse across server and client through a shared folder (`shared/`) for common interfaces, types, and functions.

## Sane Server-Side Rendering (SSR)
- Implements SSR with explicit code rather than framework magic, via `server/ssr.tsx`.
- Offers clear understanding and control over the rendering process.

## Express & Socket.io Integration
- Incorporates Express for routing in `server/http.ts`.
- Uses Socket.io for real-time communication in `server/sockets.ts`.
