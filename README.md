# Fitsum Portfolio

Modern animated portfolio powered by React (Vite) on the frontend and an Express + MongoDB API on the backend.

## Features

- Animated, responsive UI with Tailwind + Lucide icons
- CMS-style admin tools for projects, profile, YouTube, and testimonials
- Integrated backend with JWT auth, file uploads, and health/sync endpoints
- Shared TypeScript utilities for data consistency between client and server

## Tech Stack

- Frontend: React 18 + TypeScript, Vite, Tailwind CSS, React Router
- Backend: Node.js, Express, MongoDB/Mongoose, JWT, Multer
- Tooling: ESLint, TypeScript, concurrently (for combined dev workflow)

## Environment Variables

1. **Frontend** - copy `.env.example` to `.env` (or `.env.local`) and adjust:

   ```
   VITE_API_URL=http://localhost:5000/api
   VITE_FRONTEND_URL=http://localhost:5173
   ```

2. **Backend** - create `server/.env` (sample values shown below):

   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/fitsum_portfolio
   JWT_SECRET=replace-with-a-long-random-string
   JWT_EXPIRES_IN=7d
   FRONTEND_URL=http://localhost:5173
   LOG_LEVEL=info
   NODE_ENV=development
   ```

Ensure `VITE_API_URL` matches the backend `PORT` and that `FRONTEND_URL` mirrors the domain where Vite serves the app to avoid CORS issues.

## Install Dependencies

```bash
npm install          # frontend deps (root)
cd server && npm install
```

## Development Workflow

Start both servers with one command (recommended):

```bash
npm run dev:full
```

Scripts:

- `npm run dev:client` - Vite dev server only
- `npm run dev:server` - Express API (via Nodemon)
- `npm run dev:full` - runs both in parallel with live logs

The API is available at `http://localhost:5000/api` and the frontend at `http://localhost:5173` by default. The admin dashboard performs health checks against `/api/health` and exposes sync/reset tools once you are authenticated.

## Production Build

```bash
npm run build      # build frontend assets
```

Serve `dist/` via your preferred host and deploy the Express server separately (set `VITE_API_URL` to the deployed API URL before building).

## License

MIT
