"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { ReportForm } from "@/components/ReportForm";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export default function LaporPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login?redirect=/lapor");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen bg-slate-950">
        <Loader2 className="w-8 h-8 text-teal-500 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-screen bg-slate-950 p-6 gap-4">
        <p className="text-amber-400 text-center">
          Harap login terlebih dahulu untuk membuat laporan.
        </p>
        <Link
          href="/login?redirect=/lapor"
          className="bg-teal-600 text-white px-6 py-3 rounded-xl font-bold"
        >
          Login
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col gap-6 p-4 md:p-6 max-w-lg mx-auto w-full pt-20 md:pt-8">
      <h1 className="text-2xl font-black text-slate-100">Lapor Insiden</h1>
      <p className="text-slate-400 text-sm">
        Berikan detail kejadian untuk memperingatkan pengguna lain di area ini.
      </p>
      <ReportForm />
    </div>
  );
}
