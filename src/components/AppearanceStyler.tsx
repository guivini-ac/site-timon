import { useEffect } from 'react';
import { useAppearance } from './AppearanceContext';

export function AppearanceStyler() {
  const { config, previewMode } = useAppearance();

  useEffect(() => {
    const body = document.body;
    const root = document.documentElement;

    // Aplicar classe de preview
    if (previewMode) {
      body.classList.add('preview-mode');
    } else {
      body.classList.remove('preview-mode');
    }

    // Aplicar variáveis CSS dinâmicas
    root.style.setProperty('--primary', config.primaryColor);
    root.style.setProperty('--secondary', config.secondaryColor);
    root.style.setProperty('--accent', config.accentColor);
    root.style.setProperty('--background', config.backgroundColor);
    root.style.setProperty('--foreground', config.textColor);
    root.style.setProperty('--timon-blue', config.primaryColor);
    root.style.setProperty('--timon-green', config.secondaryColor);
    root.style.setProperty('--font-size', `${config.fontSize}px`);
    root.style.setProperty('--font-weight-normal', config.fontWeight.toString());
    root.style.setProperty('--radius', `${config.borderRadius}px`);

    // Aplicar fonte personalizada se diferente da padrão
    if (config.fontFamily !== 'Open Sans') {
      // Criar ou atualizar link para Google Fonts
      const existingLink = document.getElementById('custom-font-link');
      if (existingLink) {
        existingLink.remove();
      }

      const link = document.createElement('link');
      link.id = 'custom-font-link';
      link.rel = 'stylesheet';
      link.href = `https://fonts.googleapis.com/css2?family=${config.fontFamily.replace(' ', '+')}:wght@300;400;500;600;700&display=swap`;
      document.head.appendChild(link);

      // Aplicar fonte ao body
      body.style.fontFamily = `'${config.fontFamily}', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`;
    } else {
      // Remover fonte personalizada se voltar para padrão
      const existingLink = document.getElementById('custom-font-link');
      if (existingLink) {
        existingLink.remove();
      }
      body.style.fontFamily = '';
    }

    // Remover todas as classes de estilo anteriores
    const styleClasses = [
      'header-default', 'header-minimal', 'header-bold',
      'button-rounded', 'button-square', 'button-pill',
      'card-default', 'card-elevated', 'card-flat',
      'no-animations', 'no-shadows', 'enable-gradients'
    ];

    styleClasses.forEach(className => {
      body.classList.remove(className);
    });

    // Aplicar novas classes baseadas na configuração
    body.classList.add(`header-${config.headerStyle}`);
    body.classList.add(`button-${config.buttonStyle}`);
    body.classList.add(`card-${config.cardStyle}`);

    if (!config.enableAnimations) {
      body.classList.add('no-animations');
    }

    if (!config.enableShadows) {
      body.classList.add('no-shadows');
    }

    if (config.enableGradients) {
      body.classList.add('enable-gradients');
    }

    // Aplicar CSS customizado
    let customStyleElement = document.getElementById('custom-appearance-css');
    if (!customStyleElement) {
      customStyleElement = document.createElement('style');
      customStyleElement.id = 'custom-appearance-css';
      document.head.appendChild(customStyleElement);
    }
    customStyleElement.textContent = config.customCSS;

    // Cleanup function
    return () => {
      // Remove preview mode class when component unmounts
      body.classList.remove('preview-mode');
    };
  }, [config, previewMode]);

  return null; // Este componente não renderiza nada visualmente
}

export default AppearanceStyler;