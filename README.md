# MarsaTrade

Global Seafood Intelligence — subscription dashboard for seafood traders, exporters, and logistics companies.

## Stack

Next.js 15 · **Supabase (Postgres)** · Prisma · Vercel · Stripe · Frankfurter (ECB FX) · Claude API

## Local development

### 1. Supabase database

1. Create a project at [supabase.com/dashboard](https://supabase.com/dashboard)
2. Go to **Project Settings → Database → Connection string**
3. Copy:
   - **Transaction pooler** (port 6543) → `DATABASE_URL`
   - **Direct connection** (port 5432) → `DIRECT_URL`

```bash
cp .env.example .env.local
# Fill in DATABASE_URL, DIRECT_URL, AUTH_SECRET
```

### 2. Install, migrate, seed

```bash
npm install
npx prisma migrate dev    # runs against DIRECT_URL
npm run db:seed           # demo users + market data
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

| Email | Password | Role |
|-------|----------|------|
| youssef@marsatrade.com | demo123 | Pro subscriber |
| admin@marsatrade.com | admin123 | Admin |

## Deploy to Vercel + Supabase

### 1. Supabase (database)

1. Create project at [supabase.com](https://supabase.com)
2. Note both connection strings (pooler + direct)

### 2. Vercel (hosting)

1. Import repo from GitHub at [vercel.com/new](https://vercel.com/new)
2. Add environment variables:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | Supabase **transaction pooler** (port 6543, `?pgbouncer=true`) |
| `DIRECT_URL` | Supabase **direct** connection (port 5432) |
| `AUTH_SECRET` | Random 32+ char string |
| `ANTHROPIC_API_KEY` | Optional — AI news summaries |
| `GNEWS_API_KEY` | Optional — multilingual news |
| `STRIPE_*` | Optional — live billing |

3. Deploy — build runs `prisma migrate deploy` automatically

### 3. Seed production

After first deploy:

```bash
DATABASE_URL="..." DIRECT_URL="..." npm run db:seed
```

Or pull Vercel env and seed locally:

```bash
npx vercel env pull .env.production
npm run db:seed
```

### 4. Stripe webhook (optional)

`https://your-domain.vercel.app/api/stripe/webhook`

Events: `checkout.session.completed`, `customer.subscription.deleted`

## Why Supabase?

- Managed Postgres with a generous free tier
- Connection pooling built-in (required for Vercel serverless)
- Dashboard for browsing/editing data
- Room to add Supabase Auth, Storage, or Realtime later

Prisma talks directly to Supabase Postgres — no SDK required for v1.

## Features

- Auth — signup (7-day trial), login, JWT sessions
- Subscriptions — Stripe checkout or demo upgrade
- Landed cost calculator — live ECB FX rates
- Price trends & freight — admin-editable weekly data in Supabase
- AI news feed — RSS + GNews + Claude summarization

## Admin panel

`admin@marsatrade.com` → **Data Admin** to update species prices and freight rates.

## Commands

```bash
npm run dev          # local dev server
npm run db:migrate   # create migration
npm run db:seed      # seed demo data
npm run db:studio    # Prisma Studio (DB browser)
```
