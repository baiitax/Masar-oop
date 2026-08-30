// MASAR Protocol - Evaluate Release Eligibility API
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { createServerClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
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
    const body = await request.json();
    const { transaction_id } = body;

    if (!transaction_id) {
      return NextResponse.json({ error: 'Missing transaction_id' }, { status: 400 });
    }

    // Get transaction
    const { data: transaction, error: txError } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', transaction_id)
      .single();

    if (txError || !transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    // Get release policy for this transaction
    const { data: policy } = await supabase
      .from('release_policies')
      .select('*')
      .eq('lane_id', transaction.lane_id)
      .eq('active', true)
      .lte('value_band_min', transaction.contract_value || 0)
      .or(`value_band_max.is.null,value_band_max.gte.${transaction.contract_value || 0}`)
      .limit(1)
      .single();

    if (!policy) {
      return NextResponse.json({ error: 'No release policy found' }, { status: 404 });
    }

    // Get release conditions
    const { data: conditions } = await supabase
      .from('release_conditions')
      .select('*')
      .eq('policy_id', policy.id)
      .eq('active', true)
      .order('priority');

    if (!conditions) {
      return NextResponse.json({ error: 'No conditions found' }, { status: 404 });
    }

    // Evaluate each condition
    const evaluatedConditions = [];
    let allRequiredSatisfied = true;

    for (const condition of conditions) {
      const satisfied = await evaluateCondition(condition, transaction_id, transaction);
      
      evaluatedConditions.push({
        condition_code: condition.condition_code,
        condition_name: condition.condition_name,
        required: condition.required,
        satisfied,
        human_approval_required: condition.human_approval_required,
      });

      if (condition.required && !satisfied) {
        allRequiredSatisfied = false;
      }
    }

    // Update protocol conditions
    for (const ec of evaluatedConditions) {
      await supabase
        .from('protocol_conditions')
        .upsert({
          transaction_id,
          condition_code: ec.condition_code,
          condition_name: ec.condition_name,
          category: 'release',
          status: ec.satisfied ? 'satisfied' : 'pending',
          required: ec.required,
          satisfied_at: ec.satisfied ? new Date().toISOString() : null,
          satisfied_by: ec.satisfied ? user.id : null,
        }, {
          onConflict: 'transaction_id,condition_code',
        });
    }

    // Calculate readiness
    const totalConditions = conditions.length;
    const satisfiedConditions = evaluatedConditions.filter(c => c.satisfied).length;
    const readinessScore = Math.round((satisfiedConditions / totalConditions) * 100);

    // Update transaction readiness score
    await supabase
      .from('transactions')
      .update({ clearance_readiness_score: readinessScore })
      .eq('id', transaction_id);

    return NextResponse.json({
      transaction_id,
      eligible: allRequiredSatisfied,
      readiness_score: readinessScore,
      total_conditions: totalConditions,
      satisfied_conditions: satisfiedConditions,
      conditions: evaluatedConditions,
      requires_human_approval: evaluatedConditions.some(c => c.human_approval_required && !c.satisfied),
    });
  } catch (error) {
    console.error('Evaluate release error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function evaluateCondition(
  condition: any,
  transactionId: string,
  transaction: any
): Promise<boolean> {
  const supabase = supabaseAdmin;

  switch (condition.condition_code) {
    case 'BUYER_KYB_APPROVED':
      return await checkBuyerKYB(transaction.buyer_organization_id);
    
    case 'EXPORTER_KYB_APPROVED':
      return await checkExporterKYB(transaction.exporter_organization_id);
    
    case 'CONTRACT_EXECUTED':
      return transaction.current_state === 'CONTRACTED' || 
             ['COMPLIANCE_REVIEW', 'COMPLIANCE_READY', 'INSPECTION_PENDING', 'INSPECTION_IN_PROGRESS', 'INSPECTION_PASSED', 'FINANCE_PENDING', 'FINANCE_APPROVED', 'FUNDS_SECURED', 'SHIPMENT_READY', 'IN_TRANSIT', 'ARRIVED', 'PORT_VERIFIED', 'RELEASE_ELIGIBLE', 'RELEASE_APPROVAL', 'SETTLEMENT', 'COMPLETED'].includes(transaction.current_state);
    
    case 'COMPLIANCE_COMPLETE':
      const { data: compliance } = await supabase
        .from('compliance_cases')
        .select('status')
        .eq('transaction_id', transactionId)
        .single();
      return compliance?.status === 'ready';
    
    case 'INSPECTION_PASSED':
      const { data: inspection } = await supabase
        .from('inspections')
        .select('status')
        .eq('transaction_id', transactionId)
        .single();
      return inspection?.status === 'passed';
    
    case 'QUALITY_ACCEPTED':
      const { data: quality } = await supabase
        .from('quality_variances')
        .select('id')
        .eq('transaction_id', transactionId)
        .eq('status', 'open')
        .limit(1);
      return !quality || quality.length === 0;
    
    case 'FUNDS_CONFIRMED':
      const { data: escrow } = await supabase
        .from('escrow_records')
        .select('status')
        .eq('transaction_id', transactionId)
        .single();
      return escrow?.status === 'funded';
    
    case 'SHIPMENT_VERIFIED':
      const { data: shipment } = await supabase
        .from('shipments')
        .select('status')
        .eq('transaction_id', transactionId)
        .single();
      return shipment && ['in_transit', 'arrived', 'discharged', 'customs_cleared', 'delivered'].includes(shipment.status);
    
    case 'PORT_VERIFIED':
      const { data: portVerification } = await supabase
        .from('port_verifications')
        .select('status')
        .eq('transaction_id', transactionId)
        .single();
      return portVerification?.status === 'verified';
    
    case 'FINAL_DOCUMENTS_COMPLETE':
      const { data: pendingDocs } = await supabase
        .from('documents')
        .select('id')
        .eq('transaction_id', transactionId)
        .in('status', ['expected', 'missing', 'uploaded', 'processing'])
        .is('deleted_at', null)
        .limit(1);
      return !pendingDocs || pendingDocs.length === 0;
    
    default:
      return false;
  }
}

async function checkBuyerKYB(organizationId: string): Promise<boolean> {
  const { data: kyb } = await supabaseAdmin
    .from('kyb_cases')
    .select('status')
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();
  
  return kyb?.status === 'approved';
}

async function checkExporterKYB(organizationId: string): Promise<boolean> {
  const { data: kyb } = await supabaseAdmin
    .from('kyb_cases')
    .select('status')
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();
  
  return kyb?.status === 'approved';
}
