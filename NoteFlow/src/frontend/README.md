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

## Deploy on Vercel (single project)

Set Vercel project root directory to `src/frontend`.

- Keep `NEXT_PUBLIC_API_URL` empty for same-origin `/api`.
- This project includes a Vercel function at `api/[...all].ts` that serves backend routes.
- Add backend env vars in this same Vercel project:
  - `MONGODB_URI`
  - `MONGODB_DB_NAME`
  - `JWT_ACCESS_SECRET`
  - `JWT_REFRESH_SECRET`
  - `ACCESS_TOKEN_EXPIRES`
  - `REFRESH_TOKEN_EXPIRES`
  - `CLIENT_ORIGINS` (include your frontend domain)
  - `CLOUDINARY_CLOUD_NAME`
  - `CLOUDINARY_API_KEY`
  - `CLOUDINARY_API_SECRET`
