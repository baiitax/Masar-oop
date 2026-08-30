// MASAR API - Health Check
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Check database connectivity
    const { error: dbError } = await supabaseAdmin
      .from('transactions')
      .select('id', { count: 'exact', head: true });

    const dbHealthy = !dbError;
    const latency = Date.now() - startTime;

    return NextResponse.json({
      status: dbHealthy ? 'healthy' : 'degraded',
      service: 'MASAR Protocol API',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      checks: {
        database: {
          status: dbHealthy ? 'healthy' : 'unhealthy',
          latency: `${latency}ms`,
        },
      },
    }, { status: dbHealthy ? 200 : 503 });
  } catch (error) {
    return NextResponse.json({
      status: 'unhealthy',
      service: 'MASAR Protocol API',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      error: 'Health check failed',
    }, { status: 503 });
  }
}
