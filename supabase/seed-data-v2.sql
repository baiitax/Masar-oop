-- MASAR Sample Data V2
-- Run this AFTER running quick-setup-v4.sql

-- Step 1: Insert sample organizations
INSERT INTO public.organizations (id, legal_name, trading_name, organization_type, registration_number, country_code, country, city, email, phone, status, verification_status) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Al Rajhi Foods International', 'Al Rajhi Foods', 'BUYER', 'CR-2024-001', 'SA', 'Saudi Arabia', 'Riyadh', 'info@alrajhifoods.sa', '+966501234567', 'active', 'verified'),
  ('22222222-2222-2222-2222-222222222222', 'Nigerian Sesame Export Co. Ltd', 'NigSesame', 'EXPORTER', 'RC-1539001', 'NG', 'Nigeria', 'Lagos', 'exports@nigsesame.com', '+2348023456789', 'active', 'verified'),
  ('33333333-3333-3333-3333-333333333333', 'SGS Nigeria Limited', 'SGS Nigeria', 'INSPECTION_PARTNER', 'RC-1234567', 'NG', 'Nigeria', 'Lagos', 'inspections@sgs-ng.com', '+2348034567890', 'active', 'verified'),
  ('44444444-4444-4444-4444-444444444444', 'Saudi National Bank', 'SNB', 'FINANCIAL_PARTNER', 'CR-2024-002', 'SA', 'Saudi Arabia', 'Riyadh', 'trade@snb.sa', '+966502345678', 'active', 'verified'),
  ('55555555-5555-5555-5555-555555555555', 'Kaduna Cashew Processing Ltd', 'KadCashew', 'EXPORTER', 'RC-2345678', 'NG', 'Nigeria', 'Kaduna', 'info@kadcashew.com', '+2348045678901', 'active', 'verified'),
  ('66666666-6666-6666-6666-666666666666', 'Jeddah Trading Company', 'Jeddah Trading', 'BUYER', 'CR-2024-003', 'SA', 'Saudi Arabia', 'Jeddah', 'procurement@jeddahtrading.sa', '+966503456789', 'active', 'verified'),
  ('77777777-7777-7777-7777-777777777777', 'Bureau Veritas Nigeria', 'BV Nigeria', 'INSPECTION_PARTNER', 'RC-3456789', 'NG', 'Nigeria', 'Lagos', 'inspections@bv-ng.com', '+2348056789012', 'active', 'verified'),
  ('88888888-8888-8888-8888-888888888888', 'Ghana Soybean Exports Ltd', 'GhanaSoy', 'EXPORTER', 'RC-GH-001', 'GH', 'Ghana', 'Accra', 'exports@ghanasoy.com', '+233201234567', 'active', 'verified'),
  ('99999999-9999-9999-9999-999999999999', 'MASAR Platform Limited', 'MASAR', 'ADMIN', 'RC-1539036', 'NG', 'Nigeria', 'Lagos', 'admin@masar.sa', '+2348141815466', 'active', 'verified'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Dubai Commodities Trading', 'DCT Dubai', 'BUYER', 'CR-2024-004', 'AE', 'UAE', 'Dubai', 'trade@dct-dubai.ae', '+971501234567', 'active', 'verified');

-- Step 2: Insert sample profiles (FIXED: valid UUID format)
INSERT INTO public.profiles (id, auth_user_id, full_name, email, phone, job_title, country, status) VALUES
  ('a0000001-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Lukman Kura', 'demo.ceo@masar.local', '+2348141815466', 'CEO & Founder', 'NG', 'active'),
  ('a0000002-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 'Operations Manager', 'demo.operations@masar.local', '+2348023456789', 'Head of Operations', 'NG', 'active'),
  ('a0000003-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000003', 'Compliance Officer', 'demo.compliance@masar.local', '+2348034567890', 'Chief Compliance Officer', 'NG', 'active'),
  ('a0000004-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000004', 'Finance Manager', 'demo.finance@masar.local', '+2348045678901', 'Trade Finance Manager', 'NG', 'active'),
  ('a0000005-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000005', 'Ahmed Al Rajhi', 'demo.buyer@masar.local', '+966501234567', 'Procurement Director', 'SA', 'active'),
  ('a0000006-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000006', 'Oluwaseun Adebayo', 'demo.exporter@masar.local', '+2348023456789', 'Export Manager', 'NG', 'active'),
  ('a0000007-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000007', 'Inspector SGS', 'demo.inspector@masar.local', '+2348034567890', 'Senior Inspector', 'NG', 'active'),
  ('a0000008-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000008', 'Internal Auditor', 'demo.auditor@masar.local', '+2348045678901', 'Chief Auditor', 'NG', 'active');

-- Step 3: Link users to organizations
INSERT INTO public.organization_members (organization_id, user_id, role_id, status, is_primary) VALUES
  ('99999999-9999-9999-9999-999999999999', '00000000-0000-0000-0000-000000000001', (SELECT id FROM public.roles WHERE code = 'CEO'), 'active', true),
  ('99999999-9999-9999-9999-999999999999', '00000000-0000-0000-0000-000000000002', (SELECT id FROM public.roles WHERE code = 'OPERATIONS'), 'active', true),
  ('99999999-9999-9999-9999-999999999999', '00000000-0000-0000-0000-000000000003', (SELECT id FROM public.roles WHERE code = 'COMPLIANCE'), 'active', true),
  ('99999999-9999-9999-9999-999999999999', '00000000-0000-0000-0000-000000000004', (SELECT id FROM public.roles WHERE code = 'TRADE_FINANCE'), 'active', true),
  ('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000005', (SELECT id FROM public.roles WHERE code = 'BUYER_ADMIN'), 'active', true),
  ('22222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000006', (SELECT id FROM public.roles WHERE code = 'EXPORTER_ADMIN'), 'active', true),
  ('33333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000007', (SELECT id FROM public.roles WHERE code = 'INSPECTOR'), 'active', true),
  ('99999999-9999-9999-9999-999999999999', '00000000-0000-0000-0000-000000000008', (SELECT id FROM public.roles WHERE code = 'AUDITOR'), 'active', true);

-- Done!
SELECT 'Sample data inserted successfully!' as status,
  (SELECT COUNT(*) FROM public.organizations) as organizations,
  (SELECT COUNT(*) FROM public.profiles) as profiles,
  (SELECT COUNT(*) FROM public.organization_members) as memberships;
