import { SeverityBadge } from '@/components/shared/SeverityBadge'
import type { DashboardStats } from '@/types'

export function TopThreats({ threats }: { threats: DashboardStats['top_threats'] }) {
  return (
    <div className='rounded-xl border border-border bg-surface p-4'>
      <h3 className='mb-3 text-sm font-semibold text-primary'>Top Threats</h3>
      <table className='w-full text-left text-xs'>
        <thead>
          <tr className='text-muted'>
            <th scope='col' className='py-2'>Rank</th>
            <th scope='col' className='py-2'>IP</th>
            <th scope='col' className='py-2'>Country</th>
            <th scope='col' className='py-2'>Hit Count</th>
            <th scope='col' className='py-2'>Risk</th>
            <th scope='col' className='py-2'>Severity</th>
          </tr>
        </thead>
        <tbody>
          {threats.slice(0, 5).map((threat, index) => (
            <tr key={threat.ip} className='border-t border-border transition-colors duration-100 hover:bg-elevated'>
              <td className='py-2'>{index + 1}</td>
              <td className='py-2 font-mono'>{threat.ip}</td>
              <td className='py-2'>{threat.country}</td>
              <td className='py-2'>{threat.hit_count}</td>
              <td className='py-2'>{threat.risk_score}</td>
              <td className='py-2'>
                <SeverityBadge severity={threat.severity} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
