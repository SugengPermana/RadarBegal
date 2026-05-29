'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  FileWarning,
  Newspaper,
  Siren,
  LogOut,
  Bell,
  User,
  AlertTriangle,
  ChevronLeft,
  X,
  Trash2,
  FileText,
} from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { useNotifications } from '@/providers/NotificationProvider';
import { formatRelativeTime } from '@/lib/format';
import { normalizeRiskLevel, riskLabel } from '@/lib/risk';
import { useLocation } from '@/providers/LocationProvider';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, isLoading: authLoading, signOut } = useAuth();
  const { userLocation } = useLocation();
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    setFocusNewsId,
  } = useNotifications();

  const [showNotifications, setShowNotifications] = useState(false);

  const isAuthPage = pathname === '/login';
  const isAccountPage = pathname === '/account';

  if (isAuthPage) {
    return <div className="min-h-screen bg-slate-950 text-slate-200">{children}</div>;
  }

  const navItems = [
    { href: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/kasus', icon: FileWarning, label: 'Kasus' },
    { href: '/berita', icon: Newspaper, label: 'Berita' },
    { href: '/emergency', icon: Siren, label: 'Emergency' },
  ];

  if (user && !authLoading) {
    navItems.push({ href: '/history-laporan', icon: FileText, label: 'History Laporan' });
  }

  if (profile?.role?.toLowerCase() === 'admin') {
    navItems.push({ href: '/hapus-laporan', icon: Trash2, label: 'Hapus Laporan' });
  }

  const currentPage =
    navItems.find((item) => item.href === pathname)?.label ||
    (isAccountPage ? 'Account' : 'Dashboard');

  const accountHref = user ? '/account' : '/login';

  const handleNotificationClick = (newsId: number, notifId: string) => {
    markAsRead(notifId);
    setShowNotifications(false);
    setFocusNewsId(newsId);
    if (pathname !== '/') {
      router.push(`/?id=${newsId}`);
    }
  };

  const NotificationDropdown = () => (
    <>
      <button
        suppressHydrationWarning
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative text-slate-400 hover:text-teal-400 transition-colors p-2 bg-slate-800/50 rounded-full shadow-sm border border-slate-700/50"
        aria-label="Notifikasi"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center text-[10px] font-bold bg-red-500 text-white rounded-full border-2 border-slate-900">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {showNotifications && (
        <div className="absolute top-[120%] right-0 w-80 bg-slate-900 border border-slate-800 shadow-2xl rounded-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-900/50">
            <span className="font-bold text-sm tracking-wider uppercase text-slate-200">
              Notifikasi
            </span>
            <button
              type="button"
              onClick={() => setShowNotifications(false)}
              className="text-slate-500 hover:text-slate-300 transition-colors bg-slate-800/50 hover:bg-slate-800 p-1.5 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="p-4 text-sm text-slate-500 text-center">Belum ada notifikasi</p>
            ) : (
              notifications.map((notif) => (
                <button
                  key={notif.id}
                  type="button"
                  onClick={() => handleNotificationClick(notif.newsId, notif.id)}
                  className="w-full text-left p-4 hover:bg-slate-800/50 transition-colors border-b border-slate-800/50"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-2 h-2 rounded-full mt-2 shrink-0 ${!notif.read ? 'bg-red-500 animate-pulse' : 'bg-transparent'
                        }`}
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-slate-200 line-clamp-1">
                        {notif.title}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1">{notif.location}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${normalizeRiskLevel(notif.riskLevel) === 'CRITICAL'
                            ? 'bg-red-500/20 text-red-400'
                            : normalizeRiskLevel(notif.riskLevel) === 'WARNING'
                              ? 'bg-orange-500/20 text-orange-400'
                              : 'bg-yellow-500/20 text-yellow-400'
                            }`}
                        >
                          {riskLabel(notif.riskLevel)}
                        </span>
                        <span className="text-[10px] text-slate-500 font-medium">
                          {formatRelativeTime(notif.publishedAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
          {notifications.length > 0 && (
            <button
              type="button"
              onClick={markAllAsRead}
              className="w-full py-3 text-xs font-bold uppercase tracking-wider text-teal-500 hover:bg-slate-800 transition-colors text-center"
            >
              Tandai Semua Dibaca
            </button>
          )}
        </div>
      )}
    </>
  );

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-200 font-sans">
      <header className="md:hidden bg-slate-900/90 backdrop-blur-xl border-b border-slate-800 fixed top-0 w-full z-50">
        <div className="flex justify-between items-center px-4 h-16 w-full">
          <div className="flex flex-col">
            <span className="text-[10px] text-teal-500 font-bold uppercase tracking-widest leading-none mb-1">
              RadarBegal
            </span>
            <div className="font-bold text-xl tracking-tighter text-slate-100 leading-none">
              {currentPage}
            </div>
          </div>
          <div className="flex gap-3 relative items-center min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              <NotificationDropdown />
              {userLocation && (
                <span className="text-[10px] text-slate-300 truncate max-w-[120px]">
                  Lokasi Anda: {userLocation.address}
                </span>
              )}
            </div>
            <Link
              href={accountHref}
              className="text-slate-400 hover:text-teal-400 transition-colors p-2 bg-slate-800/50 rounded-full"
            >
              <User className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </header>


      <header className="hidden md:flex bg-slate-900/80 backdrop-blur-md border-b border-slate-800 fixed top-0 right-0 w-[calc(100%-280px)] h-16 z-30 px-8 items-center justify-between">
        <div className="flex flex-col justify-center">
          <span className="text-[10px] text-teal-500 font-bold uppercase tracking-widest leading-none mb-1">
            RadarBegal
          </span>
          <h1 className="text-xl font-bold text-slate-100 leading-none">{currentPage}</h1>
        </div>
        <div className="flex items-center gap-4 relative">
          <NotificationDropdown />
          {userLocation && (
            <span className="text-[10px] text-slate-300 truncate max-w-[240px]">
              Lokasi Anda: {userLocation.address}
            </span>
          )}
        </div>
      </header>

      <nav className="hidden md:flex bg-slate-900 border-r border-slate-800 fixed left-0 top-0 h-full w-[280px] z-40 flex-col py-6">
        <div className="px-6 mb-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 bg-teal-500 rounded flex items-center justify-center">
              <AlertTriangle className="w-3.5 h-3.5 text-slate-950" />
            </div>
            <div className="text-xs text-teal-500 font-bold uppercase tracking-widest leading-none">
              RadarBegal
            </div>
          </div>
          <div className="font-bold text-3xl text-slate-100 tracking-tight leading-none capitalize">
            {currentPage}
          </div>
          <p className="text-xs text-slate-500 mt-2 uppercase tracking-wider font-semibold">
            Jabodetabek Security
          </p>
        </div>

        <div className="flex-1 px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${isActive
                  ? 'bg-teal-500/10 text-teal-500 border-l-4 border-teal-500'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-teal-500' : ''}`} />
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="px-4 mt-auto flex flex-col gap-2 pt-4 border-t border-slate-800">
          <Link
            href={accountHref}
            className="flex items-center gap-4 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors font-medium"
          >
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden">
              <User className="w-4 h-4 text-slate-300" />
            </div>
            <span>Account</span>
          </Link>
          {user && !authLoading && (
            <button
              type="button"
              onClick={async () => {
                await signOut();
                router.push('/login');
              }}
              className="flex items-center gap-4 px-4 py-3 rounded-xl text-amber-500 hover:bg-amber-500/10 transition-colors font-medium w-full text-left"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          )}
        </div>
      </nav>

      <main className="flex-1 md:ml-[280px] mt-16 pb-20 md:pb-0 min-h-[calc(100vh-4rem)] relative flex flex-col">
        {children}
      </main>

      <nav className="md:hidden fixed bottom-0 w-full z-50 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 flex justify-around items-center px-2 py-3 pb-safe">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center px-3 py-1 rounded-full transition-all ${isActive ? 'text-teal-500 bg-teal-500/10' : 'text-slate-400 hover:text-slate-200'
                }`}
            >
              <item.icon className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-bold">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
