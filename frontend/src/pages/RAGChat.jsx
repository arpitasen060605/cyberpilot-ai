import { useState } from 'react'
import ReactMarkdown from 'react-markdown'

function RAGChat() {
  const [question, setQuestion] = useState('')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)

  const handleAsk = async () => {
    if (!question.trim()) return

    const currentQuestion = question
    setQuestion('')
    setLoading(true)

    setMessages((prev) => [...prev, { role: 'user', text: currentQuestion }])

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/chat?question=${encodeURIComponent(currentQuestion)}`,
        { method: 'POST' }
      )
      const data = await response.json()
      setMessages((prev) => [...prev, { role: 'assistant', text: data.answer }])
    } catch (error) {
      console.error('Chat failed:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#e6edf3]">Threat Intelligence Chat</h1>
        <p className="text-[#8b949e] mt-1">
          Ask about MITRE techniques, attack patterns, and detection methods
        </p>
      </div>

      <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5 min-h-[400px] flex flex-col">
        <div className="flex-1 space-y-4 mb-4">
          {messages.length === 0 && (
            <p className="text-[#8b949e] text-sm">
              No messages yet — ask a question to get started.
            </p>
          )}

          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-3 ${
                  msg.role === 'user'
                    ? 'bg-[#0e7490] text-white'
                    : 'bg-[#0d1117] border border-[#30363d] text-[#e6edf3]'
                }`}
              >
                <div className="prose prose-invert prose-sm max-w-none">
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
            placeholder="Ask about threats, MITRE techniques, detection methods..."
            className="flex-1 bg-[#0d1117] border border-[#30363d] rounded-lg px-4 py-2.5 text-[#e6edf3] placeholder-[#8b949e] focus:outline-none focus:border-[#22d3ee] transition-colors"
          />
          <button
            onClick={handleAsk}
            disabled={loading}
            className="bg-[#22d3ee] text-[#0d1117] font-semibold px-6 py-2.5 rounded-lg hover:bg-[#67e8f9] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? '...' : 'Ask'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default RAGChat