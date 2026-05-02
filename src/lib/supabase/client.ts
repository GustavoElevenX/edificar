"use client";

import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
let cachedClient: SupabaseClient | null = null;

export function getAuthConfigError() {
  if (!supabaseUrl || supabaseUrl.includes("SEU-PROJETO")) {
    return "A autenticação ainda não foi configurada. Confira as variáveis do .env.local e reinicie o servidor.";
  }

  if (!supabaseAnonKey || supabaseAnonKey.includes("SUA_CHAVE")) {
    return "A autenticação ainda não foi configurada. Confira as variáveis do .env.local e reinicie o servidor.";
  }

  return "";
}

export function getSupabaseClient() {
  const configError = getAuthConfigError();

  if (configError) {
    throw new Error(configError);
  }

  if (!cachedClient) {
    cachedClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: "edificar-auth-session"
      }
    });
  }

  return cachedClient;
}
