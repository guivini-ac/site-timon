import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface VLibrasContextType {
  isEnabled: boolean;
  isLoaded: boolean;
  toggleVLibras: () => void;
  enableVLibras: () => void;
  disableVLibras: () => void;
}

const VLibrasContext = createContext<VLibrasContextType | undefined>(undefined);

interface VLibrasProviderProps {
  children: ReactNode;
}

export const VLibrasProvider = ({ children }: VLibrasProviderProps) => {
  const [isEnabled, setIsEnabled] = useState(true); // Habilitado por padrão
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Verifica se há preferência salva no localStorage
    try {
      const savedPreference = localStorage.getItem('vlibras-enabled');
      if (savedPreference !== null) {
        setIsEnabled(savedPreference === 'true');
      }
    } catch (error) {
      console.warn('Erro ao acessar localStorage para VLibras:', error);
    }
  }, []);

  useEffect(() => {
    // Salva a preferência no localStorage
    try {
      localStorage.setItem('vlibras-enabled', isEnabled.toString());
    } catch (error) {
      console.warn('Erro ao salvar preferência do VLibras:', error);
    }
    
    // Anuncia mudança para leitores de tela
    try {
      const announcement = isEnabled 
        ? 'VLibras ativado - Tradutor para Libras disponível'
        : 'VLibras desativado - Tradutor para Libras não disponível';
      
      // Criar elemento temporário para anúncio
      const announcer = document.createElement('div');
      announcer.setAttribute('aria-live', 'polite');
      announcer.setAttribute('aria-atomic', 'true');
      announcer.className = 'sr-only';
      announcer.textContent = announcement;
      
      document.body.appendChild(announcer);
      
      // Remove o elemento após o anúncio
      setTimeout(() => {
        if (announcer.parentNode === document.body) {
          document.body.removeChild(announcer);
        }
      }, 1000);
    } catch (error) {
      console.warn('Erro ao criar anúncio de acessibilidade:', error);
    }
  }, [isEnabled]);

  const toggleVLibras = () => {
    setIsEnabled(prev => !prev);
  };

  const enableVLibras = () => {
    setIsEnabled(true);
  };

  const disableVLibras = () => {
    setIsEnabled(false);
  };

  const value = {
    isEnabled,
    isLoaded,
    toggleVLibras,
    enableVLibras,
    disableVLibras,
  };

  return (
    <VLibrasContext.Provider value={value}>
      {children}
    </VLibrasContext.Provider>
  );
};

export const useVLibras = () => {
  const context = useContext(VLibrasContext);
  if (context === undefined) {
    throw new Error('useVLibras deve ser usado dentro de um VLibrasProvider');
  }
  return context;
};