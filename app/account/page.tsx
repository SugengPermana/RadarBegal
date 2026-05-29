"use client";

import { User, Shield, Calendar, LogOut, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { formatTanggalIndonesia } from "@/lib/format";

export default function AccountPage() {
  const router = useRouter();
  const { user, profile, isLoading, signOut } = useAuth();

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-teal-500 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] p-6 gap-4">
        <User className="w-16 h-16 text-slate-700" />
        <p className="text-slate-400 text-center">Anda belum login</p>
        <Link
          href="/login?redirect=/account"
          className="bg-teal-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-teal-500 transition-colors"
        >
          Login
        </Link>
      </div>
    );
  }

  const displayProfile = profile ?? {
    username: user.email?.split("@")[0] || "Pengguna",
    avatar_url: null,
    role: "user",
    created_at: user.created_at,
  };

  return (
    <div className="flex-1 p-4 md:p-8 max-w-lg mx-auto w-full pt-20 md:pt-8">
      <h1 className="text-3xl font-black text-slate-100 mb-8">Profil Account</h1>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center overflow-hidden mb-4">
            {displayProfile.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={displayProfile.avatar_url}
                alt={displayProfile.username}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-12 h-12 text-slate-500" />
            )}
          </div>
          <h2 className="text-2xl font-bold text-slate-100">{displayProfile.username}</h2>
          <p className="text-slate-500 text-sm mt-1">{user.email}</p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-4 bg-slate-950 border border-slate-800 rounded-xl p-4">
            <Shield className="w-5 h-5 text-teal-500 shrink-0" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Role</p>
              <p className="text-slate-200 font-semibold capitalize">{displayProfile.role}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-slate-950 border border-slate-800 rounded-xl p-4">
            <Calendar className="w-5 h-5 text-teal-500 shrink-0" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Bergabung Sejak
              </p>
              <p className="text-slate-200 font-semibold">
                {formatTanggalIndonesia(displayProfile.created_at)}
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={async () => {
            await signOut();
            router.push("/login");
          }}
          className="mt-8 w-full flex items-center justify-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-500 py-3 rounded-xl font-bold hover:bg-amber-500/20 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );
}
