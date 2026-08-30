-- MASAR Protocol Database - Seed Data
-- Demo data for development and staging

-- Note: This seed data should only be used in development/staging
-- Never use demo data in production

-- Insert countries
INSERT INTO public.countries (code, name, name_ar, name_fr, currency_code, region) VALUES
  ('NG', 'Nigeria', 'نيجيريا', 'Nigéria', 'NGN', 'West Africa'),
  ('SA', 'Saudi Arabia', 'المملكة العربية السعودية', 'Arabie Saoudite', 'SAR', 'Middle East'),
  ('AE', 'United Arab Emirates', 'الإمارات العربية المتحدة', 'Émirats arabes unis', 'AED', 'Middle East'),
  ('KE', 'Kenya', 'كينيا', 'Kenya', 'KES', 'East Africa'),
  ('GH', 'Ghana', 'غانا', 'Ghana', 'GHS', 'West Africa'),
  ('ET', 'Ethiopia', 'إثيوبيا', 'Éthiopie', 'ETB', 'East Africa'),
  ('US', 'United States', 'الولايات المتحدة', 'États-Unis', 'USD', 'North America'),
  ('GB', 'United Kingdom', 'المملكة المتحدة', 'Royaume-Uni', 'GBP', 'Europe');

-- Insert currencies
INSERT INTO public.currencies (code, name, symbol, decimal_places) VALUES
  ('USD', 'US Dollar', '$', 2),
  ('NGN', 'Nigerian Naira', '₦', 2),
  ('SAR', 'Saudi Riyal', '﷼', 2),
  ('AED', 'UAE Dirham', 'د.إ', 2),
  ('GBP', 'British Pound', '£', 2);

-- Insert commodities
INSERT INTO public.commodities (code, name, name_ar, name_fr, category, description) VALUES
  ('SESAME', 'Non-GMO Sesame', 'سمسم غير مُعدَّل وراثياً', 'Sesame non-OGM', 'Oilseeds', 'Premium Nigerian sesame seeds for Saudi food industry'),
  ('CASHEW', 'Raw Cashew Nuts', 'كاجو خام', 'Noix de caju brutes', 'Nuts', 'Raw cashew nuts for processing'),
  ('SOY', 'Soybean', 'فول الصويا', 'Soja', 'Oilseeds', 'Soybean for animal feed and oil extraction');

-- Insert trade lanes
INSERT INTO public.trade_lanes (code, name, origin_country, destination_country, commodity_id, transaction_type, incoterm, status) VALUES
  ('NG-KSA-SESAME', 'Nigeria → Saudi Arabia / Sesame', 'NG', 'SA', (SELECT id FROM public.commodities WHERE code = 'SESAME'), 'COMMODITY_EXPORT', 'CIF', 'active'),
  ('NG-KSA-CASHEW', 'Nigeria → Saudi Arabia / Cashew', 'NG', 'SA', (SELECT id FROM public.commodities WHERE code = 'CASHEW'), 'COMMODITY_EXPORT', 'CIF', 'active'),
  ('NG-KSA-SOY', 'Nigeria → Saudi Arabia / Soybean', 'NG', 'SA', (SELECT id FROM public.commodities WHERE code = 'SOY'), 'COMMODITY_EXPORT', 'FOB', 'active');

-- Insert SLA policies
INSERT INTO public.sla_policies (policy_code, name, description, category, target_hours, warning_threshold, critical_threshold, escalation_policy) VALUES
  ('KYB_SANCTIONS', 'KYB & Sanctions Screening', 'Time to complete KYB and sanctions verification', 'IDENTITY', 72, 70, 85, 'COMPLIANCE_HEAD'),
  ('COMPLIANCE_PACK', 'Compliance Pack Assembly', 'Time to assemble compliance documents', 'COMPLIANCE', 120, 70, 85, 'COMPLIANCE_HEAD'),
  ('INSPECTION_BOOKING', 'Inspection Booking', 'Time to book inspection', 'INSPECTION', 48, 70, 85, 'OPERATIONS_HEAD'),
  ('INSPECTION_RESULTS', 'Inspection Results', 'Time to receive inspection results', 'INSPECTION', 72, 70, 85, 'OPERATIONS_HEAD'),
  ('ESCROW_FUNDING', 'Escrow Funding/Release', 'Time to fund or release escrow', 'FINANCE', 4, 50, 75, 'FINANCE_HEAD'),
  ('DISPUTE_HANDLING', 'Dispute Handling', 'Time to resolve disputes', 'SETTLEMENT', 120, 60, 80, 'OPERATIONS_HEAD'),
  ('EXCEPTION_RESPONSE', 'Exception Response', 'Time to respond to exceptions', 'OPERATIONS', 24, 50, 75, 'OPERATIONS_HEAD');

