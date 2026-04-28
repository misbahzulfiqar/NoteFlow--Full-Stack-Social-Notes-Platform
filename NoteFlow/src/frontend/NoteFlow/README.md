# NoteFlow

NoteFlow is split into two independent apps:

- `src/frontend` - Next.js frontend
- `src/backend` - Express API

## Local run

Run backend:

```bash
cd src/backend
cp .env.example .env
npm install
npm run dev
```

Run frontend (new terminal):

```bash
cd src/frontend
cp .env.example .env.local
npm install
npm run dev
```

## Separate Vercel deployment (recommended)

Create **two Vercel projects** from the same repo:

1. Backend project
   - Root directory: `src/backend`
   - Set all backend env vars from `src/backend/.env.example`
2. Frontend project
   - Root directory: `src/frontend`
   - Set `NEXT_PUBLIC_API_URL` to backend URL with `/api`
   - Example: `https://your-backend.vercel.app/api`

This keeps backend and frontend fully separate, without duplicate deployment logic.
