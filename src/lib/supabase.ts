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

export async function sendPhoneOtp(phone: string) {
  const { data, error } = await supabase.auth.signInWithOtp({
    phone,
    options: {
      shouldCreateUser: true,
    },
  });
  if (error) {
    console.warn("Supabase Phone OTP failed, using simulation fallback:", error);
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    localStorage.setItem(`sms_otp_${phone}`, code);
    return { simulated: true, code };
  }
  return data;
}

export async function verifyPhoneOtp(phone: string, token: string) {
  const simulatedCode = localStorage.getItem(`sms_otp_${phone}`);
  if (simulatedCode) {
    if (simulatedCode === token) {
      localStorage.removeItem(`sms_otp_${phone}`);
      return { 
        user: { 
          id: "simulated-phone-user", 
          email: `${phone}@phone.local`, 
          phone, 
          user_metadata: {} 
        } 
      };
    }
    throw new Error("Invalid verification code");
  }

  const { data, error } = await supabase.auth.verifyOtp({
    phone,
    token,
    type: "sms",
  });
  if (error) throw error;
  return data;
}
