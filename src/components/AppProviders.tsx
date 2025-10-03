import React from 'react';
import { AccessibilityProvider } from './AccessibilityContext';
import { VLibrasProvider } from './VLibrasContext';
import { SlidesProvider } from './SlidesContext';
import { PagesProvider } from './PagesContext';
import { CalendarProvider } from './CalendarContext';
import { ServicesProvider } from './ServicesContext';
import { SecretariasProvider } from './SecretariasContext';
import { GalleryProvider } from './GalleryContext';
import { FormsProvider } from './FormsContext';
import { UsersProvider } from './UsersContext';
import { AdminDataProvider } from './AdminDataContext';
import { AppearanceProvider } from './AppearanceContext';
import { AuthProvider } from './AuthContext';
import { CommentsProvider } from './CommentsContext';
import SystemChecker from './SystemChecker';

interface AppProvidersProps {
  children: React.ReactNode;
}

export default function AppProviders({ children }: AppProvidersProps) {
  return (
    <SystemChecker>
      <AuthProvider>
        <AccessibilityProvider>
          <VLibrasProvider>
            <AppearanceProvider>
              <AdminDataProvider>
                <SlidesProvider>
                  <PagesProvider>
                    <CalendarProvider>
                      <ServicesProvider>
                        <SecretariasProvider>
                          <GalleryProvider>
                            <FormsProvider>
                              <UsersProvider>
                                <CommentsProvider>
                                  {children}
                                </CommentsProvider>
                              </UsersProvider>
                            </FormsProvider>
                          </GalleryProvider>
                        </SecretariasProvider>
                      </ServicesProvider>
                    </CalendarProvider>
                  </PagesProvider>
                </SlidesProvider>
              </AdminDataProvider>
            </AppearanceProvider>
          </VLibrasProvider>
        </AccessibilityProvider>
      </AuthProvider>
    </SystemChecker>
  );
}