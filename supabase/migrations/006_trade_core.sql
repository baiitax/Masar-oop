-- MASAR Protocol Database - Migration 006
-- Trade Core Tables

-- Countries table
CREATE TABLE public.countries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  name_ar TEXT,
  name_fr TEXT,
  currency_code TEXT,
  region TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Currencies table
CREATE TABLE public.currencies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  symbol TEXT,
  decimal_places INTEGER DEFAULT 2,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Commodities table
CREATE TABLE public.commodities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  name_ar TEXT,
  name_fr TEXT,
  category TEXT,
  description TEXT,
  hs_code TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'deprecated')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trade lanes table
CREATE TABLE public.trade_lanes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  origin_country TEXT NOT NULL REFERENCES public.countries(code),
  destination_country TEXT NOT NULL REFERENCES public.countries(code),
  commodity_id UUID NOT NULL REFERENCES public.commodities(id),
  transaction_type TEXT DEFAULT 'COMMODITY_EXPORT',
  incoterm TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'deprecated')),
  version TEXT DEFAULT '1.0',
  effective_from DATE NOT NULL DEFAULT CURRENT_DATE,
  effective_to DATE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT trade_lanes_origin_destination_check CHECK (origin_country != destination_country),
  CONSTRAINT trade_lanes_effective_dates_check CHECK (effective_to IS NULL OR effective_to > effective_from)
);

-- Transaction type enum
CREATE TYPE public.transaction_type AS ENUM (
  'COMMODITY_EXPORT',
  'COMMODITY_IMPORT',
  'REEXPORT',
  'ENTREPOT'
);

-- Transaction state enum
CREATE TYPE public.transaction_state AS ENUM (
  'DRAFT',
  'RFQ',
  'BUYER_VERIFIED',
  'EXPORTER_VERIFIED',
  'COMMERCIAL_MATCH',
  'CONTRACTED',
  'COMPLIANCE_REVIEW',
  'COMPLIANCE_READY',
  'INSPECTION_PENDING',
  'INSPECTION_IN_PROGRESS',
  'INSPECTION_PASSED',
  'FINANCE_PENDING',
  'FINANCE_APPROVED',
  'FUNDS_SECURED',
  'SHIPMENT_READY',
  'IN_TRANSIT',
  'ARRIVED',
  'PORT_VERIFIED',
  'RELEASE_ELIGIBLE',
  'RELEASE_APPROVAL',
  'SETTLEMENT',
  'COMPLETED'
);

-- Exception state enum
CREATE TYPE public.exception_state AS ENUM (
  'KYB_EXCEPTION',
  'SANCTIONS_EXCEPTION',
  'COMPLIANCE_EXCEPTION',
  'DOCUMENT_EXCEPTION',
  'INSPECTION_FAILED',
  'QUALITY_VARIANCE',
  'FINANCE_DECLINED',
  'SHIPMENT_DELAY',
  'PORT_EXCEPTION',
  'SETTLEMENT_EXCEPTION',
  'DISPUTE',
  'CANCELLED'
);

-- Transactions table (central protocol object)
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_number TEXT UNIQUE NOT NULL,
  transaction_type public.transaction_type DEFAULT 'COMMODITY_EXPORT',
  
  -- Parties
  buyer_organization_id UUID NOT NULL REFERENCES public.organizations(id),
  exporter_organization_id UUID NOT NULL REFERENCES public.organizations(id),
  supplier_syndicate_id UUID REFERENCES public.organizations(id),
  
  -- Location
  origin_country TEXT NOT NULL REFERENCES public.countries(code),
  destination_country TEXT NOT NULL REFERENCES public.countries(code),
  origin_location TEXT,
  destination_location TEXT,
  
  -- Commodity
  commodity_id UUID NOT NULL REFERENCES public.commodities(id),
  lane_id UUID REFERENCES public.trade_lanes(id),
  quantity NUMERIC(20,4) NOT NULL CHECK (quantity > 0),
  unit TEXT NOT NULL DEFAULT 'MT',
  currency TEXT NOT NULL DEFAULT 'USD',
  estimated_value NUMERIC(20,4),
  contract_value NUMERIC(20,4),
  incoterm TEXT,
  
  -- State
  current_state public.transaction_state DEFAULT 'DRAFT',
  previous_state public.transaction_state,
  risk_level public.risk_level DEFAULT 'medium',
  protocol_status TEXT DEFAULT 'active',
  
  -- Scores
  clearance_readiness_score INTEGER DEFAULT 0 CHECK (clearance_readiness_score >= 0 AND clearance_readiness_score <= 100),
  confidence_score INTEGER DEFAULT 0 CHECK (confidence_score >= 0 AND confidence_score <= 100),
  
  -- Metadata
  metadata JSONB DEFAULT '{}',
  created_by UUID NOT NULL REFERENCES auth.users(id),
  assigned_to UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id),
  
  -- Constraints
  CONSTRAINT transactions_parties_check CHECK (buyer_organization_id != exporter_organization_id),
  CONSTRAINT transactions_value_check CHECK (contract_value IS NULL OR contract_value >= 0)
);

-- Transaction state transitions table
CREATE TABLE public.transaction_state_transitions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  from_state public.transaction_state,
  to_state public.transaction_state NOT NULL,
  required_permission TEXT,
  required_conditions JSONB DEFAULT '[]',
  requires_human_approval BOOLEAN DEFAULT FALSE,
  requires_dual_approval BOOLEAN DEFAULT FALSE,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(from_state, to_state)
);

