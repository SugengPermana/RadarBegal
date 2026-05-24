"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Email dan password wajib diisi");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    router.push("/lapor");
  };

  const handleRegister = async () => {
    if (!email || !password) {
      alert("Email dan password wajib diisi");
      return;
    }

    if (password.length < 6) {
      alert("Password minimal 6 karakter");
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Akun berhasil dibuat");
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col gap-4">

        <h1 className="text-3xl font-black text-white text-center">
          Radar Begal
        </h1>

        <p className="text-slate-400 text-center text-sm">
          Login untuk mengirim laporan keamanan
        </p>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none"
        />

        <button
          onClick={handleLogin}
          className="bg-teal-600 hover:bg-teal-500 text-white py-3 rounded-xl font-bold"
        >
          Login
        </button>

        <button
          onClick={handleRegister}
          className="bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-xl font-bold"
        >
          Register
        </button>

      </div>
    </div>
  );
}