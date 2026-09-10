import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './Pages/Home'
import LoadingScreen from './components/LoadingScreen'
import Navbar from './components/Navbar'
import GameDevelopment from './Pages/GameDevelopment'
import WebDevelopment from './Pages/WebDevelopment'
import ThreeDModeling from './Pages/ThreeDModeling'
import VRDevelopmentPage from './Pages/VRDevelopmentPage'
import GraphicsDesigningPage from './Pages/GraphicsDesigningPage'
import About from './Pages/About'
import Contact from './Pages/Contact'
import Careers from './Pages/Careers'
import Portfolio from './Pages/Portfolio'
import ScrollToTop from './components/ScrollToTop'
import ServiceUnavailable from './components/ServiceUnavailable'
import CustomCursor from './components/CustomCursor'
import { useServices } from './context/ServicesContext'
import { useMaintenance } from './context/MaintenanceContext'
import UnderMaintenance from './Pages/UnderMaintenance'
import { Toaster } from 'react-hot-toast'

const ServiceRoute = ({ serviceId, title, component: Component }) => {
  const { isServiceActive } = useServices();
  if (!isServiceActive(serviceId)) {
    return <ServiceUnavailable title={title} />;
  }
  return <Component />;
};

const App = () => {
  const { isMaintenanceMode } = useMaintenance();

  if (isMaintenanceMode) {
    return (
      <>
        <CustomCursor />
        <UnderMaintenance />
      </>
    );
  }

  return (
    <>
      <CustomCursor />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#090d16',
            color: '#ffffff',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '12px',
            fontSize: '13px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.8)',
          },
        }}
      />
      <LoadingScreen />
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/services/game-development" element={<ServiceRoute serviceId="game-dev" title="Game Development" component={GameDevelopment} />} />
        <Route path="/services/web-development" element={<ServiceRoute serviceId="web-dev" title="Web Development" component={WebDevelopment} />} />
        <Route path="/services/3d-modeling" element={<ServiceRoute serviceId="3d-modeling" title="3D Modeling" component={ThreeDModeling} />} />
        <Route path="/services/vr-development" element={<ServiceRoute serviceId="vr-dev" title="VR & Spatial Computing" component={VRDevelopmentPage} />} />
        <Route path="/services/graphics-designing" element={<ServiceRoute serviceId="graphics-designing" title="Graphics & Branding" component={GraphicsDesigningPage} />} />
      </Routes>
    </>
  )
}

export default App