-- Create indexes
CREATE INDEX idx_countries_code ON public.countries(code);
CREATE INDEX idx_currencies_code ON public.currencies(code);
CREATE INDEX idx_commodities_code ON public.commodities(code);
CREATE INDEX idx_commodities_status ON public.commodities(status);
CREATE INDEX idx_trade_lanes_code ON public.trade_lanes(code);
CREATE INDEX idx_trade_lanes_origin ON public.trade_lanes(origin_country);
CREATE INDEX idx_trade_lanes_destination ON public.trade_lanes(destination_country);
CREATE INDEX idx_trade_lanes_commodity ON public.trade_lanes(commodity_id);
CREATE INDEX idx_transactions_number ON public.transactions(transaction_number);
CREATE INDEX idx_transactions_state ON public.transactions(current_state);
CREATE INDEX idx_transactions_buyer ON public.transactions(buyer_organization_id);
CREATE INDEX idx_transactions_exporter ON public.transactions(exporter_organization_id);
CREATE INDEX idx_transactions_commodity ON public.transactions(commodity_id);
CREATE INDEX idx_transactions_created_at ON public.transactions(created_at);
CREATE INDEX idx_transactions_assigned ON public.transactions(assigned_to);
CREATE INDEX idx_transactions_deleted_at ON public.transactions(deleted_at) WHERE deleted_at IS NULL;

-- Enable RLS
ALTER TABLE public.countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.currencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commodities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trade_lanes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transaction_state_transitions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for reference tables (public read)
CREATE POLICY "Countries are viewable by authenticated users"
  ON public.countries FOR SELECT
  USING (auth.uid() IS NOT NULL AND active = TRUE);

CREATE POLICY "Currencies are viewable by authenticated users"
  ON public.currencies FOR SELECT
  USING (auth.uid() IS NOT NULL AND active = TRUE);

CREATE POLICY "Commodities are viewable by authenticated users"
  ON public.commodities FOR SELECT
  USING (auth.uid() IS NOT NULL AND status = 'active');

CREATE POLICY "Trade lanes are viewable by authenticated users"
  ON public.trade_lanes FOR SELECT
  USING (auth.uid() IS NOT NULL AND status = 'active');

CREATE POLICY "State transitions are viewable by authenticated users"
  ON public.transaction_state_transitions FOR SELECT
  USING (auth.uid() IS NOT NULL AND active = TRUE);

-- RLS Policies for transactions
CREATE POLICY "Transactions viewable by buyer organization members"
  ON public.transactions FOR SELECT
  USING (
    deleted_at IS NULL AND (
      buyer_organization_id IN (SELECT public.get_user_organization_ids())
      OR exporter_organization_id IN (SELECT public.get_user_organization_ids())
      OR EXISTS (
        SELECT 1 FROM public.organization_members om
        JOIN public.roles r ON om.role_id = r.id
        WHERE om.user_id = auth.uid()
        AND r.code IN ('SUPER_ADMIN', 'CEO', 'CTO', 'OPERATIONS', 'COMPLIANCE', 'ORIGIN_OPERATIONS', 'TRADE_FINANCE', 'CFO', 'AUDITOR')
        AND om.status = 'active'
      )
    )
  );

CREATE POLICY "Transactions can be created by authorized users"
  ON public.transactions FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND public.user_has_permission('transaction.create')
  );

CREATE POLICY "Transactions can be updated by authorized users"
  ON public.transactions FOR UPDATE
  USING (
    deleted_at IS NULL AND (
      buyer_organization_id IN (SELECT public.get_user_organization_ids())
      OR exporter_organization_id IN (SELECT public.get_user_organization_ids())
      OR EXISTS (
        SELECT 1 FROM public.organization_members om
        JOIN public.roles r ON om.role_id = r.id
        WHERE om.user_id = auth.uid()
        AND r.code IN ('SUPER_ADMIN', 'OPERATIONS', 'COMPLIANCE')
        AND om.status = 'active'
      )
    )
  );

-- Create triggers
CREATE TRIGGER set_transactions_updated_at
  BEFORE UPDATE ON public.transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER set_trade_lanes_updated_at
  BEFORE UPDATE ON public.trade_lanes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to generate transaction number
CREATE OR REPLACE FUNCTION public.generate_transaction_number(
  p_commodity_code TEXT,
  p_year INTEGER DEFAULT EXTRACT(YEAR FROM NOW())::INTEGER
)
RETURNS TEXT AS $$
DECLARE
  v_sequence INTEGER;
  v_number TEXT;
BEGIN
  -- Get next sequence number for this commodity and year
  SELECT COALESCE(MAX(
    CAST(SUBSTRING(transaction_number FROM '\d+$') AS INTEGER)
  ), 0) + 1
  INTO v_sequence
  FROM public.transactions
  WHERE transaction_number LIKE 'MASAR-' || p_commodity_code || '-' || p_year || '-%';
  
  -- Format: MASAR-SES-2027-000001
  v_number := 'MASAR-' || p_commodity_code || '-' || p_year || '-' || LPAD(v_sequence::TEXT, 6, '0');
  
  RETURN v_number;
END;
$$ LANGUAGE plpgsql;

COMMENT ON TABLE public.countries IS 'Country reference data';
COMMENT ON TABLE public.currencies IS 'Currency reference data';
COMMENT ON TABLE public.commodities IS 'Tradeable commodities';
COMMENT ON TABLE public.trade_lanes IS 'Trade lane configurations (origin-destination-commodity)';
COMMENT ON TABLE public.transactions IS 'Central MASAR protocol transaction object';
COMMENT ON TABLE public.transaction_state_transitions IS 'Configurable state transition rules';
