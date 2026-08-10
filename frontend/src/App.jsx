import {useState} from 'react'
function App(){
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
    }finally {
      setLoading(false)
    }
  }
  return (
    <div>
      <h1>CyberPilot AI</h1>

      <input
        type="text"
        value={ip}
        onChange={(e) => setIp(e.target.value)}
        placeholder="Enter an IP address"
      />

      <button onClick={handleInvestigate} disabled={loading}>
        {loading ? 'Investigating...' : 'Investigate'}
      </button>

      {result && (
        <div>
          <h2>AI Summary</h2>
          <p>{result.ai_summary}</p>
        </div>
      )}
    </div>
  )
}
export default App