# MarsaTrade — Production Deploy Checklist

Everything below is automated except **one manual step** (Supabase DB password).

## Already done

- [x] Code pushed to **https://github.com/YoussefDKR/MarsaTrade**
- [x] Supabase project created: **MarsaTrade** (`btnwndvigyfvhuoqyprb`, eu-central-1)
- [x] Vercel project created: **marsatrade** (linked to GitHub)

## You need to do (2 minutes)

### 1. Reset Supabase database password

The project was created with a random password. Set one you know:

1. Open [Supabase → MarsaTrade → Database Settings](https://supabase.com/dashboard/project/btnwndvigyfvhuoqyprb/settings/database)
2. Click **Reset database password**
3. Choose a strong password and save it

### 2. Run the setup script

```powershell
cd C:\Users\mryou\Desktop\MarsaTrade
pwsh scripts/setup-production.ps1
```

Paste the password when prompted. The script will:

- Write `.env.local` with Supabase pooler URLs
- Run `prisma migrate deploy` + seed demo data
- Push `DATABASE_URL`, `DIRECT_URL`, `AUTH_SECRET` to Vercel
- Deploy to production

## URLs after deploy

| Service | URL |
|---------|-----|
| App | https://marsatrade.vercel.app (or your Vercel URL) |
| Supabase | https://supabase.com/dashboard/project/btnwndvigyfvhuoqyprb |
| GitHub | https://github.com/YoussefDKR/MarsaTrade |

## Demo logins (after seed)

| Email | Password |
|-------|----------|
| youssef@marsatrade.com | demo123 |
| admin@marsatrade.com | admin123 |

## Supabase connection strings (for reference)

After reset, your URLs follow this pattern:

```
DATABASE_URL=postgresql://postgres.btnwndvigyfvhuoqyprb:[PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.btnwndvigyfvhuoqyprb:[PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:5432/postgres
```

Set these in Vercel → Project → Settings → Environment Variables if not using the script.
