import { createClient } from "@supabase/supabase-js";

const rawUrl = import.meta.env.VITE_SUPABASE_URL || "";
// Normalize URL to remove rest/v1 if present
const supabaseUrl = rawUrl.endsWith("/rest/v1/")
  ? rawUrl.replace("/rest/v1/", "")
  : rawUrl.endsWith("/rest/v1")
    ? rawUrl.replace("/rest/v1", "")
    : rawUrl;

const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function sendOtp(email: string) {
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
    },
  });
  if (error) throw error;
  return data;
}

export async function verifyOtp(email: string, token: string) {
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: "email",
  });
  if (error) throw error;
  return data;
}
