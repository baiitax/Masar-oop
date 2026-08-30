// MASAR API - Exporter Dashboard Aggregate Endpoint
import { NextRequest } from 'next/server';
import { executeMiddlewareChain, requireAuth, rateLimit, successResponse, errorResponse, ErrorCodes } from '@/lib/api/middleware';
import { supabaseAdmin } from '@/lib/supabase/server';
import { apiConfig } from '@/lib/api/config';

export async function GET(request: NextRequest) {
  const { error, user, context } = await executeMiddlewareChain(request, [
    requireAuth(),
    rateLimit(apiConfig.rateLimits.default),
  ]);

  if (error) return errorResponse(error, context.requestId);

  try {
    const organizationId = user!.currentOrganization?.id;
    if (!organizationId) {
      return errorResponse(ErrorCodes.TENANT_ACCESS_DENIED, context.requestId);
    }

    // Load all exporter dashboard sections in parallel
    const [kpis, pipeline, actions, transactions, inventory, finance, shipments, compliance, exceptions, analytics, activity] = await Promise.allSettled([
      getExporterKPIs(organizationId),
      getExportPipeline(organizationId),
      getRequiredActions(organizationId, user!.id),
      getActiveTransactions(organizationId),
      getInventorySummary(organizationId),
      getFinancialSummary(organizationId),
      getShipmentTracking(organizationId),
      getComplianceSummary(organizationId),
      getExceptions(organizationId),
      getExportAnalytics(organizationId),
      getRecentActivity(organizationId),
    ]);

    return successResponse({
      kpis: kpis.status === 'fulfilled' ? kpis.value : null,
      pipeline: pipeline.status === 'fulfilled' ? pipeline.value : [],
      actions: actions.status === 'fulfilled' ? actions.value : [],
      transactions: transactions.status === 'fulfilled' ? transactions.value : [],
      inventory: inventory.status === 'fulfilled' ? inventory.value : null,
      finance: finance.status === 'fulfilled' ? finance.value : null,
      shipments: shipments.status === 'fulfilled' ? shipments.value : [],
      compliance: compliance.status === 'fulfilled' ? compliance.value : null,
      exceptions: exceptions.status === 'fulfilled' ? exceptions.value : [],
      analytics: analytics.status === 'fulfilled' ? analytics.value : null,
      activity: activity.status === 'fulfilled' ? activity.value : [],
      exporterHealth: await getExporterHealth(organizationId),
    }, {
      requestId: context.requestId,
      generatedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('Exporter dashboard error:', err);
    return errorResponse(ErrorCodes.INTERNAL_ERROR, context.requestId);
  }
}

// ============================================================
// EXPORTER KPI FUNCTIONS
// ============================================================

async function getExporterKPIs(organizationId: string) {
  const [transactions, funding, shipments, settlements, invoices] = await Promise.all([
    supabaseAdmin
      .from('transactions')
      .select('current_state, contract_value, estimated_value')
      .eq('exporter_organization_id', organizationId)
      .is('deleted_at', null),
    supabaseAdmin
      .from('funding_requests')
      .select('status, requested_amount, approved_amount')
      .in('transaction_id',
        supabaseAdmin
          .from('transactions')
          .select('id')
          .eq('exporter_organization_id', organizationId)
      ),
    supabaseAdmin
      .from('shipments')
      .select('status')
      .in('transaction_id',
        supabaseAdmin
          .from('transactions')
          .select('id')
          .eq('exporter_organization_id', organizationId)
      ),
    supabaseAdmin
      .from('settlements')
      .select('status, gross_amount')
      .in('transaction_id',
        supabaseAdmin
          .from('transactions')
          .select('id')
          .eq('exporter_organization_id', organizationId)
      ),
    supabaseAdmin
      .from('invoices')
      .select('status, total')
      .eq('issuer_organization_id', organizationId)
      .is('deleted_at', null),
  ]);

  const txData = transactions.data || [];
  const activeStates = ['DRAFT', 'RFQ', 'BUYER_VERIFIED', 'EXPORTER_VERIFIED', 'COMMERCIAL_MATCH', 'CONTRACTED', 'COMPLIANCE_REVIEW', 'COMPLIANCE_READY', 'INSPECTION_PENDING', 'INSPECTION_IN_PROGRESS', 'INSPECTION_PASSED', 'FINANCE_PENDING', 'FINANCE_APPROVED', 'FUNDS_SECURED', 'SHIPMENT_READY', 'IN_TRANSIT', 'ARRIVED', 'PORT_VERIFIED', 'RELEASE_ELIGIBLE', 'RELEASE_APPROVAL', 'SETTLEMENT'];

  const activeTransactions = txData.filter(t => activeStates.includes(t.current_state));
  const totalExportValue = txData.reduce((sum, t) => sum + (t.contract_value || t.estimated_value || 0), 0);
  const pipelineValue = activeTransactions.reduce((sum, t) => sum + (t.contract_value || t.estimated_value || 0), 0);

  const shipmentData = shipments.data || [];
  const goodsInTransit = shipmentData.filter(s => ['in_transit', 'departed'].includes(s.status)).length;

  const settlementData = settlements.data || [];
  const expectedSettlement = settlementData
    .filter(s => ['pending', 'processing'].includes(s.status))
    .reduce((sum, s) => sum + (s.gross_amount || 0), 0);

  const invoiceData = invoices.data || [];
  const outstandingReceivables = invoiceData
    .filter(i => ['issued', 'sent', 'overdue'].includes(i.status))
    .reduce((sum, i) => sum + (i.total || 0), 0);

  const completedSettlements = settlementData.filter(s => s.status === 'completed');
  const completedValue = completedSettlements.reduce((sum, s) => sum + (s.gross_amount || 0), 0);

  return {
    activeExportOrders: activeTransactions.length,
    totalExportValue,
    confirmedOrders: txData.filter(t => ['CONTRACTED', 'COMPLIANCE_REVIEW', 'COMPLIANCE_READY'].includes(t.current_state)).length,
    pipelineValue,
    goodsInTransit,
    pendingDocumentation: 0, // Would query documents
    outstandingReceivables,
    expectedSettlement,
    openExceptions: 0, // Will be set from exceptions
    completionRate: txData.length > 0 ? Math.round((completedSettlements.length / txData.length) * 100) : 0,
    averageOrderValue: txData.length > 0 ? totalExportValue / txData.length : 0,
  };
}

async function getExportPipeline(organizationId: string) {
  const { data: transactions } = await supabaseAdmin
    .from('transactions')
    .select('current_state, contract_value, estimated_value')
    .eq('exporter_organization_id', organizationId)
    .is('deleted_at', null);

  if (!transactions) return [];

  const stages = [
    { label: 'Opportunity', states: ['DRAFT', 'RFQ'] },
    { label: 'Quotation', states: ['BUYER_VERIFIED', 'EXPORTER_VERIFIED'] },
    { label: 'Order', states: ['COMMERCIAL_MATCH', 'CONTRACTED'] },
    { label: 'Compliance', states: ['COMPLIANCE_REVIEW', 'COMPLIANCE_READY'] },
    { label: 'Inspection', states: ['INSPECTION_PENDING', 'INSPECTION_IN_PROGRESS', 'INSPECTION_PASSED'] },
    { label: 'Documentation', states: ['FINANCE_PENDING', 'FINANCE_APPROVED'] },
    { label: 'Finance', states: ['FUNDS_SECURED'] },
    { label: 'Shipment', states: ['SHIPMENT_READY', 'IN_TRANSIT', 'ARRIVED', 'PORT_VERIFIED'] },
    { label: 'Delivery', states: ['RELEASE_ELIGIBLE', 'RELEASE_APPROVAL'] },
    { label: 'Settlement', states: ['SETTLEMENT'] },
    { label: 'Completed', states: ['COMPLETED'] },
  ];

  return stages.map(stage => {
    const stageTx = transactions.filter(t => stage.states.includes(t.current_state));
    const totalValue = stageTx.reduce((sum, t) => sum + (t.contract_value || t.estimated_value || 0), 0);
    const blockedCount = stageTx.filter(t =>
      t.current_state.includes('EXCEPTION') ||
      t.current_state.includes('FAILED') ||
      t.current_state.includes('DELAY')
    ).length;

    return {
      stage: stage.label,
      count: stageTx.length,
      value: totalValue,
      blocked: blockedCount,
    };
  });
}

async function getRequiredActions(organizationId: string, userId: string) {
  const actions = [];

  // Pending document uploads
  const { data: pendingDocs } = await supabaseAdmin
    .from('documents')
    .select('id, document_type, transaction_id, transaction:transaction_id(transaction_number)')
    .eq('organization_id', organizationId)
    .in('status', ['expected', 'missing'])
    .is('deleted_at', null)
    .limit(10);

  if (pendingDocs?.length) {
    actions.push(...pendingDocs.map(d => ({
      type: 'DOCUMENT_UPLOAD',
      priority: 'high',
      title: `Upload ${(d.transaction as any)?.transaction_number || 'document'}`,
      description: `${d.document_type.replace(/_/g, ' ')} required`,
      transactionId: d.transaction_id,
      transactionNumber: (d.transaction as any)?.transaction_number,
      action: 'Upload Document',
    })));
  }

  // Pending tasks
  const { data: pendingTasks } = await supabaseAdmin
    .from('tasks')
    .select('id, title, description, transaction_id, transaction:transaction_id(transaction_number), due_at')
    .eq('assigned_to', userId)
    .eq('status', 'pending')
    .is('deleted_at', null)
    .limit(5);

  if (pendingTasks?.length) {
    actions.push(...pendingTasks.map(t => ({
      type: 'TASK',
      priority: 'medium',
      title: t.title,
      description: t.description,
      transactionId: t.transaction_id,
      transactionNumber: (t.transaction as any)?.transaction_number,
      dueDate: t.due_at,
      action: 'Complete Task',
    })));
  }

  // Pending inspections
  const { data: pendingInspections } = await supabaseAdmin
    .from('inspections')
    .select('id, scheduled_at, transaction_id, transaction:transaction_id(transaction_number)')
    .in('transaction_id',
      supabaseAdmin
        .from('transactions')
        .select('id')
        .eq('exporter_organization_id', organizationId)
    )
    .in('status', ['requested', 'accepted', 'scheduled'])
    .limit(5);

  if (pendingInspections?.length) {
    actions.push(...pendingInspections.map(i => ({
      type: 'INSPECTION',
      priority: 'high',
      title: 'Inspection Pending',
      description: `Transaction ${(i.transaction as any)?.transaction_number}`,
      transactionId: i.transaction_id,
      transactionNumber: (i.transaction as any)?.transaction_number,
      dueDate: i.scheduled_at,
      action: 'Schedule Inspection',
    })));
  }

  return actions.sort((a, b) => {
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    return (priorityOrder[a.priority as keyof typeof priorityOrder] || 4) -
           (priorityOrder[b.priority as keyof typeof priorityOrder] || 4);
  });
}

async function getActiveTransactions(organizationId: string) {
  const { data: transactions } = await supabaseAdmin
    .from('transactions')
    .select(`
      id,
      transaction_number,
      current_state,
      contract_value,
      estimated_value,
      currency,
      quantity,
      unit,
      created_at,
      updated_at,
      buyer:buyer_organization_id(legal_name),
      commodity:commodity_id(name, code)
    `)
    .eq('exporter_organization_id', organizationId)
    .not('current_state', 'in', '(COMPLETED,CANCELLED)')
    .is('deleted_at', null)
    .order('updated_at', { ascending: false })
    .limit(20);

  return (transactions || []).map(tx => ({
    id: tx.id,
    transactionNumber: tx.transaction_number,
    currentState: tx.current_state,
    value: tx.contract_value || tx.estimated_value || 0,
    currency: tx.currency,
    quantity: tx.quantity,
    unit: tx.unit,
    buyer: (tx.buyer as any)?.legal_name || 'Unknown',
    commodity: (tx.commodity as any)?.name || 'Unknown',
    commodityCode: (tx.commodity as any)?.code,
    progress: calculateProgress(tx.current_state),
    lastUpdated: tx.updated_at,
    createdAt: tx.created_at,
  }));
}

async function getInventorySummary(organizationId: string) {
  // In production, this would query inventory tables
  return {
    totalProducts: 0,
    availableStock: 0,
    allocatedStock: 0,
    reservedStock: 0,
    inProduction: 0,
    inInspection: 0,
    readyForShipment: 0,
    shipped: 0,
    lowStockAlerts: 0,
  };
}

async function getFinancialSummary(organizationId: string) {
  const [invoices, settlements] = await Promise.all([
    supabaseAdmin
      .from('invoices')
      .select('status, total, currency')
      .eq('issuer_organization_id', organizationId)
      .is('deleted_at', null),
    supabaseAdmin
      .from('settlements')
      .select('status, gross_amount, currency')
      .in('transaction_id',
        supabaseAdmin
          .from('transactions')
          .select('id')
          .eq('exporter_organization_id', organizationId)
      ),
  ]);

  const invoiceData = invoices.data || [];
  const settlementData = settlements.data || [];

  return {
    totalInvoiced: invoiceData.reduce((sum, i) => sum + (i.total || 0), 0),
    paidAmount: invoiceData.filter(i => i.status === 'paid').reduce((sum, i) => sum + (i.total || 0), 0),
    pendingAmount: invoiceData.filter(i => ['issued', 'sent', 'overdue'].includes(i.status)).reduce((sum, i) => sum + (i.total || 0), 0),
    overdueAmount: invoiceData.filter(i => i.status === 'overdue').reduce((sum, i) => sum + (i.total || 0), 0),
    settlementsCompleted: settlementData.filter(s => s.status === 'completed').length,
    settlementsPending: settlementData.filter(s => ['pending', 'processing'].includes(s.status)).length,
    totalRevenue: settlementData.filter(s => s.status === 'completed').reduce((sum, s) => sum + (s.gross_amount || 0), 0),
  };
}

async function getShipmentTracking(organizationId: string) {
  const { data: shipments } = await supabaseAdmin
    .from('shipments')
    .select(`
      id,
      shipment_reference,
      status,
      carrier,
      vessel,
      origin_port,
      destination_port,
      estimated_departure,
      actual_departure,
      estimated_arrival,
      actual_arrival,
      transaction_id,
      transaction:transaction_id(transaction_number, buyer:buyer_organization_id(legal_name))
    `)
    .in('transaction_id',
      supabaseAdmin
        .from('transactions')
        .select('id')
        .eq('exporter_organization_id', organizationId)
    )
    .not('status', 'in', '(delivered,not_started)')
    .order('estimated_arrival', { ascending: true })
    .limit(10);

  return (shipments || []).map(s => ({
    id: s.id,
    reference: s.shipment_reference,
    status: s.status,
    carrier: s.carrier,
    vessel: s.vessel,
    origin: s.origin_port,
    destination: s.destination_port,
    eta: s.estimated_arrival,
    transactionNumber: (s.transaction as any)?.transaction_number,
    buyer: ((s.transaction as any)?.buyer as any)?.legal_name,
    progress: calculateShipmentProgress(s.status),
  }));
}

async function getComplianceSummary(organizationId: string) {
  const [kyb, documents] = await Promise.all([
    supabaseAdmin
      .from('kyb_cases')
      .select('status, next_review_date')
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single(),
    supabaseAdmin
      .from('documents')
      .select('status')
      .eq('organization_id', organizationId)
      .is('deleted_at', null),
  ]);

  const kybStatus = kyb.data?.status || 'not_started';
  const kybExpiring = kyb.data?.next_review_date
    ? Math.ceil((new Date(kyb.data.next_review_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) <= 30
    : false;

  const docs = documents.data || [];

  return {
    kybStatus,
    kybExpiring,
    documentsVerified: docs.filter(d => d.status === 'verified').length,
    documentsPending: docs.filter(d => ['expected', 'missing', 'uploaded', 'processing'].includes(d.status)).length,
    documentsExpiring: docs.filter(d => d.status === 'expiring').length,
    totalDocuments: docs.length,
  };
}

async function getExceptions(organizationId: string) {
  const { data: exceptions } = await supabaseAdmin
    .from('exceptions')
    .select(`
      id,
      exception_type,
      severity,
      status,
      description,
      created_at,
      transaction_id,
      transaction:transaction_id(transaction_number, contract_value)
    `)
    .in('transaction_id',
      supabaseAdmin
        .from('transactions')
        .select('id')
        .eq('exporter_organization_id', organizationId)
    )
    .in('status', ['open', 'in_progress'])
    .order('created_at', { ascending: false })
    .limit(10);

  return (exceptions || []).map(e => ({
    id: e.id,
    type: e.exception_type,
    severity: e.severity,
    status: e.status,
    description: e.description,
    transactionNumber: (e.transaction as any)?.transaction_number,
    value: (e.transaction as any)?.contract_value || 0,
    createdAt: e.created_at,
    age: Math.round((Date.now() - new Date(e.created_at).getTime()) / (1000 * 60 * 60)),
  }));
}

async function getExportAnalytics(organizationId: string) {
  const { data: transactions } = await supabaseAdmin
    .from('transactions')
    .select('current_state, contract_value, estimated_value, created_at')
    .eq('exporter_organization_id', organizationId)
    .is('deleted_at', null);

  if (!transactions) return null;

  const completed = transactions.filter(t => t.current_state === 'COMPLETED');
  const totalValue = completed.reduce((sum, t) => sum + (t.contract_value || t.estimated_value || 0), 0);

  return {
    totalTransactions: transactions.length,
    completedTransactions: completed.length,
    totalExportValue: totalValue,
    averageOrderValue: completed.length > 0 ? totalValue / completed.length : 0,
    completionRate: transactions.length > 0 ? Math.round((completed.length / transactions.length) * 100) : 0,
  };
}

async function getRecentActivity(organizationId: string) {
  const { data: events } = await supabaseAdmin
    .from('protocol_events')
    .select(`
      id,
      event_type,
      occurred_at,
      transaction_id,
      transaction:transaction_id(transaction_number),
      actor:actor_user_id(full_name)
    `)
    .in('transaction_id',
      supabaseAdmin
        .from('transactions')
        .select('id')
        .eq('exporter_organization_id', organizationId)
    )
    .order('occurred_at', { ascending: false })
    .limit(15);

  return (events || []).map(e => ({
    id: e.id,
    type: e.event_type,
    transactionNumber: (e.transaction as any)?.transaction_number,
    actor: (e.actor as any)?.full_name || 'System',
    timestamp: e.occurred_at,
  }));
}

async function getExporterHealth(organizationId: string) {
  const [kyb, compliance] = await Promise.all([
    supabaseAdmin
      .from('kyb_cases')
      .select('status, next_review_date')
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single(),
    supabaseAdmin
      .from('documents')
      .select('status')
      .eq('organization_id', organizationId)
      .is('deleted_at', null),
  ]);

  const kybStatus = kyb.data?.status || 'not_started';
  const kybExpiring = kyb.data?.next_review_date
    ? Math.ceil((new Date(kyb.data.next_review_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) <= 30
    : false;

  const docs = compliance.data || [];
  const missingDocs = docs.filter(d => ['expected', 'missing'].includes(d.status)).length;

  return {
    kybStatus,
    kybExpiring,
    documentIssues: missingDocs,
    verified: kybStatus === 'approved' && missingDocs === 0,
    warnings: [
      ...(kybExpiring ? ['KYB renewal required'] : []),
      ...(missingDocs > 0 ? [`${missingDocs} documents missing`] : []),
    ],
  };
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

function calculateProgress(state: string): number {
  const stateProgress: Record<string, number> = {
    'DRAFT': 5, 'RFQ': 10,
    'BUYER_VERIFIED': 15, 'EXPORTER_VERIFIED': 20,
    'COMMERCIAL_MATCH': 25, 'CONTRACTED': 30,
    'COMPLIANCE_REVIEW': 40, 'COMPLIANCE_READY': 50,
    'INSPECTION_PENDING': 55, 'INSPECTION_IN_PROGRESS': 60, 'INSPECTION_PASSED': 65,
    'FINANCE_PENDING': 70, 'FINANCE_APPROVED': 75, 'FUNDS_SECURED': 80,
    'SHIPMENT_READY': 82, 'IN_TRANSIT': 85, 'ARRIVED': 88, 'PORT_VERIFIED': 90,
    'RELEASE_ELIGIBLE': 92, 'RELEASE_APPROVAL': 95, 'SETTLEMENT': 98, 'COMPLETED': 100,
  };
  return stateProgress[state] || 0;
}

function calculateShipmentProgress(status: string): number {
  const statusProgress: Record<string, number> = {
    'booked': 10, 'gate_in': 20, 'loaded': 30, 'departed': 40,
    'in_transit': 60, 'arrived': 80, 'discharged': 85, 'customs_cleared': 90, 'delivered': 100,
  };
  return statusProgress[status] || 0;
}
