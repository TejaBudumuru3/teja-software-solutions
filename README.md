# Teja Software Solutions

Lightweight Next.js + Prisma app for client/team collaboration and messaging.

## Overview

- Two-pane LinkedIn-style messaging UI with role-aware contacts (Admin / Employee / Client).
- Project previews, service requests, and role-based views.
- Built with Next.js (app router), Tailwind CSS utilities, and Prisma for Postgres.

## Features

- Role-aware conversations and contacts endpoint
- Two-pane messaging UI (conversations + messages)
- Project previews and simple service request handling
- Login-only public landing page (no public registration links)

## Quick start

1. Install dependencies

```bash
npm install
```

2. Create environment variables (`.env`)

Required variables:

- `DATABASE_URL` — your Postgres connection string
- `JWT_SECRET` — secret used to sign auth tokens

Example `.env` (do NOT commit):

```dotenv
DATABASE_URL=postgresql://user:pass@host:port/dbname
JWT_SECRET="YOUR_JWT_SECRET"
```

3. Prepare the database (Prisma)

```bash
npx prisma migrate dev --name init
npx prisma generate
```

4. Run the development server

```bash
npm run dev
```

5. Type-check (optional)

```bash
npx tsc --noEmit
```

## Project layout (important files)

- `app/page.tsx` — landing page (HeroFresh + FeatureGrid)
- `app/components/Header.tsx`, `HeroFresh.tsx`, `FeatureGrid.tsx`, `Footer.tsx` — landing UI
- `app/components/Messages.tsx` — two-pane messaging UI
- `app/api/*` — server routes (messages, auth, profile, etc.)
- `prisma/schema.prisma` — Prisma schema

## Notes & decisions

- Public-facing registration routes/CTAs were intentionally removed from the landing (registration is admin-only).
- Landing uses a premium white + blur aesthetic; hero image is loaded from Unsplash for the demo.
- I removed several legacy/unused landing components (Hero variants and preview card) to keep the UI focused.

## Contributing

- Run the dev server and open `http://localhost:3000` to preview.
- Keep environment secrets out of VCS. Use `.env.local` for local development.

## Troubleshooting

- If pages error on missing env variables, confirm `DATABASE_URL` and `JWT_SECRET` exist.
- If Prisma client is stale, run `npx prisma generate`.

---

If you'd like, I can:
- Replace the demo Unsplash hero with an optimized `next/image` usage (recommended for production), or
- Run a repo-wide search to remove any remaining public `/register` links.

Which would you like next?
