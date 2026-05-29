import type {Metadata} from 'next';
import './globals.css';
import { AppShell } from '@/components/AppShell';

export const metadata: Metadata = {
<<<<<<< HEAD
  title: 'RadarBegal',
=======
  title: 'Waspada.id - Jakarta Security Command',
>>>>>>> 18c80f34ce2f5ceed807b0a20f0fe14d0ba3a1c5
  description: 'Sistem Kewaspadaan Warga Jakarta',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="bg-slate-950 text-slate-200" suppressHydrationWarning>
        <AppShell>
          {children}
        </AppShell>
      </body>
    </html>
  );
}
