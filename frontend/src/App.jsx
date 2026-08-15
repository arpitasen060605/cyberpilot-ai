import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import IOCInvestigation from './pages/IOCInvestigation'
import CVEExplainer from './pages/CVEExplainer'
import LogInvestigation from './pages/LogInvestigation'
import RAGChat from './pages/RAGChat'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#0d1117]">
        <Sidebar />
        <main className="ml-64 p-8">
          <Routes>
            <Route path="/" element={<IOCInvestigation />} />
            <Route path="/cve" element={<CVEExplainer />} />
            <Route path="/log" element={<LogInvestigation />} />
            <Route path="/chat" element={<RAGChat />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App