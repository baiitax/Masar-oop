// MASAR Inspection Webhook API
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    // Verify webhook signature (implement based on provider)
    const signature = request.headers.get('x-webhook-signature');
    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
    }

    const body = await request.json();
    const { event_type, inspection_id, external_event_id, payload } = body;

    // Idempotency check
    const { data: existingEvent } = await supabaseAdmin
      .from('integration_events')
      .select('id')
      .eq('external_event_id', external_event_id)
      .single();

    if (existingEvent) {
      return NextResponse.json({ status: 'duplicate', message: 'Event already processed' });
    }

    // Get inspection provider
    const { data: provider } = await supabaseAdmin
      .from('integration_providers')
      .select('id')
      .eq('provider_type', 'inspection')
      .eq('status', 'active')
      .single();

    if (!provider) {
      return NextResponse.json({ error: 'Provider not found' }, { status: 404 });
    }

    // Log integration event
    await supabaseAdmin.from('integration_events').insert({
      provider_id: provider.id,
      event_type,
      external_event_id,
      status: 'received',
      payload,
    });

    // Process based on event type
    switch (event_type) {
      case 'INSPECTION_ACCEPTED':
        await handleInspectionAccepted(inspection_id, payload);
        break;
      case 'INSPECTOR_ASSIGNED':
        await handleInspectorAssigned(inspection_id, payload);
        break;
      case 'SAMPLE_COLLECTED':
        await handleSampleCollected(inspection_id, payload);
        break;
      case 'LAB_RESULT_RECEIVED':
        await handleLabResultReceived(inspection_id, payload);
        break;
      case 'INSPECTION_COMPLETED':
        await handleInspectionCompleted(inspection_id, payload);
        break;
      default:
        console.log(`Unhandled event type: ${event_type}`);
    }

    return NextResponse.json({ status: 'processed', event_type });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function handleInspectionAccepted(inspectionId: string, payload: any) {
  await supabaseAdmin
    .from('inspections')
    .update({
      status: 'accepted',
      metadata: payload,
    })
    .eq('id', inspectionId);
}

async function handleInspectorAssigned(inspectionId: string, payload: any) {
  await supabaseAdmin
    .from('inspections')
    .update({
      status: 'inspector_assigned',
      inspector_id: payload.inspector_id,
    })
    .eq('id', inspectionId);
}

async function handleSampleCollected(inspectionId: string, payload: any) {
  // Create sample record
  await supabaseAdmin.from('samples').insert({
    inspection_id: inspectionId,
    transaction_id: payload.transaction_id,
    sample_number: payload.sample_number,
    lot_number: payload.lot_number,
    seal_number: payload.seal_number,
    collected_at: payload.collected_at,
    collected_by: payload.collected_by,
    collection_location: payload.location,
    laboratory_id: payload.laboratory_id,
    status: 'collected',
  });

  // Update inspection status
  await supabaseAdmin
    .from('inspections')
    .update({ status: 'sample_collected' })
    .eq('id', inspectionId);
}

async function handleLabResultReceived(inspectionId: string, payload: any) {
  const { sample_id, results } = payload;

  // Insert lab results
  for (const result of results) {
    await supabaseAdmin.from('lab_results').insert({
      sample_id,
      laboratory_id: payload.laboratory_id,
      report_number: result.report_number,
      test_type: result.test_type,
      parameter: result.parameter,
      result: result.value,
      unit: result.unit,
      reference_range_min: result.min,
      reference_range_max: result.max,
      pass_fail: result.pass_fail,
      tested_at: result.tested_at,
    });
  }

  // Update inspection status
  await supabaseAdmin
    .from('inspections')
    .update({ status: 'result_received' })
    .eq('id', inspectionId);
}

async function handleInspectionCompleted(inspectionId: string, payload: any) {
  await supabaseAdmin
    .from('inspections')
    .update({
      status: payload.result === 'pass' ? 'passed' : payload.result === 'conditional' ? 'conditional' : 'failed',
      result: payload.result,
      completed_at: new Date().toISOString(),
      summary: payload.summary,
      findings: payload.findings,
      recommendations: payload.recommendations,
    })
    .eq('id', inspectionId);

  // Create protocol event
  const { data: inspection } = await supabaseAdmin
    .from('inspections')
    .select('transaction_id')
    .eq('id', inspectionId)
    .single();

  if (inspection) {
    await supabaseAdmin.rpc('create_protocol_event', {
      p_transaction_id: inspection.transaction_id,
      p_event_type: payload.result === 'pass' ? 'INSPECTION_PASSED' : 'INSPECTION_FAILED',
      p_event_source: 'inspection_webhook',
      p_payload: payload,
    });
  }
}
