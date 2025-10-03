import { AdminLayout } from './admin/AdminLayout';

interface AdminPageProps {
  onNavigateBack: () => void;
  onLogout: () => void;
}

const AdminPage = ({ onNavigateBack, onLogout }: AdminPageProps) => {
  return <AdminLayout onNavigateBack={onNavigateBack} onLogout={onLogout} />;
};

export default AdminPage;