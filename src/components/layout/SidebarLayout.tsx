import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';

interface SidebarLayoutProps {
  children: React.ReactNode;
}

const SidebarLayout: React.FC<SidebarLayoutProps> = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { user, loading } = useAuth();

  if (loading || !user || !user.role) {
    return <div style={{height: '100vh'}} className="d-flex justify-content-center align-items-center"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Chargement...</span></div></div>;
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fa' }}>
      <div style={{
        width: isSidebarCollapsed ? 60 : 250,
        transition: 'width 0.3s',
        background: '#2c3e50',
        minHeight: '100vh',
        overflow: 'auto'
      }}>
        <Sidebar
          user={user}
          isCollapsed={isSidebarCollapsed}
          onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
      </div>
      <main style={{
        flex: 1,
        padding: 24,
        minHeight: '100vh',
        background: '#f8f9fa',
        overflow: 'auto'
      }}>
        {children}
      </main>
    </div>
  );
};

export default SidebarLayout; 