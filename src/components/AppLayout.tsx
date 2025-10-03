import React from 'react';
import Header from './Header';
import Footer from './Footer';
import AccessibilityBar from './AccessibilityBar';
import VLibras from './VLibras';
import AppRouter from './AppRouter';
import { NavigationState, NavigationHandlers } from '../hooks/useNavigation';
import { isAuthPage } from '../utils/constants';

interface AppLayoutProps extends NavigationState, NavigationHandlers {}

export default function AppLayout(props: AppLayoutProps) {
  const { currentPage, navigateToLogin, navigateToCustomPage } = props;
  const isAuth = isAuthPage(currentPage);

  return (
    <div className="min-h-screen bg-background">
      {!isAuth && <AccessibilityBar />}
      {!isAuth && (
        <Header 
          currentPage={currentPage}
          onNavigateToHome={props.navigateToHome}
          onNavigateToGallery={props.navigateToGallery}
          onNavigateToAgenda={props.navigateToAgenda}
          onNavigateToNews={props.navigateToNews}
          onNavigateToHistory={props.navigateToHistory}
          onNavigateToMayor={props.navigateToMayor}
          onNavigateToSecretaries={props.navigateToSecretaries}
          onNavigateToOrganogram={props.navigateToOrganogram}
          onNavigateToAnthem={props.navigateToAnthem}
          onNavigateToSymbols={props.navigateToSymbols}
          onNavigateToGeneralData={props.navigateToGeneralData}
          onNavigateToTouristAttractions={props.navigateToTouristAttractions}
          onNavigateToCustomPage={navigateToCustomPage}
        />
      )}
      <main 
        id="main-content"
        tabIndex={-1}
        role="main"
        aria-label="Conteúdo principal"
      >
        <AppRouter {...props} />
      </main>
      {!isAuth && <Footer onNavigateToAdmin={navigateToLogin} />}
      {!isAuth && <VLibras />}
    </div>
  );
}