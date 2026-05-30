import { createClient } from "@supabase/supabase-js";

// Fallback to empty string to prevent the app from completely crashing with "Cannot read properties of null"
// if the environment variables are missing during the build process.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://missing-url.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "missing-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log("SUPABASE URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);

// Debug: Cek browser console setelah halaman load
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  console.error(
    "⚠️ NEXT_PUBLIC_SUPABASE_URL tidak ditemukan! Pastikan Anda memasukkan variabel ini sebagai BUILD ARGUMENT (--build-arg) saat membangun Docker image untuk Cloud Run."
  );
}
