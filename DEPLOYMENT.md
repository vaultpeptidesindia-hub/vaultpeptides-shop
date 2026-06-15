# Vault Peptides - Deployment Guide

## 0. Local Quick Start (zero-config) ⚡
No external database needed — the app ships with a SQLite database file.

```bash
npm install
npx prisma generate
npx prisma db push      # creates prisma/dev.db
npx prisma db seed      # loads products + creates the admin account
npm run dev             # http://localhost:3000
```

**Seeded admin login:** `admin@vaultpeptides.shop` / `VaultAdmin@123`
(change these in `.env` via `ADMIN_EMAIL` / `ADMIN_PASSWORD`, then re-seed.)

**Where customer data is saved:** besides the database, every signup and order is
also written to clean, human-readable files you can open directly:
- `data/customers.json` and `data/customers.csv` — every customer's details
- `data/orders.json` — every order placed

## 1. Prerequisites
- Node.js 18+ (this project is tested on Node 24)
- A WhatsApp number for orders/COA (currently `918722579999`)
- For production: a host (Vercel/VPS) and — if you outgrow SQLite — a PostgreSQL database

## 2. Environment Variables
Copy `.env.example` to `.env` and set:
- `DATABASE_URL`: `file:./dev.db` for local SQLite, or a PostgreSQL URL for production.
- `AUTH_SECRET` / `NEXTAUTH_SECRET`: random string for session encryption (`openssl rand -base64 32`).
- `NEXTAUTH_URL`: your URL (`http://localhost:3000` locally, `https://vaultpeptides.shop` in prod).
- `WHATSAPP_NUMBER`: the business WhatsApp number.
- `ADMIN_EMAIL` / `ADMIN_PASSWORD`: credentials seeded for the `/admin` dashboard.

## 3. Database Setup
```bash
npx prisma generate
npx prisma db push      # syncs the schema to your database
npx prisma db seed      # products + admin user
```

### Switching to PostgreSQL for production
The schema is intentionally **portable** (plain strings instead of enums, JSON-in-text
instead of arrays). To move to Postgres, change ONLY the datasource in
`prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"   // was "sqlite"
  url      = env("DATABASE_URL")
}
```
…then set `DATABASE_URL` to your Postgres connection string and run `prisma db push` + `prisma db seed`.
No application code changes are required.

## 4. Deploy to Vercel
1. Push your code to a GitHub repository.
2. Connect the repository to Vercel.
3. Add the environment variables in the Vercel dashboard.
4. Deployment will happen automatically.

## 5. Security Checklist
- [x] Password hashing using Bcrypt (12 rounds).
- [x] Secure HTTP-only cookies for sessions.
- [x] Middleware-based route protection for `/dashboard` and `/admin`.
- [x] Server Actions for secure database mutation.
- [x] CSRF protection (native to NextAuth).
- [x] Input validation using Zod.
- [ ] Implement Rate Limiting (e.g., using `upstash/ratelimit`).
- [ ] Configure Content Security Policy (CSP) headers.
