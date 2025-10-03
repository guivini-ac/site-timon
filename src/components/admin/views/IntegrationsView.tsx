import { useState } from 'react';
import { 
  Wrench,
  Globe,
  Mail,
  MessageSquare,
  Phone,
  MapPin,
  CreditCard,
  BarChart3,
  Cloud,
  Shield,
  Key,
  CheckCircle,
  AlertCircle,
  XCircle,
  ExternalLink,
  RefreshCw,
  Settings,
  Save,
  Eye,
  EyeOff,
  Copy,
  TestTube,
  Zap,
  Building2,
  FileText,
  Share2,
  MonitorSpeaker,
  Webhook,
  Database,
  Lock,
  Unlock,
  PlayCircle,
  StopCircle,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Info
} from 'lucide-react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Switch } from '../../ui/switch';
import { Badge } from '../../ui/badge';
import { Separator } from '../../ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Alert, AlertDescription } from '../../ui/alert';
import { ScrollArea } from '../../ui/scroll-area';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog';
import { toast } from 'sonner@2.0.3';

interface IntegrationConfig {
  id: string;
  name: string;
  description: string;
  category: string;
  status: 'connected' | 'disconnected' | 'error' | 'testing';
  enabled: boolean;
  apiKey?: string;
  apiSecret?: string;
  baseUrl?: string;
  webhook?: string;
  lastSync?: Date;
  config: Record<string, any>;
}

interface IntegrationCategory {
  id: string;
  name: string;
  icon: any;
  description: string;
  integrations: IntegrationConfig[];
}

