import { useState } from 'react'
import ReactMarkdown from 'react-markdown'

function IOCInvestigation() {
  const [ip, setIp] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleInvestigate = async () => {
    setLoading(true)
    setResult(null)

    try {
      const response = await fetch(`http://127.0.0.1:8000/investigate/ip/${ip}`)
      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error('Investigation failed:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#e6edf3]">IOC Investigation</h1>
        <p className="text-[#8b949e] mt-1">
          Look up an IP address across threat intelligence sources
        </p>
      </div>

      <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5 flex gap-3">
        <input
          type="text"
          value={ip}
          onChange={(e) => setIp(e.target.value)}
          placeholder="Enter an IP address (e.g. 8.8.8.8)"
          className="flex-1 bg-[#0d1117] border border-[#30363d] rounded-lg px-4 py-2.5 text-[#e6edf3] placeholder-[#8b949e] focus:outline-none focus:border-[#22d3ee] transition-colors"
        />
        <button
          onClick={handleInvestigate}
          disabled={loading || !ip}
          className="bg-[#22d3ee] text-[#0d1117] font-semibold px-6 py-2.5 rounded-lg hover:bg-[#67e8f9] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Investigating...' : 'Investigate'}
        </button>
      </div>

      {result && (
        <div className="mt-6 bg-[#161b22] border border-[#30363d] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-[#22d3ee] mb-4">AI Summary</h2>
          <div className="prose prose-invert prose-sm max-w-none text-[#e6edf3]">
            <ReactMarkdown>{result.ai_summary}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  )
}

export default IOCInvestigation