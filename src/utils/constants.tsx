export type PageType = 'home' | 'gallery' | 'agenda' | 'news' | 'services' | 'history' | 'mayor' | 'secretaries' | 'organogram' | 'anthem' | 'symbols' | 'general-data' | 'tourist-attractions' | 'login' | 'admin' | 'custom-page' | 'form' | 'terms-of-use' | 'privacy-policy' | 'sitemap' | 'forgot-password';

export const AUTH_PAGES: PageType[] = ['login', 'admin', 'forgot-password'];

export const isAuthPage = (page: PageType): boolean => AUTH_PAGES.includes(page);