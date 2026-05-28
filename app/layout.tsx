import type { Metadata } from 'next';
import './globals.css';
import { AppShell } from '@/components/AppShell';
import { BeritaProvider } from '@/providers/BeritaProvider';
import { AuthProvider } from '@/providers/AuthProvider';
import { NotificationProvider } from '@/providers/NotificationProvider';
import { LocationProvider } from '@/providers/LocationProvider';

export const metadata: Metadata = {
  title: 'RadarBegal - Indonesia Security News',
  description: 'Sistem Kewaspadaan Warga Jakarta',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="bg-slate-950 text-slate-200" suppressHydrationWarning>
        <AuthProvider>
          <BeritaProvider>
            <NotificationProvider>
              <LocationProvider>
                <AppShell>{children}</AppShell>
              </LocationProvider>
            </NotificationProvider>
          </BeritaProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
