import React, { createContext, useContext, useState, useEffect } from 'react';

const MaintenanceContext = createContext();

export const MaintenanceProvider = ({ children }) => {
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchMaintenanceStatus = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/settings');
      const json = await res.json();
      if (json.success && json.settings?.maintenanceMode !== undefined) {
        setIsMaintenanceMode(Boolean(json.settings.maintenanceMode));
      }
    } catch (err) {
      console.warn('[MaintenanceContext] Could not fetch settings:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaintenanceStatus();
    // Poll status every 3 seconds for instant updates when admin toggles maintenance mode
    const interval = setInterval(fetchMaintenanceStatus, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <MaintenanceContext.Provider
      value={{
        isMaintenanceMode,
        loading,
        refreshMaintenance: fetchMaintenanceStatus,
      }}
    >
      {children}
    </MaintenanceContext.Provider>
  );
};

export const useMaintenance = () => {
  const context = useContext(MaintenanceContext);
  if (!context) {
    return {
      isMaintenanceMode: false,
      loading: false,
      refreshMaintenance: () => {},
    };
  }
  return context;
};
