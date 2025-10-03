import { useEffect } from 'react';
import { useVLibras } from './VLibrasContext';

declare global {
  interface Window {
    VLibras?: {
      Widget: (selector: string) => void;
    };
  }
}

const VLibras = () => {
  const { isEnabled } = useVLibras();

  useEffect(() => {
    // Função para limpar completamente o VLibras
    const cleanupVLibras = () => {
      try {
        // Remove o script
        const script = document.getElementById('vlibras-script');
        if (script && script.parentNode) {
          script.parentNode.removeChild(script);
        }
        
        // Remove todos os widgets VLibras
        const widgets = document.querySelectorAll('[vw]');
        widgets.forEach(widget => {
          if (widget.parentNode && widget !== document.querySelector('[vw=""]')) {
            widget.parentNode.removeChild(widget);
          }
        });

        // Remove estilos do VLibras se existirem
        const vlibrasStyles = document.querySelectorAll('style[data-vw]');
        vlibrasStyles.forEach(style => {
          if (style.parentNode) {
            style.parentNode.removeChild(style);
          }
        });
      } catch (error) {
        console.warn('Erro ao limpar VLibras:', error);
      }
    };

    // Só carrega o VLibras se estiver habilitado
    if (!isEnabled) {
      cleanupVLibras();
      return;
    }

    // Função para carregar o script do VLibras
    const loadVLibras = () => {
      try {
        // Verifica se o script já foi carregado
        if (document.getElementById('vlibras-script')) {
          // Se já existe, mas não foi inicializado, tenta inicializar
          if (window.VLibras && !document.querySelector('[vw] .vw-plugin-wrapper')) {
            new window.VLibras.Widget('https://vlibras.gov.br/app');
          }
          return;
        }

        // Remove qualquer widget existente antes de adicionar novo
        const existingWidget = document.querySelector('[vw]:not([vw=""])');
        if (existingWidget && existingWidget.parentNode) {
          existingWidget.parentNode.removeChild(existingWidget);
        }

        // Cria o elemento script
        const script = document.createElement('script');
        script.id = 'vlibras-script';
        script.src = 'https://vlibras.gov.br/app/vlibras-plugin.js';
        script.async = true;
        script.defer = true;

        // Adiciona o script ao head
        document.head.appendChild(script);

        // Configura o VLibras quando o script carrega
        script.onload = () => {
          if (window.VLibras) {
            try {
              new window.VLibras.Widget('https://vlibras.gov.br/app');
            } catch (error) {
              console.warn('Erro ao inicializar VLibras:', error);
            }
          }
        };

        script.onerror = () => {
          console.warn('Erro ao carregar script do VLibras');
        };
      } catch (error) {
        console.warn('Erro ao carregar VLibras:', error);
      }
    };

    // Carrega o VLibras
    loadVLibras();

    // Cleanup function
    return () => {
      cleanupVLibras();
    };
  }, [isEnabled]);

  // Não renderiza nada se o VLibras estiver desabilitado
  if (!isEnabled) {
    return null;
  }

  return (
    <>
      {/* Container para o VLibras - será preenchido automaticamente pelo script */}
      <div 
        vw=""
        className="enabled"
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 9999,
        }}
        aria-label="Plugin VLibras - Tradutor para Libras"
      >
        {/* Link alternativo para usuários que não conseguem carregar o JavaScript */}
        <noscript>
          <div 
            className="bg-[#144c9c] text-white p-3 rounded-lg shadow-lg"
            style={{
              position: 'fixed',
              bottom: '20px',
              right: '20px',
              maxWidth: '300px',
              fontSize: '14px',
              zIndex: 9999,
            }}
          >
            <p className="mb-2">
              <strong>VLibras não disponível</strong>
            </p>
            <p className="text-sm">
              Para utilizar o tradutor de Libras, é necessário habilitar o JavaScript. 
              Você também pode acessar diretamente:{' '}
              <a 
                href="https://vlibras.gov.br/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-yellow-300 underline hover:text-yellow-200"
                aria-label="Site do VLibras - abre em nova janela"
              >
                vlibras.gov.br
              </a>
            </p>
          </div>
        </noscript>
      </div>

      {/* Estilos customizados para o VLibras */}
      <style>{`
        /* Customização do botão do VLibras para manter a identidade visual */
        [vw] .vw-plugin-wrapper .vw-plugin-button {
          background-color: #144c9c !important;
          border: 2px solid #ffffff !important;
          box-shadow: 0 4px 12px rgba(20, 76, 156, 0.3) !important;
          transition: all 0.3s ease !important;
        }

        [vw] .vw-plugin-wrapper .vw-plugin-button:hover {
          background-color: #0d3b7a !important;
          transform: scale(1.05) !important;
          box-shadow: 0 6px 16px rgba(20, 76, 156, 0.4) !important;
        }

        [vw] .vw-plugin-wrapper .vw-plugin-button:focus {
          outline: 3px solid #FFC107 !important;
          outline-offset: 2px !important;
        }

        /* Customização do player do VLibras */
        [vw] .vw-player-wrapper {
          border: 2px solid #144c9c !important;
          border-radius: 12px !important;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15) !important;
        }

        [vw] .vw-player-wrapper .vw-player-controls {
          background-color: #144c9c !important;
        }

        [vw] .vw-player-wrapper .vw-player-controls button {
          color: #ffffff !important;
        }

        [vw] .vw-player-wrapper .vw-player-controls button:hover {
          background-color: rgba(255, 255, 255, 0.1) !important;
        }

        /* Responsividade do VLibras */
        @media (max-width: 768px) {
          [vw] {
            bottom: 80px !important;
            right: 10px !important;
          }

          [vw] .vw-plugin-wrapper .vw-plugin-button {
            width: 50px !important;
            height: 50px !important;
          }

          [vw] .vw-player-wrapper {
            width: 90vw !important;
            max-width: 300px !important;
            right: 5vw !important;
          }
        }

        /* Alto contraste para o VLibras */
        .high-contrast [vw] .vw-plugin-wrapper .vw-plugin-button {
          background-color: #ffff00 !important;
          color: #000000 !important;
          border: 3px solid #000000 !important;
        }

        .high-contrast [vw] .vw-plugin-wrapper .vw-plugin-button:hover {
          background-color: #ffffff !important;
          color: #000000 !important;
        }

        .high-contrast [vw] .vw-player-wrapper {
          border: 3px solid #ffff00 !important;
          background-color: #000000 !important;
        }

        .high-contrast [vw] .vw-player-wrapper .vw-player-controls {
          background-color: #ffff00 !important;
        }

        .high-contrast [vw] .vw-player-wrapper .vw-player-controls button {
          color: #000000 !important;
        }

        /* Animação suave para o aparecimento do VLibras */
        [vw] .vw-plugin-wrapper {
          animation: vLibrasSlideIn 0.5s ease-out;
        }

        @keyframes vLibrasSlideIn {
          from {
            opacity: 0;
            transform: translateX(100px) scale(0.8);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }

        /* Respeitar preferência de movimento reduzido */
        @media (prefers-reduced-motion: reduce) {
          [vw] .vw-plugin-wrapper {
            animation: none !important;
          }
          
          [vw] .vw-plugin-wrapper .vw-plugin-button:hover {
            transform: none !important;
          }
        }

        /* Garantir que o VLibras não interfira com outros elementos */
        [vw] {
          pointer-events: auto;
        }

        [vw] * {
          box-sizing: border-box;
        }
      `}</style>
    </>
  );
};

export default VLibras;