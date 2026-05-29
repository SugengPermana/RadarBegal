"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { supabase } from "@/lib/supabase/client";
import { Trash2, AlertCircle, Loader2, MapPin, Clock, User } from "lucide-react";

export default function HapusLaporanPage() {
  const { profile, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    if (!authLoading && profile?.role?.toLowerCase() !== "admin") {
      router.push("/");
    }
  }, [profile, authLoading, router]);

  useEffect(() => {
    async function fetchReports() {
      const { data, error } = await supabase
        .from("reports")
        .select("*, users(username, avatar_url)")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setReports(data);
      }
      setLoading(false);
    }

    if (profile?.role?.toLowerCase() === "admin") {
      fetchReports();
    }
  }, [profile]);

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus laporan ini?")) return;

    setDeletingId(id);
    const { error } = await supabase.from("reports").delete().eq("id", id);

    if (!error) {
      setReports((prev) => prev.filter((r) => r.id !== id));
    } else {
      alert("Gagal menghapus laporan: " + error.message);
    }
    setDeletingId(null);
  };

  if (authLoading || (profile?.role?.toLowerCase() !== "admin" && !authLoading)) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-950 p-8">
        <Loader2 className="w-8 h-8 text-teal-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 md:p-8 max-w-[1000px] mx-auto w-full flex flex-col pt-20 md:pt-8 bg-slate-950 relative z-10">
      <div className="mb-8 flex flex-col gap-2">
        <h1 className="text-3xl md:text-4xl font-black text-slate-100 tracking-tight flex items-center gap-3">
          <Trash2 className="w-8 h-8 text-red-500" /> Manajemen Laporan
        </h1>
        <p className="text-slate-400">
          Daftar laporan dari para user
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-6 lg:p-8">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 text-teal-500 animate-spin" />
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-12 flex flex-col items-center">
            <AlertCircle className="w-12 h-12 text-slate-700 mb-4" />
            <h3 className="text-slate-300 font-bold mb-2">Belum Ada Laporan</h3>
            <p className="text-slate-500 text-sm">
              Tidak ada laporan yang tersedia di database.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {reports.map((report) => (
              <div
                key={report.id}
                className="bg-slate-950 border border-slate-800 p-5 rounded-2xl flex flex-col sm:flex-row gap-4 sm:items-center justify-between hover:border-slate-700 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  {/* Reporter Info */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                      {report.users?.avatar_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={report.users.avatar_url}
                          alt="avatar"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-3.5 h-3.5 text-slate-500" />
                      )}
                    </div>
                    <span className="text-xs font-bold text-slate-300 truncate">
                      {report.users?.username || "User Tidak Diketahui"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded bg-slate-800 text-slate-300">
                      {report.report_status}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      <Clock className="w-3 h-3" />
                      {new Date(report.created_at).toLocaleDateString("id-ID")}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-200 text-base mb-1 line-clamp-2">
                    {report.description}
                  </h4>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{report.location_name}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleDelete(report.id)}
                  disabled={deletingId === report.id}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl border border-red-500/20 transition-colors font-bold text-sm disabled:opacity-50 shrink-0"
                >
                  {deletingId === report.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  Hapus
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
