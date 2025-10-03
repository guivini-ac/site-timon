import React, { createContext, useContext, useState, useEffect } from 'react';

export interface AppearanceConfig {
  // Cores principais
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  
  // Identidade Visual - Logos
  headerLogoUrl: string;
  footerLogoUrl: string;
  brandName: string;
  
  // Tipografia
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  
  // Layout
  borderRadius: number;
  spacing: number;
  
  // Componentes específicos
  headerStyle: 'default' | 'minimal' | 'bold';
  buttonStyle: 'rounded' | 'square' | 'pill';
  cardStyle: 'default' | 'elevated' | 'flat';
  
  // Configurações avançadas
  enableAnimations: boolean;
  enableShadows: boolean;
  enableGradients: boolean;
  
  // Tema personalizado
  customCSS: string;
}

const defaultConfig: AppearanceConfig = {
  primaryColor: '#144c9c',
  secondaryColor: '#228B22', 
  accentColor: '#f4b728',
  backgroundColor: '#ffffff',
  textColor: '#000000',
  headerLogoUrl: 'https://i.ibb.co/kgXRL9pT/PREFEITURA-HORIZONTAL-PADRA-O-COR.pngs',
  footerLogoUrl: 'https://i.ibb.co/yBmCGg0j/PREFEITURA-HORIZONTAL-PADRA-O-BRANCA.png',
  brandName: 'Prefeitura Municipal de Timon',
  fontFamily: 'Open Sans',
  fontSize: 14,
  fontWeight: 400,
  borderRadius: 8,
  spacing: 16,
  headerStyle: 'default',
  buttonStyle: 'rounded',
  cardStyle: 'default',
  enableAnimations: true,
  enableShadows: true,
  enableGradients: false,
  customCSS: ''
};

interface AppearanceContextType {
  config: AppearanceConfig;
  updateConfig: (updates: Partial<AppearanceConfig>) => void;
  resetToDefault: () => void;
  applyConfig: () => void;
  previewMode: boolean;
  setPreviewMode: (enabled: boolean) => void;
  saveConfig: () => void;
  loadConfig: () => void;
}

const AppearanceContext = createContext<AppearanceContextType | undefined>(undefined);

export function AppearanceProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<AppearanceConfig>(defaultConfig);
  const [previewMode, setPreviewMode] = useState(false);
  
  // Carregar configuração salva ao inicializar
  useEffect(() => {
    loadConfig();
  }, []);

  // Aplicar configuração sempre que houver mudanças
  useEffect(() => {
    applyConfig();
  }, [config]);

  const updateConfig = (updates: Partial<AppearanceConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const resetToDefault = () => {
    setConfig(defaultConfig);
  };

  const applyConfig = () => {
    const root = document.documentElement;
    
    // Aplicar cores
    root.style.setProperty('--primary', config.primaryColor);
    root.style.setProperty('--secondary', config.secondaryColor);
    root.style.setProperty('--accent', config.accentColor);
    root.style.setProperty('--background', config.backgroundColor);
    root.style.setProperty('--foreground', config.textColor);
    root.style.setProperty('--timon-blue', config.primaryColor);
    root.style.setProperty('--timon-green', config.secondaryColor);
    
    // Aplicar tipografia
    root.style.setProperty('--font-size', `${config.fontSize}px`);
    root.style.setProperty('--font-weight-normal', config.fontWeight.toString());
    
    // Aplicar layout
    root.style.setProperty('--radius', `${config.borderRadius}px`);
    
    // Aplicar configurações de componentes
    const body = document.body;
    
    // Remover classes anteriores
    body.classList.remove(
      'header-minimal', 'header-bold', 'header-default',
      'button-square', 'button-pill', 'button-rounded',
      'card-elevated', 'card-flat', 'card-default',
      'no-animations', 'no-shadows', 'enable-gradients'
    );
    
    // Aplicar novas classes
    body.classList.add(`header-${config.headerStyle}`);
    body.classList.add(`button-${config.buttonStyle}`);
    body.classList.add(`card-${config.cardStyle}`);
    
    if (!config.enableAnimations) body.classList.add('no-animations');
    if (!config.enableShadows) body.classList.add('no-shadows');
    if (config.enableGradients) body.classList.add('enable-gradients');
    
    // Aplicar CSS customizado
    let customStyleElement = document.getElementById('custom-appearance-styles');
    if (!customStyleElement) {
      customStyleElement = document.createElement('style');
      customStyleElement.id = 'custom-appearance-styles';
      document.head.appendChild(customStyleElement);
    }
    customStyleElement.textContent = config.customCSS;
    
    // Aplicar fonte
    if (config.fontFamily !== 'Open Sans') {
      const fontLink = document.getElementById('custom-font');
      if (!fontLink) {
        const link = document.createElement('link');
        link.id = 'custom-font';
        link.rel = 'stylesheet';
        link.href = `https://fonts.googleapis.com/css2?family=${config.fontFamily.replace(' ', '+')}:wght@300;400;500;600;700&display=swap`;
        document.head.appendChild(link);
      }
      root.style.setProperty('--font-family', config.fontFamily);
      body.style.fontFamily = `'${config.fontFamily}', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`;
    }
  };

  const saveConfig = () => {
    try {
      localStorage.setItem('timon-appearance-config', JSON.stringify(config));
      console.log('Configuração de aparência salva');
    } catch (error) {
      console.error('Erro ao salvar configuração:', error);
    }
  };

  const loadConfig = () => {
    try {
      const saved = localStorage.getItem('timon-appearance-config');
      if (saved) {
        const savedConfig = JSON.parse(saved);
        setConfig({ ...defaultConfig, ...savedConfig });
      }
    } catch (error) {
      console.error('Erro ao carregar configuração:', error);
      setConfig(defaultConfig);
    }
  };

  return (
    <AppearanceContext.Provider value={{
      config,
      updateConfig,
      resetToDefault,
      applyConfig,
      previewMode,
      setPreviewMode,
      saveConfig,
      loadConfig
    }}>
      {children}
    </AppearanceContext.Provider>
  );
}

export function useAppearance() {
  const context = useContext(AppearanceContext);
  if (context === undefined) {
    throw new Error('useAppearance must be used within an AppearanceProvider');
  }
  return context;
}