export function IntegrationsView() {
  const [activeTab, setActiveTab] = useState('government');
  const [isLoading, setIsLoading] = useState(false);
  const [testingIntegration, setTestingIntegration] = useState<string | null>(null);
  const [showApiKeys, setShowApiKeys] = useState<Record<string, boolean>>({});

  const [integrations, setIntegrations] = useState<IntegrationCategory[]>([
    {
      id: 'government',
      name: 'APIs Governamentais',
      icon: Building2,
      description: 'Integrações com sistemas oficiais',
      integrations: [
        {
          id: 'conecta-timon',
          name: 'Conecta Timon',
          description: 'Sistema integrado de serviços da prefeitura',
          category: 'government',
          status: 'connected',
          enabled: true,
          baseUrl: 'https://conecta.timon.ma.gov.br/api',
          apiKey: 'ct_prod_abc123...',
          lastSync: new Date(),
          config: {
            version: 'v2',
            timeout: 30000,
            retries: 3
          }
        },
        {
          id: 'transparency-portal',
          name: 'Portal da Transparência',
          description: 'Dados de transparência e prestação de contas',
          category: 'government',
          status: 'connected',
          enabled: true,
          baseUrl: 'https://transparencia.timon.ma.gov.br/api',
          apiKey: 'tp_prod_def456...',
          lastSync: new Date(),
          config: {
            syncFrequency: 'daily',
            dataTypes: ['expenses', 'contracts', 'salaries']
          }
        },
        {
          id: 'official-diary',
          name: 'Diário Oficial',
          description: 'Sistema de publicação oficial municipal',
          category: 'government',
          status: 'disconnected',
          enabled: false,
          baseUrl: 'https://diario.timon.ma.gov.br/api',
          config: {
            autoPublish: false,
            approvalWorkflow: true
          }
        }
      ]
    },
    {
      id: 'communication',
      name: 'Comunicação',
      icon: MessageSquare,
      description: 'E-mail, SMS e mensageria',
      integrations: [
        {
          id: 'smtp-email',
          name: 'E-mail SMTP',
          description: 'Servidor de e-mail para notificações',
          category: 'communication',
          status: 'connected',
          enabled: true,
          config: {
            host: 'mail.timon.ma.gov.br',
            port: 587,
            secure: true,
            username: 'noreply@timon.ma.gov.br',
            fromName: 'Prefeitura de Timon'
          }
        },
        {
          id: 'whatsapp-business',
          name: 'WhatsApp Business API',
          description: 'Envio de mensagens via WhatsApp',
          category: 'communication',
          status: 'error',
          enabled: false,
          apiKey: 'whats_prod_...',
          config: {
            phoneNumber: '5599999999999',
            webhookUrl: 'https://timon.ma.gov.br/webhook/whatsapp'
          }
        },
        {
          id: 'sms-gateway',
          name: 'Gateway SMS',
          description: 'Envio de SMS para notificações',
          category: 'communication',
          status: 'disconnected',
          enabled: false,
          config: {
            provider: 'twilio',
            phoneNumber: '+5599999999999'
          }
        }
      ]
    },
    {
      id: 'social',
      name: 'Redes Sociais',
      icon: Share2,
      description: 'APIs de redes sociais',
      integrations: [
        {
          id: 'facebook-api',
          name: 'Facebook API',
          description: 'Publicação automática no Facebook',
          category: 'social',
          status: 'connected',
          enabled: true,
          apiKey: 'fb_app_id_123...',
          apiSecret: 'fb_secret_456...',
          config: {
            pageId: '123456789',
            autoPost: true,
            postTypes: ['news', 'events']
          }
        },
        {
          id: 'instagram-api',
          name: 'Instagram Basic Display',
          description: 'Integração com Instagram',
          category: 'social',
          status: 'testing',
          enabled: true,
          apiKey: 'ig_app_id_789...',
          config: {
            userId: '987654321',
            autoPost: false
          }
        },
        {
          id: 'youtube-api',
          name: 'YouTube Data API',
          description: 'Gerenciamento de vídeos no YouTube',
          category: 'social',
          status: 'disconnected',
          enabled: false,
          config: {
            channelId: 'UCxxxxxxxxx',
            autoUpload: false
          }
        }
      ]
    },
    {
      id: 'maps',
      name: 'Mapas e Localização',
      icon: MapPin,
      description: 'APIs de mapas e geolocalização',
      integrations: [
        {
          id: 'google-maps',
          name: 'Google Maps API',
          description: 'Mapas e geolocalização',
          category: 'maps',
          status: 'connected',
          enabled: true,
          apiKey: 'google_maps_key_...',
          config: {
            enablePlaces: true,
            enableDirections: true,
            enableGeocoding: true
          }
        },
        {
          id: 'openstreetmap',
          name: 'OpenStreetMap',
          description: 'Mapas gratuitos e colaborativos',
          category: 'maps',
          status: 'disconnected',
          enabled: false,
          config: {
            tileServer: 'https://tile.openstreetmap.org',
            attribution: true
          }
        }
      ]
    },
    {
      id: 'payments',
      name: 'Pagamentos',
      icon: CreditCard,
      description: 'Gateways de pagamento',
      integrations: [
        {
          id: 'pix-bcb',
          name: 'PIX - Banco Central',
          description: 'Pagamentos via PIX',
          category: 'payments',
          status: 'connected',
          enabled: true,
          config: {
            pixKey: 'prefeitura@timon.ma.gov.br',
            merchant: 'Prefeitura Municipal de Timon',
            environment: 'production'
          }
        },
        {
          id: 'pagseguro',
          name: 'PagSeguro',
          description: 'Gateway de pagamento PagSeguro',
          category: 'payments',
          status: 'disconnected',
          enabled: false,
          apiKey: 'pagseguro_key_...',
          config: {
            environment: 'sandbox',
            webhook: 'https://timon.ma.gov.br/webhook/pagseguro'
          }
        }
      ]
    },
    {
      id: 'analytics',
      name: 'Analytics',
      icon: BarChart3,
      description: 'Monitoramento e análise',
      integrations: [
        {
          id: 'google-analytics',
          name: 'Google Analytics 4',
          description: 'Análise de tráfego do site',
          category: 'analytics',
          status: 'connected',
          enabled: true,
          apiKey: 'G-XXXXXXXXXX',
          config: {
            trackingId: 'G-XXXXXXXXXX',
            enhancedEcommerce: false,
            anonymizeIp: true
          }
        },
        {
          id: 'google-search-console',
          name: 'Google Search Console',
          description: 'Monitoramento de SEO',
          category: 'analytics',
          status: 'connected',
          enabled: true,
          config: {
            siteUrl: 'https://timon.ma.gov.br',
            verificationMethod: 'html-tag'
          }
        }
      ]
    },
    {
      id: 'utilities',
      name: 'Utilitários',
      icon: Zap,
      description: 'APIs de utilidade geral',
      integrations: [
        {
          id: 'viacep',
          name: 'ViaCEP',
          description: 'Consulta de CEP brasileiro',
          category: 'utilities',
          status: 'connected',
          enabled: true,
          baseUrl: 'https://viacep.com.br/ws',
          config: {
            format: 'json',
            timeout: 5000
          }
        },
        {
          id: 'weather-api',
          name: 'OpenWeatherMap',
          description: 'Dados meteorológicos',
          category: 'utilities',
          status: 'disconnected',
          enabled: false,
          apiKey: 'owm_key_...',
          config: {
            city: 'Timon',
            units: 'metric',
            lang: 'pt_br'
          }
        }
      ]
    }
  ]);

  const handleToggleIntegration = (categoryId: string, integrationId: string) => {
    setIntegrations(prev => prev.map(category => {
      if (category.id === categoryId) {
        return {
          ...category,
          integrations: category.integrations.map(integration => {
            if (integration.id === integrationId) {
              const newEnabled = !integration.enabled;
              toast.success(
                `${integration.name} ${newEnabled ? 'ativada' : 'desativada'}`,
                {
                  description: `A integração foi ${newEnabled ? 'habilitada' : 'desabilitada'} com sucesso.`
                }
              );
              return {
                ...integration,
                enabled: newEnabled,
                status: newEnabled ? 'connected' : 'disconnected'
              };
            }
            return integration;
          })
        };
      }
      return category;
    }));
  };

  const handleTestIntegration = async (categoryId: string, integrationId: string) => {
    setTestingIntegration(integrationId);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIntegrations(prev => prev.map(category => {
        if (category.id === categoryId) {
          return {
            ...category,
            integrations: category.integrations.map(integration => {
              if (integration.id === integrationId) {
                return {
                  ...integration,
                  status: 'connected',
                  lastSync: new Date()
                };
              }
              return integration;
            })
          };
        }
        return category;
      }));
      
      toast.success('Teste realizado com sucesso!', {
        description: 'A integração está funcionando corretamente.'
      });
    } catch (error) {
      setIntegrations(prev => prev.map(category => {
        if (category.id === categoryId) {
          return {
            ...category,
            integrations: category.integrations.map(integration => {
              if (integration.id === integrationId) {
                return {
                  ...integration,
                  status: 'error'
                };
              }
              return integration;
            })
          };
        }
        return category;
      }));
      
      toast.error('Erro no teste', {
        description: 'Verifique as configurações e tente novamente.'
      });
    } finally {
      setTestingIntegration(null);
    }
  };

  const handleSaveAll = async () => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Integrações salvas com sucesso!', {
        description: 'Todas as configurações foram aplicadas.'
      });
    } catch (error) {
      toast.error('Erro ao salvar integrações', {
        description: 'Tente novamente ou contate o suporte.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleApiKeyVisibility = (integrationId: string) => {
    setShowApiKeys(prev => ({
      ...prev,
      [integrationId]: !prev[integrationId]
    }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copiado!', {
      description: 'Texto copiado para a área de transferência.'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'testing':
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      connected: { label: 'Conectado', variant: 'default' as const, className: 'bg-green-100 text-green-800 border-green-200' },
      testing: { label: 'Testando', variant: 'secondary' as const, className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
      error: { label: 'Erro', variant: 'destructive' as const, className: 'bg-red-100 text-red-800 border-red-200' },
      disconnected: { label: 'Desconectado', variant: 'outline' as const, className: 'bg-gray-100 text-gray-600 border-gray-300' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const currentCategory = integrations.find(cat => cat.id === activeTab);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Integrações Externas</h1>
          <p className="text-muted-foreground">
            Configure APIs e conecte sistemas externos ao portal da prefeitura
          </p>
        </div>
        <Button 
          onClick={handleSaveAll} 
          disabled={isLoading}
          className="min-w-[120px]"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Salvando...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Save className="w-4 h-4" />
              Salvar Tudo
            </div>
          )}
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ativas</p>
                <p className="text-2xl font-bold">
                  {integrations.reduce((acc, cat) => 
                    acc + cat.integrations.filter(int => int.status === 'connected').length, 0
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Com Erro</p>
                <p className="text-2xl font-bold">
                  {integrations.reduce((acc, cat) => 
                    acc + cat.integrations.filter(int => int.status === 'error').length, 0
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <AlertCircle className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Desconectadas</p>
                <p className="text-2xl font-bold">
                  {integrations.reduce((acc, cat) => 
                    acc + cat.integrations.filter(int => int.status === 'disconnected').length, 0
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Wrench className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">
                  {integrations.reduce((acc, cat) => acc + cat.integrations.length, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <ScrollArea>
          <TabsList className="inline-flex h-auto p-1 bg-muted/50">
            {integrations.map((category) => (
              <TabsTrigger 
                key={category.id} 
                value={category.id}
                className="flex items-center gap-2 whitespace-nowrap px-4 py-2"
              >
                <category.icon className="w-4 h-4" />
                <span>{category.name}</span>
                <Badge variant="secondary" className="text-xs">
                  {category.integrations.length}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>
        </ScrollArea>

        {/* Category Content */}
        {integrations.map((category) => (
          <TabsContent key={category.id} value={category.id} className="space-y-6">
            {/* Category Header */}
            <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
              <category.icon className="w-6 h-6 text-primary" />
              <div>
                <h3 className="font-semibold">{category.name}</h3>
                <p className="text-sm text-muted-foreground">{category.description}</p>
              </div>
            </div>

            {/* Integrations Grid */}
            <div className="grid gap-6">
              {category.integrations.map((integration) => (
                <Card key={integration.id} className="relative">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(integration.status)}
                        </div>
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            {integration.name}
                            {getStatusBadge(integration.status)}
                          </CardTitle>
                          <CardDescription className="mt-1">
                            {integration.description}
                          </CardDescription>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={integration.enabled}
                          onCheckedChange={() => handleToggleIntegration(category.id, integration.id)}
                        />
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Configuration Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {integration.baseUrl && (
                        <div className="space-y-2">
                          <Label>URL Base</Label>
                          <div className="flex items-center gap-2">
                            <Input
                              value={integration.baseUrl}
                              readOnly
                              className="flex-1"
                            />
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => copyToClipboard(integration.baseUrl!)}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                      
                      {integration.apiKey && (
                        <div className="space-y-2">
                          <Label>API Key</Label>
                          <div className="flex items-center gap-2">
                            <Input
                              type={showApiKeys[integration.id] ? 'text' : 'password'}
                              value={integration.apiKey}
                              readOnly
                              className="flex-1"
                            />
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => toggleApiKeyVisibility(integration.id)}
                            >
                              {showApiKeys[integration.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => copyToClipboard(integration.apiKey!)}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                      
                      {integration.webhook && (
                        <div className="space-y-2 md:col-span-2">
                          <Label>Webhook URL</Label>
                          <div className="flex items-center gap-2">
                            <Input
                              value={integration.webhook}
                              readOnly
                              className="flex-1"
                            />
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => copyToClipboard(integration.webhook!)}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Configuration Details */}
                    {Object.keys(integration.config).length > 0 && (
                      <div className="space-y-2">
                        <Label>Configurações</Label>
                        <div className="p-3 bg-muted/50 rounded-lg">
                          <pre className="text-xs text-muted-foreground overflow-x-auto">
                            {JSON.stringify(integration.config, null, 2)}
                          </pre>
                        </div>
                      </div>
                    )}

                    {/* Last Sync */}
                    {integration.lastSync && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <RefreshCw className="w-4 h-4" />
                        <span>
                          Última sincronização: {integration.lastSync.toLocaleString('pt-BR')}
                        </span>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-2 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTestIntegration(category.id, integration.id)}
                        disabled={!integration.enabled || testingIntegration === integration.id}
                      >
                        {testingIntegration === integration.id ? (
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            Testando...
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <TestTube className="w-4 h-4" />
                            Testar Conexão
                          </div>
                        )}
                      </Button>
                      
                      <Button variant="ghost" size="sm">
                        <Settings className="w-4 h-4 mr-2" />
                        Configurar
                      </Button>
                      
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Documentação
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Add New Integration */}
            <Card className="border-dashed">
              <CardContent className="p-6 text-center">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                    <Wrench className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <h3 className="font-medium">Adicionar Nova Integração</h3>
                  <p className="text-sm text-muted-foreground">
                    Configure uma nova conexão com serviços externos
                  </p>
                  <Button variant="outline" className="mt-2">
                    <Wrench className="w-4 h-4 mr-2" />
                    Nova Integração
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* System Alerts */}
      <div className="space-y-4">
        <h3 className="font-semibold">Alertas do Sistema</h3>
        
        <Alert>
          <Shield className="w-4 h-4" />
          <AlertDescription>
            <strong>Segurança:</strong> Mantenha suas chaves de API seguras e nunca as compartilhe. 
            Todas as conexões utilizam HTTPS para garantir a segurança dos dados.
          </AlertDescription>
        </Alert>
        
        <Alert>
          <Info className="w-4 h-4" />
          <AlertDescription>
            <strong>Monitoramento:</strong> As integrações são verificadas automaticamente a cada 5 minutos. 
            Você será notificado em caso de falhas.
          </AlertDescription>
        </Alert>
        
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertTriangle className="w-4 h-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            <strong>LGPD:</strong> Certifique-se de que todas as integrações estão em conformidade 
            com a Lei Geral de Proteção de Dados.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}