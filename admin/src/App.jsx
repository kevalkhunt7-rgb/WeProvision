import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import ServicesManager from './pages/ServicesManager';
import PortfolioManager from './pages/PortfolioManager';
import CareersManager from './pages/CareersManager';
import InquiriesManager from './pages/InquiriesManager';

const App = () => {
  return (
    <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#0f172a',
            color: '#f8fafc',
            border: '1px solid #334155',
            borderRadius: '12px',
            fontSize: '13px',
            fontWeight: '600',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
          },
          success: {
            iconTheme: {
              primary: '#a855f7',
              secondary: '#ffffff',
            },
          },
          error: {
            iconTheme: {
              primary: '#f43f5e',
              secondary: '#ffffff',
            },
          },
        }}
      />
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Admin Routes */}
        <Route element={<ProtectedRoute />}>
          <Route
            path="/*"
            element={
              <Layout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/services" element={<ServicesManager />} />
                  <Route path="/portfolio" element={<PortfolioManager />} />
                  <Route path="/careers" element={<CareersManager />} />
                  <Route path="/inquiries" element={<InquiriesManager />} />
                </Routes>
              </Layout>
            }
          />
        </Route>
      </Routes>
    </AuthProvider>
  );
};

export default App;
