import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// StrictMode removed to prevent double useEffect execution
// which causes duplicate ISS API calls and rate limiting
createRoot(document.getElementById('root')).render(
  <App />,
)
