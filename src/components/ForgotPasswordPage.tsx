import { useState } from 'react';
import { Mail, Key, ArrowLeft, Check, AlertCircle, Eye, EyeOff, Loader2, X } from 'lucide-react';
import { useAuth } from './AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';

interface ForgotPasswordPageProps {
  onBackToLogin: () => void;
}

type Step = 'email' | 'verification' | 'reset';

interface AlertState {
  show: boolean;
  type: 'error' | 'success';
  message: string;
}

export default function ForgotPasswordPage({ onBackToLogin }: ForgotPasswordPageProps) {
  const { resetPassword } = useAuth();
  const [currentStep, setCurrentStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<AlertState>({ show: false, type: 'error', message: '' });

  // Função para mostrar alerta
  const showAlert = (type: 'error' | 'success', message: string) => {
    setAlert({ show: true, type, message });
  };

  // Função para fechar alerta
  const closeAlert = () => {
    setAlert({ show: false, type: 'error', message: '' });
  };

  // Função para enviar código de verificação
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      showAlert('error', 'Por favor, insira um email válido.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showAlert('error', 'Por favor, insira um email válido.');
      return;
    }

    setIsLoading(true);
    closeAlert();

    try {
      // Simular envio de código (em produção, isso seria uma chamada à API)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      showAlert('success', 'Código de verificação enviado para seu email!');
      setCurrentStep('verification');
    } catch (err) {
      showAlert('error', 'Erro ao enviar código. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Função para verificar código
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!code.trim() || code.length !== 6) {
      showAlert('error', 'Por favor, insira um código de 6 dígitos válido.');
      return;
    }

    setIsLoading(true);
    closeAlert();

    try {
      // Simular verificação de código (em produção, isso seria uma chamada à API)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Validar código mock (em produção, isso seria validado no backend)
      if (code !== '123456') {
        throw new Error('Código inválido');
      }
      
      showAlert('success', 'Código verificado com sucesso!');
      setCurrentStep('reset');
    } catch (err) {
      showAlert('error', 'Código inválido ou expirado. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Função para resetar senha
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPassword || !confirmPassword) {
      showAlert('error', 'Por favor, preencha todos os campos.');
      return;
    }

    if (newPassword.length < 8) {
      showAlert('error', 'A senha deve ter pelo menos 8 caracteres.');
      return;
    }

    if (newPassword !== confirmPassword) {
      showAlert('error', 'As senhas não coincidem.');
      return;
    }

    // Validar força da senha
    const hasUpperCase = /[A-Z]/.test(newPassword);
    const hasLowerCase = /[a-z]/.test(newPassword);
    const hasNumbers = /\d/.test(newPassword);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);

    if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
      showAlert('error', 'A senha deve conter pelo menos uma letra maiúscula, uma minúscula e um número.');
      return;
    }

    setIsLoading(true);
    closeAlert();

    try {
      // Simular reset de senha (em produção, isso seria uma chamada à API)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      showAlert('success', 'Senha alterada com sucesso! Redirecionando para o login...');
      
      // Redirecionar para login após 2 segundos
      setTimeout(() => {
        onBackToLogin();
      }, 2000);
    } catch (err) {
      showAlert('error', 'Erro ao alterar senha. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Função para reenviar código
  const handleResendCode = async () => {
    setIsLoading(true);
    closeAlert();
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      showAlert('success', 'Novo código enviado para seu email!');
    } catch (err) {
      showAlert('error', 'Erro ao reenviar código. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 'email':
        return 'Recuperar Senha';
      case 'verification':
        return 'Verificar Email';
      case 'reset':
        return 'Nova Senha';
      default:
        return 'Recuperar Senha';
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 'email':
        return 'Digite seu email para receber o código de verificação';
      case 'verification':
        return 'Digite o código de 6 dígitos enviado para seu email';
      case 'reset':
        return 'Crie uma nova senha segura para sua conta';
      default:
        return '';
    }
  };

  const formatEmail = (email: string) => {
    const [local, domain] = email.split('@');
    const maskedLocal = local.length > 2 
      ? local.substring(0, 2) + '*'.repeat(local.length - 2)
      : local;
    return `${maskedLocal}@${domain}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Header com botão voltar */}
      <div className="absolute top-4 left-4">
        <button
          onClick={onBackToLogin}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
          aria-label="Voltar ao painel de login"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Voltar ao Login</span>
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo e cabeçalho */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-[rgba(20,76,156,1)] rounded-full flex items-center justify-center mb-4">
            <span className="text-white text-2xl font-bold">T</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {getStepTitle()}
          </h1>
          <p className="text-sm text-gray-600">
            Prefeitura Municipal de Timon - MA
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg rounded-lg sm:px-10">
          {/* Progress Steps */}
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
              currentStep === 'email' 
                ? 'bg-[rgba(20,76,156,1)] text-white' 
                : 'bg-green-500 text-white'
            }`}>
              {currentStep === 'email' ? '1' : <Check className="w-4 h-4" />}
            </div>
            <div className={`h-1 w-12 ${
              ['verification', 'reset'].includes(currentStep) 
                ? 'bg-green-500' 
                : 'bg-gray-300'
            }`} />
            <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
              currentStep === 'verification' 
                ? 'bg-[rgba(20,76,156,1)] text-white' 
                : currentStep === 'reset'
                ? 'bg-green-500 text-white'
                : 'bg-gray-300 text-gray-600'
            }`}>
              {currentStep === 'reset' ? <Check className="w-4 h-4" /> : '2'}
            </div>
            <div className={`h-1 w-12 ${
              currentStep === 'reset' 
                ? 'bg-green-500' 
                : 'bg-gray-300'
            }`} />
            <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
              currentStep === 'reset' 
                ? 'bg-[rgba(20,76,156,1)] text-white' 
                : 'bg-gray-300 text-gray-600'
            }`}>
              3
            </div>
          </div>

          <div className="text-center mb-6">
            <p className="text-gray-600">
              {getStepDescription()}
            </p>
          </div>

          <div className="space-y-6">
            {/* Alerta unificado com botão fechar */}
            {alert.show && (
              <div className={`rounded-md p-3 ${
                alert.type === 'error' 
                  ? 'bg-red-50 border border-red-200' 
                  : 'bg-green-50 border border-green-200'
              }`}>
                <div className="flex justify-between items-start">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      {alert.type === 'error' ? (
                        <AlertCircle className="h-5 w-5 text-red-400" />
                      ) : (
                        <Check className="h-5 w-5 text-green-400" />
                      )}
                    </div>
                    <div className="ml-3">
                      <div className={`text-sm ${
                        alert.type === 'error' ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {alert.message}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={closeAlert}
                    className={`ml-3 inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      alert.type === 'error'
                        ? 'text-red-400 hover:bg-red-100 focus:ring-red-500'
                        : 'text-green-400 hover:bg-green-100 focus:ring-green-500'
                    }`}
                    aria-label="Fechar alerta"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Etapa 1: Email */}
            {currentStep === 'email' && (
              <form onSubmit={handleSendCode} className="space-y-6">
                <div>
                  <label 
                    htmlFor="email" 
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="seu.email@timon.ma.gov.br"
                      disabled={isLoading}
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Digite seu email institucional para receber o código de recuperação
                  </p>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[rgba(20,76,156,1)] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Enviando código...
                      </div>
                    ) : (
                      'Enviar código de verificação'
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Etapa 2: Verificação */}
            {currentStep === 'verification' && (
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                  <div className="text-sm text-blue-800 text-center">
                    Código enviado para <strong>{formatEmail(email)}</strong>
                  </div>
                </div>

                <form onSubmit={handleVerifyCode} className="space-y-6">
                  <div>
                    <label 
                      htmlFor="code" 
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Código de verificação
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Key className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="code"
                        name="code"
                        type="text"
                        required
                        value={code}
                        onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center text-lg tracking-widest"
                        placeholder="123456"
                        maxLength={6}
                        disabled={isLoading}
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Digite o código de 6 dígitos enviado para seu email
                    </p>
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={isLoading || code.length !== 6}
                      className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[rgba(20,76,156,1)] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <div className="flex items-center">
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Verificando...
                        </div>
                      ) : (
                        'Verificar código'
                      )}
                    </button>
                  </div>
                </form>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={isLoading}
                    className="font-medium text-[rgba(20,76,156,1)] hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1 disabled:opacity-50"
                  >
                    Não recebeu o código? Reenviar
                  </button>
                </div>
              </div>
            )}

            {/* Etapa 3: Nova senha */}
            {currentStep === 'reset' && (
              <form onSubmit={handleResetPassword} className="space-y-6">
                <div>
                  <label 
                    htmlFor="newPassword" 
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Nova senha
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Key className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="newPassword"
                      name="newPassword"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Digite sua nova senha"
                      disabled={isLoading}
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

                <div>
                  <label 
                    htmlFor="confirmPassword" 
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Confirmar nova senha
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Key className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Confirme sua nova senha"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                      aria-label={showConfirmPassword ? 'Ocultar senha' : 'Mostrar senha'}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Indicador de força da senha */}
                {newPassword && (
                  <div className="bg-gray-50 rounded-md p-3">
                    <div className="text-xs font-medium text-gray-700 mb-2">Requisitos da senha:</div>
                    <div className="space-y-1">
                      <div className="flex text-xs">
                        <span className={`mr-2 ${newPassword.length >= 8 ? 'text-green-600' : 'text-gray-400'}`}>
                          {newPassword.length >= 8 ? '✓' : '○'} Mínimo 8 caracteres
                        </span>
                      </div>
                      <div className="flex text-xs">
                        <span className={`mr-2 ${/[A-Z]/.test(newPassword) ? 'text-green-600' : 'text-gray-400'}`}>
                          {/[A-Z]/.test(newPassword) ? '✓' : '○'} Letra maiúscula
                        </span>
                      </div>
                      <div className="flex text-xs">
                        <span className={`mr-2 ${/[a-z]/.test(newPassword) ? 'text-green-600' : 'text-gray-400'}`}>
                          {/[a-z]/.test(newPassword) ? '✓' : '○'} Letra minúscula
                        </span>
                      </div>
                      <div className="flex text-xs">
                        <span className={`mr-2 ${/\d/.test(newPassword) ? 'text-green-600' : 'text-gray-400'}`}>
                          {/\d/.test(newPassword) ? '✓' : '○'} Número
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[rgba(20,76,156,1)] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Alterando senha...
                      </div>
                    ) : (
                      'Alterar senha'
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Informações de segurança */}
          <div className="mt-6 border-t border-gray-200 pt-6">
            <div className="bg-gray-50 rounded-md p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-2">
                Segurança da Conta
              </h3>
              <p className="text-xs text-gray-600 mb-2">
                Por motivos de segurança, o código de verificação expira em 15 minutos.
              </p>
              <div className="text-xs text-gray-500">
                <p>Em caso de problemas, entre em contato com o suporte técnico.</p>
                <p className="mt-1">Email: suporte@timon.ma.gov.br</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer do painel administrativo */}
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
}