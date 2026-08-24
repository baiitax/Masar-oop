import { createClient } from '@/lib/supabase/client';

// Check if Supabase is configured
const isConfigured = () => {
  return process.env.NEXT_PUBLIC_SUPABASE_URL && 
         process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
         process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co';
};

const supabase = createClient();

// ============================================================
// AUTH FUNCTIONS
// ============================================================

export async function signUp(email: string, password: string, metadata: {
  full_name: string;
  company?: string;
  phone?: string;
  role?: string;
}) {
  if (!isConfigured()) {
    return { data: null, error: { message: 'Supabase not configured' } };
  }
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  });
  return { data, error };
}

export async function signIn(email: string, password: string) {
  if (!isConfigured()) {
    return { data: null, error: { message: 'Supabase not configured' } };
  }
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
}

export async function signOut() {
  if (!isConfigured()) {
    return { error: null };
  }
  
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getCurrentUser() {
  if (!isConfigured()) {
    return null;
  }
  
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function getProfile(userId: string) {
  if (!isConfigured()) {
    return { data: null, error: { message: 'Supabase not configured' } };
  }
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  return { data, error };
}

export async function updateProfile(userId: string, updates: Record<string, any>) {
  if (!isConfigured()) {
    return { data: null, error: { message: 'Supabase not configured' } };
  }
  
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  return { data, error };
}

// ============================================================
// TRANSACTION FUNCTIONS
// ============================================================

export async function getTransactions(filters?: {
  status?: string;
  buyer_id?: string;
  exporter_id?: string;
  limit?: number;
  offset?: number;
}) {
  if (!isConfigured()) {
    return { data: [], error: null };
  }
  
  let query = supabase
    .from('transactions')
    .select(`
      *,
      buyer:buyers(*, organization:organizations(*)),
      exporter:exporters(*, organization:organizations(*)),
      commodity:commodities(*)
    `)
    .order('created_at', { ascending: false });

  if (filters?.status) query = query.eq('status', filters.status);
  if (filters?.buyer_id) query = query.eq('buyer_id', filters.buyer_id);
  if (filters?.exporter_id) query = query.eq('exporter_id', filters.exporter_id);
  if (filters?.limit) query = query.limit(filters.limit);
  if (filters?.offset) query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);

  const { data, error } = await query;
  return { data, error };
}

export async function getTransaction(id: string) {
  if (!isConfigured()) {
    return { data: null, error: { message: 'Supabase not configured' } };
  }
  
  const { data, error } = await supabase
    .from('transactions')
    .select(`
      *,
      buyer:buyers(*, organization:organizations(*)),
      exporter:exporters(*, organization:organizations(*)),
      commodity:commodities(*),
      timeline:transaction_timeline(*),
      documents(*),
      inspections(*, results:inspection_results(*)),
      shipments(*),
      finance_requests(*),
      escrow_instructions(*),
      exceptions(*)
    `)
    .eq('id', id)
    .single();
  return { data, error };
}

export async function createTransaction(transaction: {
  buyer_id: string;
  exporter_id: string;
  commodity_id: string;
  quantity: string;
  contract_value: number;
  incoterm: string;
  destination: string;
  origin: string;
}) {
  if (!isConfigured()) {
    return { data: null, error: { message: 'Supabase not configured' } };
  }
  
  const masarId = `MASAR-SES-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 999999)).padStart(6, '0')}`;
  
  const { data, error } = await supabase
    .from('transactions')
    .insert({
      ...transaction,
      masar_id: masarId,
      status: 'DRAFT',
      risk_level: 'LOW',
    })
    .select()
    .single();
  return { data, error };
}

export async function updateTransactionStatus(id: string, status: string) {
  if (!isConfigured()) {
    return { data: null, error: { message: 'Supabase not configured' } };
  }
  
  const { data, error } = await supabase
    .from('transactions')
    .update({ status })
    .eq('id', id)
    .select()
    .single();
  return { data, error };
}

// ============================================================
// BUYER FUNCTIONS
// ============================================================

export async function getBuyers(filters?: {
  verification_status?: string;
  limit?: number;
}) {
  if (!isConfigured()) {
    return { data: [], error: null };
  }
  
  let query = supabase
    .from('buyers')
    .select('*, organization:organizations(*)')
    .order('created_at', { ascending: false });

  if (filters?.verification_status) query = query.eq('verification_status', filters.verification_status);
  if (filters?.limit) query = query.limit(filters.limit);

  const { data, error } = await query;
  return { data, error };
}

export async function createBuyer(buyer: {
  organization_id: string;
  saudi_registration?: string;
  buyer_category?: string;
  annual_procurement_volume?: string;
  commodities?: string[];
  required_volume?: string;
  quality_specs?: string;
  delivery_locations?: string[];
  incoterms?: string[];
  payment_terms?: string;
  bank_references?: string[];
}) {
  if (!isConfigured()) {
    return { data: null, error: { message: 'Supabase not configured' } };
  }
  
  const { data, error } = await supabase
    .from('buyers')
    .insert(buyer)
    .select()
    .single();
  return { data, error };
}

// ============================================================
// EXPORTER FUNCTIONS
// ============================================================

export async function getExporters(filters?: {
  verification_status?: string;
  limit?: number;
}) {
  if (!isConfigured()) {
    return { data: [], error: null };
  }
  
  let query = supabase
    .from('exporters')
    .select('*, organization:organizations(*)')
    .order('trust_score', { ascending: false });

  if (filters?.verification_status) query = query.eq('verification_status', filters.verification_status);
  if (filters?.limit) query = query.limit(filters.limit);

  const { data, error } = await query;
  return { data, error };
}

export async function createExporter(exporter: {
  organization_id: string;
  cac_number?: string;
  nepc_number?: string;
  export_license_status?: string;
  bank_name?: string;
  sesame_grade?: string;
  sesame_origin?: string;
  available_quantity?: string;
  moisture?: string;
  purity?: string;
  foreign_matter?: string;
  aflatoxin_status?: string;
}) {
  if (!isConfigured()) {
    return { data: null, error: { message: 'Supabase not configured' } };
  }
  
  const { data, error } = await supabase
    .from('exporters')
    .insert(exporter)
    .select()
    .single();
  return { data, error };
}

// ============================================================
// DOCUMENT FUNCTIONS
// ============================================================

export async function getDocuments(transactionId: string) {
  if (!isConfigured()) {
    return { data: [], error: null };
  }
  
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('transaction_id', transactionId)
    .order('created_at', { ascending: false });
  return { data, error };
}

export async function uploadDocument(doc: {
  transaction_id: string;
  type: string;
  issuing_organization?: string;
  document_number?: string;
  issue_date?: string;
  expiry_date?: string;
  file_url?: string;
  hash?: string;
}) {
  if (!isConfigured()) {
    return { data: null, error: { message: 'Supabase not configured' } };
  }
  
  const { data, error } = await supabase
    .from('documents')
    .insert(doc)
    .select()
    .single();
  return { data, error };
}

// ============================================================
// INSPECTION FUNCTIONS
// ============================================================

export async function getInspections(transactionId?: string) {
  if (!isConfigured()) {
    return { data: [], error: null };
  }
  
  let query = supabase
    .from('inspections')
    .select('*, results:inspection_results(*), transaction:transactions(masar_id)')
    .order('scheduled_date', { ascending: false });

  if (transactionId) query = query.eq('transaction_id', transactionId);

  const { data, error } = await query;
  return { data, error };
}

// ============================================================
// SHIPMENT FUNCTIONS
// ============================================================

export async function getShipments(transactionId?: string) {
  if (!isConfigured()) {
    return { data: [], error: null };
  }
  
  let query = supabase
    .from('shipments')
    .select('*, transaction:transactions(masar_id)')
    .order('created_at', { ascending: false });

  if (transactionId) query = query.eq('transaction_id', transactionId);

  const { data, error } = await query;
  return { data, error };
}

// ============================================================
// FINANCE FUNCTIONS
// ============================================================

export async function getFinanceRequests(transactionId?: string) {
  if (!isConfigured()) {
    return { data: [], error: null };
  }
  
  let query = supabase
    .from('finance_requests')
    .select('*, transaction:transactions(masar_id), capital_partner:organizations(*)')
    .order('created_at', { ascending: false });

  if (transactionId) query = query.eq('transaction_id', transactionId);

  const { data, error } = await query;
  return { data, error };
}

// ============================================================
// AUDIT FUNCTIONS
// ============================================================

export async function getAuditEvents(filters?: {
  entity_type?: string;
  entity_id?: string;
  user_id?: string;
  limit?: number;
}) {
  if (!isConfigured()) {
    return { data: [], error: null };
  }
  
  let query = supabase
    .from('audit_events')
    .select('*, user:profiles(full_name, email, role)')
    .order('created_at', { ascending: false });

  if (filters?.entity_type) query = query.eq('entity_type', filters.entity_type);
  if (filters?.entity_id) query = query.eq('entity_id', filters.entity_id);
  if (filters?.user_id) query = query.eq('user_id', filters.user_id);
  if (filters?.limit) query = query.limit(filters.limit);

  const { data, error } = await query;
  return { data, error };
}

// ============================================================
// NOTIFICATION FUNCTIONS
// ============================================================

export async function getNotifications(userId: string, unreadOnly = false) {
  if (!isConfigured()) {
    return { data: [], error: null };
  }
  
  let query = supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (unreadOnly) query = query.eq('read', false);

  const { data, error } = await query;
  return { data, error };
}

// ============================================================
// DASHBOARD STATS
// ============================================================

export async function getDashboardStats() {
  if (!isConfigured()) {
    return {
      active_transactions: 0,
      completed_transactions: 0,
      total_gmv: 0,
      completed_gmv: 0,
      verified_buyers: 0,
      verified_exporters: 0,
      at_risk_transactions: 0,
    };
  }
  
  const [transactions, buyers, exporters] = await Promise.all([
    supabase.from('transactions').select('status, contract_value, risk_level'),
    supabase.from('buyers').select('id, verification_status'),
    supabase.from('exporters').select('id, verification_status, trust_score'),
  ]);

  const txns = transactions.data || [];
  const activeTxns = txns.filter(t => !['COMPLETED', 'SETTLED', 'CANCELLED'].includes(t.status));
  const completedTxns = txns.filter(t => ['COMPLETED', 'SETTLED'].includes(t.status));
  const totalGMV = txns.reduce((sum, t) => sum + (t.contract_value || 0), 0);
  const completedGMV = completedTxns.reduce((sum, t) => sum + (t.contract_value || 0), 0);

  return {
    active_transactions: activeTxns.length,
    completed_transactions: completedTxns.length,
    total_gmv: totalGMV,
    completed_gmv: completedGMV,
    verified_buyers: (buyers.data || []).filter(b => b.verification_status === 'APPROVED').length,
    verified_exporters: (exporters.data || []).filter(e => e.verification_status === 'APPROVED').length,
    at_risk_transactions: txns.filter(t => ['HIGH', 'CRITICAL'].includes(t.risk_level)).length,
  };
}
