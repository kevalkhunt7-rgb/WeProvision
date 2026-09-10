import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { ServicesProvider } from './context/ServicesContext.jsx'
import { MaintenanceProvider } from './context/MaintenanceContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <MaintenanceProvider>
        <ServicesProvider>
          <App />
        </ServicesProvider>
      </MaintenanceProvider>
    </BrowserRouter>
  </StrictMode>,
)

