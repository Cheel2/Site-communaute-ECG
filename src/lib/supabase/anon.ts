import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let clientAnon: SupabaseClient | null = null;

export function createAnonClient(): SupabaseClient {
  if (clientAnon) {
    return clientAnon;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Variables Supabase manquantes : NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY.'
    );
  }

  // persistSession: false — aucune dépendance à localStorage : ce client est
  // utilisable au build time (generateMetadata SSG) sans cookies(), ce qui
  // préserve le rendu statique imposé par D3.
  clientAnon = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false },
  });

  return clientAnon;
}