# Teja Software Solutions

A full-stack web application for managing clients, employees, projects, services, and internal messaging — with role-based access for Admins, Employees, and Clients.

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Database ORM | Prisma |
| Database | PostgreSQL (Neon) |
| Styling | Tailwind CSS |
| Auth | JWT (HTTP-only cookies) |
| Language | TypeScript |

---

## Getting started

### Prerequisites

- Node.js 18+
- A PostgreSQL database (local or hosted, e.g. [Neon](https://neon.tech))

### 1. Clone the repository

```bash
git clone https://github.com/TejaBudumuru3/teja-software-solutions.git
cd teja-software-solutions
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root directory:

```dotenv
DATABASE_URL=postgresql://user:password@host:port/dbname
JWT_SECRET="your-secret-key"
```

> **Never commit your `.env` file.** Add it to `.gitignore`.

### 4. Set up the database

```bash
npx prisma migrate dev --name init
npx prisma generate
```

To seed initial data:

```bash
npx tsx seed.ts
```

### 5. Run the development server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

---

## Project structure

```
app/
 page.tsx              # Public landing page
 login/                # Login page
 admin/                # Admin dashboard
 client/               # Client dashboard
 employee/             # Employee dashboard
 api/                  # API routes (auth, messages, projects, etc.)
 components/           # Shared UI components
 lib/                  # Auth helpers, schema types, utilities
prisma/
 schema.prisma         # Database schema
 migrations/           # Migration history
public/                   # Static assets
```

---

## Roles and access

| Role | Access |
|---|---|
| **Admin** | Full access — manage users, projects, clients, employees, services |
| **Employee** | View assigned projects, message clients and admins |
| **Client** | View own projects, submit service requests, message team |

> Registration is restricted to Admins only. There is no public sign-up.

---

## Available scripts

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run start        # Start production server
npx tsc --noEmit     # Type-check without emitting files
npx prisma studio    # Open Prisma Studio (database GUI)
```

---

## Deployment

1. Set environment variables on your hosting platform (Vercel, Railway, etc.).
2. Run `npx prisma migrate deploy` to apply migrations in production.
3. Build and start with `npm run build && npm run start`.

---

## License

This project is private and not open for public use.
