-- ====================================================================
-- SUPABASE POSTGRESQL DATABASE SCHEMA
-- Project: Customer Segmentation & Churn Pattern Analytics in European Banking
-- Author: panchaksharayya12
-- Repository: https://github.com/panchaksharayya12/Global-logistic-control.git
-- ====================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Retail Customers Master Table
CREATE TABLE IF NOT EXISTS public.customers (
    customer_id BIGINT PRIMARY KEY,
    year INT DEFAULT 2025,
    surname VARCHAR(100) NOT NULL,
    credit_score INT NOT NULL,
    geography VARCHAR(50) NOT NULL CHECK (geography IN ('France', 'Germany', 'Spain')),
    gender VARCHAR(10) NOT NULL CHECK (gender IN ('Female', 'Male')),
    age INT NOT NULL,
    tenure INT NOT NULL,
    balance NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    num_of_products INT NOT NULL CHECK (num_of_products BETWEEN 1 AND 4),
    has_cr_card SMALLINT NOT NULL CHECK (has_cr_card IN (0, 1)),
    is_active_member SMALLINT NOT NULL CHECK (is_active_member IN (0, 1)),
    estimated_salary NUMERIC(15, 2) NOT NULL,
    exited SMALLINT NOT NULL CHECK (exited IN (0, 1)),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_customers_geography ON public.customers(geography);
CREATE INDEX IF NOT EXISTS idx_customers_age ON public.customers(age);
CREATE INDEX IF NOT EXISTS idx_customers_exited ON public.customers(exited);
CREATE INDEX IF NOT EXISTS idx_customers_balance ON public.customers(balance);

-- 2. Churn What-If Simulation Sessions
CREATE TABLE IF NOT EXISTS public.churn_simulations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    interest_bonus NUMERIC(4, 2) NOT NULL,
    germany_coverage INT NOT NULL,
    bundle_discount INT NOT NULL,
    reactivation_budget_k INT NOT NULL,
    projected_churn_rate NUMERIC(5, 2) NOT NULL,
    accounts_saved INT NOT NULL,
    capital_saved_m NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Global Logistics Telemetry Shipments Table
CREATE TABLE IF NOT EXISTS public.shipments (
    shipment_id VARCHAR(50) PRIMARY KEY,
    origin_port VARCHAR(100) NOT NULL,
    destination_port VARCHAR(100) NOT NULL,
    carrier VARCHAR(100) NOT NULL,
    mode VARCHAR(50) NOT NULL CHECK (mode IN ('SEA', 'AIR', 'ROAD', 'RAIL')),
    delivery_status VARCHAR(50) NOT NULL CHECK (delivery_status IN ('ON_TIME', 'AT_RISK', 'DELAYED')),
    delay_hours NUMERIC(6, 1) DEFAULT 0.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.churn_simulations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipments ENABLE ROW LEVEL SECURITY;

-- Allow read-only public access for client exploration
CREATE POLICY "Allow public read access on customers" 
    ON public.customers FOR SELECT USING (true);

CREATE POLICY "Allow public insert on churn_simulations" 
    ON public.churn_simulations FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read on churn_simulations" 
    ON public.churn_simulations FOR SELECT USING (true);

CREATE POLICY "Allow public read on shipments" 
    ON public.shipments FOR SELECT USING (true);
