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
      const response = await fetch(`http://127.0.0.1:8000/cve/${cveId}`)
      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error('CVE lookup failed:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1>CVE Explainer</h1>

      <input
        type="text"
        value={cveId}
        onChange={(e) => setCveId(e.target.value)}
        placeholder="CVE-2021-44228"
      />

      <button onClick={handleExplain} disabled={loading}>
        {loading ? 'Explaining...' : 'Explain'}
      </button>

      {result && (
        <div>
          <h2>AI Explanation</h2>
          <ReactMarkdown>{result.ai_explanation}</ReactMarkdown>
        </div>
      )}
    </div>
  )
}

export default CVEExplainer