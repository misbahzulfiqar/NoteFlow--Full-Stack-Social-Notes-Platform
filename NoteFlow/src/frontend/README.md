# Frontend (Next.js)

This folder contains the NoteFlow frontend app.

## Local development

1. Copy envs:

```bash
cp .env.example .env.local
```

2. Start frontend:

```bash
npm install
npm run dev
```

## API base URL behavior

- If `NEXT_PUBLIC_API_URL` is set, frontend uses that value.
- If it is not set in browser, frontend uses same-origin `/api`.
  - Example on Vercel: `https://your-frontend.vercel.app/api`
  - This is the correct option for single-project deployment.

## Deploy frontend on Vercel

Set Vercel project root directory to `src/frontend`.

For single-project deployment, do not set `NEXT_PUBLIC_API_URL`.
For separate backend deployment, set:
- `NEXT_PUBLIC_API_URL=https://your-backend-project.vercel.app/api`
