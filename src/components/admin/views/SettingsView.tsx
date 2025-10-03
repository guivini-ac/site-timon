import { useState } from 'react';
import { 
  Settings, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Globe, 
  Facebook, 
  Instagram, 
  Twitter, 
  Youtube,
  Monitor,
  Save,
  Building2,
  Info,
  Share2,
  Zap
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
import { toast } from 'sonner@2.0.3';

interface SiteSettings {
  // Informações Gerais
  siteName: string;
  siteTagline: string;
  siteDescription: string;
  logoUrl: string;
  faviconUrl: string;

  // Contato
  address: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  whatsapp: string;
  email: string;
  contactEmail: string;
  workingHours: string;

  // Redes Sociais
  facebook: string;
  instagram: string;
  twitter: string;
  youtube: string;
  website: string;
  
  // Configurações Técnicas
  maintenanceMode: boolean;
  allowRegistration: boolean;
  requireEmailVerification: boolean;
  enableNotifications: boolean;
}

export function SettingsView() {
  const [activeTab, setActiveTab] = useState('general');
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState<SiteSettings>({
    // Dados da Prefeitura de Timon
    siteName: 'Prefeitura Municipal de Timon',
    siteTagline: 'Cidade Crescimento',
    siteDescription: 'Portal oficial da Prefeitura Municipal de Timon - MA. Acesse serviços, notícias e informações sobre nossa cidade.',
    logoUrl: '',
    faviconUrl: '',

    // Contato oficial
    address: 'Rua São José, nº 1000',
    neighborhood: 'Centro',
    city: 'Timon',
    state: 'Maranhão',
    zipCode: '65630-000',
    phone: '(99) 3212-3000',
    whatsapp: '(99) 9 9999-9999',
    email: 'contato@timon.ma.gov.br',
    contactEmail: 'ouvidoria@timon.ma.gov.br',
    workingHours: 'Segunda a Sexta: 8h às 17h',

    // Redes sociais
    facebook: 'https://facebook.com/prefeituradtimon',
    instagram: 'https://instagram.com/prefeituradtimon',
    twitter: 'https://twitter.com/prefeituradtimon',
    youtube: 'https://youtube.com/@prefeituradtimon',
    website: 'https://timon.ma.gov.br',

    // Configurações técnicas
    maintenanceMode: false,
    allowRegistration: false,
    requireEmailVerification: true,
    enableNotifications: true
  });

  const handleInputChange = (field: keyof SiteSettings, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    
    try {
      // Aqui seria feita a chamada para a API para salvar as configurações
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simular delay
      
      toast.success('Configurações salvas com sucesso!', {
        description: 'Todas as alterações foram aplicadas.'
      });
    } catch (error) {
      toast.error('Erro ao salvar configurações', {
        description: 'Tente novamente ou contate o suporte.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    {
      id: 'general',
      label: 'Geral',
      icon: Info,
      description: 'Informações básicas do site'
    },
    {
      id: 'contact',
      label: 'Contato',
      icon: Building2,
      description: 'Dados de contato e endereço'
    },
    {
      id: 'social',
      label: 'Redes Sociais',
      icon: Share2,
      description: 'Links das redes sociais'
    },
    {
      id: 'system',
      label: 'Sistema',
      icon: Zap,
      description: 'Configurações técnicas'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Configurações do Site</h1>
          <p className="text-muted-foreground">
            Configure informações gerais, contato e preferências do portal da prefeitura
          </p>
        </div>
        <Button 
          onClick={handleSave} 
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

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          {tabs.map((tab) => (
            <TabsTrigger 
              key={tab.id} 
              value={tab.id}
              className="flex items-center gap-2 text-xs"
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Aba Geral */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[16px]">
                <Info className="w-5 h-5" />
                Informações Gerais
              </CardTitle>
              <CardDescription>
                Configure as informações básicas que aparecem no site
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Nome do Site</Label>
                  <Input
                    id="siteName"
                    value={settings.siteName}
                    onChange={(e) => handleInputChange('siteName', e.target.value)}
                    placeholder="Prefeitura Municipal de Timon"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="siteTagline">Slogan</Label>
                  <Input
                    id="siteTagline"
                    value={settings.siteTagline}
                    onChange={(e) => handleInputChange('siteTagline', e.target.value)}
                    placeholder="Cidade Crescimento"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="siteDescription">Descrição do Site</Label>
                <Textarea
                  id="siteDescription"
                  value={settings.siteDescription}
                  onChange={(e) => handleInputChange('siteDescription', e.target.value)}
                  placeholder="Descrição que aparece no cabeçalho e em compartilhamentos"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="logoUrl">URL do Logo</Label>
                  <Input
                    id="logoUrl"
                    value={settings.logoUrl}
                    onChange={(e) => handleInputChange('logoUrl', e.target.value)}
                    placeholder="https://exemplo.com/logo.png"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="faviconUrl">URL do Favicon</Label>
                  <Input
                    id="faviconUrl"
                    value={settings.faviconUrl}
                    onChange={(e) => handleInputChange('faviconUrl', e.target.value)}
                    placeholder="https://exemplo.com/favicon.ico"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba Contato */}
        <TabsContent value="contact" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[16px]">
                <Building2 className="w-5 h-5" />
                Dados de Contato
              </CardTitle>
              <CardDescription>
                Informações de contato da prefeitura
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Endereço */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <h4 className="font-medium">Endereço</h4>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Endereço</Label>
                    <Input
                      id="address"
                      value={settings.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="Rua, número"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="neighborhood">Bairro</Label>
                    <Input
                      id="neighborhood"
                      value={settings.neighborhood}
                      onChange={(e) => handleInputChange('neighborhood', e.target.value)}
                      placeholder="Centro"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">Cidade</Label>
                    <Input
                      id="city"
                      value={settings.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="Timon"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">Estado</Label>
                    <Input
                      id="state"
                      value={settings.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      placeholder="Maranhão"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">CEP</Label>
                    <Input
                      id="zipCode"
                      value={settings.zipCode}
                      onChange={(e) => handleInputChange('zipCode', e.target.value)}
                      placeholder="65630-000"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Contatos */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <h4 className="font-medium">Telefones</h4>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone Principal</Label>
                    <Input
                      id="phone"
                      value={settings.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="(99) 3212-3000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp">WhatsApp</Label>
                    <Input
                      id="whatsapp"
                      value={settings.whatsapp}
                      onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                      placeholder="(99) 9 9999-9999"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Emails */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <h4 className="font-medium">E-mails</h4>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail Principal</Label>
                    <Input
                      id="email"
                      type="email"
                      value={settings.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="contato@timon.ma.gov.br"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">E-mail Ouvidoria</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={settings.contactEmail}
                      onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                      placeholder="ouvidoria@timon.ma.gov.br"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Horário */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <h4 className="font-medium">Horário de Funcionamento</h4>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="workingHours">Horário de Atendimento</Label>
                  <Input
                    id="workingHours"
                    value={settings.workingHours}
                    onChange={(e) => handleInputChange('workingHours', e.target.value)}
                    placeholder="Segunda a Sexta: 8h às 17h"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba Redes Sociais */}
        <TabsContent value="social" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[16px]">
                <Share2 className="w-5 h-5" />
                Redes Sociais
              </CardTitle>
              <CardDescription>
                Links das redes sociais da prefeitura
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="facebook" className="flex items-center gap-2">
                    <Facebook className="w-4 h-4 text-blue-600" />
                    Facebook
                  </Label>
                  <Input
                    id="facebook"
                    value={settings.facebook}
                    onChange={(e) => handleInputChange('facebook', e.target.value)}
                    placeholder="https://facebook.com/prefeituradtimon"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="instagram" className="flex items-center gap-2">
                    <Instagram className="w-4 h-4 text-pink-600" />
                    Instagram
                  </Label>
                  <Input
                    id="instagram"
                    value={settings.instagram}
                    onChange={(e) => handleInputChange('instagram', e.target.value)}
                    placeholder="https://instagram.com/prefeituradtimon"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="twitter" className="flex items-center gap-2">
                    <Twitter className="w-4 h-4 text-blue-400" />
                    Twitter/X
                  </Label>
                  <Input
                    id="twitter"
                    value={settings.twitter}
                    onChange={(e) => handleInputChange('twitter', e.target.value)}
                    placeholder="https://twitter.com/prefeituradtimon"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="youtube" className="flex items-center gap-2">
                    <Youtube className="w-4 h-4 text-red-600" />
                    YouTube
                  </Label>
                  <Input
                    id="youtube"
                    value={settings.youtube}
                    onChange={(e) => handleInputChange('youtube', e.target.value)}
                    placeholder="https://youtube.com/@prefeituradtimon"
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="website" className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-green-600" />
                    Site Oficial
                  </Label>
                  <Input
                    id="website"
                    value={settings.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    placeholder="https://timon.ma.gov.br"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>



        {/* Aba Sistema */}
        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[16px]">
                <Zap className="w-5 h-5" />
                Configurações do Sistema
              </CardTitle>
              <CardDescription>
                Configurações técnicas e de segurança do portal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-base">Modo de Manutenção</Label>
                    <p className="text-sm text-muted-foreground">
                      Ativa uma página de manutenção para visitantes
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {settings.maintenanceMode && (
                      <Badge variant="destructive">Ativo</Badge>
                    )}
                    <Switch
                      checked={settings.maintenanceMode}
                      onCheckedChange={(checked) => handleInputChange('maintenanceMode', checked)}
                    />
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-base">Permitir Cadastro de Usuários</Label>
                    <p className="text-sm text-muted-foreground">
                      Permite que novos usuários se cadastrem no sistema
                    </p>
                  </div>
                  <Switch
                    checked={settings.allowRegistration}
                    onCheckedChange={(checked) => handleInputChange('allowRegistration', checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-base">Verificação de E-mail Obrigatória</Label>
                    <p className="text-sm text-muted-foreground">
                      Exige verificação de e-mail para novos usuários
                    </p>
                  </div>
                  <Switch
                    checked={settings.requireEmailVerification}
                    onCheckedChange={(checked) => handleInputChange('requireEmailVerification', checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-base">Notificações do Sistema</Label>
                    <p className="text-sm text-muted-foreground">
                      Ativa notificações automáticas do sistema
                    </p>
                  </div>
                  <Switch
                    checked={settings.enableNotifications}
                    onCheckedChange={(checked) => handleInputChange('enableNotifications', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card de Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="w-5 h-5" />
                Status do Sistema
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="text-green-600 font-semibold">Sistema</div>
                  <div className="text-2xl font-bold text-green-700">Online</div>
                  <div className="text-sm text-green-600">Funcionando</div>
                </div>
                
                <div className="text-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="text-blue-600 font-semibold">Banco de Dados</div>
                  <div className="text-2xl font-bold text-blue-700">Conectado</div>
                  <div className="text-sm text-blue-600">Operacional</div>
                </div>
                
                <div className="text-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="text-yellow-600 font-semibold">Cache</div>
                  <div className="text-2xl font-bold text-yellow-700">Ativo</div>
                  <div className="text-sm text-yellow-600">Otimizado</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}