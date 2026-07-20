#!/usr/bin/env pwsh
# One-shot MarsaTrade production setup (Supabase + migrate + seed + Vercel env)
# Run from project root:  pwsh scripts/setup-production.ps1

param(
  [string]$ProjectRef = "btnwndvigyfvhuoqyprb",
  [string]$Region = "eu-central-1"
)

$ErrorActionPreference = "Stop"

Write-Host "=== MarsaTrade Production Setup ===" -ForegroundColor Cyan

# 1. Prompt for Supabase DB password (from dashboard: Settings > Database)
$dbPass = Read-Host "Enter Supabase database password for project $ProjectRef"
if (-not $dbPass) { throw "Database password required" }

$encoded = [uri]::EscapeDataString($dbPass)
$dbUrl = "postgresql://postgres.${ProjectRef}:${encoded}@aws-0-${Region}.pooler.supabase.com:6543/postgres?pgbouncer=true"
$directUrl = "postgresql://postgres.${ProjectRef}:${encoded}@aws-0-${Region}.pooler.supabase.com:5432/postgres"
$authSecret = -join ((48..57 + 65..90 + 97..122) | Get-Random -Count 48 | ForEach-Object { [char]$_ })

# 2. Write local env
@"
DATABASE_URL=$dbUrl
DIRECT_URL=$directUrl
AUTH_SECRET=$authSecret
"@ | Set-Content .env.local -Encoding utf8
Write-Host "Wrote .env.local" -ForegroundColor Green

# 3. Migrate & seed
$env:DATABASE_URL = $dbUrl
$env:DIRECT_URL = $directUrl
npx prisma migrate deploy
npm run db:seed
Write-Host "Database migrated and seeded" -ForegroundColor Green

# 4. Push env to Vercel
if (Get-Command vercel -ErrorAction SilentlyContinue) {
  Write-Host "Setting Vercel env vars..." -ForegroundColor Cyan
  echo $dbUrl | npx vercel env add DATABASE_URL production --yes
  echo $directUrl | npx vercel env add DIRECT_URL production --yes
  echo $authSecret | npx vercel env add AUTH_SECRET production --yes
  Write-Host "Deploying to Vercel..." -ForegroundColor Cyan
  npx vercel --prod --yes
} else {
  Write-Host "Vercel CLI not found — set DATABASE_URL, DIRECT_URL, AUTH_SECRET manually in Vercel dashboard" -ForegroundColor Yellow
}

Write-Host "Done! Supabase: https://supabase.com/dashboard/project/$ProjectRef" -ForegroundColor Green
Write-Host "GitHub: https://github.com/YoussefDKR/MarsaTrade" -ForegroundColor Green