-- Insert automation rules
INSERT INTO public.automation_rules (rule_code, name, description, trigger_event, conditions, actions, priority) VALUES
  ('KYB_APPROVED_START_COMPLIANCE', 'KYB Approved - Start Compliance', 'When KYB is approved, start compliance review', 'KYB_COMPLETED', 
   '[{"field": "buyer.kyb_status", "operator": "equals", "value": "approved"}, {"field": "exporter.kyb_status", "operator": "equals", "value": "approved"}]',
   '[{"type": "transition_state", "target": "COMPLIANCE_REVIEW"}, {"type": "create_task", "assignee": "COMPLIANCE_TEAM"}]',
   1),
  ('COMPLIANCE_READY_REQUEST_INSPECTION', 'Compliance Ready - Request Inspection', 'When compliance is ready, request inspection', 'COMPLIANCE_READY',
   '[{"field": "compliance_pack.status", "operator": "equals", "value": "ready"}]',
   '[{"type": "transition_state", "target": "INSPECTION_PENDING"}, {"type": "create_inspection_request"}]',
   2),
  ('INSPECTION_PASSED_NOTIFY_FINANCE', 'Inspection Passed - Notify Finance', 'When inspection passes, notify finance', 'INSPECTION_PASSED',
   '[{"field": "inspection.status", "operator": "equals", "value": "passed"}]',
   '[{"type": "transition_state", "target": "FINANCE_PENDING"}, {"type": "send_notification", "recipients": ["FINANCE_TEAM"]}]',
   3),
  ('INSPECTION_FAILED_FREEZE_RELEASE', 'Inspection Failed - Freeze Release', 'When inspection fails, freeze release', 'INSPECTION_FAILED',
   '[{"field": "inspection.status", "operator": "equals", "value": "failed"}]',
   '[{"type": "transition_state", "target": "INSPECTION_FAILED"}, {"type": "create_exception", "type": "inspection_failure"}]',
   4);

-- Insert quality specifications for sesame
INSERT INTO public.quality_specifications (commodity_id, lane_id, parameter, operator, target_value, minimum_value, maximum_value, unit, tolerance, required, critical) VALUES
  ((SELECT id FROM public.commodities WHERE code = 'SESAME'), (SELECT id FROM public.trade_lanes WHERE code = 'NG-KSA-SESAME'), 'Moisture', '<=', 6, NULL, 8, '%', 2, TRUE, TRUE),
  ((SELECT id FROM public.commodities WHERE code = 'SESAME'), (SELECT id FROM public.trade_lanes WHERE code = 'NG-KSA-SESAME'), 'Purity', '>=', 99, 98, NULL, '%', 1, TRUE, TRUE),
  ((SELECT id FROM public.commodities WHERE code = 'SESAME'), (SELECT id FROM public.trade_lanes WHERE code = 'NG-KSA-SESAME'), 'Foreign Matter', '<=', 0.5, NULL, 2, '%', 0.5, TRUE, FALSE),
  ((SELECT id FROM public.commodities WHERE code = 'SESAME'), (SELECT id FROM public.trade_lanes WHERE code = 'NG-KSA-SESAME'), 'Aflatoxin', '<=', 5, NULL, 10, 'ppb', 2, TRUE, TRUE),
  ((SELECT id FROM public.commodities WHERE code = 'SESAME'), (SELECT id FROM public.trade_lanes WHERE code = 'NG-KSA-SESAME'), 'Oil Content', '>=', 50, 48, NULL, '%', 2, TRUE, FALSE),
  ((SELECT id FROM public.commodities WHERE code = 'SESAME'), (SELECT id FROM public.trade_lanes WHERE code = 'NG-KSA-SESAME'), 'FFA', '<=', 2, NULL, 3, '%', 0.5, TRUE, FALSE);

