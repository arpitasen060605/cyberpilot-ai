import { useState, useEffect } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { Link } from 'react-router-dom'

const COLORS = {
  malicious: '#f87171',
  suspicious: '#fbbf24',
  benign: '#4ade80',
}

function Dashboard() {
  const [stats, setStats] = useState(null)
  const [investigations, setInvestigations] = useState([])

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/stats`)
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.error('Failed to load stats:', err))

    fetch(`${import.meta.env.VITE_API_URL}/investigations`)
      .then((res) => res.json())
      .then((data) => setInvestigations(data.investigations.slice(0, 5)))
      .catch((err) => console.error('Failed to load investigations:', err))
  }, [])

  const chartData = stats
    ? [
        { name: 'Malicious', value: stats.malicious, color: COLORS.malicious },
        { name: 'Suspicious', value: stats.suspicious, color: COLORS.suspicious },
        { name: 'Benign', value: stats.benign, color: COLORS.benign },
      ]
    : []

  return (
    <div className="max-w-6xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#e6edf3]">Dashboard</h1>
        <p className="text-[#8b949e] mt-1">Overview of recent SOC activity</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Investigations" value={stats?.total_investigations ?? '—'} />
        <StatCard label="Malicious" value={stats?.malicious ?? '—'} color={COLORS.malicious} />
        <StatCard label="Suspicious" value={stats?.suspicious ?? '—'} color={COLORS.suspicious} />
        <StatCard label="Benign" value={stats?.benign ?? '—'} color={COLORS.benign} />
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Donut chart */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-[#e6edf3] mb-4">Verdict Distribution</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
              >
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#0d1117', border: '1px solid #30363d' }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Recent investigations */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-[#e6edf3] mb-4">Recent Investigations</h2>
          <div className="space-y-3">
            {investigations.length === 0 && (
              <p className="text-[#8b949e] text-sm">No investigations yet.</p>
            )}
            {investigations.map((inv, index) => (
              <div
                key={index}
                className="flex items-center justify-between border-b border-[#30363d] pb-2 last:border-0"
              >
                <span className="text-[#e6edf3] font-mono text-sm">{inv.ip_address}</span>
                <VerdictBadge verdict={inv.verdict} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Link
          to="/ioc"
          className="text-[#22d3ee] text-sm hover:underline"
        >
          Run a new investigation →
        </Link>
      </div>
    </div>
  )
}

function StatCard({ label, value, color }) {
  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5">
      <p className="text-[#8b949e] text-sm">{label}</p>
      <p
        className="text-3xl font-bold mt-2"
        style={{ color: color || '#e6edf3' }}
      >
        {value}
      </p>
    </div>
  )
}

function VerdictBadge({ verdict }) {
  const colors = {
    malicious: 'bg-red-500/10 text-red-400 border-red-500/30',
    suspicious: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    benign: 'bg-green-500/10 text-green-400 border-green-500/30',
  }
  const style = colors[verdict] || 'bg-gray-500/10 text-gray-400 border-gray-500/30'

  return (
    <span className={`text-xs px-2 py-1 rounded-full border ${style}`}>
      {verdict || 'unknown'}
    </span>
  )
}

export default Dashboard