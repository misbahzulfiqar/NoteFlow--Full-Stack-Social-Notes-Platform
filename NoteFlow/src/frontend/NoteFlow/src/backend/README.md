# Backend (Express API)

This folder contains the NoteFlow backend API.

## Local development

1. Copy envs:

```bash
cp .env.example .env
```

2. Start backend:

```bash
npm install
npm run dev
```

Backend runs on `http://localhost:5000` and API routes are under `/api/*`.

## Deploy backend on Vercel (separate project)

Set Vercel project root directory to `src/backend`.

This backend uses a Vercel serverless entry at `api/[...all].ts`, so all requests such as:
- `/api/auth/*`
- `/api/notes/*`
- `/api/feed/*`

are handled by your Express app.

### Required Vercel environment variables

- `MONGODB_URI`
- `MONGODB_DB_NAME`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `ACCESS_TOKEN_EXPIRES`
- `REFRESH_TOKEN_EXPIRES`
- `CLIENT_ORIGINS` (include your frontend URL, comma-separated if multiple)
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
