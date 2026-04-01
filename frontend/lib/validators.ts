import { z } from 'zod'

export const severitySchema = z.enum(['Low', 'Medium', 'High', 'Critical'])
export const protocolSchema = z.enum(['TCP', 'UDP', 'ICMP', 'OTHER'])
export const mlLabelSchema = z.enum(['Normal', 'Suspicious', 'Malicious'])

export const sessionAlertSchema = z.object({
  id: z.string(),
  timestamp: z.string(),
  src_ip: z.string(),
  dst_ip: z.string(),
  src_port: z.number(),
  dst_port: z.number(),
  protocol: protocolSchema,
  duration: z.number(),
  packet_count: z.number(),
  total_bytes: z.number(),
  ml: z.object({
    label: mlLabelSchema,
    confidence: z.number(),
    probabilities: z.record(mlLabelSchema, z.number()),
  }),
  shap: z.array(
    z.object({
      feature: z.string(),
      value: z.number(),
      impact: z.number(),
    }),
  ),
  cti: z
    .object({
      is_malicious: z.boolean(),
      abuse_confidence: z.number(),
      country_code: z.string(),
      isp: z.string(),
      usage_type: z.string(),
      last_reported: z.string().optional(),
    })
    .nullable(),
  risk: z.object({
    score: z.number(),
    severity: severitySchema,
    factors: z.array(z.string()),
  }),
})

export const dashboardStatsSchema = z.object({
  total_sessions: z.number(),
  active_sessions: z.number(),
  alerts_today: z.number(),
  malicious_ips: z.number(),
  threat_breakdown: z.record(mlLabelSchema, z.number()),
  avg_risk_score: z.number(),
  top_threats: z.array(
    z.object({
      ip: z.string(),
      risk_score: z.number(),
      hit_count: z.number(),
      severity: severitySchema,
      country: z.string(),
    }),
  ),
})
