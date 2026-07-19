# CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',
    "plan" TEXT NOT NULL DEFAULT 'trial',
    "stripe_customer_id" TEXT,
    "stripe_subscription_id" TEXT,
    "trial_ends_at" TIMESTAMP(3),
    "billing_ends_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "species" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "unit" TEXT NOT NULL DEFAULT 'EUR/kg',
    "current_price" DOUBLE PRECISION NOT NULL,
    "change_24h" DOUBLE PRECISION NOT NULL,
    "fob_price_eur" DOUBLE PRECISION NOT NULL,
    "duty_rate" DOUBLE PRECISION NOT NULL,
    "vat_rate" DOUBLE PRECISION NOT NULL,
    "history" JSONB NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "species_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "freight_routes" (
    "id" TEXT NOT NULL,
    "origin" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "rate_usd" DOUBLE PRECISION NOT NULL,
    "change_7d" DOUBLE PRECISION NOT NULL,
    "container_type" TEXT NOT NULL,
    "history" JSONB NOT NULL,
    "last_updated" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "freight_routes_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "market_meta" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "data_last_updated" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "market_meta_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
