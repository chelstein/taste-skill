import { GlassCard } from '@/components/ui/GlassCard';

const envVars = [
  { key: 'DATABASE_URL',                desc: 'PostgreSQL connection string',         required: true  },
  { key: 'NEXT_PUBLIC_APP_URL',         desc: 'Public URL of the deployed app',        required: true  },
  { key: 'SLACK_WEBHOOK_URL',           desc: 'Slack incoming webhook for alerts',    required: false },
  { key: 'GOOGLE_SAFE_BROWSING_API_KEY',desc: 'Google Safe Browsing API',             required: false },
  { key: 'VIRUSTOTAL_API_KEY',          desc: 'VirusTotal domain reputation API',     required: false },
  { key: 'CISCO_TALOS_API_KEY',         desc: 'Cisco Talos threat intelligence',      required: false },
  { key: 'URLSCAN_API_KEY',             desc: 'URLScan.io analysis API',              required: false },
  { key: 'MSFT_SMARTSCREEN_API_KEY',    desc: 'Microsoft SmartScreen API',            required: false },
];

export default function SettingsPage() {
  return (
    <div className="px-8 py-10 max-w-[900px] mx-auto">
      <div className="mb-10 animate-fade-up opacity-0">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.07] mb-4">
          <span className="text-[10px] uppercase tracking-[0.2em] text-white/35 font-medium">Configuration</span>
        </div>
        <h1 className="text-3xl font-semibold text-white tracking-tight">Settings</h1>
        <p className="text-white/35 mt-1.5 text-sm">Environment variables and integration keys</p>
      </div>

      <div className="space-y-5">
        <div className="animate-fade-up-d1 opacity-0">
          <GlassCard>
            <div className="text-[10px] uppercase tracking-[0.18em] text-white/25 font-medium mb-5">Environment Variables</div>
            <div className="space-y-2">
              {envVars.map(v => (
                <div key={v.key} className="flex items-center gap-4 bg-white/[0.02] border border-white/[0.05] rounded-xl px-4 py-3">
                  <code className="text-[#14b8a6]/70 text-xs font-mono flex-shrink-0">{v.key}</code>
                  <span className="text-white/30 text-xs flex-1">{v.desc}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${
                    v.required
                      ? 'bg-red-500/10 text-red-400 ring-1 ring-red-500/20'
                      : 'bg-white/[0.04] text-white/20 ring-1 ring-white/[0.06]'
                  }`}>
                    {v.required ? 'required' : 'optional'}
                  </span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        <div className="animate-fade-up-d2 opacity-0">
          <GlassCard>
            <div className="text-[10px] uppercase tracking-[0.18em] text-white/25 font-medium mb-3">Authentication</div>
            <p className="text-white/35 text-sm leading-relaxed">
              Auth is currently a placeholder. Integrate{' '}
              <span className="text-white/60 font-medium">NextAuth.js</span> or{' '}
              <span className="text-white/60 font-medium">Clerk</span>{' '}
              for production access control and SSO.
            </p>
          </GlassCard>
        </div>

        <div className="animate-fade-up-d3 opacity-0">
          <GlassCard glow="teal">
            <div className="text-[10px] uppercase tracking-[0.18em] text-[#14b8a6]/50 font-medium mb-3">About ReefGuard</div>
            <p className="text-white/40 text-sm leading-relaxed">
              ReefGuard continuously monitors the public domain ecosystem that customers rely on for trusted email,
              DNS integrity, and brand reputation. It identifies broken SPF, missing DMARC, weak DKIM coverage,
              blacklist exposure, certificate risk, and DNS hygiene problems before they become customer-impacting incidents.
            </p>
            <div className="mt-4 text-[10px] text-white/15 font-mono">GMI Security · ReefGuard v0.1.0</div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
