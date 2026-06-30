import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // ── Spinato's Pizza ──────────────────────────────────────────────────────
  const spinatos = await prisma.customer.upsert({
    where: { id: 'spinatos-001' },
    update: {},
    create: {
      id: 'spinatos-001',
      name: "Spinato's Pizza",
      domains: {
        create: {
          id: 'domain-spinatos',
          fqdn: 'spinatospizzeria.com',
          scanRuns: {
            create: {
              score: 35,
              posture: 'poor',
              spfStatus: 'multiple_records',
              dkimStatus: 'missing',
              dmarcStatus: 'policy_none',
              repStatus: 'clean',
              rawResult: {},
            },
          },
          findings: {
            create: [
              { category: 'email_auth', severity: 'critical', title: 'Multiple SPF records', description: 'More than one SPF TXT record found causing PermError.', remediation: 'Merge all SPF mechanisms into a single TXT record.', status: 'open' },
              { category: 'email_auth', severity: 'high',     title: 'DMARC p=none',         description: 'DMARC policy is set to p=none, providing no enforcement.',  remediation: 'Upgrade DMARC policy to p=quarantine or p=reject.',         status: 'open' },
              { category: 'email_auth', severity: 'critical', title: 'DKIM missing',          description: 'No DKIM public keys found on any common selector.',          remediation: 'Configure DKIM signing and publish the public key.',         status: 'open' },
              { category: 'email_auth', severity: 'medium',   title: 'No DMARC rua',          description: 'No aggregate reporting address configured in DMARC.',         remediation: 'Add rua=mailto:dmarc-reports@spinatospizzeria.com',          status: 'open' },
              { category: 'email_auth', severity: 'medium',   title: 'No DMARC sp policy',    description: 'No explicit subdomain policy configured.',                    remediation: 'Add sp=reject to the DMARC record.',                        status: 'open' },
            ],
          },
        },
      },
    },
  });

  // ── Atlas Healthcare ──────────────────────────────────────────────────────
  const atlas = await prisma.customer.upsert({
    where: { id: 'atlas-001' },
    update: {},
    create: {
      id: 'atlas-001',
      name: 'Atlas Healthcare Partners',
      domains: {
        create: {
          id: 'domain-atlas',
          fqdn: 'atlashp.com',
          scanRuns: {
            create: {
              score: 65,
              posture: 'needs_improvement',
              spfStatus: 'hardfail',
              dkimStatus: 'found',
              dmarcStatus: 'missing',
              repStatus: 'clean',
              rawResult: {},
            },
          },
          findings: {
            create: [
              { category: 'email_auth', severity: 'critical', title: 'Missing DMARC', description: 'No DMARC record found. Email spoofing is unrestricted.', remediation: 'Add a TXT record at _dmarc.atlashp.com with v=DMARC1; p=quarantine; rua=mailto:dmarc@atlashp.com', status: 'open' },
            ],
          },
        },
      },
    },
  });

  // ── GMI ──────────────────────────────────────────────────────────────────
  // n8n scan: SPF found (softfail ~all), DKIM on default/selector1/selector2, DMARC quarantine (no rua, no sp), CAA missing
  // Score: 100 -8(softfail) -5(rua) -5(sp) -3(CAA) = 79
  const gmi = await prisma.customer.upsert({
    where: { id: 'gmi-001' },
    update: {},
    create: {
      id: 'gmi-001',
      name: 'GMI',
      domains: {
        create: {
          id: 'domain-gmi',
          fqdn: 'gmi.com',
          scanRuns: {
            create: {
              score: 79,
              posture: 'needs_improvement',
              spfStatus: 'softfail',
              dkimStatus: 'found',
              dmarcStatus: 'quarantine',
              repStatus: 'clean',
              rawResult: {
                spf: { exists: true, records: ['v=spf1 include:spf.protection.outlook.com ~all'], multipleRecords: false, softfail: true, hardfail: false, tooManyLookups: false },
                dmarc: { exists: true, raw: 'v=DMARC1; p=quarantine;', policy: 'quarantine', hasRua: false, hasSpPolicy: false, spPolicy: null },
                dkim: { found: true, selectors: ['default', 'selector1', 'selector2'] },
                dnssec: { enabled: false },
                caa: { exists: false },
                mx: [{ exchange: 'gmi-com.mail.protection.outlook.com', priority: 0 }],
                ns: ['ns40.domaincontrol.com', 'ns39.domaincontrol.com'],
                reputation: [],
              },
            },
          },
          findings: {
            create: [
              { category: 'email_auth', severity: 'medium',   title: 'SPF softfail (~all)',  description: 'SPF record uses ~all (softfail) instead of -all (hardfail). Unauthorized senders are flagged but not rejected.', remediation: 'Change ~all to -all in the SPF record: v=spf1 include:spf.protection.outlook.com -all', status: 'open' },
              { category: 'email_auth', severity: 'medium',   title: 'No DMARC rua',         description: 'DMARC exists (p=quarantine) but has no aggregate reporting address.', remediation: 'Add rua=mailto:dmarc-reports@gmi.com to the DMARC record.', status: 'open' },
              { category: 'email_auth', severity: 'medium',   title: 'No DMARC sp policy',   description: 'No subdomain policy (sp=) configured in DMARC. Subdomains are not explicitly protected.', remediation: 'Add sp=reject to the DMARC record.', status: 'open' },
              { category: 'dns_hygiene', severity: 'low',     title: 'CAA missing',           description: 'No CAA record found. Any CA can issue TLS certificates for gmi.com.', remediation: 'Add CAA records, e.g. 0 issue "letsencrypt.org"', status: 'open' },
            ],
          },
        },
      },
    },
  });

  // ── G Con Inc ────────────────────────────────────────────────────────────
  // n8n scan: SPF hardfail ok, DMARC quarantine+rua, DKIM selector2, CAA missing, no sp policy
  // Score: 100 -5(sp) -3(CAA) -5(DNSSEC) = 87
  const gcon = await prisma.customer.upsert({
    where: { id: 'gcon-001' },
    update: {},
    create: {
      id: 'gcon-001',
      name: 'G Con Inc',
      domains: {
        create: {
          id: 'domain-gcon',
          fqdn: 'gconinc.com',
          scanRuns: {
            create: {
              score: 87,
              posture: 'watch',
              spfStatus: 'hardfail',
              dkimStatus: 'found',
              dmarcStatus: 'quarantine',
              repStatus: 'clean',
              rawResult: {
                spf: { exists: true, records: ['v=spf1 ip4:69.16.242.16 ip4:162.248.127.196 ip4:149.72.228.127 ip4:98.175.208.178 ip4:43.228.186.112 ip4:103.47.205.238 a:dispatch-us.ppe-hosted.com include:spf.protection.outlook.com include:sendgrid.net include:docebosaas.com include:mailgun.org -all'], multipleRecords: false, softfail: false, hardfail: true, tooManyLookups: false },
                dmarc: { exists: true, raw: 'v=DMARC1; p=quarantine; rua=mailto:dmarc@gconinc.com; ruf=mailto:dmarc@gconinc.com', policy: 'quarantine', hasRua: true, hasSpPolicy: false, spPolicy: null },
                dkim: { found: true, selectors: ['selector2'] },
                dnssec: { enabled: false },
                caa: { exists: false },
                mx: [{ exchange: 'gconinc-com.mail.protection.outlook.com', priority: 0 }],
                ns: ['ns40.domaincontrol.com', 'ns39.domaincontrol.com'],
                reputation: [],
              },
            },
          },
          findings: {
            create: [
              { category: 'email_auth',  severity: 'medium', title: 'No DMARC sp policy', description: 'DMARC is well-configured but lacks an explicit subdomain policy (sp=).', remediation: 'Add sp=reject to the DMARC record at _dmarc.gconinc.com.', status: 'open' },
              { category: 'dns_hygiene', severity: 'low',    title: 'CAA missing',          description: 'No CAA record found. Any CA can issue TLS certificates for gconinc.com.', remediation: 'Add CAA records, e.g. 0 issue "digicert.com"', status: 'open' },
              { category: 'dns_hygiene', severity: 'low',    title: 'DNSSEC missing',       description: 'DNSSEC is not enabled. DNS responses are not authenticated.', remediation: 'Enable DNSSEC at your DNS registrar (GoDaddy).', status: 'open' },
            ],
          },
        },
      },
    },
  });

  // ── Valor Global ─────────────────────────────────────────────────────────
  // n8n scan: SPF found (softfail ~all), DMARC p=none (no rua, no sp), DKIM selector1 found, CAA missing
  // Score: 100 -8(softfail) -15(p=none) -5(rua) -5(sp) -3(CAA) -5(DNSSEC) = 59
  const valor = await prisma.customer.upsert({
    where: { id: 'valor-001' },
    update: {},
    create: {
      id: 'valor-001',
      name: 'Valor Global',
      domains: {
        create: {
          id: 'domain-valor',
          fqdn: 'valorglobal.com',
          scanRuns: {
            create: {
              score: 59,
              posture: 'needs_improvement',
              spfStatus: 'softfail',
              dkimStatus: 'found',
              dmarcStatus: 'policy_none',
              repStatus: 'clean',
              rawResult: {
                spf: { exists: true, records: ['v=spf1 include:spf.protection.outlook.com ~all'], multipleRecords: false, softfail: true, hardfail: false, tooManyLookups: false },
                dmarc: { exists: true, raw: 'v=DMARC1; p=none;', policy: 'none', hasRua: false, hasSpPolicy: false, spPolicy: null },
                dkim: { found: true, selectors: ['selector1'] },
                dnssec: { enabled: false },
                caa: { exists: false },
                mx: [{ exchange: 'valorglobal-com.mail.protection.outlook.com', priority: 1 }],
                ns: ['ns31.domaincontrol.com', 'ns32.domaincontrol.com'],
                reputation: [],
              },
            },
          },
          findings: {
            create: [
              { category: 'email_auth',  severity: 'medium',   title: 'SPF softfail (~all)',   description: 'SPF record uses ~all (softfail). Unauthorized senders are marked but not rejected.', remediation: 'Change ~all to -all: v=spf1 include:spf.protection.outlook.com -all', status: 'open' },
              { category: 'email_auth',  severity: 'high',     title: 'DMARC p=none',           description: 'DMARC policy is p=none — monitoring only, no enforcement. Spoofed emails are not blocked.', remediation: 'Change p=none to p=quarantine after reviewing DMARC reports.', status: 'open' },
              { category: 'email_auth',  severity: 'medium',   title: 'No DMARC rua',           description: 'No aggregate reporting address in DMARC. Email flow visibility is blind.', remediation: 'Add rua=mailto:dmarc-reports@valorglobal.com', status: 'open' },
              { category: 'email_auth',  severity: 'medium',   title: 'No DMARC sp policy',     description: 'No subdomain policy configured. Subdomains can be spoofed independently.', remediation: 'Add sp=reject to the DMARC record.', status: 'open' },
              { category: 'dns_hygiene', severity: 'low',      title: 'CAA missing',             description: 'No CAA record. Any certificate authority can issue certs for valorglobal.com.', remediation: 'Add CAA records to restrict certificate issuance.', status: 'open' },
              { category: 'dns_hygiene', severity: 'low',      title: 'DNSSEC missing',          description: 'DNSSEC not enabled. DNS responses cannot be cryptographically verified.', remediation: 'Enable DNSSEC at your DNS registrar (GoDaddy).', status: 'open' },
            ],
          },
        },
      },
    },
  });

  // ── OpenWorks ────────────────────────────────────────────────────────────
  // n8n scan: SPF hardfail ok, DMARC missing, DKIM missing, CAA missing
  // Score: 100 -25(DMARC) -5(rua) -5(sp) -20(DKIM) -3(CAA) -5(DNSSEC) = 37
  const openworks = await prisma.customer.upsert({
    where: { id: 'openworks-001' },
    update: {},
    create: {
      id: 'openworks-001',
      name: 'OpenWorks',
      domains: {
        create: {
          id: 'domain-openworks',
          fqdn: 'openworks.com',
          scanRuns: {
            create: {
              score: 37,
              posture: 'poor',
              spfStatus: 'hardfail',
              dkimStatus: 'missing',
              dmarcStatus: 'missing',
              repStatus: 'clean',
              rawResult: {
                spf: { exists: true, records: ['v=spf1 include:succeed.net -all'], multipleRecords: false, softfail: false, hardfail: true, tooManyLookups: false },
                dmarc: { exists: false, policy: null, hasRua: false, hasSpPolicy: false, spPolicy: null },
                dkim: { found: false, selectors: [] },
                dnssec: { enabled: false },
                caa: { exists: false },
                mx: [{ exchange: 'mail.cwo.com', priority: 10 }],
                ns: ['NS1.CWO.com', 'NS2.CWO.com'],
                reputation: [],
              },
            },
          },
          findings: {
            create: [
              { category: 'email_auth',  severity: 'critical', title: 'Missing DMARC',    description: 'No DMARC record found at _dmarc.openworks.com. Email spoofing is completely unrestricted.', remediation: 'Add a TXT record at _dmarc.openworks.com: v=DMARC1; p=quarantine; rua=mailto:dmarc@openworks.com', status: 'open' },
              { category: 'email_auth',  severity: 'critical', title: 'DKIM missing',     description: 'No DKIM public key found on any common selector. Emails cannot be cryptographically authenticated.', remediation: 'Configure DKIM signing in your mail platform and publish the selector TXT record.', status: 'open' },
              { category: 'dns_hygiene', severity: 'low',      title: 'CAA missing',       description: 'No CAA record. Any CA can issue TLS certificates for openworks.com.', remediation: 'Add CAA records to restrict certificate issuance.', status: 'open' },
              { category: 'dns_hygiene', severity: 'low',      title: 'DNSSEC missing',    description: 'DNSSEC is not enabled on openworks.com.', remediation: 'Enable DNSSEC at your DNS registrar.', status: 'open' },
            ],
          },
        },
      },
    },
  });

  console.log('Seeded:',
    spinatos.name,
    atlas.name,
    gmi.name,
    gcon.name,
    valor.name,
    openworks.name,
  );
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
