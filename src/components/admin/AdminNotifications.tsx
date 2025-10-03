import { useEffect } from 'react';
import { toast } from 'sonner@2.0.3';
import { useAdmin } from './AdminContext';

export function AdminNotifications() {
  const { notifications } = useAdmin();

  useEffect(() => {
    // Apenas mostrar as notificações mais recentes (últimos 5 segundos)
    const recentNotifications = notifications.filter(
      notification => Date.now() - notification.timestamp.getTime() < 5000
    );

    recentNotifications.forEach(notification => {
      const toastConfig = {
        description: notification.message,
        action: notification.action ? {
          label: notification.action.label,
          onClick: notification.action.onClick
        } : undefined
      };

      switch (notification.type) {
        case 'success':
          toast.success(notification.title, toastConfig);
          break;
        case 'error':
          toast.error(notification.title, toastConfig);
          break;
        case 'warning':
          toast.warning(notification.title, toastConfig);
          break;
        case 'info':
        default:
          toast.info(notification.title, toastConfig);
          break;
      }
    });
  }, [notifications]);

  return null; // Este componente não renderiza nada visualmente
}