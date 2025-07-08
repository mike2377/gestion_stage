import React, { useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
  user?: any;
  onLogout?: () => void;
  showSidebar?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout, showSidebar = false }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Si l'utilisateur est connecté et que la sidebar est active, ne pas afficher navbar/footer
  const isAuthenticated = user && user.id;
  const shouldShowNavbarFooter = !isAuthenticated || !showSidebar;

  return (
    <div className="layout">
      {shouldShowNavbarFooter && <Navbar user={user} onLogout={onLogout} />}
      <div className="layout-content">
        {showSidebar && (
          <div className={`sidebar-container ${isSidebarCollapsed ? 'collapsed' : ''}`}>
            <Sidebar 
              user={user} 
              isCollapsed={isSidebarCollapsed}
              onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            />
          </div>
        )}
        <main className={`main-content ${showSidebar ? 'with-sidebar' : ''}`} 
              style={{ 
                paddingTop: shouldShowNavbarFooter ? '76px' : '0', 
                minHeight: shouldShowNavbarFooter ? 'calc(100vh - 76px)' : '100vh',
                marginLeft: showSidebar ? (isSidebarCollapsed ? '60px' : '250px') : '0'
              }}>
          {children}
        </main>
      </div>
      {shouldShowNavbarFooter && <Footer />}
    </div>
  );
};

export default Layout; 