# MBRV
## Murat's Bun, React, Vite template

I got sick of trading one simplicity for another complexity.

This is a single server that uses `bun` runtime. Vite's bundler and HMR features are served by the same `bun` backend.


## Features

- **Bun's flexibility**
  - Speed aside, `bun` makes it easy to run TypeScript, JavaScript, CommonJS, modules, etc all in one codebase.
- **Single Port Convenience**
  - Both frontend and backend run on the same port. No CORS issues, no proxies.
  - Server-side rendering is ready and explicit, no framework magic required.
- **Hot Module Reloads (HMR)**
  - Saving files in `client/` will apply React changes without losing state.
  - Saving files in `server/` or `shared/` will reload the server.
- **Shared Codebase**
  - The `shared/` folder allows for sharing interfaces, types, and functions between the server and client.
- **Familiar routes**
  - Uses express

## Getting Started

**Running the Development Server**: Simply execute `bun dev` to start both frontend and backend on the same port.
