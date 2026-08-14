import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import IOCInvestigation from './pages/IOCInvestigation'
import CVEExplainer from './pages/CVEExplainer'
import LogInvestigation from './pages/LogInvestigation'
import RAGChat from './pages/RAGChat'

function App() {
  return (
    <BrowserRouter>
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <div style={{ flex: 1, padding: '20px' }}>
          <Routes>
            <Route path="/" element={<IOCInvestigation />} />
            <Route path="/cve" element={<CVEExplainer />} />
            <Route path="/log" element={<LogInvestigation />} />
            <Route path="/chat" element={<RAGChat />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App