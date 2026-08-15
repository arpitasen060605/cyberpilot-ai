import { Link, useLocation } from 'react-router-dom'

const navItems = [
  { path: '/', label: 'IOC Investigation' },
  { path: '/cve', label: 'CVE Explainer' },
  { path: '/log', label: 'Log Investigation' },
  { path: '/chat', label: 'Threat Intel Chat' },
]

function Sidebar() {
  const location = useLocation()

  return (
    <nav className="w-64 h-screen bg-[#0d1117] border-r border-[#30363d] flex flex-col fixed left-0 top-0">
      <div className="px-6 py-6 border-b border-[#30363d]">
        <h1 className="text-xl font-bold text-[#e6edf3]">
          CyberPilot <span className="text-[#22d3ee]">AI</span>
        </h1>
        <p className="text-xs text-[#8b949e] mt-1">SOC Analyst Assistant</p>
      </div>

      <ul className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-[#1c2128] text-[#22d3ee] border-l-2 border-[#22d3ee]'
                    : 'text-[#8b949e] hover:bg-[#161b22] hover:text-[#e6edf3]'
                }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default Sidebar