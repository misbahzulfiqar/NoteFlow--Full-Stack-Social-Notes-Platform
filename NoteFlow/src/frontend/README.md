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

## Required environment variable

- `NEXT_PUBLIC_API_URL`
  - local: `http://localhost:5000/api`
  - deployed: `https://your-backend-project.vercel.app/api`

## Deploy frontend on Vercel (separate project)

Set Vercel project root directory to `src/frontend`.

In Vercel Project Settings -> Environment Variables, set:
- `NEXT_PUBLIC_API_URL=https://your-backend-project.vercel.app/api`
