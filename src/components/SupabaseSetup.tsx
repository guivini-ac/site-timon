import React from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Copy, ExternalLink, CheckCircle, AlertCircle } from 'lucide-react';

interface SupabaseSetupProps {
  onClose?: () => void;
}

const SupabaseSetup: React.FC<SupabaseSetupProps> = ({ onClose }) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Configuração do Supabase
          </h1>
          <p className="text-lg text-gray-600">
            Siga os passos abaixo para configurar o Supabase e começar a usar o sistema
          </p>
        </div>

        <div className="space-y-6">
          {/* Passo 1: Criar projeto */}
          <Card className="p-6">
            <div className="flex items-start space-x-4">
              <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                1
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold mb-3">Criar Projeto no Supabase</h2>
                <div className="space-y-3">
                  <p className="text-gray-600">
                    Acesse o Supabase e crie um novo projeto:
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => window.open('https://supabase.com/dashboard/projects', '_blank')}
                    className="flex items-center space-x-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Acessar Dashboard do Supabase</span>
                  </Button>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Informações importantes:</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Escolha um nome descritivo para o projeto (ex: "timon-site")</li>
                      <li>• Selecione a região mais próxima (recomendado: São Paulo)</li>
                      <li>• Anote a senha do banco de dados (você vai precisar dela)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Passo 2: Obter chaves */}
          <Card className="p-6">
            <div className="flex items-start space-x-4">
              <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                2
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold mb-3">Obter Chaves de API</h2>
                <div className="space-y-3">
                  <p className="text-gray-600">
                    No painel do seu projeto, vá para <strong>Settings → API</strong> e copie as seguintes informações:
                  </p>
                  
                  <div className="grid gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Project URL</h4>
                      <div className="flex items-center space-x-2">
                        <code className="bg-white px-2 py-1 rounded text-sm flex-1">
                          https://[sua-project-ref].supabase.co
                        </code>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => copyToClipboard('VITE_SUPABASE_URL=https://[sua-project-ref].supabase.co')}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Anon (public) Key</h4>
                      <div className="flex items-center space-x-2">
                        <code className="bg-white px-2 py-1 rounded text-sm flex-1">
                          eyJ... (sua chave pública)
                        </code>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => copyToClipboard('VITE_SUPABASE_ANON_KEY=sua_chave_aqui')}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Service Role Key</h4>
                      <div className="flex items-center space-x-2">
                        <code className="bg-white px-2 py-1 rounded text-sm flex-1">
                          eyJ... (sua chave de serviço)
                        </code>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => copyToClipboard('SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role_aqui')}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                    <div className="flex items-start space-x-2">
                      <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-amber-800">Importante!</h4>
                        <p className="text-sm text-amber-700">
                          A Service Role Key deve ser mantida em segredo. Nunca a exponha no frontend.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Passo 3: Configurar variáveis */}
          <Card className="p-6">
            <div className="flex items-start space-x-4">
              <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                3
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold mb-3">Configurar Variáveis de Ambiente</h2>
                <div className="space-y-3">
                  <p className="text-gray-600">
                    Configure as seguintes variáveis de ambiente no Figma Make:
                  </p>
                  
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                    <div className="space-y-1">
                      <div>SUPABASE_URL=https://[sua-project-ref].supabase.co</div>
                      <div>SUPABASE_ANON_KEY=[sua-anon-key]</div>
                      <div>SUPABASE_SERVICE_ROLE_KEY=[sua-service-role-key]</div>
                      <div>SUPABASE_DB_URL=postgresql://postgres:[senha]@db.[project-ref].supabase.co:5432/postgres</div>
                      <div className="mt-3 text-blue-400"># Variáveis para o frontend</div>
                      <div>VITE_SUPABASE_URL=https://[sua-project-ref].supabase.co</div>
                      <div>VITE_SUPABASE_ANON_KEY=[sua-anon-key]</div>
                    </div>
                  </div>

                  <Button 
                    variant="outline" 
                    onClick={() => copyToClipboard(`SUPABASE_URL=https://[sua-project-ref].supabase.co
SUPABASE_ANON_KEY=[sua-anon-key]
SUPABASE_SERVICE_ROLE_KEY=[sua-service-role-key]
SUPABASE_DB_URL=postgresql://postgres:[senha]@db.[project-ref].supabase.co:5432/postgres
VITE_SUPABASE_URL=https://[sua-project-ref].supabase.co
VITE_SUPABASE_ANON_KEY=[sua-anon-key]`)}
                    className="flex items-center space-x-2"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Copiar Template de Variáveis</span>
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Passo 4: Testar conexão */}
          <Card className="p-6">
            <div className="flex items-start space-x-4">
              <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                4
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold mb-3">Testar Conexão</h2>
                <div className="space-y-3">
                  <p className="text-gray-600">
                    Após configurar as variáveis, recarregue a página para testar a conexão.
                  </p>
                  
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-green-800">Sistema pronto!</h4>
                        <p className="text-sm text-green-700">
                          Quando a conexão for estabelecida, o sistema será inicializado automaticamente com dados padrão.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Recursos adicionais */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-3">Recursos Adicionais</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-2">Documentação</h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>
                    <a 
                      href="https://supabase.com/docs" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                    >
                      <span>Documentação do Supabase</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </li>
                  <li>
                    <a 
                      href="https://supabase.com/docs/guides/auth" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                    >
                      <span>Configuração de Autenticação</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-2">Suporte</h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>
                    <a 
                      href="https://github.com/supabase/supabase/discussions" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                    >
                      <span>Fórum da Comunidade</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </li>
                  <li>
                    <a 
                      href="https://discord.supabase.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                    >
                      <span>Discord do Supabase</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </div>

        {onClose && (
          <div className="text-center mt-8">
            <Button onClick={onClose} variant="outline">
              Fechar
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupabaseSetup;