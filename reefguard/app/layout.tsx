import type { Metadata } from 'next';
import './globals.css';
import { Sidebar } from '@/components/nav/Sidebar';

export const metadata: Metadata = {
  title: 'ReefGuard – Domain Trust Monitor',
  description: 'Continuous Domain & Email Trust Monitoring by GMI Security',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#050505] text-slate-100 antialiased">
        <div className="flex min-h-screen relative">
          {/* Background glows — fixed so they don't scroll */}
          <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            <div className="absolute -top-32 -left-32 w-[600px] h-[500px] rounded-full bg-[#14b8a6]/[0.04] blur-[140px]" />
            <div className="absolute bottom-0 -right-32 w-[500px] h-[400px] rounded-full bg-[#06b6d4]/[0.035] blur-[120px]" />
          </div>
          <Sidebar />
          <main className="flex-1 overflow-auto relative z-10">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
