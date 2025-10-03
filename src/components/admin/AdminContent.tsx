import { useAdmin } from './AdminContext';
import { DashboardView } from './views/DashboardView';
import { CarouselView } from './views/CarouselView';
import { PostsView } from './views/PostsView';
import { PagesView } from './views/PagesView';
import { MediaView } from './views/MediaView';
import { UsersView } from './views/UsersView';
import { SettingsView } from './views/SettingsView';
import { CategoriesView } from './views/CategoriesView';
import { TagsView } from './views/TagsView';

import { PermissionsView } from './views/PermissionsView';
import { SeoView } from './views/SeoView';
import { AppearanceView } from './views/AppearanceView';

import { FormsView } from './views/FormsView';
import { FormSubmissionsView } from './views/FormSubmissionsView';
import { EventsView } from './views/EventsView';
import { ServicesView } from './views/ServicesView';
import { SecretariasView } from './views/SecretariasView';
import { TouristAttractionsView } from './views/TouristAttractionsView';
import { GalleryView } from './views/GalleryView';
import ProfileView from './views/ProfileView';
import MyPermissionsView from './views/MyPermissionsView';
import { EmptyState } from './components/EmptyState';

const CommentsView = () => (
  <EmptyState
    title="Comentários"
    description="Modere comentários e interações dos usuários"
    icon="MessageSquare"
    actionLabel="Ver Comentários Pendentes"
    onAction={() => console.log('Ver comentários')}
  />
);

export function AdminContent() {
  const { currentView, isLoading } = useAdmin();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView />;
      case 'slides':
        return <CarouselView />;
      case 'posts':
        return <PostsView />;
      case 'pages':
        return <PagesView />;
      case 'events':
        return <EventsView />;
      case 'services':
        return <ServicesView />;
      case 'secretarias':
        return <SecretariasView />;
      case 'tourist-attractions':
        return <TouristAttractionsView />;
      case 'media':
        return <MediaView />;
      case 'gallery':
        return <GalleryView />;
      case 'categories':
        return <CategoriesView />;
      case 'tags':
        return <TagsView />;
      case 'forms':
        return <FormsView />;
      case 'form-submissions':
        return <FormSubmissionsView />;
      case 'users':
        return <UsersView />;
      case 'permissions':
        return <PermissionsView />;
      case 'my-permissions':
        return <MyPermissionsView />;
      case 'settings':
        return <SettingsView />;
      case 'profile':
        return <ProfileView />;
      case 'seo':
        return <SeoView />;
      case 'appearance':
        return <AppearanceView />;
      case 'comments':
        return <CommentsView />;
      default:
        return (
          <EmptyState
            title="Página não encontrada"
            description="A página solicitada não foi encontrada"
            icon="AlertCircle"
            actionLabel="Voltar ao Dashboard"
            onAction={() => window.location.reload()}
          />
        );
    }
  };

  return (
    <div className="p-6">
      {renderView()}
    </div>
  );
}