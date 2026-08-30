-- MASAR Protocol Database - Migration 016
-- Analytics Views and Materialized Views

-- Transaction summary view
CREATE OR REPLACE VIEW public.v_transaction_summary AS
SELECT 
  t.id,
  t.transaction_number,
  t.transaction_type,
  t.current_state,
  t.risk_level,
  t.clearance_readiness_score,
  t.confidence_score,
  t.estimated_value,
  t.contract_value,
  t.currency,
  t.created_at,
  t.updated_at,
  t.completed_at,
  -- Buyer info
  bo.legal_name AS buyer_name,
  bo.country_code AS buyer_country,
  -- Exporter info
  eo.legal_name AS exporter_name,
  eo.country_code AS exporter_country,
  -- Commodity info
  c.name AS commodity_name,
  c.code AS commodity_code,
  -- Lane info
  tl.code AS lane_code,
  -- Assigned user
  p.full_name AS assigned_to_name,
  -- State duration
  EXTRACT(EPOCH FROM (NOW() - t.updated_at)) / 3600 AS hours_in_current_state
FROM public.transactions t
LEFT JOIN public.organizations bo ON t.buyer_organization_id = bo.id
LEFT JOIN public.organizations eo ON t.exporter_organization_id = eo.id
LEFT JOIN public.commodities c ON t.commodity_id = c.id
LEFT JOIN public.trade_lanes tl ON t.lane_id = tl.id
LEFT JOIN public.profiles p ON t.assigned_to = p.auth_user_id
WHERE t.deleted_at IS NULL;

-- Transaction timeline view
CREATE OR REPLACE VIEW public.v_transaction_timeline AS
SELECT 
  pe.transaction_id,
  pe.event_type,
  pe.event_source,
  pe.occurred_at,
  pe.payload,
  p.full_name AS actor_name,
  o.legal_name AS actor_organization
FROM public.protocol_events pe
LEFT JOIN public.profiles p ON pe.actor_user_id = p.auth_user_id
LEFT JOIN public.organizations o ON pe.actor_organization_id = o.id
ORDER BY pe.occurred_at DESC;

-- Compliance status view
CREATE OR REPLACE VIEW public.v_compliance_status AS
SELECT 
  cc.transaction_id,
  cc.status AS compliance_status,
  cc.readiness_score,
  cc.risk_level,
  t.transaction_number,
  -- Document counts
  (SELECT COUNT(*) FROM public.documents d WHERE d.transaction_id = cc.transaction_id AND d.deleted_at IS NULL) AS total_documents,
  (SELECT COUNT(*) FROM public.documents d WHERE d.transaction_id = cc.transaction_id AND d.status = 'verified' AND d.deleted_at IS NULL) AS verified_documents,
  (SELECT COUNT(*) FROM public.documents d WHERE d.transaction_id = cc.transaction_id AND d.status IN ('expected', 'missing') AND d.deleted_at IS NULL) AS pending_documents,
  (SELECT COUNT(*) FROM public.documents d WHERE d.transaction_id = cc.transaction_id AND d.status = 'expired' AND d.deleted_at IS NULL) AS expired_documents,
  -- Exception counts
  (SELECT COUNT(*) FROM public.exceptions e WHERE e.transaction_id = cc.transaction_id AND e.status IN ('open', 'in_progress')) AS open_exceptions
FROM public.compliance_cases cc
JOIN public.transactions t ON cc.transaction_id = t.id;

-- KYB summary view
CREATE OR REPLACE VIEW public.v_kyb_summary AS
SELECT 
  kc.id AS kyb_case_id,
  kc.organization_id,
  kc.case_number,
  kc.status AS kyb_status,
  kc.decision,
  kc.risk_level,
  kc.risk_score,
  kc.submitted_at,
  kc.completed_at,
  o.legal_name AS organization_name,
  o.organization_type,
  -- Check counts
  (SELECT COUNT(*) FROM public.kyb_checks kchk WHERE kchk.kyb_case_id = kc.id) AS total_checks,
  (SELECT COUNT(*) FROM public.kyb_checks kchk WHERE kchk.kyb_case_id = kc.id AND kchk.status = 'completed') AS completed_checks,
  (SELECT COUNT(*) FROM public.kyb_checks kchk WHERE kchk.kyb_case_id = kc.id AND kchk.status = 'failed') AS failed_checks,
  -- Screening matches
  (SELECT COUNT(*) FROM public.screening_matches sm WHERE sm.kyb_case_id = kc.id AND sm.status = 'potential_match') AS potential_matches,
  (SELECT COUNT(*) FROM public.screening_matches sm WHERE sm.kyb_case_id = kc.id AND sm.status = 'confirmed') AS confirmed_matches
