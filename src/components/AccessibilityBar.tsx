import { useState } from 'react';
import { 
  Accessibility, 
  Type, 
  Eye, 
  Keyboard, 
  Volume2, 
  RotateCcw, 
  ChevronDown,
  ChevronUp,
  Plus,
  Minus,
  Hand
} from 'lucide-react';
import { Button } from './ui/button';
import { useAccessibility } from './AccessibilityContext';
import { useVLibras } from './VLibrasContext';

const AccessibilityBar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { 
    settings, 
    increaseFontSize, 
    decreaseFontSize, 
    resetFontSize, 
    toggleHighContrast,
    announceToScreenReader
  } = useAccessibility();
  const { isEnabled: vLibrasEnabled, toggleVLibras } = useVLibras();

  const handleToggleBar = () => {
    setIsExpanded(!isExpanded);
    announceToScreenReader(
      isExpanded ? 'Barra de acessibilidade recolhida' : 'Barra de acessibilidade expandida'
    );
  };

  const handleIncreaseFontSize = () => {
    increaseFontSize();
    announceToScreenReader('Tamanho da fonte aumentado');
  };

  const handleDecreaseFontSize = () => {
    decreaseFontSize();
    announceToScreenReader('Tamanho da fonte diminuído');
  };

  const handleResetFontSize = () => {
    resetFontSize();
    announceToScreenReader('Tamanho da fonte resetado para o padrão');
  };

  const handleToggleHighContrast = () => {
    toggleHighContrast();
    announceToScreenReader(
      settings.highContrast ? 'Alto contraste desativado' : 'Alto contraste ativado'
    );
  };

  const handleToggleVLibras = () => {
    toggleVLibras();
    announceToScreenReader(
      vLibrasEnabled ? 'VLibras desativado' : 'VLibras ativado - Tradutor para Libras disponível'
    );
  };

  const skipToMain = () => {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.focus();
      mainContent.scrollIntoView();
      announceToScreenReader('Navegando para o conteúdo principal');
    }
  };

  const getFontSizeLabel = () => {
    const labels = {
      'small': 'Pequena',
      'normal': 'Normal',
      'large': 'Grande',
      'extra-large': 'Extra Grande'
    };
    return labels[settings.fontSize];
  };

  return (
    <div 
      className="bg-gray-900 text-white border-b"
      role="banner"
      aria-label="Barra de ferramentas de acessibilidade"
    >
      {/* Skip to main content link */}
      <Button
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 z-50 bg-yellow-400 text-black"
        onClick={skipToMain}
        aria-label="Pular para o conteúdo principal"
      >
        Pular para o conteúdo principal
      </Button>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center space-x-2">
            <Accessibility className="h-5 w-5 text-yellow-400" aria-hidden="true" />
            <span className="text-sm font-medium">Acessibilidade</span>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleBar}
            className="text-white hover:bg-gray-800 p-2"
            aria-expanded={isExpanded}
            aria-controls="accessibility-controls"
            aria-label={isExpanded ? 'Recolher barra de acessibilidade' : 'Expandir barra de acessibilidade'}
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" aria-hidden="true" />
            ) : (
              <ChevronDown className="h-4 w-4" aria-hidden="true" />
            )}
          </Button>
        </div>

        {isExpanded && (
          <div 
            id="accessibility-controls"
            className="pb-4 border-t border-gray-700 mt-2 pt-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Font Size Controls */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-yellow-400">
                  Tamanho da Fonte
                </h3>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDecreaseFontSize}
                    className="text-white hover:bg-gray-800 p-2"
                    aria-label="Diminuir tamanho da fonte"
                    disabled={settings.fontSize === 'small'}
                  >
                    <Minus className="h-4 w-4" aria-hidden="true" />
                  </Button>
                  
                  <span 
                    className="text-xs px-2 py-1 bg-gray-800 rounded min-w-[80px] text-center"
                    aria-live="polite"
                    aria-label={`Tamanho atual: ${getFontSizeLabel()}`}
                  >
                    {getFontSizeLabel()}
                  </span>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleIncreaseFontSize}
                    className="text-white hover:bg-gray-800 p-2"
                    aria-label="Aumentar tamanho da fonte"
                    disabled={settings.fontSize === 'extra-large'}
                  >
                    <Plus className="h-4 w-4" aria-hidden="true" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleResetFontSize}
                    className="text-white hover:bg-gray-800 p-1"
                    aria-label="Resetar tamanho da fonte"
                  >
                    <RotateCcw className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </div>
              </div>

              {/* High Contrast */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-yellow-400">
                  Contraste
                </h3>
                <Button
                  variant={settings.highContrast ? "default" : "ghost"}
                  size="sm"
                  onClick={handleToggleHighContrast}
                  className={`text-white ${settings.highContrast ? 'bg-yellow-600 hover:bg-yellow-700' : 'hover:bg-gray-800'} w-full justify-start`}
                  aria-pressed={settings.highContrast}
                  aria-label={`Alto contraste ${settings.highContrast ? 'ativado' : 'desativado'}`}
                >
                  <Eye className="h-4 w-4 mr-2" aria-hidden="true" />
                  Alto Contraste
                </Button>
              </div>

              {/* Keyboard Navigation */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-yellow-400">
                  Navegação
                </h3>
                <div className="text-xs text-gray-300">
                  <div className="flex items-center mb-1">
                    <Keyboard className="h-3 w-3 mr-1" aria-hidden="true" />
                    <span>Use Tab para navegar</span>
                  </div>
                  <div>Enter/Espaço para ativar</div>
                </div>
              </div>

              {/* VLibras Control */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-yellow-400">
                  Libras
                </h3>
                <Button
                  variant={vLibrasEnabled ? "default" : "ghost"}
                  size="sm"
                  onClick={handleToggleVLibras}
                  className={`text-white ${vLibrasEnabled ? 'bg-[#144c9c] hover:bg-[#0d3b7a]' : 'hover:bg-gray-800'} w-full justify-start`}
                  aria-pressed={vLibrasEnabled}
                  aria-label={`VLibras ${vLibrasEnabled ? 'ativado' : 'desativado'} - Tradutor para Libras`}
                >
                  <Hand className="h-4 w-4 mr-2" aria-hidden="true" />
                  VLibras
                </Button>
              </div>

              {/* Screen Reader Info */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-yellow-400">
                  Leitor de Tela
                </h3>
                <div className="text-xs text-gray-300">
                  <div className="flex items-center mb-1">
                    <Volume2 className="h-3 w-3 mr-1" aria-hidden="true" />
                    <span>Site otimizado para</span>
                  </div>
                  <div>NVDA, JAWS e VoiceOver</div>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-4 pt-4 border-t border-gray-700">
              <p className="text-xs text-gray-400">
                <strong>Atalhos de teclado:</strong> Tab (navegar), Enter/Espaço (ativar), Esc (fechar), Setas (navegar em menus)
              </p>
              <p className="text-xs text-gray-400 mt-1">
                <strong>VLibras:</strong> Tradutor oficial de conteúdo digital para Libras do Governo Federal
              </p>
              <p className="text-xs text-gray-400 mt-1">
                <strong>Suporte:</strong> Entre em contato pelo e-mail acessibilidade@timon.ma.gov.br para dúvidas sobre acessibilidade
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Screen reader announcements */}
      <div 
        id="accessibility-announcements" 
        className="sr-only" 
        aria-live="polite" 
        aria-atomic="true"
      ></div>
    </div>
  );
};

export default AccessibilityBar;