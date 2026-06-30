import { prisma } from '@/lib/prisma';
import { PostureBadge, StatusBadge } from '@/components/ui/Badge';
import { ScoreRing } from '@/components/ui/ScoreRing';
import { GlassCard } from '@/components/ui/GlassCard';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  let domains: any[] = [];
  try {
    domains = await prisma.domain.findMany({
      include: {
        customer: true,
        scanRuns: { orderBy: { scannedAt: 'desc' }, take: 1 },
        findings: { where: { status: 'open' } },
      },
    });
  } catch {}

  const counts = {
    healthy:           domains.filter(d => d.scanRuns[0]?.posture === 'healthy').length,
    watch:             domains.filter(d => d.scanRuns[0]?.posture === 'watch').length,
    needs_improvement: domains.filter(d => d.scanRuns[0]?.posture === 'needs_improvement').length,
    poor:              domains.filter(d => d.scanRuns[0]?.posture === 'poor').length,
  };
  const totalFindings = domains.reduce((acc, d) => acc + d.findings.length, 0);

  return (
    <div className="px-8 py-10 max-w-[1400px] mx-auto">

      {/* Header */}
      <div className="mb-10 animate-fade-up opacity-0">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#14b8a6]/10 border border-[#14b8a6]/20 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[#14b8a6] animate-pulse" />
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#14b8a6] font-medium">Live Monitoring</span>
        </div>
        <h1 className="text-3xl font-semibold text-white tracking-tight">Domain Trust Dashboard</h1>
        <p className="text-white/40 mt-1.5 text-sm">Continuous email authentication &amp; DNS hygiene monitoring</p>
      </div>

      {/* Top stat row */}
      <div className="grid grid-cols-12 gap-4 mb-6">
        <div className="col-span-3 animate-fade-up opacity-0">
          <GlassCard glow="teal">
            <div className="text-[10px] uppercase tracking-[0.18em] text-white/30 font-medium mb-3">Domains Monitored</div>
            <div className="text-5xl font-bold text-white tabular-nums">{domains.length}</div>
            <div className="text-xs text-white/25 mt-2">active domains</div>
          </GlassCard>
        </div>

        <div className="col-span-3 animate-fade-up-d1 opacity-0">
          <GlassCard>
            <div className="text-[10px] uppercase tracking-[0.18em] text-white/30 font-medium mb-3">Open Findings</div>
            <div className={`text-5xl font-bold tabular-nums ${totalFindings > 0 ? 'text-red-400' : 'text-emerald-400'}`}>{totalFindings}</div>
            <div className="text-xs text-white/25 mt-2">require remediation</div>
          </GlassCard>
        </div>

        <div className="col-span-6 animate-fade-up-d2 opacity-0">
          <GlassCard>
            <div className="text-[10px] uppercase tracking-[0.18em] text-white/30 font-medium mb-4">Posture Breakdown</div>
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: 'Healthy', count: counts.healthy,           color: 'text-emerald-400', bar: 'bg-emerald-500' },
                { label: 'Watch',   count: counts.watch,             color: 'text-amber-400',   bar: 'bg-amber-500'   },
                { label: 'Improve', count: counts.needs_improvement, color: 'text-orange-400',  bar: 'bg-orange-500'  },
                { label: 'Poor',    count: counts.poor,              color: 'text-red-400',     bar: 'bg-red-500'     },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <div className={`text-3xl font-bold tabular-nums ${s.color}`}>{s.count}</div>
                  <div className="text-[10px] text-white/25 mt-1 uppercase tracking-wide">{s.label}</div>
                  <div className="mt-2.5 h-px bg-white/[0.06] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${s.bar}`}
                      style={{ width: domains.length ? `${(s.count / domains.length) * 100}%` : '0%' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Domain table */}
      <div className="animate-fade-up-d3 opacity-0">
        <GlassCard padding={false}>
          <div className="px-5 py-4 border-b border-white/[0.05] flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-white/25 font-medium">Monitored Domains</div>
              <div className="text-sm font-medium text-white mt-0.5">{domains.length} domain{domains.length !== 1 ? 's' : ''} tracked</div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.04]">
                  {['Customer', 'Domain', 'Score', 'Posture', 'SPF', 'DKIM', 'DMARC', 'Findings', 'Last Scan'].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-[10px] uppercase tracking-[0.12em] text-white/20 font-medium whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {domains.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-5 py-16 text-center">
                      <div className="text-white/20 text-sm">No domains yet</div>
                      <code className="text-white/10 text-xs mt-2 block font-mono">npm run db:seed</code>
                    </td>
                  </tr>
                )}
                {domains.map(d => {
                  const latest = d.scanRuns[0];
                  return (
                    <tr key={d.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors duration-200 group">
                      <td className="px-5 py-4 text-white/40 text-xs whitespace-nowrap">{d.customer.name}</td>
                      <td className="px-5 py-4">
                        <Link
                          href={`/domains/${d.id}`}
                          className="font-mono text-xs text-[#14b8a6]/70 hover:text-[#14b8a6] transition-colors duration-200 hover:underline underline-offset-2"
                        >
                          {d.fqdn}
                        </Link>
                      </td>
                      <td className="px-5 py-4">
                        {latest ? <ScoreRing score={latest.score} size={44} /> : <span className="text-white/20">–</span>}
                      </td>
                      <td className="px-5 py-4">
                        {latest ? <PostureBadge posture={latest.posture} /> : <span className="text-white/20">–</span>}
                      </td>
                      <td className="px-5 py-4">{latest ? <StatusBadge status={latest.spfStatus} /> : '–'}</td>
                      <td className="px-5 py-4">{latest ? <StatusBadge status={latest.dkimStatus} /> : '–'}</td>
                      <td className="px-5 py-4">{latest ? <StatusBadge status={latest.dmarcStatus} /> : '–'}</td>
                      <td className="px-5 py-4">
                        {d.findings.length > 0
                          ? <span className="text-red-400 font-semibold tabular-nums">{d.findings.length}</span>
                          : <span className="text-white/20 text-xs">—</span>}
                      </td>
                      <td className="px-5 py-4 text-white/25 text-xs font-mono whitespace-nowrap">
                        {latest
                          ? new Date(latest.scannedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                          : '–'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
