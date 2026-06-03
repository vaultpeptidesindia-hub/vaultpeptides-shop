# Vault Peptides - Deployment Guide

## 1. Prerequisites
- Node.js 18+
- PostgreSQL Database (Neon.tech or Supabase recommended)
- Vercel Account for hosting

## 2. Environment Variables
Create a `.env` file (see `.env.example`) and set the following:
- `DATABASE_URL`: Your PostgreSQL connection string.
- `NEXTAUTH_SECRET`: A random string for session encryption.
- `NEXTAUTH_URL`: Your production URL (e.g., `https://vaultpeptides.shop`).
- `WHATSAPP_NUMBER`: The business WhatsApp number (currently `918722579999`).

## 3. Database Setup
Run the following commands to initialize your database:
```bash
npx prisma generate
npx prisma db push
```
*Note: Use `prisma migrate dev` for development and `prisma db push` for quick prototyping if migrations aren't enabled.*

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