-- Insert compliance requirements for sesame lane
INSERT INTO public.compliance_requirements (lane_id, commodity_id, document_type, requirement_name, required, validity_period, renewal_days, release_critical) VALUES
  ((SELECT id FROM public.trade_lanes WHERE code = 'NG-KSA-SESAME'), (SELECT id FROM public.commodities WHERE code = 'SESAME'), 'BUYER_KYB', 'Buyer KYB Documentation', TRUE, NULL, NULL, FALSE),
  ((SELECT id FROM public.trade_lanes WHERE code = 'NG-KSA-SESAME'), (SELECT id FROM public.commodities WHERE code = 'SESAME'), 'EXPORTER_KYB', 'Exporter KYB Documentation', TRUE, NULL, NULL, FALSE),
  ((SELECT id FROM public.trade_lanes WHERE code = 'NG-KSA-SESAME'), (SELECT id FROM public.commodities WHERE code = 'SESAME'), 'CONTRACT', 'Trade Contract', TRUE, NULL, NULL, FALSE),
  ((SELECT id FROM public.trade_lanes WHERE code = 'NG-KSA-SESAME'), (SELECT id FROM public.commodities WHERE code = 'SESAME'), 'COMMERCIAL_INVOICE', 'Commercial Invoice', TRUE, NULL, NULL, FALSE),
  ((SELECT id FROM public.trade_lanes WHERE code = 'NG-KSA-SESAME'), (SELECT id FROM public.commodities WHERE code = 'SESAME'), 'CERTIFICATE_OF_ORIGIN', 'Certificate of Origin', TRUE, INTERVAL '90 days', 30, TRUE),
  ((SELECT id FROM public.trade_lanes WHERE code = 'NG-KSA-SESAME'), (SELECT id FROM public.commodities WHERE code = 'SESAME'), 'PHYTOSANITARY_CERTIFICATE', 'Phytosanitary Certificate', TRUE, INTERVAL '30 days', 14, TRUE),
  ((SELECT id FROM public.trade_lanes WHERE code = 'NG-KSA-SESAME'), (SELECT id FROM public.commodities WHERE code = 'SESAME'), 'CERTIFICATE_OF_ANALYSIS', 'Certificate of Analysis', TRUE, INTERVAL '30 days', 14, TRUE),
  ((SELECT id FROM public.trade_lanes WHERE code = 'NG-KSA-SESAME'), (SELECT id FROM public.commodities WHERE code = 'SESAME'), 'HEALTH_CERTIFICATE', 'Health Certificate', TRUE, INTERVAL '30 days', 14, TRUE),
  ((SELECT id FROM public.trade_lanes WHERE code = 'NG-KSA-SESAME'), (SELECT id FROM public.commodities WHERE code = 'SESAME'), 'HALAL_CERTIFICATE', 'Halal Certificate', TRUE, INTERVAL '365 days', 90, TRUE),
  ((SELECT id FROM public.trade_lanes WHERE code = 'NG-KSA-SESAME'), (SELECT id FROM public.commodities WHERE code = 'SESAME'), 'ARABIC_LABEL_VERIFICATION', 'Arabic Label Verification', TRUE, NULL, NULL, TRUE),
  ((SELECT id FROM public.trade_lanes WHERE code = 'NG-KSA-SESAME'), (SELECT id FROM public.commodities WHERE code = 'SESAME'), 'SFDA_REGISTRATION', 'SFDA Registration', TRUE, INTERVAL '365 days', 90, TRUE),
  ((SELECT id FROM public.trade_lanes WHERE code = 'NG-KSA-SESAME'), (SELECT id FROM public.commodities WHERE code = 'SESAME'), 'INSPECTION_REPORT', 'Inspection Report', TRUE, NULL, NULL, TRUE),
  ((SELECT id FROM public.trade_lanes WHERE code = 'NG-KSA-SESAME'), (SELECT id FROM public.commodities WHERE code = 'SESAME'), 'SHIPMENT_DOCUMENTATION', 'Shipment Documentation', TRUE, NULL, NULL, FALSE),
  ((SELECT id FROM public.trade_lanes WHERE code = 'NG-KSA-SESAME'), (SELECT id FROM public.commodities WHERE code = 'SESAME'), 'DESTINATION_DOCUMENTATION', 'Destination Documentation', TRUE, NULL, NULL, FALSE);

