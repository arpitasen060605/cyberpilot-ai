import { Link } from 'react-router-dom'

function Sidebar() {
  return (
    <nav>
      <h2>CyberPilot AI</h2>
      <ul>
        <li><Link to="/">IOC Investigation</Link></li>
        <li><Link to="/cve">CVE Explainer</Link></li>
        <li><Link to="/log">Log Investigation</Link></li>
        <li><Link to="/chat">Threat Intel Chat</Link></li>
      </ul>
    </nav>
  )
}

export default Sidebar