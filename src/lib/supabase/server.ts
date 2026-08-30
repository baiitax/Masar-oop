// MASAR Supabase Server Client
// Production-ready with graceful fallbacks

import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lsqxohcpgwkoujdcuhmc.supabase.co';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxzcXhvaGNwZ3drb3VqZGN1aG1jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc2MDg0NTIsImV4cCI6MjEwMzE4NDQ1Mn0.cWhKaT6Xnbz6MPRGhyffWzrtnhXfpMoOdJ21WKiANTo';

// Create the admin client
function createAdminClient(): SupabaseClient {
  const key = supabaseServiceRoleKey || supabaseAnonKey;
  return createClient(supabaseUrl, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

// Lazy-initialized admin client
let _adminClient: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (!_adminClient) {
    _adminClient = createAdminClient();
  }
  return _adminClient;
}

// Export as supabaseAdmin for backward compatibility
export const supabaseAdmin = {
  get auth() { return getSupabaseAdmin().auth; },
  get from() { return getSupabaseAdmin().from.bind(getSupabaseAdmin()); },
  get storage() { return getSupabaseAdmin().storage; },
  get rpc() { return getSupabaseAdmin().rpc.bind(getSupabaseAdmin()); },
};

// Create user-context client
export function createServerClient(accessToken: string): SupabaseClient {
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

// Helper functions
export async function verifyUserToken(accessToken: string) {
  const client = getSupabaseAdmin();
  const { data: { user }, error } = await client.auth.getUser(accessToken);
  if (error) throw error;
  return user;
}

export async function createUser(email: string, password: string, metadata?: Record<string, any>) {
  const client = getSupabaseAdmin();
  const { data, error } = await client.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: metadata,
  });
  if (error) throw error;
  return data;
}

export async function listUsers(page: number = 1, perPage: number = 50) {
  const client = getSupabaseAdmin();
  const { data, error } = await client.auth.admin.listUsers({ page, perPage });
  if (error) throw error;
  return data;
}

export async function getUserById(userId: string) {
  const client = getSupabaseAdmin();
  const { data, error } = await client.auth.admin.getUserById(userId);
  if (error) throw error;
  return data;
}

export default supabaseAdmin;