FROM public.kyb_cases kc
JOIN public.organizations o ON kc.organization_id = o.id;

-- Inspection summary view
CREATE OR REPLACE VIEW public.v_inspection_summary AS
SELECT 
  i.id AS inspection_id,
  i.transaction_id,
  i.inspection_number,
  i.status AS inspection_status,
  i.result,
  i.scheduled_at,
  i.completed_at,
  t.transaction_number,
  provider.legal_name AS provider_name,
  inspector.full_name AS inspector_name,
  -- Sample counts
  (SELECT COUNT(*) FROM public.samples s WHERE s.inspection_id = i.id) AS total_samples,
  (SELECT COUNT(*) FROM public.samples s WHERE s.inspection_id = i.id AND s.status = 'completed') AS completed_samples,
  -- Lab result counts
  (SELECT COUNT(*) FROM public.lab_results lr 
   JOIN public.samples s ON lr.sample_id = s.id 
   WHERE s.inspection_id = i.id) AS total_results,
  (SELECT COUNT(*) FROM public.lab_results lr 
   JOIN public.samples s ON lr.sample_id = s.id 
   WHERE s.inspection_id = i.id AND lr.pass_fail = 'pass') AS passed_results,
  -- Quality score
  (SELECT AVG(qr.actual_value) FROM public.quality_results qr WHERE qr.inspection_id = i.id) AS avg_quality_score
FROM public.inspections i
JOIN public.transactions t ON i.transaction_id = t.id
LEFT JOIN public.organizations provider ON i.provider_id = provider.id
LEFT JOIN public.profiles inspector ON i.inspector_id = inspector.auth_user_id;

-- Finance summary view
CREATE OR REPLACE VIEW public.v_finance_summary AS
SELECT 
  t.id AS transaction_id,
  t.transaction_number,
  t.contract_value,
  t.currency,
  -- Funding
  fr.id AS funding_request_id,
  fr.status AS funding_status,
  fr.requested_amount,
  fr.approved_amount,
  -- Escrow
  er.id AS escrow_id,
  er.status AS escrow_status,
  er.expected_amount AS escrow_expected,
  er.confirmed_amount AS escrow_confirmed,
  er.funded_at,
  -- Settlement
  s.id AS settlement_id,
  s.status AS settlement_status,
  s.gross_amount AS settlement_amount,
  s.executed_at AS settlement_date
FROM public.transactions t
LEFT JOIN public.funding_requests fr ON t.id = fr.transaction_id
LEFT JOIN public.escrow_records er ON t.id = er.transaction_id
LEFT JOIN public.settlements s ON t.id = s.transaction_id;

-- Shipment summary view
CREATE OR REPLACE VIEW public.v_shipment_summary AS
SELECT 
  sh.id AS shipment_id,
  sh.transaction_id,
  sh.shipment_reference,
  sh.status AS shipment_status,
  sh.carrier,
  sh.vessel,
  sh.container_count,
  sh.estimated_departure,
  sh.actual_departure,
  sh.estimated_arrival,
  sh.actual_arrival,
  sh.origin_port,
  sh.destination_port,
  t.transaction_number,
  -- Event counts
  (SELECT COUNT(*) FROM public.shipment_events se WHERE se.shipment_id = sh.id) AS total_events,
  -- Port verification
  pv.status AS port_verification_status,
  pv.verified_at AS port_verified_at
FROM public.shipments sh
JOIN public.transactions t ON sh.transaction_id = t.id
LEFT JOIN public.port_verifications pv ON sh.id = pv.shipment_id;

