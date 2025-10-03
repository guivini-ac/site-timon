import { useContext } from 'react';
import { AdminDataContext, NewsPost, Event, Service, GalleryAlbum, SlideData, SiteSettings, SeoSettings, AppearanceSettings, User } from './AdminDataContext';

// Hooks que faltavam no AdminDataContext

export const usePosts = () => {
  const context = useContext(AdminDataContext);
  if (!context) {
    throw new Error('usePosts must be used within AdminDataProvider');
  }

  const { state, dispatch } = context;

  return {
    posts: state.posts,
    loading: state.loading.posts,
    addPost: (post: NewsPost) => dispatch({ type: 'ADD_POST', payload: post }),
    updatePost: (id: string, data: Partial<NewsPost>) => dispatch({ type: 'UPDATE_POST', payload: { id, data } }),
    deletePost: (id: string) => dispatch({ type: 'DELETE_POST', payload: id })
  };
};

export const useEvents = () => {
  const context = useContext(AdminDataContext);
  if (!context) {
    throw new Error('useEvents must be used within AdminDataProvider');
  }

  const { state, dispatch } = context;

  return {
    events: state.events,
    loading: state.loading.events,
    addEvent: (event: Event) => dispatch({ type: 'ADD_EVENT', payload: event }),
    updateEvent: (id: string, data: Partial<Event>) => dispatch({ type: 'UPDATE_EVENT', payload: { id, data } }),
    deleteEvent: (id: string) => dispatch({ type: 'DELETE_EVENT', payload: id })
  };
};

export const useServices = () => {
  const context = useContext(AdminDataContext);
  if (!context) {
    throw new Error('useServices must be used within AdminDataProvider');
  }

  const { state, dispatch } = context;

  return {
    services: state.services,
    loading: state.loading.services,
    addService: (service: Service) => dispatch({ type: 'ADD_SERVICE', payload: service }),
    updateService: (id: string, data: Partial<Service>) => dispatch({ type: 'UPDATE_SERVICE', payload: { id, data } }),
    deleteService: (id: string) => dispatch({ type: 'DELETE_SERVICE', payload: id })
  };
};

export const useGallery = () => {
  const context = useContext(AdminDataContext);
  if (!context) {
    throw new Error('useGallery must be used within AdminDataProvider');
  }

  const { state, dispatch } = context;

  return {
    galleryAlbums: state.galleryAlbums,
    loading: state.loading.gallery,
    addGalleryAlbum: (album: GalleryAlbum) => dispatch({ type: 'ADD_GALLERY_ALBUM', payload: album }),
    updateGalleryAlbum: (id: string, data: Partial<GalleryAlbum>) => dispatch({ type: 'UPDATE_GALLERY_ALBUM', payload: { id, data } }),
    deleteGalleryAlbum: (id: string) => dispatch({ type: 'DELETE_GALLERY_ALBUM', payload: id })
  };
};

export const useSlides = () => {
  const context = useContext(AdminDataContext);
  if (!context) {
    throw new Error('useSlides must be used within AdminDataProvider');
  }

  const { state, dispatch } = context;

  return {
    slides: state.slides,
    loading: state.loading.slides,
    addSlide: (slide: SlideData) => dispatch({ type: 'ADD_SLIDE', payload: slide }),
    updateSlide: (id: string, data: Partial<SlideData>) => dispatch({ type: 'UPDATE_SLIDE', payload: { id, data } }),
    deleteSlide: (id: string) => dispatch({ type: 'DELETE_SLIDE', payload: id }),
    reorderSlides: (oldIndex: number, newIndex: number) => dispatch({ type: 'REORDER_SLIDES', payload: { oldIndex, newIndex } })
  };
};

export const useSettings = () => {
  const context = useContext(AdminDataContext);
  if (!context) {
    throw new Error('useSettings must be used within AdminDataProvider');
  }

  const { state, dispatch } = context;

  return {
    siteSettings: state.siteSettings,
    seoSettings: state.seoSettings,
    appearanceSettings: state.appearanceSettings,
    loading: state.loading.settings,
    updateSiteSettings: (data: Partial<SiteSettings>) => dispatch({ type: 'UPDATE_SITE_SETTINGS', payload: data }),
    updateSeoSettings: (data: Partial<SeoSettings>) => dispatch({ type: 'UPDATE_SEO_SETTINGS', payload: data }),
    updateAppearanceSettings: (data: Partial<AppearanceSettings>) => dispatch({ type: 'UPDATE_APPEARANCE_SETTINGS', payload: data })
  };
};

export const useAdminData = () => {
  const context = useContext(AdminDataContext);
  if (!context) {
    throw new Error('useAdminData must be used within AdminDataProvider');
  }

  const { state, dispatch } = context;

  // Mock login function - in a real app this would make an API call
  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock authentication - accept any admin credentials
    if (email === 'admin@timon.ma.gov.br' && password === 'admin123') {
      const mockUser: User = {
        id: '1',
        name: 'Administrador',
        email: email,
        role: 'admin',
        permissions: ['all'],
        isActive: true,
        createdAt: new Date()
      };
      
      dispatch({ type: 'SET_CURRENT_USER', payload: mockUser });
      dispatch({ type: 'SET_AUTHENTICATED', payload: true });
      return true;
    }
    
    return false;
  };

  const logout = () => {
    dispatch({ type: 'SET_CURRENT_USER', payload: null });
    dispatch({ type: 'SET_AUTHENTICATED', payload: false });
  };

  return {
    currentUser: state.currentUser,
    isAuthenticated: state.isAuthenticated,
    login,
    logout
  };
};