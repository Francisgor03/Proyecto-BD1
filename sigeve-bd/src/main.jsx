import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Customers from './pages/customers.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
     {/* <App /> */}
     <Customers />
  </StrictMode>,
)
