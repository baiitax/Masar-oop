// MASAR Protocol - Advance Transaction State API
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { createServerClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    // Get authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const accessToken = authHeader.split(' ')[1];
    
    // Verify user token
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(accessToken);
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Create user-context client
    const supabase = createServerClient(accessToken);

    const body = await request.json();
    const { transaction_id, target_state, reason } = body;

    if (!transaction_id || !target_state) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get current transaction
    const { data: transaction, error: txError } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', transaction_id)
      .single();

    if (txError || !transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    // Check if user has permission to advance state
    const { data: hasPermission } = await supabase
      .rpc('user_has_permission', { permission_code: 'transaction.approve' });

    if (!hasPermission) {
      // Check if user is part of transaction parties
      const { data: userOrgs } = await supabase
        .rpc('get_user_organization_ids');

      const isBuyer = userOrgs?.includes(transaction.buyer_organization_id);
      const isExporter = userOrgs?.includes(transaction.exporter_organization_id);

      if (!isBuyer && !isExporter) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    // Validate state transition
    const { data: validTransition } = await supabase
      .from('transaction_state_transitions')
      .select('*')
      .eq('from_state', transaction.current_state)
      .eq('to_state', target_state)
      .eq('active', true)
      .single();

    if (!validTransition) {
      return NextResponse.json(
        { error: `Invalid transition from ${transaction.current_state} to ${target_state}` },
        { status: 400 }
      );
    }

    // Check if human approval is required
    if (validTransition.requires_human_approval) {
      const { data: approvals } = await supabase
        .from('release_approvals')
        .select('*')
        .eq('transaction_id', transaction_id)
        .eq('status', 'approved')
        .limit(1);

      if (!approvals || approvals.length === 0) {
        return NextResponse.json(
          { error: 'Human approval required for this transition' },
          { status: 400 }
        );
      }
    }

    // Perform state transition
    const { error: updateError } = await supabase
      .from('transactions')
      .update({
        current_state: target_state,
        previous_state: transaction.current_state,
        updated_at: new Date().toISOString(),
      })
      .eq('id', transaction_id);

    if (updateError) {
      return NextResponse.json({ error: 'Failed to update transaction' }, { status: 500 });
    }

    // Create protocol event
    await supabase.rpc('create_protocol_event', {
      p_transaction_id: transaction_id,
      p_event_type: `STATE_TRANSITION`,
      p_event_source: 'api',
      p_actor_user_id: user.id,
      p_payload: {
        from_state: transaction.current_state,
        to_state: target_state,
        reason,
      },
    });

    // Create audit log
    await supabase.rpc('create_audit_log', {
      p_action: 'state_transition',
      p_entity_type: 'transaction',
      p_entity_id: transaction_id,
      p_transaction_id: transaction_id,
      p_old_values: { current_state: transaction.current_state },
      p_new_values: { current_state: target_state },
    });

    // Trigger automation rules
    await triggerAutomationRules(transaction_id, target_state, transaction);

    return NextResponse.json({
      success: true,
      transaction_id,
      previous_state: transaction.current_state,
      new_state: target_state,
    });
  } catch (error) {
    console.error('Advance state error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function triggerAutomationRules(
  transactionId: string,
  newState: string,
  transaction: any
) {
  try {
    // Find matching automation rules
    const { data: rules } = await supabaseAdmin
      .from('automation_rules')
      .select('*')
      .eq('trigger_event', newState)
      .eq('active', true);

    if (!rules || rules.length === 0) return;

    for (const rule of rules) {
      // Evaluate conditions
      const conditionsMet = evaluateConditions(rule.conditions, transaction);
      
      if (conditionsMet) {
        // Execute actions
        await executeActions(rule.actions, transactionId, transaction);
      }
    }
  } catch (error) {
    console.error('Automation rule error:', error);
  }
}

function evaluateConditions(conditions: any[], transaction: any): boolean {
  // Simple condition evaluation
  for (const condition of conditions) {
    const value = getNestedValue(transaction, condition.field);
    
    switch (condition.operator) {
      case 'equals':
        if (value !== condition.value) return false;
        break;
      case 'not_equals':
        if (value === condition.value) return false;
        break;
      case 'greater_than':
        if (value <= condition.value) return false;
        break;
      case 'less_than':
        if (value >= condition.value) return false;
        break;
    }
  }
  return true;
}

function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((curr, key) => curr?.[key], obj);
}

async function executeActions(actions: any[], transactionId: string, transaction: any) {
  for (const action of actions) {
    switch (action.type) {
      case 'create_task':
        await supabaseAdmin.rpc('create_task', {
          p_transaction_id: transactionId,
          p_task_type: action.assignee,
          p_title: `Automated task for transaction ${transaction.transaction_number}`,
          p_priority: 'medium',
        });
        break;
      case 'send_notification':
        // Implement notification sending
        break;
    }
  }
}
