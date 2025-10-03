import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AccessibilitySettings {
  fontSize: 'small' | 'normal' | 'large' | 'extra-large';
  highContrast: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  resetFontSize: () => void;
  toggleHighContrast: () => void;
  toggleScreenReader: () => void;
  enableKeyboardNavigation: () => void;
  announceToScreenReader: (message: string) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};

interface AccessibilityProviderProps {
  children: ReactNode;
}

export const AccessibilityProvider = ({ children }: AccessibilityProviderProps) => {
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('timon-accessibility-settings');
      if (saved) {
        return JSON.parse(saved);
      }
    }
    return {
      fontSize: 'normal',
      highContrast: false,
      screenReader: false,
      keyboardNavigation: false,
    };
  });

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('timon-accessibility-settings', JSON.stringify(settings));
  }, [settings]);

  // Apply font size changes to document
  useEffect(() => {
    const root = document.documentElement;
    const fontSizeMap = {
      'small': '12px',
      'normal': '14px',
      'large': '16px',
      'extra-large': '18px'
    };
    root.style.setProperty('--font-size', fontSizeMap[settings.fontSize]);
  }, [settings.fontSize]);

  // Apply high contrast theme
  useEffect(() => {
    const root = document.documentElement;
    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
  }, [settings.highContrast]);

  // Apply keyboard navigation focus styles
  useEffect(() => {
    const root = document.documentElement;
    if (settings.keyboardNavigation) {
      root.classList.add('keyboard-navigation');
    } else {
      root.classList.remove('keyboard-navigation');
    }
  }, [settings.keyboardNavigation]);

  // Listen for keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        setSettings(prev => ({ ...prev, keyboardNavigation: true }));
      }
    };

    const handleMouseDown = () => {
      setSettings(prev => ({ ...prev, keyboardNavigation: false }));
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  const increaseFontSize = () => {
    setSettings(prev => {
      const sizes: AccessibilitySettings['fontSize'][] = ['small', 'normal', 'large', 'extra-large'];
      const currentIndex = sizes.indexOf(prev.fontSize);
      const nextIndex = Math.min(currentIndex + 1, sizes.length - 1);
      return { ...prev, fontSize: sizes[nextIndex] };
    });
  };

  const decreaseFontSize = () => {
    setSettings(prev => {
      const sizes: AccessibilitySettings['fontSize'][] = ['small', 'normal', 'large', 'extra-large'];
      const currentIndex = sizes.indexOf(prev.fontSize);
      const nextIndex = Math.max(currentIndex - 1, 0);
      return { ...prev, fontSize: sizes[nextIndex] };
    });
  };

  const resetFontSize = () => {
    setSettings(prev => ({ ...prev, fontSize: 'normal' }));
  };

  const toggleHighContrast = () => {
    setSettings(prev => ({ ...prev, highContrast: !prev.highContrast }));
  };

  const toggleScreenReader = () => {
    setSettings(prev => ({ ...prev, screenReader: !prev.screenReader }));
  };

  const enableKeyboardNavigation = () => {
    setSettings(prev => ({ ...prev, keyboardNavigation: true }));
  };

  const announceToScreenReader = (message: string) => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  };

  return (
    <AccessibilityContext.Provider
      value={{
        settings,
        increaseFontSize,
        decreaseFontSize,
        resetFontSize,
        toggleHighContrast,
        toggleScreenReader,
        enableKeyboardNavigation,
        announceToScreenReader,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};