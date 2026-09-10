import React, { createContext, useContext, useState, useEffect } from 'react';

const ServicesContext = createContext();

export const ServicesProvider = ({ children }) => {
  const [servicesState, setServicesState] = useState({
    'game-dev': true,
    'web-dev': true,
    '3d-modeling': true,
    'vr-dev': true,
    'graphics-designing': true,
    'software-dev': true,
  });

  const [loading, setLoading] = useState(true);

  const fetchServices = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/services');
      const json = await res.json();
      const servicesList = json.data || json;

      if (Array.isArray(servicesList) && servicesList.length > 0) {
        const newState = {};
        servicesList.forEach((s) => {
          if (s.id) {
            const isActive = s.active !== false && s.status !== 'Inactive';
            newState[s.id] = isActive;
          }
        });
        setServicesState((prev) => ({ ...prev, ...newState }));
      }
    } catch (err) {
      console.warn('[ServicesContext] Could not fetch live service status:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
    const interval = setInterval(fetchServices, 8000);
    return () => clearInterval(interval);
  }, []);

  const isServiceActive = (serviceId) => {
    if (servicesState[serviceId] === undefined) return true;
    return servicesState[serviceId];
  };

  return (
    <ServicesContext.Provider value={{ servicesState, isServiceActive, loading, refreshServices: fetchServices }}>
      {children}
    </ServicesContext.Provider>
  );
};

export const useServices = () => {
  const context = useContext(ServicesContext);
  if (!context) {
    return {
      isServiceActive: () => true,
      servicesState: {},
      loading: false,
      refreshServices: () => {},
    };
  }
  return context;
};
