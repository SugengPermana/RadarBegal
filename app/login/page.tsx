"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      setMessage("Email dan password wajib diisi");
      return;
    }

    setIsLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setIsLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    router.push(redirect);
    router.refresh();
  };

  const handleRegister = async () => {
    if (!email || !password) {
      setMessage("Email dan password wajib diisi");
      return;
    }

    if (password.length < 6) {
      setMessage("Password minimal 6 karakter");
      return;
    }

    setIsLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signUp({ email, password });

    setIsLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Akun berhasil dibuat. Silakan login.");
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col gap-4">
        <Link href="/" className="text-slate-500 text-sm hover:text-teal-400 transition-colors">
          &larr; Kembali ke Dashboard
        </Link>

        <h1 className="text-3xl font-black text-white text-center">Radar Begal</h1>

        <p className="text-slate-400 text-center text-sm">
          Login untuk mengirim laporan keamanan
        </p>

        {message && (
          <p className="text-sm text-center text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-lg py-2 px-3">
            {message}
          </p>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-teal-500"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-teal-500"
        />

        <button
          onClick={handleLogin}
          disabled={isLoading}
          className="bg-teal-600 hover:bg-teal-500 disabled:opacity-60 text-white py-3 rounded-xl font-bold"
        >
          {isLoading ? "Memproses..." : "Login"}
        </button>

        <button
          onClick={handleRegister}
          disabled={isLoading}
          className="bg-slate-800 hover:bg-slate-700 disabled:opacity-60 text-white py-3 rounded-xl font-bold"
        >
          Register
        </button>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-500">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
