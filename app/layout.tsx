import type { Metadata } from 'next';
import './globals.css';
import { AppShell } from '@/components/AppShell';
import { BeritaProvider } from '@/providers/BeritaProvider';

export const metadata: Metadata = {
  title: 'RadarBegal - Indonesia Security News',
  description: 'Sistem Kewaspadaan Warga Jakarta',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="bg-slate-950 text-slate-200" suppressHydrationWarning>
        <BeritaProvider>
          <AppShell>
            {children}
          </AppShell>
        </BeritaProvider>
      </body>
    </html>
  );
}
