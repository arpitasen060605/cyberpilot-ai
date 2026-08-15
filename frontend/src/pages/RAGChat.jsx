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
        `http://127.0.0.1:8000/chat?question=${encodeURIComponent(currentQuestion)}`,
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
    <div>
      <h1>Threat Intelligence Chat</h1>

      <div>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.role === 'user' ? 'You' : 'AI'}:</strong>
            <ReactMarkdown>{msg.text}</ReactMarkdown>
          </div>
        ))}
      </div>

      <input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask about threats, MITRE techniques, detection methods..."
      />

      <button onClick={handleAsk} disabled={loading}>
        {loading ? 'Thinking...' : 'Ask'}
      </button>
    </div>
  )
}

export default RAGChat