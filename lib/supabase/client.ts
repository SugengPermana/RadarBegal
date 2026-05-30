import { createClient } from "@supabase/supabase-js";

const getEnv = (key: string, fallback: string | undefined) => {
  if (typeof window !== "undefined" && (window as any).ENV && (window as any).ENV[key]) {
    return (window as any).ENV[key];
  }
  return fallback;
};

// Fallback to empty string to prevent the app from completely crashing with "Cannot read properties of null"
// if the environment variables are missing during the build process.
const supabaseUrl = getEnv("NEXT_PUBLIC_SUPABASE_URL", process.env.NEXT_PUBLIC_SUPABASE_URL) || "https://missing-url.supabase.co";
const supabaseAnonKey = getEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) || "missing-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log("SUPABASE URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);

// Debug: Cek browser console setelah halaman load
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  console.error(
    "⚠️ NEXT_PUBLIC_SUPABASE_URL tidak ditemukan! Pastikan Anda memasukkan variabel ini sebagai BUILD ARGUMENT (--build-arg) saat membangun Docker image untuk Cloud Run."
  );
}
