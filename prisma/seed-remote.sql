BEGIN;

INSERT INTO species (id, name, display_name, unit, current_price, change_24h, fob_price_eur, duty_rate, vat_rate, history, updated_at)
VALUES ('tuna-yellowfin', 'Tuna', 'Tuna (Yellowfin)', 'EUR/kg', 4.62, -2.1, 3.2, 0.027, 0.07, '[{"date":"2025-12","price":4.85},{"date":"2026-01","price":4.92},{"date":"2026-02","price":4.78},{"date":"2026-03","price":4.71},{"date":"2026-04","price":4.68},{"date":"2026-05","price":4.62}]'::jsonb, NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO species (id, name, display_name, unit, current_price, change_24h, fob_price_eur, duty_rate, vat_rate, history, updated_at)
VALUES ('sardine', 'Sardine', 'Sardine', 'EUR/kg', 1.25, 1.3, 0.85, 0.022, 0.07, '[{"date":"2025-12","price":1.18},{"date":"2026-01","price":1.15},{"date":"2026-02","price":1.19},{"date":"2026-03","price":1.21},{"date":"2026-04","price":1.23},{"date":"2026-05","price":1.25}]'::jsonb, NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO species (id, name, display_name, unit, current_price, change_24h, fob_price_eur, duty_rate, vat_rate, history, updated_at)
VALUES ('octopus', 'Octopus', 'Octopus', 'EUR/kg', 7.8, -0.8, 5.4, 0.032, 0.07, '[{"date":"2025-12","price":7.45},{"date":"2026-01","price":7.62},{"date":"2026-02","price":7.88},{"date":"2026-03","price":7.95},{"date":"2026-04","price":7.85},{"date":"2026-05","price":7.8}]'::jsonb, NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO species (id, name, display_name, unit, current_price, change_24h, fob_price_eur, duty_rate, vat_rate, history, updated_at)
VALUES ('shrimp-vannamei', 'Shrimp', 'Shrimp (Vannamei)', 'EUR/kg', 6.1, -0.6, 4.25, 0.028, 0.07, '[{"date":"2025-12","price":5.95},{"date":"2026-01","price":6.05},{"date":"2026-02","price":6.18},{"date":"2026-03","price":6.22},{"date":"2026-04","price":6.15},{"date":"2026-05","price":6.1}]'::jsonb, NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO species (id, name, display_name, unit, current_price, change_24h, fob_price_eur, duty_rate, vat_rate, history, updated_at)
VALUES ('salmon', 'Salmon', 'Salmon', 'EUR/kg', 5.35, -1.5, 3.75, 0.025, 0.07, '[{"date":"2025-12","price":5.55},{"date":"2026-01","price":5.62},{"date":"2026-02","price":5.48},{"date":"2026-03","price":5.42},{"date":"2026-04","price":5.38},{"date":"2026-05","price":5.35}]'::jsonb, NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO freight_routes (id, origin, destination, rate_usd, change_7d, container_type, history, last_updated, updated_at)
VALUES ('agadir-rotterdam', 'Agadir', 'Rotterdam', 2350, 5.1, '40ft Reefer', '[2100,2150,2180,2220,2280,2350]'::jsonb, '2026-05-26', NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO freight_routes (id, origin, destination, rate_usd, change_7d, container_type, history, last_updated, updated_at)
VALUES ('tangier-marseille', 'Tangier', 'Marseille', 1850, 3.2, '40ft Reefer', '[1720,1750,1780,1800,1820,1850]'::jsonb, '2026-05-26', NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO freight_routes (id, origin, destination, rate_usd, change_7d, container_type, history, last_updated, updated_at)
VALUES ('casablanca-dubai', 'Casablanca', 'Dubai', 2950, -7.3, '40ft Reefer', '[3200,3150,3100,3050,3000,2950]'::jsonb, '2026-05-26', NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO freight_routes (id, origin, destination, rate_usd, change_7d, container_type, history, last_updated, updated_at)
VALUES ('shanghai-barcelona', 'Shanghai', 'Barcelona', 3150, 2.1, '40ft Reefer', '[3050,3080,3100,3120,3130,3150]'::jsonb, '2026-05-26', NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO freight_routes (id, origin, destination, rate_usd, change_7d, container_type, history, last_updated, updated_at)
VALUES ('oslo-london', 'Oslo', 'London', 1680, -1.4, '40ft Reefer', '[1720,1710,1700,1695,1685,1680]'::jsonb, '2026-05-26', NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO market_meta (id, data_last_updated, updated_at)
VALUES ('singleton', '2026-05-26', NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO users (id, email, password_hash, name, company, role, plan, billing_ends_at, created_at)
SELECT 'user_demo_youssef', 'youssef@marsatrade.com', '$2b$10$RoBON9O0tIwdXrbVjXpLsO8WYyq6ejdRd9CZYDtT3q/kcILWlpBVC', 'Youssef', 'Oceanic Exports SARL', 'user', 'pro', '2026-08-20T03:08:55.037Z', NOW()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'youssef@marsatrade.com');

INSERT INTO users (id, email, password_hash, name, company, role, plan, billing_ends_at, created_at)
SELECT 'user_demo_admin', 'admin@marsatrade.com', '$2b$10$5MwZA9Dv8XctpXAKudZgyOL/hTROkiecQwSlE4CCZtQtxa/LcgMKu', 'Admin', 'MarsaTrade', 'admin', 'pro', '2027-01-01T00:00:00Z', NOW()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@marsatrade.com');

COMMIT;