-- Exception summary view
CREATE OR REPLACE VIEW public.v_exception_summary AS
SELECT 
  e.id AS exception_id,
  e.transaction_id,
  e.exception_type,
  e.severity,
  e.status,
  e.description,
  e.sla_deadline,
  e.created_at,
  t.transaction_number,
  assigned.full_name AS assigned_to_name,
  org.legal_name AS assigned_organization
FROM public.exceptions e
JOIN public.transactions t ON e.transaction_id = t.id
LEFT JOIN public.profiles assigned ON e.assigned_to = assigned.auth_user_id
LEFT JOIN public.organizations org ON e.assigned_organization_id = org.id;

-- SLA metrics view
CREATE OR REPLACE VIEW public.v_sla_metrics AS
SELECT 
  sp.policy_code,
  sp.name AS policy_name,
  sp.category,
  sp.target_hours,
  -- Instance counts
  COUNT(si.id) AS total_instances,
  COUNT(CASE WHEN si.status = 'active' THEN 1 END) AS active_instances,
  COUNT(CASE WHEN si.status = 'warning' THEN 1 END) AS warning_instances,
  COUNT(CASE WHEN si.status = 'critical' THEN 1 END) AS critical_instances,
  COUNT(CASE WHEN si.status = 'breached' THEN 1 END) AS breached_instances,
  COUNT(CASE WHEN si.status = 'completed' THEN 1 END) AS completed_instances,
  -- Average completion time
  AVG(CASE 
    WHEN si.status = 'completed' 
    THEN EXTRACT(EPOCH FROM (si.completed_at - si.started_at)) / 3600 
  END) AS avg_completion_hours
FROM public.sla_policies sp
LEFT JOIN public.sla_instances si ON sp.id = si.policy_id
WHERE sp.active = TRUE
GROUP BY sp.id, sp.policy_code, sp.name, sp.category, sp.target_hours;

-- Dashboard KPI views
CREATE OR REPLACE VIEW public.v_dashboard_transaction_kpis AS
SELECT 
  COUNT(*) AS total_transactions,
  COUNT(CASE WHEN current_state = 'COMPLETED' THEN 1 END) AS completed_transactions,
  COUNT(CASE WHEN current_state NOT IN ('COMPLETED', 'CANCELLED') THEN 1 END) AS active_transactions,
  COUNT(CASE WHEN current_state IN ('KYB_EXCEPTION', 'SANCTIONS_EXCEPTION', 'COMPLIANCE_EXCEPTION', 'DOCUMENT_EXCEPTION', 'INSPECTION_FAILED', 'QUALITY_VARIANCE', 'FINANCE_DECLINED', 'SHIPMENT_DELAY', 'PORT_EXCEPTION', 'SETTLEMENT_EXCEPTION', 'DISPUTE') THEN 1 END) AS exception_transactions,
  SUM(CASE WHEN current_state = 'COMPLETED' THEN contract_value ELSE 0 END) AS completed_gmv,
  SUM(CASE WHEN current_state NOT IN ('COMPLETED', 'CANCELLED') THEN estimated_value ELSE 0 END) AS pipeline_value,
  AVG(CASE 
    WHEN current_state = 'COMPLETED' AND completed_at IS NOT NULL 
    THEN EXTRACT(EPOCH FROM (completed_at - created_at)) / 86400 
  END) AS avg_cycle_days,
  AVG(clearance_readiness_score) AS avg_clearance_score,
  AVG(confidence_score) AS avg_confidence_score
FROM public.transactions
WHERE deleted_at IS NULL;

-- Dashboard KYB KPIs
CREATE OR REPLACE VIEW public.v_dashboard_kyb_kpis AS
SELECT 
  COUNT(*) AS total_cases,
  COUNT(CASE WHEN status = 'approved' THEN 1 END) AS approved_cases,
  COUNT(CASE WHEN status IN ('submitted', 'data_extraction', 'entity_matching', 'registry_verification', 'ownership_mapping', 'ubo_identification', 'sanctions_screening', 'pep_screening', 'adverse_media', 'risk_review', 'risk_classification') THEN 1 END) AS pending_cases,
  COUNT(CASE WHEN status = 'rejected' OR status = 'blocked' THEN 1 END) AS rejected_cases,
  COUNT(CASE WHEN decision = 'auto_clear' THEN 1 END) AS auto_cleared,
  COUNT(CASE WHEN decision = 'human_review' THEN 1 END) AS human_review,
  COUNT(CASE WHEN decision = 'blocked' THEN 1 END) AS blocked,
  AVG(risk_score) AS avg_risk_score
