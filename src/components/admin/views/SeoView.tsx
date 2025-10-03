import { useState } from 'react';
import { 
  Search, 
  Globe, 
  Share2, 
  FileText, 
  Settings,
  BarChart3,
  Eye,
  CheckCircle,
  AlertCircle,
  Info,
  ExternalLink,
  Copy,
  Download,
  RefreshCw,
  Zap,
  Tag,
  Image,
  Link,
  MapPin,
  Calendar,
  Users,
  Building2,
  Phone,
  Mail
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
import { Progress } from '../../ui/progress';
import { Alert, AlertDescription } from '../../ui/alert';
import { toast } from 'sonner@2.0.3';

interface SEOSettings {
  // Meta Tags Globais
  siteTitle: string;
  siteTitleSeparator: string;
  siteDescription: string;
  siteKeywords: string;
  robotsContent: string;
  canonicalUrl: string;

  // Open Graph
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogType: string;
  ogLocale: string;
  ogSiteName: string;

  // Twitter Cards
  twitterCard: string;
  twitterSite: string;
  twitterCreator: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;

  // Schema.org
  organizationName: string;
  organizationType: string;
  organizationLogo: string;
  organizationUrl: string;
  organizationAddress: string;
  organizationPhone: string;
  organizationEmail: string;

  // Analytics
  googleAnalyticsId: string;
  googleSearchConsole: string;
  facebookPixelId: string;
  
  // Configurações Técnicas
  enableSitemap: boolean;
  enableRobotsTxt: boolean;
  enableBreadcrumbs: boolean;
  enableSchemaMarkup: boolean;
  enableOpenGraph: boolean;
  enableTwitterCards: boolean;
}

interface SEOScore {
  category: string;
  score: number;
  maxScore: number;
  status: 'excellent' | 'good' | 'warning' | 'error';
  items: {
    title: string;
    status: 'pass' | 'warning' | 'fail';
    description: string;
  }[];
}

export function SeoView() {
  const [activeTab, setActiveTab] = useState('meta');
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState<SEOSettings>({
    // Meta Tags
    siteTitle: 'Prefeitura Municipal de Timon',
    siteTitleSeparator: '|',
    siteDescription: 'Portal oficial da Prefeitura Municipal de Timon - MA. Acesse serviços públicos, notícias, transparência e informações da administração municipal.',
    siteKeywords: 'timon, prefeitura, maranhão, serviços públicos, transparência, governo municipal, cidade crescimento',
    robotsContent: 'index, follow',
    canonicalUrl: 'https://timon.ma.gov.br',

    // Open Graph
    ogTitle: 'Prefeitura Municipal de Timon - Portal Oficial',
    ogDescription: 'Portal oficial da Prefeitura Municipal de Timon - MA. Acesse serviços, notícias e informações sobre nossa cidade.',
    ogImage: 'https://timon.ma.gov.br/images/og-image.jpg',
    ogType: 'website',
    ogLocale: 'pt_BR',
    ogSiteName: 'Prefeitura de Timon',

    // Twitter
    twitterCard: 'summary_large_image',
    twitterSite: '@prefeituradtimon',
    twitterCreator: '@prefeituradtimon',
    twitterTitle: 'Prefeitura Municipal de Timon',
    twitterDescription: 'Portal oficial da Prefeitura Municipal de Timon - MA.',
    twitterImage: 'https://timon.ma.gov.br/images/twitter-image.jpg',

    // Schema.org
    organizationName: 'Prefeitura Municipal de Timon',
    organizationType: 'GovernmentOrganization',
    organizationLogo: 'https://timon.ma.gov.br/images/logo.png',
    organizationUrl: 'https://timon.ma.gov.br',
    organizationAddress: 'Rua São José, nº 1000, Centro, Timon - MA, 65630-000',
    organizationPhone: '(99) 3212-3000',
    organizationEmail: 'contato@timon.ma.gov.br',

    // Analytics
    googleAnalyticsId: '',
    googleSearchConsole: '',
    facebookPixelId: '',

    // Configurações
    enableSitemap: true,
    enableRobotsTxt: true,
    enableBreadcrumbs: true,
    enableSchemaMarkup: true,
    enableOpenGraph: true,
    enableTwitterCards: true
  });

  const handleInputChange = (field: keyof SEOSettings, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    
    try {
      // Aqui seria feita a chamada para a API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Configurações de SEO salvas com sucesso!', {
        description: 'As otimizações foram aplicadas ao site.'
      });
    } catch (error) {
      toast.error('Erro ao salvar configurações', {
        description: 'Tente novamente ou contate o suporte.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateSitemap = () => {
    toast.success('Sitemap gerado com sucesso!', {
      description: 'O sitemap foi atualizado e enviado aos buscadores.'
    });
  };

  const handleTestSEO = () => {
    toast.info('Análise SEO iniciada', {
      description: 'Analisando as configurações e estrutura do site...'
    });
  };

  // Dados mockados para análise SEO
  const seoScores: SEOScore[] = [
    {
      category: 'Meta Tags',
      score: 85,
      maxScore: 100,
      status: 'good',
      items: [
        { title: 'Título da página', status: 'pass', description: 'Título otimizado (52 caracteres)' },
        { title: 'Meta description', status: 'pass', description: 'Descrição adequada (155 caracteres)' },
        { title: 'Meta keywords', status: 'warning', description: 'Muitas palavras-chave' },
        { title: 'Canonical URL', status: 'pass', description: 'URL canônica definida' }
      ]
    },
    {
      category: 'Estrutura',
      score: 90,
      maxScore: 100,
      status: 'excellent',
      items: [
        { title: 'Hierarquia de cabeçalhos', status: 'pass', description: 'H1-H6 bem estruturados' },
        { title: 'URLs amigáveis', status: 'pass', description: 'URLs otimizadas' },
        { title: 'Links internos', status: 'pass', description: 'Boa estrutura de links' },
        { title: 'Breadcrumbs', status: 'pass', description: 'Navegação estruturada' }
      ]
    },
    {
      category: 'Conteúdo',
      score: 75,
      maxScore: 100,
      status: 'warning',
      items: [
        { title: 'Densidade de palavras-chave', status: 'pass', description: 'Densidade adequada (2.1%)' },
        { title: 'Conteúdo único', status: 'pass', description: 'Sem duplicação de conteúdo' },
        { title: 'Texto alternativo em imagens', status: 'warning', description: '3 imagens sem alt text' },
        { title: 'Tamanho do conteúdo', status: 'pass', description: 'Conteúdo adequado (1,200+ palavras)' }
      ]
    },
    {
      category: 'Técnico',
      score: 95,
      maxScore: 100,
      status: 'excellent',
      items: [
        { title: 'Velocidade de carregamento', status: 'pass', description: 'Carregamento rápido (1.2s)' },
        { title: 'Mobile-friendly', status: 'pass', description: 'Responsivo e otimizado' },
        { title: 'HTTPS', status: 'pass', description: 'Certificado SSL ativo' },
        { title: 'Schema markup', status: 'pass', description: 'Dados estruturados implementados' }
      ]
    }
  ];

  const getStatusColor = (status: 'excellent' | 'good' | 'warning' | 'error') => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-50 border-green-200';
      case 'good': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'error': return 'text-red-600 bg-red-50 border-red-200';
    }
  };

  const getItemStatusIcon = (status: 'pass' | 'warning' | 'fail') => {
    switch (status) {
      case 'pass': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case 'fail': return <AlertCircle className="w-4 h-4 text-red-600" />;
    }
  };

  const tabs = [
    { id: 'meta', label: 'Meta Tags', icon: Tag },
    { id: 'social', label: 'Redes Sociais', icon: Share2 },
    { id: 'schema', label: 'Schema.org', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'tools', label: 'Ferramentas', icon: Settings },
    { id: 'analysis', label: 'Análise', icon: Eye }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Otimização SEO</h1>
          <p className="text-muted-foreground">
            Configure meta tags, analytics e otimizações para mecanismos de busca
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={handleTestSEO}
            className="min-w-[120px]"
          >
            <Eye className="w-4 h-4 mr-2" />
            Testar SEO
          </Button>
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
                <CheckCircle className="w-4 h-4" />
                Salvar SEO
              </div>
            )}
          </Button>
        </div>
      </div>

      {/* Score Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {seoScores.map((score) => (
          <Card key={score.category}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">{score.category}</h3>
                <Badge className={getStatusColor(score.status)}>
                  {score.score}/{score.maxScore}
                </Badge>
              </div>
              <Progress value={(score.score / score.maxScore) * 100} className="h-2" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
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

        {/* Aba Meta Tags */}
        <TabsContent value="meta" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[16px]">
                <Tag className="w-5 h-5" />
                Meta Tags Globais
              </CardTitle>
              <CardDescription>
                Configure as meta tags principais que aparecem nos resultados de busca
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="siteTitle">Título do Site</Label>
                <Input
                  id="siteTitle"
                  value={settings.siteTitle}
                  onChange={(e) => handleInputChange('siteTitle', e.target.value)}
                  placeholder="Prefeitura Municipal de Timon"
                />
                <p className="text-sm text-muted-foreground">
                  Caracteres: {settings.siteTitle.length}/60 (recomendado: 50-60)
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="siteTitleSeparator">Separador</Label>
                  <Select
                    value={settings.siteTitleSeparator}
                    onValueChange={(value) => handleInputChange('siteTitleSeparator', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="|">|</SelectItem>
                      <SelectItem value="-">-</SelectItem>
                      <SelectItem value="•">•</SelectItem>
                      <SelectItem value="—">—</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-3 space-y-2">
                  <Label htmlFor="canonicalUrl">URL Canônica</Label>
                  <Input
                    id="canonicalUrl"
                    value={settings.canonicalUrl}
                    onChange={(e) => handleInputChange('canonicalUrl', e.target.value)}
                    placeholder="https://timon.ma.gov.br"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteDescription">Meta Description</Label>
                <Textarea
                  id="siteDescription"
                  value={settings.siteDescription}
                  onChange={(e) => handleInputChange('siteDescription', e.target.value)}
                  placeholder="Descrição que aparece nos resultados de busca"
                  rows={3}
                />
                <p className="text-sm text-muted-foreground">
                  Caracteres: {settings.siteDescription.length}/160 (recomendado: 150-160)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteKeywords">Palavras-chave</Label>
                <Input
                  id="siteKeywords"
                  value={settings.siteKeywords}
                  onChange={(e) => handleInputChange('siteKeywords', e.target.value)}
                  placeholder="palavra1, palavra2, palavra3"
                />
                <p className="text-sm text-muted-foreground">
                  Separe por vírgulas. Recomendado: 5-10 palavras-chave principais
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="robotsContent">Robots Meta Tag</Label>
                <Select
                  value={settings.robotsContent}
                  onValueChange={(value) => handleInputChange('robotsContent', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="index, follow">index, follow</SelectItem>
                    <SelectItem value="noindex, follow">noindex, follow</SelectItem>
                    <SelectItem value="index, nofollow">index, nofollow</SelectItem>
                    <SelectItem value="noindex, nofollow">noindex, nofollow</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba Redes Sociais */}
        <TabsContent value="social" className="space-y-6">
          {/* Open Graph */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[16px]">
                <Share2 className="w-5 h-5" />
                Open Graph (Facebook, LinkedIn)
              </CardTitle>
              <CardDescription>
                Configure como o site aparece quando compartilhado no Facebook e LinkedIn
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <Label>Ativar Open Graph</Label>
                <Switch
                  checked={settings.enableOpenGraph}
                  onCheckedChange={(checked) => handleInputChange('enableOpenGraph', checked)}
                />
              </div>

              {settings.enableOpenGraph && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="ogTitle">Título OG</Label>
                      <Input
                        id="ogTitle"
                        value={settings.ogTitle}
                        onChange={(e) => handleInputChange('ogTitle', e.target.value)}
                        placeholder="Título para redes sociais"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ogSiteName">Nome do Site</Label>
                      <Input
                        id="ogSiteName"
                        value={settings.ogSiteName}
                        onChange={(e) => handleInputChange('ogSiteName', e.target.value)}
                        placeholder="Prefeitura de Timon"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ogDescription">Descrição OG</Label>
                    <Textarea
                      id="ogDescription"
                      value={settings.ogDescription}
                      onChange={(e) => handleInputChange('ogDescription', e.target.value)}
                      placeholder="Descrição para compartilhamento"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="ogImage">Imagem OG (1200x630px)</Label>
                      <Input
                        id="ogImage"
                        value={settings.ogImage}
                        onChange={(e) => handleInputChange('ogImage', e.target.value)}
                        placeholder="https://exemplo.com/og-image.jpg"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ogType">Tipo</Label>
                      <Select
                        value={settings.ogType}
                        onValueChange={(value) => handleInputChange('ogType', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="website">Website</SelectItem>
                          <SelectItem value="article">Article</SelectItem>
                          <SelectItem value="profile">Profile</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Twitter Cards */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="w-5 h-5" />
                Twitter Cards
              </CardTitle>
              <CardDescription>
                Configure como o site aparece quando compartilhado no Twitter/X
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <Label>Ativar Twitter Cards</Label>
                <Switch
                  checked={settings.enableTwitterCards}
                  onCheckedChange={(checked) => handleInputChange('enableTwitterCards', checked)}
                />
              </div>

              {settings.enableTwitterCards && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="twitterCard">Tipo de Card</Label>
                      <Select
                        value={settings.twitterCard}
                        onValueChange={(value) => handleInputChange('twitterCard', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="summary">Summary</SelectItem>
                          <SelectItem value="summary_large_image">Summary Large Image</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="twitterSite">@Site</Label>
                      <Input
                        id="twitterSite"
                        value={settings.twitterSite}
                        onChange={(e) => handleInputChange('twitterSite', e.target.value)}
                        placeholder="@prefeituradtimon"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="twitterCreator">@Criador</Label>
                      <Input
                        id="twitterCreator"
                        value={settings.twitterCreator}
                        onChange={(e) => handleInputChange('twitterCreator', e.target.value)}
                        placeholder="@prefeituradtimon"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="twitterTitle">Título Twitter</Label>
                      <Input
                        id="twitterTitle"
                        value={settings.twitterTitle}
                        onChange={(e) => handleInputChange('twitterTitle', e.target.value)}
                        placeholder="Título para Twitter"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="twitterImage">Imagem Twitter</Label>
                      <Input
                        id="twitterImage"
                        value={settings.twitterImage}
                        onChange={(e) => handleInputChange('twitterImage', e.target.value)}
                        placeholder="https://exemplo.com/twitter-image.jpg"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="twitterDescription">Descrição Twitter</Label>
                    <Textarea
                      id="twitterDescription"
                      value={settings.twitterDescription}
                      onChange={(e) => handleInputChange('twitterDescription', e.target.value)}
                      placeholder="Descrição para Twitter"
                      rows={2}
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba Schema.org */}
        <TabsContent value="schema" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[16px]">
                <FileText className="w-5 h-5" />
                Dados Estruturados (Schema.org)
              </CardTitle>
              <CardDescription>
                Configure dados estruturados para rich snippets nos resultados de busca
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <Label>Ativar Schema Markup</Label>
                <Switch
                  checked={settings.enableSchemaMarkup}
                  onCheckedChange={(checked) => handleInputChange('enableSchemaMarkup', checked)}
                />
              </div>

              {settings.enableSchemaMarkup && (
                <>
                  <Alert>
                    <Info className="w-4 h-4" />
                    <AlertDescription>
                      Os dados estruturados ajudam os buscadores a entender melhor o conteúdo do site,
                      podendo resultar em rich snippets nos resultados de busca.
                    </AlertDescription>
                  </Alert>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="organizationName" className="flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        Nome da Organização
                      </Label>
                      <Input
                        id="organizationName"
                        value={settings.organizationName}
                        onChange={(e) => handleInputChange('organizationName', e.target.value)}
                        placeholder="Prefeitura Municipal de Timon"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="organizationType">Tipo</Label>
                      <Select
                        value={settings.organizationType}
                        onValueChange={(value) => handleInputChange('organizationType', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="GovernmentOrganization">Government Organization</SelectItem>
                          <SelectItem value="Organization">Organization</SelectItem>
                          <SelectItem value="LocalBusiness">Local Business</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="organizationUrl" className="flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        URL
                      </Label>
                      <Input
                        id="organizationUrl"
                        value={settings.organizationUrl}
                        onChange={(e) => handleInputChange('organizationUrl', e.target.value)}
                        placeholder="https://timon.ma.gov.br"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="organizationLogo" className="flex items-center gap-2">
                        <Image className="w-4 h-4" />
                        Logo
                      </Label>
                      <Input
                        id="organizationLogo"
                        value={settings.organizationLogo}
                        onChange={(e) => handleInputChange('organizationLogo', e.target.value)}
                        placeholder="https://timon.ma.gov.br/logo.png"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="organizationAddress" className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Endereço Completo
                    </Label>
                    <Input
                      id="organizationAddress"
                      value={settings.organizationAddress}
                      onChange={(e) => handleInputChange('organizationAddress', e.target.value)}
                      placeholder="Rua São José, nº 1000, Centro, Timon - MA, 65630-000"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="organizationPhone" className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Telefone
                      </Label>
                      <Input
                        id="organizationPhone"
                        value={settings.organizationPhone}
                        onChange={(e) => handleInputChange('organizationPhone', e.target.value)}
                        placeholder="(99) 3212-3000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="organizationEmail" className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        E-mail
                      </Label>
                      <Input
                        id="organizationEmail"
                        value={settings.organizationEmail}
                        onChange={(e) => handleInputChange('organizationEmail', e.target.value)}
                        placeholder="contato@timon.ma.gov.br"
                      />
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba Analytics */}
        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[16px]">
                <BarChart3 className="w-5 h-5" />
                Google Analytics & Tracking
              </CardTitle>
              <CardDescription>
                Configure códigos de rastreamento para análise de tráfego
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="googleAnalyticsId">Google Analytics ID</Label>
                <Input
                  id="googleAnalyticsId"
                  value={settings.googleAnalyticsId}
                  onChange={(e) => handleInputChange('googleAnalyticsId', e.target.value)}
                  placeholder="G-XXXXXXXXXX ou UA-XXXXXXXXX-X"
                />
                <p className="text-sm text-muted-foreground">
                  ID do Google Analytics 4 (GA4) ou Universal Analytics
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="googleSearchConsole">Google Search Console</Label>
                <Input
                  id="googleSearchConsole"
                  value={settings.googleSearchConsole}
                  onChange={(e) => handleInputChange('googleSearchConsole', e.target.value)}
                  placeholder="XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                />
                <p className="text-sm text-muted-foreground">
                  Meta tag de verificação do Search Console (content value)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="facebookPixelId">Facebook Pixel ID</Label>
                <Input
                  id="facebookPixelId"
                  value={settings.facebookPixelId}
                  onChange={(e) => handleInputChange('facebookPixelId', e.target.value)}
                  placeholder="XXXXXXXXXXXXXXX"
                />
                <p className="text-sm text-muted-foreground">
                  ID do Facebook Pixel para tracking de redes sociais
                </p>
              </div>

              <Alert>
                <Info className="w-4 h-4" />
                <AlertDescription>
                  Os códigos de rastreamento são importantes para analisar o desempenho do site,
                  mas certifique-se de estar em conformidade com a LGPD.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba Ferramentas */}
        <TabsContent value="tools" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[16px]">
                <Settings className="w-5 h-5" />
                Ferramentas SEO
              </CardTitle>
              <CardDescription>
                Configure recursos técnicos para otimização
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Sitemap XML</Label>
                      <p className="text-sm text-muted-foreground">
                        Gera sitemap.xml automaticamente
                      </p>
                    </div>
                    <Switch
                      checked={settings.enableSitemap}
                      onCheckedChange={(checked) => handleInputChange('enableSitemap', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Robots.txt</Label>
                      <p className="text-sm text-muted-foreground">
                        Arquivo de diretrizes para buscadores
                      </p>
                    </div>
                    <Switch
                      checked={settings.enableRobotsTxt}
                      onCheckedChange={(checked) => handleInputChange('enableRobotsTxt', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Breadcrumbs</Label>
                      <p className="text-sm text-muted-foreground">
                        Navegação estruturada nas páginas
                      </p>
                    </div>
                    <Switch
                      checked={settings.enableBreadcrumbs}
                      onCheckedChange={(checked) => handleInputChange('enableBreadcrumbs', checked)}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <Button
                    variant="outline"
                    onClick={handleGenerateSitemap}
                    className="w-full justify-start"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Gerar Sitemap
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Baixar Robots.txt
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Ver Sitemap
                  </Button>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-2">Links Úteis</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <Button variant="ghost" size="sm" className="justify-start">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Google Search Console
                  </Button>
                  <Button variant="ghost" size="sm" className="justify-start">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Google Analytics
                  </Button>
                  <Button variant="ghost" size="sm" className="justify-start">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Teste Rich Snippets
                  </Button>
                  <Button variant="ghost" size="sm" className="justify-start">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    PageSpeed Insights
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba Análise */}
        <TabsContent value="analysis" className="space-y-6">
          <div className="grid gap-6">
            {seoScores.map((scoreData) => (
              <Card key={scoreData.category}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-[16px]">
                      <Eye className="w-5 h-5" />
                      {scoreData.category}
                    </CardTitle>
                    <Badge className={getStatusColor(scoreData.status)}>
                      {scoreData.score}/{scoreData.maxScore}
                    </Badge>
                  </div>
                  <Progress value={(scoreData.score / scoreData.maxScore) * 100} className="h-2" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {scoreData.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-3">
                        {getItemStatusIcon(item.status)}
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{item.title}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Ações Recomendadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Alert>
                  <AlertCircle className="w-4 h-4" />
                  <AlertDescription className="font-medium">
                    Adicionar texto alternativo em 3 imagens sem alt text
                  </AlertDescription>
                </Alert>
                <Alert>
                  <Info className="w-4 h-4" />
                  <AlertDescription className="font-medium">
                    Reduzir número de palavras-chave para melhor foco
                  </AlertDescription>
                </Alert>
                <Alert>
                  <CheckCircle className="w-4 h-4" />
                  <AlertDescription className="font-medium text-green-700">
                    Site está bem otimizado para dispositivos móveis
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}