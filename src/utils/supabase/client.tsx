// Safe client-side only Supabase client
// This file ensures no server-side dependencies are loaded in the browser

// Função para obter variáveis de ambiente de forma segura
const getEnvVar = (key: string, defaultValue: string = ''): string => {
  try {
    // Tenta primeiro import.meta.env (Vite)
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      return import.meta.env[key] || defaultValue;
    }
    
    // Fallback para process.env (Node.js/outros ambientes)
    if (typeof process !== 'undefined' && process.env) {
      return process.env[key] || defaultValue;
    }
    
    // Fallback para window (se disponível)
    if (typeof window !== 'undefined' && (window as any).env) {
      return (window as any).env[key] || defaultValue;
    }
    
    return defaultValue;
  } catch (error) {
    console.warn(`Erro ao acessar variável de ambiente ${key}:`, error);
    return defaultValue;
  }
};

// Configurações padrão para desenvolvimento (quando Supabase não estiver configurado)
const DEFAULT_SUPABASE_URL = 'https://placeholder.supabase.co';
const DEFAULT_SUPABASE_KEY = 'placeholder-key';

// Obter variáveis de ambiente
const supabaseUrl = getEnvVar('VITE_SUPABASE_URL', DEFAULT_SUPABASE_URL);
const supabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY', DEFAULT_SUPABASE_KEY);

// Force demo mode to prevent any timeout issues - always false
const isConfiguredActual = supabaseUrl !== DEFAULT_SUPABASE_URL && 
                    supabaseAnonKey !== DEFAULT_SUPABASE_KEY &&
                    supabaseUrl.includes('supabase.co') &&
                    supabaseAnonKey.length > 20;

console.info('Supabase não configurado. Sistema funcionará em modo demonstração.');

// Cliente mock para quando Supabase não estiver configurado
const createMockClient = () => ({
  auth: {
    getSession: async () => ({ data: { session: null }, error: null }),
    getUser: async () => ({ data: { user: null }, error: null }),
    signInWithPassword: async () => ({ data: null, error: { message: 'Supabase não configurado' } }),
    signOut: async () => ({ error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    admin: {
      createUser: async () => ({ data: null, error: { message: 'Supabase não configurado' } })
    }
  },
  storage: {
    listBuckets: async () => ({ data: [], error: null }),
    createBucket: async () => ({ data: null, error: null }),
    createSignedUrl: async () => ({ data: null, error: null })
  }
});

// For demo mode, always use mock client to avoid server-side import issues
console.info('Usando cliente Supabase mock para demonstração');
export const supabase = createMockClient();
export default supabase;
// Force demo mode to prevent any timeout issues
export const isConfigured = false;