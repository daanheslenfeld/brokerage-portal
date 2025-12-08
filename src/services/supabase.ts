import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Check if we're in mock mode
export const isMockMode = !supabaseUrl || !supabaseAnonKey;

if (isMockMode) {
  console.warn('Supabase credentials not configured. Using mock mode.');
}

// Create a mock client or real client based on credentials
let supabase: SupabaseClient;

if (!isMockMode) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  // Create a minimal mock client that won't throw errors
  supabase = {
    auth: {
      signUp: async () => ({ data: null, error: new Error('Mock mode') }),
      signInWithPassword: async () => ({ data: null, error: new Error('Mock mode') }),
      signOut: async () => ({ error: null }),
      getUser: async () => ({ data: { user: null }, error: null }),
      resetPasswordForEmail: async () => ({ data: null, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          single: async () => ({ data: null, error: null }),
        }),
      }),
    }),
  } as unknown as SupabaseClient;
}

export { supabase };

// Auth helpers
export async function signUp(email: string, password: string) {
  if (isMockMode) {
    return { data: null, error: new Error('Mock mode - registration simulated') };
  }
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
}

export async function signIn(email: string, password: string) {
  if (isMockMode) {
    return { data: null, error: new Error('Mock mode - login simulated') };
  }
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
}

export async function signOut() {
  if (isMockMode) {
    return { error: null };
  }
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getCurrentUser() {
  if (isMockMode) {
    return { user: null, error: null };
  }
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
}

export async function resetPassword(email: string) {
  if (isMockMode) {
    return { data: null, error: null };
  }
  const { data, error } = await supabase.auth.resetPasswordForEmail(email);
  return { data, error };
}

// Listen for auth changes
export function onAuthStateChange(callback: (event: string, session: unknown) => void) {
  return supabase.auth.onAuthStateChange(callback);
}
