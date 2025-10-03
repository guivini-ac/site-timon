import TermsOfUsePage from './TermsOfUsePage';
import PrivacyPolicyPage from './PrivacyPolicyPage';
import SitemapPage from './SitemapPage';
import HeroSection from './HeroSection';
import MainSections from './MainSections';
import GalleryPage from './GalleryPage';
import AgendaPage from './AgendaPage';
import NewsPage from './NewsPage';
import ServicesPage from './ServicesPage';
import HistoryPage from './HistoryPage';
import MayorPage from './MayorPage';
import SecretariesPage from './SecretariesPage';
import OrganogramPage from './OrganogramPage';
import AnthemPage from './AnthemPage';
import SymbolsPage from './SymbolsPage';
import GeneralDataPage from './GeneralDataPage';
import TouristAttractionsPage from './TouristAttractionsPage';
import LoginPage from './LoginPage';
import AdminPage from './AdminPage';
import CustomPageView from './CustomPageView';
import FormPage from './FormPage';
import ForgotPasswordPage from './ForgotPasswordPage';
import { PageType } from '../utils/constants';
import { NavigationState, NavigationHandlers } from '../hooks/useNavigation';

interface AppRouterProps extends NavigationState, NavigationHandlers {}

export default function AppRouter({
  currentPage,
  selectedNewsId,
  selectedAlbumId,
  customPageSlug,
  formSlug,
  navigateToHome,
  navigateToGallery,
  navigateToAgenda,
  navigateToNews,
  navigateToServices,
  navigateToHistory,
  navigateToMayor,
  navigateToSecretaries,
  navigateToOrganogram,
  navigateToAnthem,
  navigateToSymbols,
  navigateToGeneralData,
  navigateToTouristAttractions,
  navigateToLogin,
  navigateToAdmin,
  navigateToCustomPage,
  navigateToForm,
  navigateToForgotPassword,
  handleSelectNews,
  handleSelectAlbum,
  handleLoginSuccess,
  handleLogout,
}: AppRouterProps) {
  const renderContent = () => {
    switch (currentPage) {
      case 'gallery':
        return (
          <GalleryPage 
            onNavigateBack={navigateToHome}
            selectedAlbumId={selectedAlbumId}
            onSelectAlbum={handleSelectAlbum}
          />
        );
      case 'agenda':
        return <AgendaPage onNavigateBack={navigateToHome} />;
      case 'news':
        return (
          <NewsPage 
            onNavigateBack={navigateToHome}
            selectedNewsId={selectedNewsId}
            onSelectNews={handleSelectNews}
          />
        );
      case 'services':
        return <ServicesPage onNavigateBack={navigateToHome} />;
      case 'history':
        return <HistoryPage onNavigateBack={navigateToHome} />;
      case 'mayor':
        return <MayorPage onNavigateBack={navigateToHome} />;
      case 'secretaries':
        return <SecretariesPage onNavigateBack={navigateToHome} />;
      case 'organogram':
        return <OrganogramPage onNavigateBack={navigateToHome} />;
      case 'anthem':
        return <AnthemPage onNavigateBack={navigateToHome} />;
      case 'symbols':
        return <SymbolsPage onNavigateBack={navigateToHome} />;
      case 'general-data':
        return <GeneralDataPage onNavigateBack={navigateToHome} />;
      case 'tourist-attractions':
        return <TouristAttractionsPage onNavigateBack={navigateToHome} />;
      case 'terms-of-use':
        return <TermsOfUsePage onNavigateBack={navigateToHome} />;
      case 'privacy-policy':
        return <PrivacyPolicyPage onNavigateBack={navigateToHome} />;
      case 'sitemap':
        return <SitemapPage />;
      case 'login':
        return (
          <LoginPage 
            onNavigateBack={navigateToHome}
            onLoginSuccess={handleLoginSuccess}
            onNavigate={(page) => {
              if (page === 'forgot-password') {
                navigateToForgotPassword();
              }
            }}
          />
        );
      case 'admin':
        return (
          <AdminPage 
            onNavigateBack={navigateToHome}
            onLogout={handleLogout}
          />
        );
      case 'custom-page':
        return (
          <CustomPageView 
            slug={customPageSlug}
            onNavigateBack={navigateToHome}
          />
        );
      case 'form':
        return (
          <FormPage 
            slug={formSlug}
            onNavigateBack={navigateToHome}
          />
        );
      case 'forgot-password':
        return (
          <ForgotPasswordPage 
            onBackToLogin={navigateToLogin}
          />
        );
      default:
        return (
          <>
            <HeroSection onNavigateToNews={navigateToNews} />
            <MainSections 
              onNavigateToGallery={navigateToGallery}
              onNavigateToAgenda={navigateToAgenda}
              onNavigateToNews={navigateToNews}
              onNavigateToServices={navigateToServices}
            />
          </>
        );
    }
  };

  return <>{renderContent()}</>;
}