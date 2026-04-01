'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from 'react-simple-maps'
import { useWebSocket } from '@/hooks/useWebSocket'
import { WS_URL, SEVERITY_COLORS } from '@/lib/constants'
import type { SessionAlert, WSEvent } from '@/types'

type Dot = {
  id: string
  ip: string
  risk_score: number
  severity: SessionAlert['risk']['severity']
  country: string
  lastSeen: string
  coordinates: [number, number]
}

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

function seededCoords(seed: string): [number, number] {
  const hash = seed.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  const lng = ((hash * 13) % 330) - 165
  const lat = ((hash * 7) % 120) - 60
  return [lng, lat]
}

export default function ThreatMap() {
  const [dots, setDots] = useState<Dot[]>([])
  const [hovered, setHovered] = useState<Dot | null>(null)

  const onMessage = useCallback((event: WSEvent) => {
    if (event.type !== 'session_scored' && event.type !== 'alert_created') return
    const payload = event.payload as SessionAlert
    if (payload.risk.severity === 'Low') return

    const dot: Dot = {
      id: payload.id,
      ip: payload.src_ip,
      risk_score: payload.risk.score,
      severity: payload.risk.severity,
      country: payload.cti?.country_code ?? 'N/A',
      lastSeen: payload.timestamp,
      coordinates: seededCoords(payload.src_ip),
    }

    setDots((prev) => [dot, ...prev].slice(0, 300))
  }, [])

  const { close } = useWebSocket({ url: WS_URL, onMessage })

  useEffect(() => {
    return () => close()
  }, [close])

  const countries = useMemo(() => new Set(dots.map((dot) => dot.country)).size, [dots])

  return (
    <div className='relative rounded-xl border border-border bg-surface p-4'>
      <div className='mb-4 rounded-lg border border-border bg-elevated px-3 py-2 text-sm text-muted'>
        {dots.length} malicious IPs detected across {countries} countries
      </div>
      <div className='relative h-[520px] overflow-hidden rounded-lg border border-border'>
        <ComposableMap projectionConfig={{ scale: 145 }}>
          <ZoomableGroup>
            <Geographies geography={GEO_URL}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill='var(--bg-elevated)'
                    stroke='var(--border)'
                    strokeWidth={0.3}
                  />
                ))
              }
            </Geographies>
            {dots.map((dot) => {
              const color = SEVERITY_COLORS[dot.severity]
              const radius = 3 + (dot.risk_score / 100) * 6
              return (
                <Marker key={dot.id} coordinates={dot.coordinates}>
                  <circle
                    r={radius}
                    fill={`${color}cc`}
                    stroke={color}
                    strokeWidth={1}
                    onMouseEnter={() => setHovered(dot)}
                    onMouseLeave={() => setHovered(null)}
                  />
                </Marker>
              )
            })}
          </ZoomableGroup>
        </ComposableMap>

        {hovered ? (
          <div className='pointer-events-none absolute left-4 top-4 rounded-lg border border-border bg-elevated p-2 text-xs'>
            <p className='font-mono text-primary'>{hovered.ip}</p>
            <p>Abuse score: {hovered.risk_score}</p>
            <p>Country: {hovered.country}</p>
            <p className='text-muted'>Last seen: {new Date(hovered.lastSeen).toLocaleString()}</p>
          </div>
        ) : null}
      </div>
    </div>
  )
}
