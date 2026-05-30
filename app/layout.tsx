import type { Metadata } from 'next';
import './globals.css';
import { AppShell } from '@/components/AppShell';
import { BeritaProvider } from '@/providers/BeritaProvider';
import { AuthProvider } from '@/providers/AuthProvider';
import { NotificationProvider } from '@/providers/NotificationProvider';
import { LocationProvider } from '@/providers/LocationProvider';

export const metadata: Metadata = {
  title: 'RadarBegal',
  description: 'Sistem Kewaspadaan Warga Jakarta',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Inject runtime environment variables to window.ENV for Cloud Run compatibility
  const envScript = `
    window.ENV = {
      NEXT_PUBLIC_SUPABASE_URL: "${process.env.NEXT_PUBLIC_SUPABASE_URL || ''}",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''}",
      NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: "${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}"
    };
  `;

  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: envScript }} />
      </head>
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
