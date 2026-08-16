import { useState } from 'react'
import ReactMarkdown from 'react-markdown'

function CVEExplainer() {
  const [cveId, setCveId] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleExplain = async () => {
    setLoading(true)
    setResult(null)

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/cve/${cveId}`)
      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error('CVE lookup failed:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl">
  <div className="mb-8">
    <h1 className="text-2xl font-bold text-[#e6edf3]">CVE Explainer</h1>
    <p className="text-[#8b949e] mt-1">
      Look up a CVE and get a plain-English breakdown
    </p>
  </div>

  <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5 flex gap-3">
    <input
      type="text"
      value={cveId}
      onChange={(e) => setCveId(e.target.value)}
      placeholder="CVE-2021-44228"
      className="flex-1 bg-[#0d1117] border border-[#30363d] rounded-lg px-4 py-2.5 text-[#e6edf3] placeholder-[#8b949e] focus:outline-none focus:border-[#22d3ee] transition-colors"
    />
    <button
      onClick={handleExplain}
      disabled={loading || !cveId}
      className="bg-[#22d3ee] text-[#0d1117] font-semibold px-6 py-2.5 rounded-lg hover:bg-[#67e8f9] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
    >
      {loading ? 'Explaining...' : 'Explain'}
    </button>
  </div>

  {result && (
        <div className="mt-6 bg-[#161b22] border border-[#30363d] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-[#22d3ee] mb-4">AI Explanation</h2>
          <div className="prose prose-invert prose-sm max-w-none text-[#e6edf3]">
            <ReactMarkdown>{result.ai_explanation}</ReactMarkdown>
          </div>
        </div>
      )}
</div>
  )
}

export default CVEExplainer