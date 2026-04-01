export type Severity = 'Low' | 'Medium' | 'High' | 'Critical'
export type Protocol = 'TCP' | 'UDP' | 'ICMP' | 'OTHER'
export type MLLabel = 'Normal' | 'Suspicious' | 'Malicious'

export interface SessionAlert {
  id: string
  timestamp: string
  src_ip: string
  dst_ip: string
  src_port: number
  dst_port: number
  protocol: Protocol
  duration: number
  packet_count: number
  total_bytes: number
  ml: {
    label: MLLabel
    confidence: number
    probabilities: Record<MLLabel, number>
  }
  shap: Array<{
    feature: string
    value: number
    impact: number
  }>
  cti: {
    is_malicious: boolean
    abuse_confidence: number
    country_code: string
    isp: string
    usage_type: string
    last_reported?: string
  } | null
  risk: {
    score: number
    severity: Severity
    factors: string[]
  }
}

export interface DashboardStats {
  total_sessions: number
  active_sessions: number
  alerts_today: number
  malicious_ips: number
  threat_breakdown: Record<MLLabel, number>
  avg_risk_score: number
  top_threats: Array<{
    ip: string
    risk_score: number
    hit_count: number
    severity: Severity
    country: string
  }>
}

export type WSEventType = 'session_scored' | 'alert_created' | 'stats_update' | 'demo_status'

export interface WSEvent {
  type: WSEventType
  payload: SessionAlert | DashboardStats | { active: boolean; progress: number }
}

export interface SessionListResponse {
  data: SessionAlert[]
  total: number
  page: number
}
