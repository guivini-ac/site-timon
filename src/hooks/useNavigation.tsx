import { useState, useEffect } from 'react';
import { PageType } from '../utils/constants';

export interface NavigationState {
  currentPage: PageType;
  selectedNewsId: number | null;
  selectedAlbumId: string | null;
  customPageSlug: string;
  formSlug: string;
}

export interface NavigationHandlers {
  navigateToHome: () => void;
  navigateToGallery: () => void;
  navigateToAgenda: () => void;
  navigateToNews: (newsId?: number) => void;
  navigateToServices: () => void;
  navigateToHistory: () => void;
  navigateToMayor: () => void;
  navigateToSecretaries: () => void;
  navigateToOrganogram: () => void;
  navigateToAnthem: () => void;
  navigateToSymbols: () => void;
  navigateToGeneralData: () => void;
  navigateToTouristAttractions: () => void;
  navigateToLogin: () => void;
  navigateToAdmin: () => void;
  navigateToCustomPage: (slug: string) => void;
  navigateToForm: (slug: string) => void;
  navigateToTermsOfUse: () => void;
  navigateToPrivacyPolicy: () => void;
  navigateToSitemap: () => void;
  navigateToForgotPassword: () => void;
  handleSelectNews: (newsId: number | null) => void;
  handleSelectAlbum: (albumId: string | null) => void;
  handleLoginSuccess: () => void;
  handleLogout: () => void;
}

export function useNavigation(): NavigationState & NavigationHandlers {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [selectedNewsId, setSelectedNewsId] = useState<number | null>(null);
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);
  const [customPageSlug, setCustomPageSlug] = useState<string>('');
  const [formSlug, setFormSlug] = useState<string>('');

  const navigateToHome = () => {
    setCurrentPage('home');
    setSelectedNewsId(null);
    setSelectedAlbumId(null);
  };

  const navigateToGallery = () => {
    setCurrentPage('gallery');
    setSelectedAlbumId(null);
  };

  const navigateToAgenda = () => {
    setCurrentPage('agenda');
  };

  const navigateToNews = (newsId?: number) => {
    setCurrentPage('news');
    setSelectedNewsId(newsId || null);
  };

  const navigateToServices = () => {
    setCurrentPage('services');
  };

  const navigateToHistory = () => {
    setCurrentPage('history');
  };

  const navigateToMayor = () => {
    setCurrentPage('mayor');
  };

  const navigateToSecretaries = () => {
    setCurrentPage('secretaries');
  };

  const navigateToOrganogram = () => {
    setCurrentPage('organogram');
  };

  const navigateToAnthem = () => {
    setCurrentPage('anthem');
  };

  const navigateToSymbols = () => {
    setCurrentPage('symbols');
  };

  const navigateToGeneralData = () => {
    setCurrentPage('general-data');
  };

  const navigateToTouristAttractions = () => {
    setCurrentPage('tourist-attractions');
  };

  const navigateToLogin = () => {
    setCurrentPage('login');
  };

  const navigateToAdmin = () => {
    setCurrentPage('admin');
  };

  const navigateToCustomPage = (slug: string) => {
    setCurrentPage('custom-page');
    setCustomPageSlug(slug);
  };

  const navigateToForm = (slug: string) => {
    setCurrentPage('form');
    setFormSlug(slug);
  };

  const navigateToTermsOfUse = () => {
    setCurrentPage('terms-of-use');
  };

  const navigateToPrivacyPolicy = () => {
    setCurrentPage('privacy-policy');
  };

  const navigateToSitemap = () => {
    setCurrentPage('sitemap');
  };

  const navigateToForgotPassword = () => {
    setCurrentPage('forgot-password');
  };

  const handleSelectNews = (newsId: number | null) => {
    setSelectedNewsId(newsId);
    setCurrentPage('news');
  };

  const handleSelectAlbum = (albumId: string | null) => {
    setSelectedAlbumId(albumId);
    setCurrentPage('gallery');
  };

  const handleLoginSuccess = () => {
    setCurrentPage('admin');
  };

  const handleLogout = () => {
    setCurrentPage('home');
  };

  // Event listener for custom navigation events
  useEffect(() => {
    const handleNavigate = (event: CustomEvent) => {
      const { page, slug, newsId, albumId } = event.detail;
      
      switch (page) {
        case 'home':
          navigateToHome();
          break;
        case 'gallery':
          navigateToGallery();
          break;
        case 'agenda':
          navigateToAgenda();
          break;
        case 'news':
          if (newsId) {
            handleSelectNews(newsId);
          } else {
            navigateToNews();
          }
          break;
        case 'services':
          navigateToServices();
          break;
        case 'history':
          navigateToHistory();
          break;
        case 'mayor':
          navigateToMayor();
          break;
        case 'secretaries':
          navigateToSecretaries();
          break;
        case 'organogram':
          navigateToOrganogram();
          break;
        case 'anthem':
          navigateToAnthem();
          break;
        case 'symbols':
          navigateToSymbols();
          break;
        case 'general-data':
          navigateToGeneralData();
          break;
        case 'tourist-attractions':
          navigateToTouristAttractions();
          break;
        case 'login':
          navigateToLogin();
          break;
        case 'admin':
          navigateToAdmin();
          break;
        case 'custom-page':
          if (slug) {
            navigateToCustomPage(slug);
          }
          break;
        case 'form':
          if (slug) {
            navigateToForm(slug);
          }
          break;
        case 'terms-of-use':
          navigateToTermsOfUse();
          break;
        case 'privacy-policy':
          navigateToPrivacyPolicy();
          break;
        case 'sitemap':
          navigateToSitemap();
          break;
        case 'forgot-password':
          navigateToForgotPassword();
          break;
        default:
          break;
      }
    };

    window.addEventListener('navigate', handleNavigate as EventListener);

    return () => {
      window.removeEventListener('navigate', handleNavigate as EventListener);
    };
  }, [handleSelectNews, handleSelectAlbum]);

  return {
    // State
    currentPage,
    selectedNewsId,
    selectedAlbumId,
    customPageSlug,
    formSlug,
    
    // Handlers
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
    navigateToTermsOfUse,
    navigateToPrivacyPolicy,
    navigateToSitemap,
    navigateToForgotPassword,
    handleSelectNews,
    handleSelectAlbum,
    handleLoginSuccess,
    handleLogout,
  };
}