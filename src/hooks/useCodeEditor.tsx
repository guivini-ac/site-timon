import { useState, useCallback, useEffect } from 'react';

interface EditorSettings {
  theme: string;
  fontSize: number;
  showMinimap: boolean;
  wordWrap: boolean;
  autoFormat: boolean;
  showPreview: boolean;
  language: 'html' | 'css' | 'javascript' | 'json';
}

interface ValidationError {
  line: number;
  column: number;
  message: string;
  severity: 'error' | 'warning' | 'info';
}

interface CodeEditorState {
  content: string;
  originalContent: string;
  hasUnsavedChanges: boolean;
  validationErrors: ValidationError[];
  isFullscreen: boolean;
  settings: EditorSettings;
}

const DEFAULT_SETTINGS: EditorSettings = {
  theme: 'timon-light',
  fontSize: 14,
  showMinimap: true,
  wordWrap: true,
  autoFormat: true,
  showPreview: true,
  language: 'html'
};

const STORAGE_KEY = 'timon_code_editor_settings';

export function useCodeEditor(initialContent: string = '') {
  const [state, setState] = useState<CodeEditorState>(() => {
    // Carregar configurações salvas do localStorage
    const savedSettings = localStorage.getItem(STORAGE_KEY);
    const settings = savedSettings ? 
      { ...DEFAULT_SETTINGS, ...JSON.parse(savedSettings) } : 
      DEFAULT_SETTINGS;

    return {
      content: initialContent,
      originalContent: initialContent,
      hasUnsavedChanges: false,
      validationErrors: [],
      isFullscreen: false,
      settings
    };
  });

  // Salvar configurações no localStorage quando mudarem
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.settings));
  }, [state.settings]);

  // Detectar mudanças não salvas
  useEffect(() => {
    const hasChanges = state.content !== state.originalContent;
    if (hasChanges !== state.hasUnsavedChanges) {
      setState(prev => ({ ...prev, hasUnsavedChanges: hasChanges }));
    }
  }, [state.content, state.originalContent, state.hasUnsavedChanges]);

  const updateContent = useCallback((content: string) => {
    setState(prev => ({ ...prev, content }));
  }, []);

  const updateSettings = useCallback((newSettings: Partial<EditorSettings>) => {
    setState(prev => ({
      ...prev,
      settings: { ...prev.settings, ...newSettings }
    }));
  }, []);

  const setValidationErrors = useCallback((errors: ValidationError[]) => {
    setState(prev => ({ ...prev, validationErrors: errors }));
  }, []);

  const toggleFullscreen = useCallback(() => {
    setState(prev => ({ ...prev, isFullscreen: !prev.isFullscreen }));
  }, []);

  const saveContent = useCallback(() => {
    setState(prev => ({
      ...prev,
      originalContent: prev.content,
      hasUnsavedChanges: false
    }));
  }, []);

  const resetContent = useCallback(() => {
    setState(prev => ({
      ...prev,
      content: prev.originalContent,
      hasUnsavedChanges: false
    }));
  }, []);

  const setInitialContent = useCallback((content: string) => {
    setState(prev => ({
      ...prev,
      content,
      originalContent: content,
      hasUnsavedChanges: false
    }));
  }, []);

  // Funções de utilitários para validação e formatação
  const validateHTML = useCallback((html: string): ValidationError[] => {
    const errors: ValidationError[] = [];
    
    try {
      // Verificar tags não fechadas (validação básica)
      const openTags = html.match(/<([a-zA-Z]+)(?:\s[^>]*)?(?<!\/)\>/g) || [];
      const closeTags = html.match(/<\/([a-zA-Z]+)>/g) || [];
      
      const openTagNames = openTags.map(tag => tag.match(/<([a-zA-Z]+)/)?.[1]).filter(Boolean);
      const closeTagNames = closeTags.map(tag => tag.match(/<\/([a-zA-Z]+)>/)?.[1]).filter(Boolean);
      
      // Tags que não precisam ser fechadas
      const selfClosingTags = [
        'img', 'br', 'hr', 'input', 'meta', 'link', 'area', 
        'base', 'col', 'embed', 'source', 'track', 'wbr'
      ];
      
      openTagNames.forEach(tagName => {
        if (tagName && !selfClosingTags.includes(tagName.toLowerCase())) {
          const openCount = openTagNames.filter(t => t === tagName).length;
          const closeCount = closeTagNames.filter(t => t === tagName).length;
          
          if (openCount > closeCount) {
            errors.push({
              line: 1,
              column: 1,
              message: `Tag <${tagName}> não foi fechada`,
              severity: 'warning'
            });
          }
        }
      });

      // Verificar atributos obrigatórios para acessibilidade
      if (html.includes('<img') && !html.includes('alt=')) {
        errors.push({
          line: 1,
          column: 1,
          message: 'Imagens devem ter o atributo alt para acessibilidade',
          severity: 'warning'
        });
      }

      // Verificar estrutura semântica
      if (html.includes('<div') && !html.includes('<main') && !html.includes('<section')) {
        errors.push({
          line: 1,
          column: 1,
          message: 'Considere usar tags semânticas como <main>, <section>, <article>',
          severity: 'info'
        });
      }

      // Verificar hierarquia de headings
      const headings = html.match(/<h([1-6])/g) || [];
      if (headings.length > 0) {
        const levels = headings.map(h => parseInt(h.match(/h([1-6])/)?.[1] || '1'));
        for (let i = 1; i < levels.length; i++) {
          if (levels[i] > levels[i - 1] + 1) {
            errors.push({
              line: 1,
              column: 1,
              message: `Hierarquia de headings deve ser sequencial (pulou de h${levels[i - 1]} para h${levels[i]})`,
              severity: 'warning'
            });
            break;
          }
        }
      }

      // Verificar links externos sem target
      const externalLinks = html.match(/<a[^>]+href=["']https?:\/\/(?!timon\.ma\.gov\.br)[^"']+["'][^>]*>/g) || [];
      externalLinks.forEach(() => {
        if (!html.includes('target="_blank"')) {
          errors.push({
            line: 1,
            column: 1,
            message: 'Links externos devem abrir em nova aba (target="_blank")',
            severity: 'info'
          });
        }
      });

    } catch (error) {
      errors.push({
        line: 1,
        column: 1,
        message: 'Erro ao validar HTML: ' + (error as Error).message,
        severity: 'error'
      });
    }

    return errors;
  }, []);

  const getStats = useCallback(() => {
    return {
      characters: state.content.length,
      lines: state.content.split('\n').length,
      words: state.content.trim() ? state.content.split(/\s+/).filter(word => word.length > 0).length : 0,
      errors: state.validationErrors.filter(e => e.severity === 'error').length,
      warnings: state.validationErrors.filter(e => e.severity === 'warning').length,
      info: state.validationErrors.filter(e => e.severity === 'info').length
    };
  }, [state.content, state.validationErrors]);

  const formatCode = useCallback(() => {
    // Formatação básica de HTML
    let formatted = state.content;
    
    try {
      // Remover espaços extras
      formatted = formatted.replace(/\s+/g, ' ').trim();
      
      // Adicionar quebras de linha após tags de abertura e fechamento
      formatted = formatted.replace(/></g, '>\n<');
      formatted = formatted.replace(/^\s*</gm, '<');
      
      // Indentação básica
      const lines = formatted.split('\n');
      let indentLevel = 0;
      const indentSize = 2;
      
      const formattedLines = lines.map(line => {
        const trimmed = line.trim();
        if (!trimmed) return '';
        
        // Diminuir indentação para tags de fechamento
        if (trimmed.startsWith('</')) {
          indentLevel = Math.max(0, indentLevel - 1);
        }
        
        const indented = ' '.repeat(indentLevel * indentSize) + trimmed;
        
        // Aumentar indentação para tags de abertura (exceto auto-fechadas)
        if (trimmed.startsWith('<') && !trimmed.startsWith('</') && !trimmed.endsWith('/>') && !trimmed.includes('</'))) {
          indentLevel++;
        }
        
        return indented;
      });
      
      formatted = formattedLines.join('\n');
      updateContent(formatted);
      
    } catch (error) {
      console.error('Erro ao formatar código:', error);
    }
  }, [state.content, updateContent]);

  const insertTemplate = useCallback((template: string) => {
    // Inserir template na posição atual do cursor ou no final
    const newContent = state.content + '\n\n' + template + '\n';
    updateContent(newContent);
  }, [state.content, updateContent]);

  return {
    // Estado
    content: state.content,
    originalContent: state.originalContent,
    hasUnsavedChanges: state.hasUnsavedChanges,
    validationErrors: state.validationErrors,
    isFullscreen: state.isFullscreen,
    settings: state.settings,
    
    // Ações
    updateContent,
    updateSettings,
    setValidationErrors,
    toggleFullscreen,
    saveContent,
    resetContent,
    setInitialContent,
    
    // Utilitários
    validateHTML,
    getStats,
    formatCode,
    insertTemplate
  };
}