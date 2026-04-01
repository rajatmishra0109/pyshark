import type { DashboardStats, MLLabel, Protocol, SessionAlert, Severity } from '@/types'

const severities: Severity[] = ['Low', 'Medium', 'High', 'Critical']
const protocols: Protocol[] = ['TCP', 'UDP', 'ICMP', 'OTHER']
const labels: MLLabel[] = ['Normal', 'Suspicious', 'Malicious']

function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function pick<T>(arr: T[]): T {
  return arr[rand(0, arr.length - 1)]
}

export function generateSessions(count = 140): SessionAlert[] {
  const now = Date.now()

  return Array.from({ length: count }, (_, i) => {
    const timestamp = new Date(now - i * rand(5_000, 120_000)).toISOString()
    const riskScore = rand(8, 98)
    const severity: Severity =
      riskScore < 30 ? 'Low' : riskScore < 60 ? 'Medium' : riskScore < 80 ? 'High' : 'Critical'
    const protocol = pick(protocols)
    const srcA = rand(11, 222)
    const srcB = rand(1, 254)
    const srcC = rand(1, 254)
    const srcD = rand(1, 254)

    const label: MLLabel = riskScore > 75 ? 'Malicious' : riskScore > 45 ? 'Suspicious' : 'Normal'
    const normal = Math.max(0.02, Number((1 - riskScore / 130).toFixed(2)))
    const malicious = Math.max(0.02, Number((riskScore / 110).toFixed(2)))
    const suspicious = Math.max(0.02, Number((1 - normal - malicious).toFixed(2)))

    return {
      id: `sess-${i + 1}`,
      timestamp,
      src_ip: `${srcA}.${srcB}.${srcC}.${srcD}`,
      dst_ip: `10.0.${rand(1, 10)}.${rand(2, 250)}`,
      src_port: rand(1024, 65535),
      dst_port: pick([22, 53, 80, 443, 3306, 8080]),
      protocol,
      duration: Number((Math.random() * 6.2).toFixed(2)),
      packet_count: rand(12, 15000),
      total_bytes: rand(300, 2_000_000),
      ml: {
        label,
        confidence: Number((0.5 + Math.random() * 0.5).toFixed(2)),
        probabilities: {
          Normal: normal,
          Suspicious: suspicious,
          Malicious: malicious,
        },
      },
      shap: [
        { feature: 'syn_rate', value: Number((Math.random() * 2).toFixed(3)), impact: Number((Math.random() * 2 - 0.2).toFixed(3)) },
        { feature: 'dst_port_entropy', value: Number((Math.random() * 8).toFixed(3)), impact: Number((Math.random() * 1.8 - 0.3).toFixed(3)) },
        { feature: 'pkt_len_std', value: Number((Math.random() * 400).toFixed(3)), impact: Number((Math.random() * 1.8 - 0.5).toFixed(3)) },
        { feature: 'rst_rate', value: Number((Math.random() * 1.5).toFixed(3)), impact: Number((Math.random() * 1.5 - 0.6).toFixed(3)) },
        { feature: 'iat_std', value: Number((Math.random() * 900).toFixed(3)), impact: Number((Math.random() * 1.5 - 0.6).toFixed(3)) },
      ],
      cti:
        srcA % 3 === 0
          ? null
          : {
              is_malicious: riskScore > 70,
              abuse_confidence: rand(15, 99),
              country_code: pick(['US', 'DE', 'IN', 'JP', 'BR', 'NL']),
              isp: pick(['Akamai', 'Cloudflare', 'DigitalOcean', 'Hetzner', 'AWS']),
              usage_type: pick(['Data Center', 'ISP', 'Hosting', 'Enterprise']),
              last_reported: new Date(now - rand(5 * 60_000, 2 * 24 * 60 * 60_000)).toISOString(),
            },
      risk: {
        score: riskScore,
        severity,
        factors: ['Anomalous packet cadence', 'Suspicious port behavior', 'Model confidence spike'],
      },
    }
  })
}

export function buildStats(sessions: SessionAlert[]): DashboardStats {
  const alertsToday = sessions.filter((s) => s.risk.score >= 60).length
  const maliciousIps = sessions.filter((s) => s.ml.label === 'Malicious').length
  const totalRisk = sessions.reduce((sum, s) => sum + s.risk.score, 0)

  const breakdown: Record<MLLabel, number> = {
    Normal: sessions.filter((s) => s.ml.label === 'Normal').length,
    Suspicious: sessions.filter((s) => s.ml.label === 'Suspicious').length,
    Malicious: sessions.filter((s) => s.ml.label === 'Malicious').length,
  }

  const ipMap = new Map<string, { ip: string; risk_score: number; hit_count: number; severity: Severity; country: string }>()
  for (const s of sessions) {
    const existing = ipMap.get(s.src_ip)
    if (existing) {
      existing.hit_count += 1
      existing.risk_score = Math.max(existing.risk_score, s.risk.score)
      existing.severity = s.risk.score > existing.risk_score ? s.risk.severity : existing.severity
    } else {
      ipMap.set(s.src_ip, {
        ip: s.src_ip,
        risk_score: s.risk.score,
        hit_count: 1,
        severity: s.risk.severity,
        country: s.cti?.country_code ?? 'N/A',
      })
    }
  }

  const top_threats = [...ipMap.values()]
    .sort((a, b) => b.risk_score - a.risk_score || b.hit_count - a.hit_count)
    .slice(0, 5)

  return {
    total_sessions: sessions.length,
    active_sessions: Math.max(8, Math.floor(sessions.length * 0.12)),
    alerts_today: alertsToday,
    malicious_ips: maliciousIps,
    threat_breakdown: breakdown,
    avg_risk_score: Number((totalRisk / Math.max(1, sessions.length)).toFixed(1)),
    top_threats,
  }
}

export const MOCK_SESSIONS = generateSessions()
