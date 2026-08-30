-- MASAR Protocol Database - Migration 001
-- Extensions and Core Setup

-- Enable required PostgreSQL extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gist";

-- Create custom schemas for organization
CREATE SCHEMA IF NOT EXISTS protocol;
CREATE SCHEMA IF NOT EXISTS compliance;
CREATE SCHEMA IF NOT EXISTS trade;
CREATE SCHEMA IF NOT EXISTS finance;
CREATE SCHEMA IF NOT EXISTS logistics;
CREATE SCHEMA IF NOT EXISTS inspection;
CREATE SCHEMA IF NOT EXISTS intelligence;
CREATE SCHEMA IF NOT EXISTS audit;
CREATE SCHEMA IF NOT EXISTS integration;
CREATE SCHEMA IF NOT EXISTS configuration;

-- Grant usage on schemas to authenticated users
GRANT USAGE ON SCHEMA protocol TO authenticated;
GRANT USAGE ON SCHEMA compliance TO authenticated;
GRANT USAGE ON SCHEMA trade TO authenticated;
GRANT USAGE ON SCHEMA finance TO authenticated;
GRANT USAGE ON SCHEMA logistics TO authenticated;
GRANT USAGE ON SCHEMA inspection TO authenticated;
GRANT USAGE ON SCHEMA intelligence TO authenticated;
GRANT USAGE ON SCHEMA audit TO authenticated;
GRANT USAGE ON SCHEMA integration TO authenticated;
GRANT USAGE ON SCHEMA configuration TO authenticated;

-- Create application roles
DO $$
BEGIN
  -- Check if roles exist before creating
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'masar_admin') THEN
    CREATE ROLE masar_admin;
  END IF;
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'masar_operator') THEN
    CREATE ROLE masar_operator;
  END IF;
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'masar_readonly') THEN
    CREATE ROLE masar_readonly;
  END IF;
END
$$;

-- Grant schema permissions
GRANT ALL ON ALL SCHEMAS IN DATABASE postgres TO masar_admin;
GRANT USAGE ON ALL SCHEMAS IN DATABASE postgres TO masar_operator;
GRANT USAGE ON ALL SCHEMAS IN DATABASE postgres TO masar_readonly;

-- Create update timestamp function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create set created_at function
CREATE OR REPLACE FUNCTION public.set_created_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.created_at IS NULL THEN
    NEW.created_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create hash generation function for audit chain
CREATE OR REPLACE FUNCTION public.generate_hash(input TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN encode(digest(input, 'sha256'), 'hex');
END;
$$ LANGUAGE plpgsql IMMUTABLE;

COMMENT ON FUNCTION public.update_updated_at_column IS 'Automatically updates updated_at timestamp';
COMMENT ON FUNCTION public.set_created_at IS 'Sets created_at if not provided';
COMMENT ON FUNCTION public.generate_hash IS 'Generates SHA-256 hash for audit chain';
