import { useState } from 'react'
import ReactMarkdown from 'react-markdown'

function LogInvestigation() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleInvestigate = async () => {
    if (!selectedFile) return

    setLoading(true)
    setResult(null)

    const formData = new FormData()
    formData.append('file', selectedFile)

    try {
      const response = await fetch('http://127.0.0.1:8000/investigate/log', {
        method: 'POST',
        body: formData
      })
      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error('Log investigation failed:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1>Log Investigation</h1>

      <input
        type="file"
        onChange={(e) => setSelectedFile(e.target.files[0])}
      />

      <button onClick={handleInvestigate} disabled={loading || !selectedFile}>
        {loading ? 'Analyzing...' : 'Analyze'}
      </button>

      {result && (
        <div>
          <h2>Log Analysis</h2>
          <ReactMarkdown>{result.log_analysis}</ReactMarkdown>

          <h2>MITRE ATT&CK Mapping</h2>
          <ReactMarkdown>{result.mitre_mapping}</ReactMarkdown>
        </div>
      )}
    </div>
  )
}

export default LogInvestigation