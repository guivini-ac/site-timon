import { REGEX } from '@timon/config';

// Validation utilities
export const validation = {
  email: (email: string): boolean => REGEX.EMAIL.test(email),
  phone: (phone: string): boolean => REGEX.PHONE.test(phone),
  cpf: (cpf: string): boolean => REGEX.CPF.test(cpf),
  cnpj: (cnpj: string): boolean => REGEX.CNPJ.test(cnpj),
  cep: (cep: string): boolean => REGEX.CEP.test(cep),
  slug: (slug: string): boolean => REGEX.SLUG.test(slug),
};

// Format utilities
export const format = {
  phone: (phone: string): string => {
    const numbers = phone.replace(/\D/g, '');
    if (numbers.length === 11) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
    } else if (numbers.length === 10) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
    }
    return phone;
  },

  cpf: (cpf: string): string => {
    const numbers = cpf.replace(/\D/g, '');
    if (numbers.length === 11) {
      return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9)}`;
    }
    return cpf;
  },

  cnpj: (cnpj: string): string => {
    const numbers = cnpj.replace(/\D/g, '');
    if (numbers.length === 14) {
      return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8, 12)}-${numbers.slice(12)}`;
    }
    return cnpj;
  },

  cep: (cep: string): string => {
    const numbers = cep.replace(/\D/g, '');
    if (numbers.length === 8) {
      return `${numbers.slice(0, 5)}-${numbers.slice(5)}`;
    }
    return cep;
  },

  currency: (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  },

  date: (date: string | Date): string => {
    return new Intl.DateTimeFormat('pt-BR').format(new Date(date));
  },

  dateTime: (date: string | Date): string => {
    return new Intl.DateTimeFormat('pt-BR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  },

  fileSize: (bytes: number): string => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  },
};

// URL utilities
export const url = {
  addParams: (baseUrl: string, params: Record<string, any>): string => {
    const url = new URL(baseUrl, window.location.origin);
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        url.searchParams.set(key, String(params[key]));
      }
    });
    return url.toString();
  },

  removeParams: (baseUrl: string, paramNames: string[]): string => {
    const url = new URL(baseUrl, window.location.origin);
    paramNames.forEach(name => url.searchParams.delete(name));
    return url.toString();
  },

  getParam: (paramName: string): string | null => {
    const url = new URL(window.location.href);
    return url.searchParams.get(paramName);
  },

  createSlug: (text: string): string => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/[^\w\s-]/g, '') // Remove caracteres especiais
      .replace(/\s+/g, '-') // Substitui espaços por hífens
      .replace(/-+/g, '-') // Remove hífens duplos
      .trim()
      .replace(/^-|-$/g, ''); // Remove hífens do início e fim
  },
};

// File utilities
export const file = {
  getExtension: (filename: string): string => {
    return filename.split('.').pop()?.toLowerCase() || '';
  },

  getMimeType: (filename: string): string => {
    const extension = file.getExtension(filename);
    const mimeTypes: Record<string, string> = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      gif: 'image/gif',
      webp: 'image/webp',
      pdf: 'application/pdf',
      doc: 'application/msword',
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      xls: 'application/vnd.ms-excel',
      xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      mp4: 'video/mp4',
      mp3: 'audio/mpeg',
    };
    return mimeTypes[extension] || 'application/octet-stream';
  },

  isImage: (filename: string): boolean => {
    const extension = file.getExtension(filename);
    return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension);
  },

  isDocument: (filename: string): boolean => {
    const extension = file.getExtension(filename);
    return ['pdf', 'doc', 'docx', 'xls', 'xlsx'].includes(extension);
  },

  isVideo: (filename: string): boolean => {
    const extension = file.getExtension(filename);
    return ['mp4', 'webm', 'ogg'].includes(extension);
  },

  isAudio: (filename: string): boolean => {
    const extension = file.getExtension(filename);
    return ['mp3', 'wav', 'ogg'].includes(extension);
  },
};

// Storage utilities
export const storage = {
  get: (key: string): any => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },

  set: (key: string, value: any): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Handle quota exceeded or other storage errors
    }
  },

  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch {
      // Handle storage errors
    }
  },

  clear: (): void => {
    try {
      localStorage.clear();
    } catch {
      // Handle storage errors
    }
  },
};

// Debounce utility
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle utility
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Copy to clipboard
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch {
      return false;
    }
  }
};

// Generate unique ID
export const generateId = (prefix?: string): string => {
  const id = Math.random().toString(36).substr(2, 9);
  return prefix ? `${prefix}-${id}` : id;
};

// Deep clone utility
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as any;
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as any;
  if (typeof obj === 'object') {
    const clonedObj: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
  return obj;
};

// Retry utility for async operations
export const retry = async <T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (attempt === maxAttempts) break;
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }
  
  throw lastError!;
};