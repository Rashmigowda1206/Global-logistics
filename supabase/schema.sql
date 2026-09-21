-- ====================================================================
-- SUPABASE POSTGRESQL DATABASE SCHEMA
-- Project: TRANSITIQ — Global Logistics Control Tower
-- Author: Rashmigowda1206
-- Repository: https://github.com/Rashmigowda1206/Global-logistics.git
-- ====================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Global Logistics Shipments Telemetry Master Table
CREATE TABLE IF NOT EXISTS public.shipments (
    order_id VARCHAR(50) PRIMARY KEY,
    customer_id VARCHAR(50),
    customer_name VARCHAR(100) NOT NULL,
    customer_segment VARCHAR(50) DEFAULT 'Consumer',
    order_country VARCHAR(100) NOT NULL,
    order_region VARCHAR(100) NOT NULL,
    market VARCHAR(50) NOT NULL,
    shipping_mode VARCHAR(50) NOT NULL CHECK (shipping_mode IN ('Standard Class', 'First Class', 'Second Class', 'Same Day', 'Air', 'Sea', 'Road', 'Rail')),
    days_for_shipping_real NUMERIC(5, 2) NOT NULL,
    days_for_shipment_scheduled NUMERIC(5, 2) NOT NULL,
    delay_gap NUMERIC(5, 2) NOT NULL,
    delivery_classification VARCHAR(30) NOT NULL CHECK (delivery_classification IN ('EARLY', 'ON SCHEDULE', 'DELAYED')),
    late_delivery_risk SMALLINT NOT NULL CHECK (late_delivery_risk IN (0, 1)),
    risk_score NUMERIC(5, 2) NOT NULL,
    origin_hub VARCHAR(100) NOT NULL,
    destination_hub VARCHAR(100) NOT NULL,
    carrier VARCHAR(100) NOT NULL,
    order_item_total NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    order_profit NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_shipments_delivery_class ON public.shipments(delivery_classification);
CREATE INDEX IF NOT EXISTS idx_shipments_shipping_mode ON public.shipments(shipping_mode);
CREATE INDEX IF NOT EXISTS idx_shipments_market ON public.shipments(market);
CREATE INDEX IF NOT EXISTS idx_shipments_late_risk ON public.shipments(late_delivery_risk);
CREATE INDEX IF NOT EXISTS idx_shipments_origin_dest ON public.shipments(origin_hub, destination_hub);

-- 2. Global Trade Routes & Corridors Table
CREATE TABLE IF NOT EXISTS public.trade_routes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    route_code VARCHAR(30) NOT NULL UNIQUE,
    route_name VARCHAR(150) NOT NULL,
    origin_hub VARCHAR(100) NOT NULL,
    destination_hub VARCHAR(100) NOT NULL,
    shipping_mode VARCHAR(50) NOT NULL,
    distance_km NUMERIC(10, 2) NOT NULL,
    avg_delay_days NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    congestion_level NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    status VARCHAR(30) NOT NULL CHECK (status IN ('NORMAL', 'AT_RISK', 'DELAYED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Ports & Multimodal Terminals (Network Nodes) Table
CREATE TABLE IF NOT EXISTS public.network_nodes (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    node_type VARCHAR(50) NOT NULL CHECK (node_type IN ('PORT', 'WAREHOUSE', 'DC', 'AIRPORT')),
    country VARCHAR(100) NOT NULL,
    region VARCHAR(100) NOT NULL,
    latitude NUMERIC(10, 6) NOT NULL,
    longitude NUMERIC(10, 6) NOT NULL,
    congestion_score NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    throughput_teu NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    avg_dwell_days NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    status VARCHAR(30) NOT NULL CHECK (status IN ('NORMAL', 'CONGESTED', 'CRITICAL')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. What-If Scenario Simulations Audit Table
CREATE TABLE IF NOT EXISTS public.what_if_simulations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scenario_name VARCHAR(100) NOT NULL,
    modal_shift_percent NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    buffer_days_added NUMERIC(4, 2) NOT NULL DEFAULT 0.00,
    projected_on_time_rate NUMERIC(5, 2) NOT NULL,
    projected_delay_reduction_days NUMERIC(5, 2) NOT NULL,
    estimated_cost_impact_usd NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trade_routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.network_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.what_if_simulations ENABLE ROW LEVEL SECURITY;

-- Allow read-only public access for exploration
CREATE POLICY "Allow public read access on shipments" 
    ON public.shipments FOR SELECT USING (true);

CREATE POLICY "Allow public read access on trade_routes" 
    ON public.trade_routes FOR SELECT USING (true);

CREATE POLICY "Allow public read access on network_nodes" 
    ON public.network_nodes FOR SELECT USING (true);

CREATE POLICY "Allow public insert on simulations" 
    ON public.what_if_simulations FOR INSERT WITH CHECK (true);
