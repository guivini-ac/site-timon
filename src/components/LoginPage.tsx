import { useState } from 'react';
import { User, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from './AuthContext';

interface LoginPageProps {
  onNavigateBack: () => void;
  onLoginSuccess: () => void;
  onNavigate: (page: string) => void;
}

const LoginPage = ({ onNavigateBack, onLoginSuccess, onNavigate }: LoginPageProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState<string>('');
  
  const { signIn, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const { data, error: signInError } = await signIn(formData.email, formData.password);
      
      if (signInError) {
        setError(signInError.message || 'Erro ao fazer login');
        return;
      }
      
      if (data?.user) {
        onLoginSuccess();
      }
    } catch (error) {
      console.error('Erro no login:', error);
      setError('Erro inesperado ao fazer login');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Header com botão voltar */}
      <div className="absolute top-4 left-4">
        <button
          onClick={onNavigateBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
          aria-label="Voltar para o site"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Voltar ao Site</span>
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo e cabeçalho */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-[rgba(20,76,156,1)] rounded-full flex items-center justify-center mb-4">
            <span className="text-white text-2xl font-bold">T</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Painel Administrativo
          </h1>
          <p className="text-sm text-gray-600">
            Prefeitura Municipal de Timon - MA
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg rounded-lg sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Campo Email */}
            <div>
              <label 
                htmlFor="email" 
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="seu.email@timon.ma.gov.br"
                  aria-describedby="email-description"
                />
              </div>
              <p id="email-description" className="mt-1 text-xs text-gray-500">
                Digite seu email institucional
              </p>
            </div>

            {/* Campo Senha */}
            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Digite sua senha"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Links auxiliares */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Lembrar de mim
                </label>
              </div>

              <div className="text-sm">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('forgot-password');
                  }}
                  className="font-medium text-[rgba(20,76,156,1)] hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
                >
                  Esqueceu a senha?
                </a>
              </div>
            </div>

            {/* Mensagem de erro */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <div className="text-sm text-red-600">
                  {error}
                </div>
              </div>
            )}

            {/* Botão de login */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[rgba(20,76,156,1)] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center">
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Entrando...
                  </div>
                ) : (
                  'Entrar no Painel'
                )}
              </button>
            </div>
          </form>

          {/* Informações de desenvolvimento */}
          <div className="mt-6 border-t border-gray-200 pt-6">
            <div className="bg-gray-50 rounded-md p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-2">
                Modo de Desenvolvimento
              </h3>
              <p className="text-xs text-gray-600 mb-2">
                Use as credenciais abaixo para acessar o sistema administrativo.
              </p>
              <div className="text-xs text-gray-500">
                <p>Para criar uma conta de administrador, entre em contato com o suporte técnico.</p>
                <p className="mt-1">Email: suporte@timon.ma.gov.br</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer do login */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            Sistema seguro da Prefeitura Municipal de Timon - MA
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Para suporte técnico: suporte@timon.ma.gov.br
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;