FROM public.kyb_cases;

-- Dashboard Compliance KPIs
CREATE OR REPLACE VIEW public.v_dashboard_compliance_kpis AS
SELECT 
  COUNT(*) AS total_cases,
  COUNT(CASE WHEN status = 'ready' THEN 1 END) AS ready_cases,
  COUNT(CASE WHEN status = 'in_progress' THEN 1 END) AS in_progress_cases,
  COUNT(CASE WHEN status = 'exception' THEN 1 END) AS exception_cases,
  AVG(readiness_score) AS avg_readiness_score
FROM public.compliance_cases;

-- Dashboard Finance KPIs
CREATE OR REPLACE VIEW public.v_dashboard_finance_kpis AS
SELECT 
  (SELECT COUNT(*) FROM public.funding_requests) AS total_funding_requests,
  (SELECT COUNT(*) FROM public.funding_requests WHERE status = 'approved') AS approved_funding,
  (SELECT COUNT(*) FROM public.funding_requests WHERE status = 'funded') AS funded,
  (SELECT SUM(approved_amount) FROM public.funding_requests WHERE status IN ('approved', 'funded')) AS total_approved_amount,
  (SELECT COUNT(*) FROM public.escrow_records WHERE status = 'funded') AS escrow_funded,
  (SELECT SUM(confirmed_amount) FROM public.escrow_records WHERE status = 'funded') AS total_escrow_amount,
  (SELECT COUNT(*) FROM public.settlements WHERE status = 'completed') AS completed_settlements,
  (SELECT SUM(gross_amount) FROM public.settlements WHERE status = 'completed') AS total_settled_amount;

-- Release readiness view
CREATE OR REPLACE VIEW public.v_release_readiness AS
SELECT 
  t.id AS transaction_id,
  t.transaction_number,
  t.current_state,
  t.contract_value,
  t.currency,
  -- Condition counts
  (SELECT COUNT(*) FROM public.protocol_conditions pc WHERE pc.transaction_id = t.id) AS total_conditions,
  (SELECT COUNT(*) FROM public.protocol_conditions pc WHERE pc.transaction_id = t.id AND pc.status = 'satisfied') AS satisfied_conditions,
  (SELECT COUNT(*) FROM public.protocol_conditions pc WHERE pc.transaction_id = t.id AND pc.required = TRUE AND pc.status = 'satisfied') AS required_satisfied,
  (SELECT COUNT(*) FROM public.protocol_conditions pc WHERE pc.transaction_id = t.id AND pc.required = TRUE) AS required_total,
  -- Approval status
  ra.status AS approval_status,
  ra.required_approvals,
  (SELECT COUNT(*) FROM public.release_approval_votes rav WHERE rav.approval_id = ra.id AND rav.decision = 'approved') AS approvals_received
FROM public.transactions t
LEFT JOIN public.release_approvals ra ON t.id = ra.transaction_id
WHERE t.deleted_at IS NULL
AND t.current_state IN ('RELEASE_ELIGIBLE', 'RELEASE_APPROVAL', 'SETTLEMENT', 'COMPLETED');

COMMENT ON VIEW public.v_transaction_summary IS 'Transaction overview with related data';
COMMENT ON VIEW public.v_transaction_timeline IS 'Chronological transaction events';
COMMENT ON VIEW public.v_compliance_status IS 'Compliance status per transaction';
COMMENT ON VIEW public.v_kyb_summary IS 'KYB case summary with check counts';
COMMENT ON VIEW public.v_inspection_summary IS 'Inspection summary with results';
COMMENT ON VIEW public.v_finance_summary IS 'Financial status per transaction';
COMMENT ON VIEW public.v_shipment_summary IS 'Shipment tracking summary';
COMMENT ON VIEW public.v_exception_summary IS 'Exception case details';
COMMENT ON VIEW public.v_sla_metrics IS 'SLA performance metrics';
COMMENT ON VIEW public.v_release_readiness IS 'Release condition evaluation';