-- Insert release policies
INSERT INTO public.release_policies (policy_code, name, description, lane_id, commodity_id, transaction_type, risk_class, value_band_min, value_band_max) VALUES
  ('NG-KSA-SESAME-STANDARD', 'Sesame Standard Release Policy', 'Standard release policy for sesame transactions', 
   (SELECT id FROM public.trade_lanes WHERE code = 'NG-KSA-SESAME'),
   (SELECT id FROM public.commodities WHERE code = 'SESAME'),
   'COMMODITY_EXPORT', 'medium', 0, 1000000),
  ('NG-KSA-SESAME-HIGH_VALUE', 'Sesame High Value Release Policy', 'High value release policy requiring dual approval',
   (SELECT id FROM public.trade_lanes WHERE code = 'NG-KSA-SESAME'),
   (SELECT id FROM public.commodities WHERE code = 'SESAME'),
   'COMMODITY_EXPORT', 'high', 1000000, NULL);

-- Insert release conditions for standard policy
INSERT INTO public.release_conditions (policy_id, condition_code, condition_name, description, priority, required, automatic_check, human_approval_required, dual_approval_required, check_function) VALUES
  ((SELECT id FROM public.release_policies WHERE policy_code = 'NG-KSA-SESAME-STANDARD'), 'BUYER_KYB_APPROVED', 'Buyer KYB Approved', 'Buyer KYB verification completed and approved', 1, TRUE, TRUE, FALSE, FALSE, 'check_buyer_kyb'),
  ((SELECT id FROM public.release_policies WHERE policy_code = 'NG-KSA-SESAME-STANDARD'), 'EXPORTER_KYB_APPROVED', 'Exporter KYB Approved', 'Exporter KYB verification completed and approved', 2, TRUE, TRUE, FALSE, FALSE, 'check_exporter_kyb'),
  ((SELECT id FROM public.release_policies WHERE policy_code = 'NG-KSA-SESAME-STANDARD'), 'CONTRACT_EXECUTED', 'Contract Executed', 'Trade contract signed by all parties', 3, TRUE, TRUE, FALSE, FALSE, 'check_contract'),
  ((SELECT id FROM public.release_policies WHERE policy_code = 'NG-KSA-SESAME-STANDARD'), 'COMPLIANCE_COMPLETE', 'Compliance Complete', 'All mandatory compliance documents verified', 4, TRUE, TRUE, FALSE, FALSE, 'check_compliance'),
  ((SELECT id FROM public.release_policies WHERE policy_code = 'NG-KSA-SESAME-STANDARD'), 'INSPECTION_PASSED', 'Inspection Passed', 'Inspection completed with pass result', 5, TRUE, TRUE, FALSE, FALSE, 'check_inspection'),
  ((SELECT id FROM public.release_policies WHERE policy_code = 'NG-KSA-SESAME-STANDARD'), 'QUALITY_ACCEPTED', 'Quality Accepted', 'Quality within contract specification', 6, TRUE, TRUE, FALSE, FALSE, 'check_quality'),
  ((SELECT id FROM public.release_policies WHERE policy_code = 'NG-KSA-SESAME-STANDARD'), 'FUNDS_CONFIRMED', 'Funds Confirmed', 'Funds secured in escrow', 7, TRUE, TRUE, FALSE, FALSE, 'check_funds'),
  ((SELECT id FROM public.release_policies WHERE policy_code = 'NG-KSA-SESAME-STANDARD'), 'SHIPMENT_VERIFIED', 'Shipment Verified', 'Shipment confirmed and in transit', 8, FALSE, TRUE, FALSE, FALSE, 'check_shipment'),
  ((SELECT id FROM public.release_policies WHERE policy_code = 'NG-KSA-SESAME-STANDARD'), 'PORT_VERIFIED', 'Port Verified', 'Port verification completed', 9, FALSE, TRUE, FALSE, FALSE, 'check_port'),
  ((SELECT id FROM public.release_policies WHERE policy_code = 'NG-KSA-SESAME-STANDARD'), 'FINAL_DOCUMENTS_COMPLETE', 'Final Documents Complete', 'All final documents received', 10, FALSE, TRUE, FALSE, FALSE, 'check_final_docs');

-- Insert release conditions for high value policy (requires human approval)
INSERT INTO public.release_conditions (policy_id, condition_code, condition_name, description, priority, required, automatic_check, human_approval_required, dual_approval_required) VALUES
  ((SELECT id FROM public.release_policies WHERE policy_code = 'NG-KSA-SESAME-HIGH_VALUE'), 'HUMAN_RELEASE_APPROVAL', 'Human Release Authorization', 'Manual release authorization required for high value', 11, TRUE, FALSE, TRUE, TRUE);

-- Note: Demo users and organizations should be created through Supabase Auth
-- The following is a reference for the seed data structure

