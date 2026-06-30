'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const nav = [
  { label: 'Dashboard',  href: '/' },
  { label: 'Customers',  href: '/customers' },
  { label: 'Domains',    href: '/domains' },
  { label: 'Findings',   href: '/findings' },
  { label: 'Reputation', href: '/reputation' },
  { label: 'Settings',   href: '/settings' },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-52 min-h-screen flex flex-col border-r border-white/[0.06] bg-[#050505] relative z-10 flex-shrink-0">
      {/* Logo */}
      <div className="px-5 pt-7 pb-6">
        <div className="flex items-center gap-2.5">
          <div className="relative w-7 h-7 flex-shrink-0">
            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-[#14b8a6] to-[#06b6d4]" />
            <div className="absolute inset-0 rounded-lg flex items-center justify-center text-[#050505] font-bold text-xs tracking-tight">RG</div>
          </div>
          <div>
            <div className="text-[13px] font-semibold text-white tracking-tight leading-none">ReefGuard</div>
            <div className="text-[10px] text-white/25 tracking-wider uppercase mt-0.5">Trust Monitor</div>
          </div>
        </div>
      </div>

      {/* Section label */}
      <div className="px-5 mb-1.5">
        <span className="text-[9px] uppercase tracking-[0.18em] text-white/20 font-medium">Navigation</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2.5 space-y-0.5">
        {nav.map(item => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group relative flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-300 ${
                active ? 'text-white' : 'text-white/35 hover:text-white/70'
              }`}
            >
              {active && (
                <>
                  <span className="absolute inset-0 rounded-xl bg-white/[0.05] border border-white/[0.08]" />
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-3.5 rounded-r-full bg-[#14b8a6]" />
                </>
              )}
              <span className={`relative w-1.5 h-1.5 rounded-full flex-shrink-0 transition-colors duration-300 ${active ? 'bg-[#14b8a6]' : 'bg-white/15 group-hover:bg-white/30'}`} />
              <span className="relative">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-white/[0.05]">
        <div className="text-[10px] text-white/15 tracking-wide">GMI Security · v0.1</div>
      </div>
    </aside>
  );
}
