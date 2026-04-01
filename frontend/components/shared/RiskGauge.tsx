import { getSeverityFromScore } from '@/lib/utils'
import { SEVERITY_COLORS } from '@/lib/constants'

type RiskGaugeProps = {
  score: number
  size?: number
}

export function RiskGauge({ score, size = 60 }: RiskGaugeProps) {
  const clamped = Math.max(0, Math.min(100, score))
  const severity = getSeverityFromScore(clamped)
  const stroke = 6
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (clamped / 100) * circumference

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role='img'
      aria-label={`Risk score: ${Math.round(clamped)} out of 100`}
    >
      <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill='transparent'
          stroke='var(--border)'
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill='transparent'
          stroke={SEVERITY_COLORS[severity]}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap='round'
        />
      </g>
      <text
        x='50%'
        y='50%'
        dominantBaseline='middle'
        textAnchor='middle'
        className='fill-primary font-mono font-bold text-[14px]'
      >
        {Math.round(clamped)}
      </text>
    </svg>
  )
}
