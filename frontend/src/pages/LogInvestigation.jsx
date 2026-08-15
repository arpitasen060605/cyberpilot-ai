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
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#e6edf3]">Log Investigation</h1>
        <p className="text-[#8b949e] mt-1">
          Upload a log file for AI-powered threat analysis
        </p>
      </div>

      <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5 flex gap-3 items-center">
        <label className="flex-1 flex items-center bg-[#0d1117] border border-[#30363d] rounded-lg px-4 py-2.5 text-[#8b949e] cursor-pointer hover:border-[#22d3ee] transition-colors">
          <input
            type="file"
            onChange={(e) => setSelectedFile(e.target.files[0])}
            className="hidden"
          />
          <span className="text-[#22d3ee] mr-2">Choose File</span>
          <span className="truncate">
            {selectedFile ? selectedFile.name : 'No file selected'}
          </span>
        </label>
        <button
          onClick={handleInvestigate}
          disabled={loading || !selectedFile}
          className="bg-[#22d3ee] text-[#0d1117] font-semibold px-6 py-2.5 rounded-lg hover:bg-[#67e8f9] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Analyzing...' : 'Analyze'}
        </button>
      </div>

      {result && (
        <div className="mt-6 space-y-6">
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6">
            <h2 className="text-lg font-semibold text-[#22d3ee] mb-4">Log Analysis</h2>
            <div className="prose prose-invert prose-sm max-w-none text-[#e6edf3]">
              <ReactMarkdown>{result.log_analysis}</ReactMarkdown>
            </div>
          </div>

          <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6">
            <h2 className="text-lg font-semibold text-[#22d3ee] mb-4">MITRE ATT&CK Mapping</h2>
            <div className="prose prose-invert prose-sm max-w-none text-[#e6edf3]">
              <ReactMarkdown>{result.mitre_mapping}</ReactMarkdown>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LogInvestigation