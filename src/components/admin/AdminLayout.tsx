import { useEffect } from 'react';
import { Toaster } from '../ui/sonner';
import { AdminProvider, useAdmin } from './AdminContext';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { AdminContent } from './AdminContent';
import { AdminNotifications } from './AdminNotifications';
import { cn } from '../ui/utils';

interface AdminLayoutProps {
  onNavigateBack: () => void;
  onLogout: () => void;
}

function AdminLayoutInner({ onNavigateBack, onLogout }: AdminLayoutProps) {
  const { sidebarOpen, setSidebarOpen, sidebarCollapsed } = useAdmin();

  // Gerenciar redimensionamento da tela
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 1024;
      if (isMobile) {
        // Em mobile, fechar sidebar
        setSidebarOpen(false);
      } else {
        // Em desktop, abrir sidebar
        setSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setSidebarOpen]);

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900 flex overflow-hidden">
      {/* Sidebar - Fixo à esquerda */}
      <AdminSidebar onLogout={onLogout} />
      
      {/* Overlay para mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Conteúdo Principal - Área de scroll independente */}
      <div className={cn(
        "flex-1 flex flex-col min-w-0 overflow-hidden transition-all duration-300",
        // Em mobile: sem margem (sidebar é overlay)
        "ml-0",
        // Em desktop: margem baseada no estado collapsed/expanded da sidebar
        sidebarCollapsed ? "lg:ml-16" : "lg:ml-72"
      )}>
        {/* Breadcrumb + Header - Fixo no topo */}
        <div className="flex-shrink-0">
          <AdminHeader onNavigateBack={onNavigateBack} />
        </div>
        
        {/* Conteúdo - Área de scroll principal */}
        <div className="flex-1 overflow-y-auto">
          <AdminContent />
        </div>
      </div>

      {/* Sistema de Notificações */}
      <AdminNotifications />
      <Toaster richColors closeButton />
    </div>
  );
}

export function AdminLayout(props: AdminLayoutProps) {
  return (
    <AdminProvider>
      <AdminLayoutInner {...props} />
    </AdminProvider>
  );
}