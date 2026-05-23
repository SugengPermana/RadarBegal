'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  History, 
  Newspaper, 
  Phone, 
  Settings, 
  LogOut, 
  Bell, 
  User,
  AlertTriangle,
  MapPin,
  ChevronLeft,
  X
} from 'lucide-react';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasNewNotifications, setHasNewNotifications] = useState(true);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications && hasNewNotifications) {
      setHasNewNotifications(false);
    }
  };
  
  const isLapor = pathname === '/lapor';

  if (isLapor) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-950 text-slate-200">
        <header className="flex items-center justify-between px-4 h-16 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
          <Link href="/" className="p-2 -ml-2 rounded-full hover:bg-slate-800 text-slate-400 transition-colors group">
            <ChevronLeft className="w-6 h-6 group-hover:text-teal-500 transition-colors" />
          </Link>
          <h1 className="font-semibold text-lg absolute left-1/2 -translate-x-1/2 text-slate-100">Lapor Insiden</h1>
          <div className="w-10"></div>
        </header>
        <main className="flex-1 w-full max-w-[600px] mx-auto pb-24 relative overflow-hidden flex flex-col">
          {children}
        </main>
      </div>
    );
  }

  const navItems = [
    { href: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/history', icon: History, label: 'History' },
    { href: '/berita', icon: Newspaper, label: 'Berita' },
    { href: '/emergency', icon: Phone, label: 'Emergency' },
  ];

  const currentPage = navItems.find((item) => item.href === pathname)?.label || 'Dashboard';

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-200 font-sans">
      {/* TopNavBar (Mobile) */}
      <header className="md:hidden bg-slate-900/90 backdrop-blur-xl border-b border-slate-800 fixed top-0 w-full z-50">
        <div className="flex justify-between items-center px-4 h-16 w-full">
          <div className="flex flex-col">
            <span className="text-[10px] text-teal-500 font-bold uppercase tracking-widest leading-none mb-1">Waspada.id</span>
            <div className="font-bold text-xl tracking-tighter text-slate-100 leading-none">{currentPage}</div>
          </div>
          <div className="flex gap-3 relative">
            <button suppressHydrationWarning onClick={toggleNotifications} className="relative text-slate-400 hover:text-teal-400 transition-colors p-2 bg-slate-800/50 rounded-full">
              <Bell className="w-5 h-5" />
              {hasNewNotifications && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-slate-900"></span>}
            </button>
            <button suppressHydrationWarning className="text-slate-400 hover:text-teal-400 transition-colors p-2 bg-slate-800/50 rounded-full">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* TopNavBar (Desktop) */}
      <header className="hidden md:flex bg-slate-900/80 backdrop-blur-md border-b border-slate-800 fixed top-0 right-0 w-[calc(100%-280px)] h-16 z-30 px-8 items-center justify-between">
        <div className="flex flex-col justify-center">
          <span className="text-[10px] text-teal-500 font-bold uppercase tracking-widest leading-none mb-1">Waspada.id</span>
          <h1 className="text-xl font-bold text-slate-100 leading-none">{currentPage}</h1>
        </div>
        <div className="flex items-center gap-4 relative">
           <button suppressHydrationWarning onClick={toggleNotifications} className="relative text-slate-400 hover:text-teal-400 transition-colors p-2 bg-slate-800/50 rounded-full shadow-sm border border-slate-700/50">
             <Bell className="w-5 h-5" />
             {hasNewNotifications && <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-slate-900"></span>}
           </button>

           {/* Notification Popover Dropdown */}
           {showNotifications && (
             <div className="absolute top-[120%] right-0 w-80 bg-slate-900 border border-slate-800 shadow-2xl rounded-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
               <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-900/50">
                 <span className="font-bold text-sm tracking-wider uppercase text-slate-200">Notifikasi</span>
                 <button onClick={() => setShowNotifications(false)} className="text-slate-500 hover:text-slate-300 transition-colors bg-slate-800/50 hover:bg-slate-800 p-1.5 rounded-full">
                   <X className="w-4 h-4" />
                 </button>
               </div>
               <div className="max-h-80 overflow-y-auto">
                 <div className="p-4 hover:bg-slate-800/50 transition-colors border-b border-slate-800/50 cursor-pointer">
                   <div className="flex items-start gap-3">
                     <div className="w-2 h-2 rounded-full bg-red-500 mt-2 shrink-0 animate-pulse"></div>
                     <div className="flex-1">
                       <h4 className="text-sm font-semibold text-slate-200">Laporan Begal Baru</h4>
                       <p className="text-xs text-slate-400 mt-1">Laporan masuk dari Kebayoran. Radius 3.2km dari lokasi Anda.</p>
                       <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-2 block">10 Min yang lalu</span>
                     </div>
                   </div>
                 </div>
                 <div className="p-4 hover:bg-slate-800/50 transition-colors border-b border-slate-800/50 cursor-pointer">
                   <div className="flex items-start gap-3">
                     <div className="w-2 h-2 rounded-full bg-transparent mt-2 shrink-0"></div>
                     <div className="flex-1">
                       <h4 className="text-sm font-semibold text-slate-200">Zona Aman Diperbarui</h4>
                       <p className="text-xs text-slate-400 mt-1">Status keamanan sekitar Anda saat ini terpantau aman.</p>
                       <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-2 block">2 Jam yang lalu</span>
                     </div>
                   </div>
                 </div>
               </div>
               <button className="w-full py-3 text-xs font-bold uppercase tracking-wider text-teal-500 hover:bg-slate-800 transition-colors text-center">
                 Tandai Semua Dibaca
               </button>
             </div>
           )}
        </div>
      </header>

      {/* SideNavBar (Desktop) */}
      <nav className="hidden md:flex bg-slate-900 border-r border-slate-800 fixed left-0 top-0 h-full w-[280px] z-40 flex-col py-6">
        <div className="px-6 mb-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 bg-teal-500 rounded flex items-center justify-center">
              <AlertTriangle className="w-3.5 h-3.5 text-slate-950" />
            </div>
            <div className="text-xs text-teal-500 font-bold uppercase tracking-widest leading-none">Waspada.id</div>
          </div>
          <div className="font-bold text-3xl text-slate-100 tracking-tight leading-none capitalize">{currentPage}</div>
          <p className="text-xs text-slate-500 mt-2 uppercase tracking-wider font-semibold">Jakarta Security Command</p>
        </div>
        
        <div className="flex-1 px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                  isActive 
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
          <Link href="#" className="flex items-center gap-4 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors font-medium">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
              <User className="w-4 h-4 text-slate-300" />
            </div>
            <span>Account</span>
          </Link>
          <Link href="#" className="flex items-center gap-4 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors font-medium">
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </Link>
          <Link href="#" className="flex items-center gap-4 px-4 py-3 rounded-xl text-amber-500 hover:bg-amber-500/10 transition-colors font-medium">
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 md:ml-[280px] mt-16 pb-20 md:pb-0 min-h-[calc(100vh-4rem)] relative flex flex-col">
        {children}
      </main>

      {/* Bottom Nav (Mobile) */}
      <nav className="md:hidden fixed bottom-0 w-full z-50 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 flex justify-around items-center px-2 py-3 pb-safe">
        {navItems.slice(0, 3).map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex flex-col items-center justify-center px-3 py-1 rounded-full transition-all ${
                isActive ? 'text-teal-500 bg-teal-500/10' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <item.icon className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-bold">{item.label}</span>
            </Link>
          );
        })}
        <Link 
          href="/lapor"
          className="flex flex-col items-center justify-center px-4 py-1 rounded-full text-slate-400 hover:text-slate-200 transition-all"
        >
          <AlertTriangle className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-bold">Lapor</span>
        </Link>
      </nav>
    </div>
  );
}
