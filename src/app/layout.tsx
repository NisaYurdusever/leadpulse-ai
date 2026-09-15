import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'LeadPulse AI | Autonomous Lead Qualification Platform',
  description: 'AI-driven client engagement, qualification, and appointment scheduling.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased">
        {/* Navigation Bar */}
        <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg text-blue-400">
              <span className="h-3 w-3 rounded-full bg-blue-500 animate-pulse" />
              LeadPulse AI
            </Link>
            
            <nav className="flex items-center gap-4 text-xs sm:text-sm font-medium">
              <Link href="/dashboard" className="text-slate-300 hover:text-white transition">
                Dashboard
              </Link>
              <Link href="/chat" className="text-slate-300 hover:text-white transition">
                Assistant
              </Link>
              <Link href="/settings" className="text-slate-300 hover:text-white transition">
                Settings
              </Link>
              <Link 
                href="/health" 
                className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs hover:bg-emerald-500/20 transition"
              >
                Health
              </Link>
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500">
          <p>© 2026 LeadPulse AI — Capstone Production Track. Deployed on Vercel.</p>
        </footer>
      </body>
    </html>
  );
}