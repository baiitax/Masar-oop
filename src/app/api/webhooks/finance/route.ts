// MASAR Finance Webhook API
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { event_type, external_event_id, payload } = body;

    // Idempotency check
    const { data: existing } = await supabaseAdmin
      .from('integration_events')
      .select('id')
      .eq('external_event_id', external_event_id)
      .single();

    if (existing) {
      return NextResponse.json({ status: 'duplicate' });
    }

    // Get finance provider
    const { data: provider } = await supabaseAdmin
      .from('integration_providers')
      .select('id')
      .eq('provider_type', 'escrow')
      .eq('status', 'active')
      .single();

    if (!provider) {
      return NextResponse.json({ error: 'Provider not found' }, { status: 404 });
    }

    // Log event
    await supabaseAdmin.from('integration_events').insert({
      provider_id: provider.id,
      event_type,
      external_event_id,
      status: 'received',
      payload,
    });

    switch (event_type) {
      case 'ESCROW_FUNDED':
        await handleEscrowFunded(payload);
        break;
      case 'ESCROW_RELEASED':
        await handleEscrowReleased(payload);
        break;
      case 'SETTLEMENT_COMPLETED':
        await handleSettlementCompleted(payload);
        break;
      case 'PAYMENT_CONFIRMED':
        await handlePaymentConfirmed(payload);
        break;
    }

    return NextResponse.json({ status: 'processed', event_type });
  } catch (error) {
    console.error('Finance webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function handleEscrowFunded(payload: any) {
  const { transaction_id, amount, currency, external_reference } = payload;

  // Update escrow record
  await supabaseAdmin
    .from('escrow_records')
    .update({
      status: 'funded',
      confirmed_amount: amount,
      funded_at: new Date().toISOString(),
      external_reference,
      provider_response: payload,
    })
    .eq('transaction_id', transaction_id);

  // Create protocol event
  await supabaseAdmin.rpc('create_protocol_event', {
    p_transaction_id: transaction_id,
    p_event_type: 'FUNDS_CONFIRMED',
    p_event_source: 'finance_webhook',
    p_payload: payload,
  });

  // Update transaction state
  await supabaseAdmin
    .from('transactions')
    .update({ current_state: 'FUNDS_SECURED' })
    .eq('id', transaction_id)
    .eq('current_state', 'FINANCE_APPROVED');
}

async function handleEscrowReleased(payload: any) {
  const { transaction_id } = payload;

  await supabaseAdmin
    .from('escrow_records')
    .update({
      status: 'released',
      released_at: new Date().toISOString(),
      provider_response: payload,
    })
    .eq('transaction_id', transaction_id);

  await supabaseAdmin.rpc('create_protocol_event', {
    p_transaction_id: transaction_id,
    p_event_type: 'ESCROW_RELEASED',
    p_event_source: 'finance_webhook',
    p_payload: payload,
  });
}

async function handleSettlementCompleted(payload: any) {
  const { settlement_id, transaction_id } = payload;

  await supabaseAdmin
    .from('settlements')
    .update({
      status: 'completed',
      executed_at: new Date().toISOString(),
      external_reference: payload.external_reference,
    })
    .eq('id', settlement_id);

  // Update settlement items
  await supabaseAdmin
    .from('settlement_items')
    .update({ status: 'paid', paid_at: new Date().toISOString() })
    .eq('settlement_id', settlement_id);

  // Update transaction
  await supabaseAdmin
    .from('transactions')
    .update({
      current_state: 'COMPLETED',
      completed_at: new Date().toISOString(),
    })
    .eq('id', transaction_id);

  await supabaseAdmin.rpc('create_protocol_event', {
    p_transaction_id: transaction_id,
    p_event_type: 'SETTLEMENT_COMPLETED',
    p_event_source: 'finance_webhook',
    p_payload: payload,
  });
}

async function handlePaymentConfirmed(payload: any) {
  const { transaction_id, amount, currency, from_organization, to_organization } = payload;

  await supabaseAdmin.from('payment_events').insert({
    transaction_id,
    event_type: 'PAYMENT_CONFIRMED',
    amount,
    currency,
    from_organization,
    to_organization,
    external_reference: payload.external_reference,
    provider_response: payload,
  });
}
