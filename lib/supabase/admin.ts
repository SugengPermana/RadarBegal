import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://missing-url.supabase.co";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "missing-key";

// Note: admin client only runs on the server, so runtime environment variables in Cloud Run DO work here.
export const supabaseAdmin = createClient(
  supabaseUrl,
  serviceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

console.log("SUPABASE ADMIN URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error("⚠️ SUPABASE_SERVICE_ROLE_KEY tidak ditemukan!");
}
