// MASAR API - Readiness Check
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    // Check all dependencies
    const checks = await Promise.allSettled([
      // Database
      supabaseAdmin.from('transactions').select('id', { count: 'exact', head: true }),
      // Auth
      supabaseAdmin.auth.getSession(),
      // Storage
      supabaseAdmin.storage.listBuckets(),
    ]);

    const results = {
      database: checks[0].status === 'fulfilled' ? 'ready' : 'not_ready',
      auth: checks[1].status === 'fulfilled' ? 'ready' : 'not_ready',
      storage: checks[2].status === 'fulfilled' ? 'ready' : 'not_ready',
    };

    const allReady = Object.values(results).every(v => v === 'ready');

    return NextResponse.json({
      status: allReady ? 'ready' : 'not_ready',
      service: 'MASAR Protocol API',
      checks: results,
      timestamp: new Date().toISOString(),
    }, { status: allReady ? 200 : 503 });
  } catch (error) {
    return NextResponse.json({
      status: 'not_ready',
      service: 'MASAR Protocol API',
      error: 'Readiness check failed',
    }, { status: 503 });
  }
}