-- Demo Organizations (to be created via API):
-- 1. MASAR Platform (ADMIN)
-- 2. Al Rajhi Foods (BUYER) - Saudi Arabia
-- 3. Nigerian Sesame Co. (EXPORTER) - Nigeria
-- 4. SGS Nigeria (INSPECTION_PARTNER) - Nigeria
-- 5. Saudi National Bank (FINANCIAL_PARTNER) - Saudi Arabia

-- Demo Users (to be created via Supabase Auth):
-- 1. CEO Demo - demo.ceo@masar.local
-- 2. Operations Demo - demo.operations@masar.local
-- 3. Compliance Demo - demo.compliance@masar.local
-- 4. Finance Demo - demo.finance@masar.local
-- 5. Buyer Demo - demo.buyer@masar.local
-- 6. Exporter Demo - demo.exporter@masar.local
-- 7. Inspector Demo - demo.inspector@masar.local
-- 8. Auditor Demo - demo.auditor@masar.local

-- Demo Transaction (to be created via API):
-- Transaction Number: MASAR-SES-2026-000001
-- Buyer: Al Rajhi Foods
-- Exporter: Nigerian Sesame Co.
-- Commodity: Sesame
-- Quantity: 1,000 MT
-- Value: $500,000
-- Lane: NG-KSA-SESAME

-- Transaction Lifecycle:
-- 1. DRAFT → RFQ
-- 2. RFQ → BUYER_VERIFIED (KYB approved)
-- 3. BUYER_VERIFIED → EXPORTER_VERIFIED (KYB approved)
-- 4. EXPORTER_VERIFIED → COMMERCIAL_MATCH
-- 5. COMMERCIAL_MATCH → CONTRACTED
-- 6. CONTRACTED → COMPLIANCE_REVIEW
-- 7. COMPLIANCE_REVIEW → COMPLIANCE_READY (14 docs verified)
-- 8. COMPLIANCE_READY → INSPECTION_PENDING
-- 9. INSPECTION_PENDING → INSPECTION_IN_PROGRESS
-- 10. INSPECTION_IN_PROGRESS → INSPECTION_PASSED (Quality: 96%)
-- 11. INSPECTION_PASSED → FINANCE_PENDING
-- 12. FINANCE_PENDING → FINANCE_APPROVED
-- 13. FINANCE_APPROVED → FUNDS_SECURED ($500,000 escrow)
-- 14. FUNDS_SECURED → SHIPMENT_READY
-- 15. SHIPMENT_READY → IN_TRANSIT
-- 16. IN_TRANSIT → ARRIVED (Jeddah)
-- 17. ARRIVED → PORT_VERIFIED
-- 18. PORT_VERIFIED → RELEASE_ELIGIBLE (10/10 conditions)
-- 19. RELEASE_ELIGIBLE → RELEASE_APPROVAL (Human approval)
-- 20. RELEASE_APPROVAL → SETTLEMENT
-- 21. SETTLEMENT → COMPLETED

-- Exception Scenarios (for testing):
-- 1. MASAR-SES-2026-000002: KYB_EXCEPTION (Sanctions match)
-- 2. MASAR-SES-2026-000003: DOCUMENT_EXCEPTION (Missing phytosanitary)
-- 3. MASAR-SES-2026-000004: INSPECTION_FAILED (Moisture: 12%)
-- 4. MASAR-SES-2026-000005: QUALITY_VARIANCE (Aflatoxin: 15ppb)
-- 5. MASAR-SES-2026-000006: FINANCE_DECLINED (Insufficient collateral)
-- 6. MASAR-SES-2026-000007: SHIPMENT_DELAY (Vessel delay)

COMMENT ON TABLE public.countries IS 'Reference data for countries';
COMMENT ON TABLE public.currencies IS 'Reference data for currencies';
COMMENT ON TABLE public.commodities IS 'Reference data for tradeable commodities';
COMMENT ON TABLE public.trade_lanes IS 'Configurable trade lane templates';
COMMENT ON TABLE public.sla_policies IS 'SLA policy definitions';
COMMENT ON TABLE public.automation_rules IS 'Workflow automation rules';
COMMENT ON TABLE public.quality_specifications IS 'Quality parameters by commodity';
COMMENT ON TABLE public.compliance_requirements IS 'Document requirements by lane';
COMMENT ON TABLE public.release_policies IS 'Release policy configurations';
COMMENT ON TABLE public.release_conditions IS 'Release condition definitions';
