import bcrypt from "bcryptjs";
import { writeFileSync } from "fs";
import { species, freightRoutes, DATA_LAST_UPDATED } from "../src/data/defaults.ts";

function esc(s) {
  return String(s).replace(/'/g, "''");
}

function json(v) {
  return `'${esc(JSON.stringify(v))}'::jsonb`;
}

const demo123 = await bcrypt.hash("demo123", 10);
const admin123 = await bcrypt.hash("admin123", 10);

const billingEnd = new Date();
billingEnd.setMonth(billingEnd.getMonth() + 1);

const lines = ["BEGIN;"];

for (const s of species) {
  lines.push(`INSERT INTO species (id, name, display_name, unit, current_price, change_24h, fob_price_eur, duty_rate, vat_rate, history, updated_at)
VALUES ('${esc(s.id)}', '${esc(s.name)}', '${esc(s.displayName)}', '${esc(s.unit)}', ${s.currentPrice}, ${s.change24h}, ${s.fobPriceEur}, ${s.dutyRate}, ${s.vatRate}, ${json(s.history)}, NOW())
ON CONFLICT (id) DO NOTHING;`);
}

for (const r of freightRoutes) {
  lines.push(`INSERT INTO freight_routes (id, origin, destination, rate_usd, change_7d, container_type, history, last_updated, updated_at)
VALUES ('${esc(r.id)}', '${esc(r.origin)}', '${esc(r.destination)}', ${r.rateUsd}, ${r.change7d}, '${esc(r.containerType)}', ${json(r.history)}, '${esc(r.lastUpdated)}', NOW())
ON CONFLICT (id) DO NOTHING;`);
}

lines.push(`INSERT INTO market_meta (id, data_last_updated, updated_at)
VALUES ('singleton', '${esc(DATA_LAST_UPDATED)}', NOW())
ON CONFLICT (id) DO NOTHING;`);

lines.push(`INSERT INTO users (id, email, password_hash, name, company, role, plan, billing_ends_at, created_at)
SELECT 'user_demo_youssef', 'youssef@marsatrade.com', '${esc(demo123)}', 'Youssef', 'Oceanic Exports SARL', 'user', 'pro', '${billingEnd.toISOString()}', NOW()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'youssef@marsatrade.com');`);

lines.push(`INSERT INTO users (id, email, password_hash, name, company, role, plan, billing_ends_at, created_at)
SELECT 'user_demo_admin', 'admin@marsatrade.com', '${esc(admin123)}', 'Admin', 'MarsaTrade', 'admin', 'pro', '2027-01-01T00:00:00Z', NOW()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@marsatrade.com');`);

lines.push("COMMIT;");

const out = "prisma/seed-remote.sql";
writeFileSync(out, lines.join("\n\n") + "\n");
console.log(`Wrote ${out}`);
