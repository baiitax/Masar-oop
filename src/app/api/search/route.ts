// MASAR Search API
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const accessToken = authHeader.split(' ')[1];
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(accessToken);
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const supabase = createServerClient(accessToken);
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const type = searchParams.get('type') || 'all';
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!query || query.length < 2) {
      return NextResponse.json({ error: 'Query too short' }, { status: 400 });
    }

    const results: any = {
      transactions: [],
      organizations: [],
      documents: [],
      inspections: [],
      invoices: [],
    };

    // Search transactions
    if (type === 'all' || type === 'transactions') {
      const { data: transactions } = await supabase
        .from('transactions')
        .select('id, transaction_number, current_state, buyer:buyer_organization_id(legal_name), exporter:exporter_organization_id(legal_name)')
        .or(`transaction_number.ilike.%${query}%`)
        .is('deleted_at', null)
        .limit(limit);
      
      results.transactions = transactions || [];
    }

    // Search organizations
    if (type === 'all' || type === 'organizations') {
      const { data: organizations } = await supabase
        .from('organizations')
        .select('id, legal_name, trading_name, organization_type, country_code')
        .or(`legal_name.ilike.%${query}%,trading_name.ilike.%${query}%,registration_number.ilike.%${query}%`)
        .is('deleted_at', null)
        .limit(limit);
      
      results.organizations = organizations || [];
    }

    // Search documents
    if (type === 'all' || type === 'documents') {
      const { data: documents } = await supabase
        .from('documents')
        .select('id, document_type, document_number, file_name, transaction_id')
        .or(`document_number.ilike.%${query}%,file_name.ilike.%${query}%`)
        .is('deleted_at', null)
        .limit(limit);
      
      results.documents = documents || [];
    }

    // Search inspections
    if (type === 'all' || type === 'inspections') {
      const { data: inspections } = await supabase
        .from('inspections')
        .select('id, inspection_number, status, transaction_id')
        .or(`inspection_number.ilike.%${query}%`)
        .limit(limit);
      
      results.inspections = inspections || [];
    }

    // Search invoices
    if (type === 'all' || type === 'invoices') {
      const { data: invoices } = await supabase
        .from('invoices')
        .select('id, invoice_number, status, total, currency, transaction_id')
        .or(`invoice_number.ilike.%${query}%`)
        .is('deleted_at', null)
        .limit(limit);
      
      results.invoices = invoices || [];
    }

    // Calculate total results
    const total = Object.values(results).reduce((sum: number, arr: any) => sum + arr.length, 0);

    return NextResponse.json({
      query,
      total,
      results,
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
