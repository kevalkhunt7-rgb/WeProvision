import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 antialiased selection:bg-purple-500 selection:text-white">
      <Sidebar 
        isCollapsed={isCollapsed} 
        toggleSidebar={() => setIsCollapsed(!isCollapsed)} 
        mobileOpen={mobileOpen}
        closeMobile={() => setMobileOpen(false)}
      />

      <Header 
        openMobile={() => setMobileOpen(true)} 
        isCollapsed={isCollapsed}
      />

      <main className={`min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8 transition-all duration-300 ${isCollapsed ? 'lg:pl-24' : 'lg:pl-68'}`}>
        <div className="mx-auto max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
