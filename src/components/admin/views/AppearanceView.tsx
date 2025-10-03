import React, { useState } from 'react';
import { 
  Palette, 
  Type, 
  Layout, 
  Image,
  Monitor,
  Smartphone,
  Tablet,
  Sun,
  Moon,
  Eye,
  Download,
  Upload,
  RefreshCw,
  Save,
  Undo,
  Copy,
  Settings,
  Paintbrush,
  Grid,
  Layers,
  Zap,
  Code,
  Globe,
  Camera,
  Edit3,
  Sliders,
  Contrast,
  Maximize,
  RotateCcw
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
import { Slider } from '../../ui/slider';
import { RadioGroup, RadioGroupItem } from '../../ui/radio-group';
import { Alert, AlertDescription } from '../../ui/alert';
import { ScrollArea } from '../../ui/scroll-area';
import { toast } from 'sonner@2.0.3';

interface ThemeSettings {
  // Cores Principais
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  
  // Identidade Visual
  headerLogoUrl: string;
  footerLogoUrl: string;
  logoAltUrl: string; // Logo alternativo para tema escuro
  faviconUrl: string;
  brandName: string;
  
  // Tipografia
  primaryFont: string;
  secondaryFont: string;
  fontSize: number;
  lineHeight: number;
  
  // Layout
  containerMaxWidth: string;
  borderRadius: number;
  spacing: number;
  
  // Modo Escuro
  darkModeEnabled: boolean;
  darkModePrimary: string;
  darkModeBackground: string;
  darkModeText: string;
  
  // Componentes
  buttonStyle: 'rounded' | 'sharp' | 'pill';
  cardShadow: 'none' | 'sm' | 'md' | 'lg';
  borderWidth: number;
  
  // Layout Avançado
  headerLayout: 'default' | 'centered' | 'minimal';
  footerLayout: 'default' | 'minimal' | 'extended';
  sidebarPosition: 'left' | 'right' | 'none';
}

interface ColorPalette {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

interface FontOption {
  name: string;
  value: string;
  preview: string;
}

export function AppearanceView() {
  const [activeTab, setActiveTab] = useState('colors');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isLoading, setIsLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const [settings, setSettings] = useState<ThemeSettings>({
    // Cores da Prefeitura de Timon
    primaryColor: '#144c9c',
    secondaryColor: '#228B22',
    accentColor: '#f4b728',
    backgroundColor: '#ffffff',
    textColor: '#333333',
    
    // Identidade
    headerLogoUrl: 'https://i.ibb.co/kgXRL9pT/PREFEITURA-HORIZONTAL-PADRA-O-COR.pngs',
    footerLogoUrl: 'https://i.ibb.co/yBmCGg0j/PREFEITURA-HORIZONTAL-PADRA-O-BRANCA.png',
    logoAltUrl: '',
    faviconUrl: '',
    brandName: 'Prefeitura Municipal de Timon',
    
    // Tipografia
    primaryFont: 'Roboto Condensed',
    secondaryFont: 'Open Sans',
    fontSize: 16,
    lineHeight: 1.6,
    
    // Layout
    containerMaxWidth: '1200px',
    borderRadius: 8,
    spacing: 16,
    
    // Modo Escuro
    darkModeEnabled: true,
    darkModePrimary: '#5a7abe',
    darkModeBackground: '#1a1a1a',
    darkModeText: '#ffffff',
    
    // Componentes
    buttonStyle: 'rounded',
    cardShadow: 'sm',
    borderWidth: 1,
    
    // Layout
    headerLayout: 'default',
    footerLayout: 'default',
    sidebarPosition: 'left'
  });

  // Carregar configurações salvas ao inicializar
  React.useEffect(() => {
    const savedConfig = localStorage.getItem('timon-appearance-config');
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig);
        setSettings(prev => ({ ...prev, ...config }));
      } catch (error) {
        console.error('Erro ao carregar configurações:', error);
      }
    }
  }, []);

  // Paletas de cores predefinidas
  const colorPalettes: ColorPalette[] = [
    {
      name: 'Timon Oficial',
      primary: '#144c9c',
      secondary: '#228B22',
      accent: '#f4b728',
      background: '#ffffff',
      text: '#333333'
    },
    {
      name: 'Azul Governamental',
      primary: '#1e40af',
      secondary: '#0f766e',
      accent: '#f59e0b',
      background: '#ffffff',
      text: '#1f2937'
    },
    {
      name: 'Verde Institucional',
      primary: '#059669',
      secondary: '#0d9488',
      accent: '#dc2626',
      background: '#ffffff',
      text: '#374151'
    },
    {
      name: 'Neutro Moderno',
      primary: '#374151',
      secondary: '#6b7280',
      accent: '#3b82f6',
      background: '#ffffff',
      text: '#111827'
    }
  ];

  // Opções de fontes
  const fontOptions: FontOption[] = [
    { name: 'Roboto Condensed', value: 'Roboto Condensed', preview: 'Rápido e Legível' },
    { name: 'Open Sans', value: 'Open Sans', preview: 'Clean e Profissional' },
    { name: 'Montserrat', value: 'Montserrat', preview: 'Moderno e Elegante' },
    { name: 'Lato', value: 'Lato', preview: 'Amigável e Claro' },
    { name: 'Poppins', value: 'Poppins', preview: 'Jovem e Dinâmico' },
    { name: 'Source Sans Pro', value: 'Source Sans Pro', preview: 'Técnico e Limpo' }
  ];

  const handleSettingsChange = (field: keyof ThemeSettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleColorPaletteSelect = (palette: ColorPalette) => {
    setSettings(prev => ({
      ...prev,
      primaryColor: palette.primary,
      secondaryColor: palette.secondary,
      accentColor: palette.accent,
      backgroundColor: palette.background,
      textColor: palette.text
    }));
    
    toast.success('Paleta aplicada', {
      description: `Tema "${palette.name}" foi aplicado com sucesso.`
    });
  };

  const handleSave = async () => {
    setIsLoading(true);
    
    try {
      // Simular salvamento das configurações
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Salvar no localStorage para persistir as configurações
      const appearanceConfig = {
        headerLogoUrl: settings.headerLogoUrl,
        footerLogoUrl: settings.footerLogoUrl,
        brandName: settings.brandName,
        primaryColor: settings.primaryColor,
        secondaryColor: settings.secondaryColor,
        accentColor: settings.accentColor,
        backgroundColor: settings.backgroundColor,
        textColor: settings.textColor,
        logoAltUrl: settings.logoAltUrl,
        faviconUrl: settings.faviconUrl
      };
      
      localStorage.setItem('timon-appearance-config', JSON.stringify(appearanceConfig));
      
      // Disparar evento customizado para notificar outros componentes
      window.dispatchEvent(new CustomEvent('appearanceConfigUpdated', { detail: appearanceConfig }));
      
      toast.success('Tema salvo com sucesso!', {
        description: 'As configurações de aparência foram aplicadas ao site.'
      });
    } catch (error) {
      toast.error('Erro ao salvar tema', {
        description: 'Tente novamente ou contate o suporte.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    const defaultSettings = {
      primaryColor: '#144c9c',
      secondaryColor: '#228B22',
      accentColor: '#f4b728',
      backgroundColor: '#ffffff',
      textColor: '#333333',
      headerLogoUrl: 'https://i.ibb.co/kgXRL9pT/PREFEITURA-HORIZONTAL-PADRA-O-COR.pngs',
      footerLogoUrl: 'https://i.ibb.co/yBmCGg0j/PREFEITURA-HORIZONTAL-PADRA-O-BRANCA.png',
      logoAltUrl: '',
      faviconUrl: '',
      brandName: 'Prefeitura Municipal de Timon',
      primaryFont: 'Roboto Condensed',
      secondaryFont: 'Open Sans',
      fontSize: 16,
      lineHeight: 1.6,
      containerMaxWidth: '1200px',
      borderRadius: 8,
      spacing: 16,
      darkModeEnabled: true,
      darkModePrimary: '#5a7abe',
      darkModeBackground: '#1a1a1a',
      darkModeText: '#ffffff',
      buttonStyle: 'rounded',
      cardShadow: 'sm',
      borderWidth: 1,
      headerLayout: 'default',
      footerLayout: 'default',
      sidebarPosition: 'left'
    };
    
    setSettings(defaultSettings);
    
    // Limpar localStorage
    localStorage.removeItem('timon-appearance-config');
    
    // Disparar evento de reset
    window.dispatchEvent(new CustomEvent('appearanceConfigReset'));
    
    toast.info('Configurações resetadas', {
      description: 'Tema restaurado para as configurações padrão.'
    });
  };

  const handleExportTheme = () => {
    const themeData = JSON.stringify(settings, null, 2);
    const blob = new Blob([themeData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'timon-theme.json';
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('Tema exportado', {
      description: 'Arquivo de tema baixado com sucesso.'
    });
  };

  const getPreviewClass = () => {
    switch (previewDevice) {
      case 'tablet': return 'max-w-2xl';
      case 'mobile': return 'max-w-sm';
      default: return 'max-w-full';
    }
  };

  const tabs = [
    { id: 'colors', label: 'Cores', icon: Palette },
    { id: 'identity', label: 'Identidade', icon: Camera },
    { id: 'typography', label: 'Tipografia', icon: Type },
    { id: 'layout', label: 'Layout', icon: Layout },
    { id: 'components', label: 'Componentes', icon: Grid },
    { id: 'preview', label: 'Preview', icon: Eye }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Personalização da Aparência</h1>
          <p className="text-muted-foreground">
            Configure temas, cores, tipografia e elementos visuais do portal
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={handleReset}
            className="min-w-[120px]"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Restaurar
          </Button>
          <Button 
            variant="outline" 
            onClick={handleExportTheme}
            className="min-w-[120px]"
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar
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
                <Save className="w-4 h-4" />
                Salvar Tema
              </div>
            )}
          </Button>
        </div>
      </div>

      {/* Device Preview Selector */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <Label>Visualização do Dispositivo</Label>
            <div className="flex items-center bg-muted rounded-lg p-1">
              <Button
                variant={previewDevice === 'desktop' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setPreviewDevice('desktop')}
              >
                <Monitor className="w-4 h-4" />
              </Button>
              <Button
                variant={previewDevice === 'tablet' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setPreviewDevice('tablet')}
              >
                <Tablet className="w-4 h-4" />
              </Button>
              <Button
                variant={previewDevice === 'mobile' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setPreviewDevice('mobile')}
              >
                <Smartphone className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

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

        {/* Aba Cores */}
        <TabsContent value="colors" className="space-y-6">
          {/* Paletas Predefinidas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[16px]">
                <Palette className="w-5 h-5" />
                Paletas de Cores
              </CardTitle>
              <CardDescription>
                Escolha uma paleta predefinida ou personalize as cores
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {colorPalettes.map((palette, index) => (
                  <div 
                    key={index}
                    className="border rounded-lg p-4 cursor-pointer hover:border-primary transition-colors"
                    onClick={() => handleColorPaletteSelect(palette)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-sm">{palette.name}</h4>
                      <Button size="sm" variant="ghost">
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                    <div className="flex space-x-1 mb-2">
                      <div className="w-6 h-6 rounded" style={{ backgroundColor: palette.primary }} />
                      <div className="w-6 h-6 rounded" style={{ backgroundColor: palette.secondary }} />
                      <div className="w-6 h-6 rounded" style={{ backgroundColor: palette.accent }} />
                      <div className="w-6 h-6 rounded border" style={{ backgroundColor: palette.background }} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Cores Personalizadas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Paintbrush className="w-5 h-5" />
                Cores Personalizadas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Cor Primária</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="color"
                      value={settings.primaryColor}
                      onChange={(e) => handleSettingsChange('primaryColor', e.target.value)}
                      className="w-12 h-10 p-1 cursor-pointer"
                    />
                    <Input
                      value={settings.primaryColor}
                      onChange={(e) => handleSettingsChange('primaryColor', e.target.value)}
                      placeholder="#144c9c"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Cor Secundária</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="color"
                      value={settings.secondaryColor}
                      onChange={(e) => handleSettingsChange('secondaryColor', e.target.value)}
                      className="w-12 h-10 p-1 cursor-pointer"
                    />
                    <Input
                      value={settings.secondaryColor}
                      onChange={(e) => handleSettingsChange('secondaryColor', e.target.value)}
                      placeholder="#228B22"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Cor de Destaque</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="color"
                      value={settings.accentColor}
                      onChange={(e) => handleSettingsChange('accentColor', e.target.value)}
                      className="w-12 h-10 p-1 cursor-pointer"
                    />
                    <Input
                      value={settings.accentColor}
                      onChange={(e) => handleSettingsChange('accentColor', e.target.value)}
                      placeholder="#f4b728"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Cor de Fundo</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="color"
                      value={settings.backgroundColor}
                      onChange={(e) => handleSettingsChange('backgroundColor', e.target.value)}
                      className="w-12 h-10 p-1 cursor-pointer"
                    />
                    <Input
                      value={settings.backgroundColor}
                      onChange={(e) => handleSettingsChange('backgroundColor', e.target.value)}
                      placeholder="#ffffff"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Cor do Texto</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="color"
                      value={settings.textColor}
                      onChange={(e) => handleSettingsChange('textColor', e.target.value)}
                      className="w-12 h-10 p-1 cursor-pointer"
                    />
                    <Input
                      value={settings.textColor}
                      onChange={(e) => handleSettingsChange('textColor', e.target.value)}
                      placeholder="#333333"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Modo Escuro */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Moon className="w-5 h-5" />
                Configurações do Modo Escuro
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Ativar Modo Escuro</Label>
                  <p className="text-sm text-muted-foreground">
                    Permite aos usuários alternar entre tema claro e escuro
                  </p>
                </div>
                <Switch
                  checked={settings.darkModeEnabled}
                  onCheckedChange={(checked) => handleSettingsChange('darkModeEnabled', checked)}
                />
              </div>

              {settings.darkModeEnabled && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                  <div className="space-y-2">
                    <Label>Cor Primária (Escuro)</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="color"
                        value={settings.darkModePrimary}
                        onChange={(e) => handleSettingsChange('darkModePrimary', e.target.value)}
                        className="w-12 h-10 p-1 cursor-pointer"
                      />
                      <Input
                        value={settings.darkModePrimary}
                        onChange={(e) => handleSettingsChange('darkModePrimary', e.target.value)}
                        placeholder="#5a7abe"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Fundo (Escuro)</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="color"
                        value={settings.darkModeBackground}
                        onChange={(e) => handleSettingsChange('darkModeBackground', e.target.value)}
                        className="w-12 h-10 p-1 cursor-pointer"
                      />
                      <Input
                        value={settings.darkModeBackground}
                        onChange={(e) => handleSettingsChange('darkModeBackground', e.target.value)}
                        placeholder="#1a1a1a"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Texto (Escuro)</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="color"
                        value={settings.darkModeText}
                        onChange={(e) => handleSettingsChange('darkModeText', e.target.value)}
                        className="w-12 h-10 p-1 cursor-pointer"
                      />
                      <Input
                        value={settings.darkModeText}
                        onChange={(e) => handleSettingsChange('darkModeText', e.target.value)}
                        placeholder="#ffffff"
                      />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba Identidade */}
        <TabsContent value="identity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[16px]">
                <Camera className="w-5 h-5" />
                Identidade Visual
              </CardTitle>
              <CardDescription>
                Configure logos, ícones e elementos de marca
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Nome da Marca</Label>
                <Input
                  value={settings.brandName}
                  onChange={(e) => handleSettingsChange('brandName', e.target.value)}
                  placeholder="Prefeitura Municipal de Timon"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Logo do Cabeçalho</Label>
                  <Input
                    value={settings.headerLogoUrl}
                    onChange={(e) => handleSettingsChange('headerLogoUrl', e.target.value)}
                    placeholder="https://exemplo.com/logo-header.png"
                  />
                  <Button variant="outline" size="sm" className="w-full">
                    <Upload className="w-4 h-4 mr-2" />
                    Fazer Upload
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Logo exibida no cabeçalho do site (recomendado: fundo transparente ou claro)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Logo do Rodapé</Label>
                  <Input
                    value={settings.footerLogoUrl}
                    onChange={(e) => handleSettingsChange('footerLogoUrl', e.target.value)}
                    placeholder="https://exemplo.com/logo-footer.png"
                  />
                  <Button variant="outline" size="sm" className="w-full">
                    <Upload className="w-4 h-4 mr-2" />
                    Fazer Upload
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Logo exibida no rodapé do site (recomendado: versão branca ou clara)
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Logo Alternativo (Tema Escuro)</Label>
                <Input
                  value={settings.logoAltUrl}
                  onChange={(e) => handleSettingsChange('logoAltUrl', e.target.value)}
                  placeholder="https://exemplo.com/logo-dark.png"
                />
                <Button variant="outline" size="sm" className="w-full max-w-xs">
                  <Upload className="w-4 h-4 mr-2" />
                  Fazer Upload
                </Button>
                <p className="text-xs text-muted-foreground">
                  Logo alternativa para uso em tema escuro (opcional)
                </p>
              </div>

              <div className="space-y-2">
                <Label>Favicon</Label>
                <Input
                  value={settings.faviconUrl}
                  onChange={(e) => handleSettingsChange('faviconUrl', e.target.value)}
                  placeholder="https://exemplo.com/favicon.ico"
                />
                <Button variant="outline" size="sm" className="w-full max-w-xs">
                  <Upload className="w-4 h-4 mr-2" />
                  Fazer Upload do Favicon
                </Button>
              </div>

              {/* Preview dos Logos */}
              <div className="border rounded-lg p-4 bg-muted/30">
                <h4 className="font-medium mb-3">Preview dos Logos</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-white p-4 rounded border">
                    <Label className="text-xs text-muted-foreground mb-2 block">Cabeçalho</Label>
                    {settings.headerLogoUrl ? (
                      <div className="bg-gray-50 h-16 rounded flex items-center justify-center">
                        <img 
                          src={settings.headerLogoUrl} 
                          alt="Logo do cabeçalho"
                          className="h-12 w-auto object-contain"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.nextElementSibling!.classList.remove('hidden');
                          }}
                        />
                        <span className="text-xs text-gray-500 hidden">Erro ao carregar</span>
                      </div>
                    ) : (
                      <div className="bg-gray-100 h-16 rounded flex items-center justify-center">
                        <span className="text-xs text-gray-400">Sem logo do cabeçalho</span>
                      </div>
                    )}
                  </div>
                  <div className="bg-gray-900 p-4 rounded border">
                    <Label className="text-xs text-gray-300 mb-2 block">Rodapé</Label>
                    {settings.footerLogoUrl ? (
                      <div className="bg-gray-800 h-16 rounded flex items-center justify-center">
                        <img 
                          src={settings.footerLogoUrl} 
                          alt="Logo do rodapé"
                          className="h-12 w-auto object-contain"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.nextElementSibling!.classList.remove('hidden');
                          }}
                        />
                        <span className="text-xs text-gray-400 hidden">Erro ao carregar</span>
                      </div>
                    ) : (
                      <div className="bg-gray-800 h-16 rounded flex items-center justify-center">
                        <span className="text-xs text-gray-500">Sem logo do rodapé</span>
                      </div>
                    )}
                  </div>
                </div>
                {settings.logoAltUrl && (
                  <div className="bg-gray-900 p-4 rounded border">
                    <Label className="text-xs text-gray-300 mb-2 block">Logo Alternativo (Tema Escuro)</Label>
                    <div className="bg-gray-800 h-16 rounded flex items-center justify-center">
                      <img 
                        src={settings.logoAltUrl} 
                        alt="Logo alternativo"
                        className="h-12 w-auto object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.nextElementSibling!.classList.remove('hidden');
                        }}
                      />
                      <span className="text-xs text-gray-400 hidden">Erro ao carregar</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba Tipografia */}
        <TabsContent value="typography" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[16px]">
                <Type className="w-5 h-5" />
                Configurações de Tipografia
              </CardTitle>
              <CardDescription>
                Configure fontes, tamanhos e espaçamentos do texto
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Fontes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Fonte Principal (Títulos)</Label>
                  <Select
                    value={settings.primaryFont}
                    onValueChange={(value) => handleSettingsChange('primaryFont', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fontOptions.map((font) => (
                        <SelectItem key={font.value} value={font.value}>
                          <div className="flex flex-col">
                            <span>{font.name}</span>
                            <span className="text-xs text-muted-foreground">{font.preview}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Fonte Secundária (Corpo)</Label>
                  <Select
                    value={settings.secondaryFont}
                    onValueChange={(value) => handleSettingsChange('secondaryFont', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fontOptions.map((font) => (
                        <SelectItem key={font.value} value={font.value}>
                          <div className="flex flex-col">
                            <span>{font.name}</span>
                            <span className="text-xs text-muted-foreground">{font.preview}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Tamanhos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label>Tamanho da Fonte Base</Label>
                  <div className="space-y-2">
                    <Slider
                      value={[settings.fontSize]}
                      onValueChange={(value) => handleSettingsChange('fontSize', value[0])}
                      min={12}
                      max={20}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>12px</span>
                      <span className="font-medium">{settings.fontSize}px</span>
                      <span>20px</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Altura da Linha</Label>
                  <div className="space-y-2">
                    <Slider
                      value={[settings.lineHeight]}
                      onValueChange={(value) => handleSettingsChange('lineHeight', value[0])}
                      min={1.2}
                      max={2.0}
                      step={0.1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>1.2</span>
                      <span className="font-medium">{settings.lineHeight}</span>
                      <span>2.0</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Preview de Tipografia */}
              <div className="border rounded-lg p-4 bg-muted/30">
                <h4 className="font-medium mb-4">Preview da Tipografia</h4>
                <div className="space-y-4" style={{ 
                  fontFamily: settings.secondaryFont, 
                  fontSize: settings.fontSize, 
                  lineHeight: settings.lineHeight 
                }}>
                  <h1 style={{ fontFamily: settings.primaryFont }} className="text-3xl font-bold">
                    Prefeitura Municipal de Timon
                  </h1>
                  <h2 style={{ fontFamily: settings.primaryFont }} className="text-2xl">
                    Cidade Crescimento
                  </h2>
                  <p>
                    Este é um exemplo de como o texto ficará no site com as configurações 
                    tipográficas selecionadas. A fonte principal é usada para títulos e 
                    cabeçalhos, enquanto a fonte secundária é aplicada ao corpo do texto.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Texto menor com informações complementares e detalhes.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba Layout */}
        <TabsContent value="layout" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[16px]">
                <Layout className="w-5 h-5" />
                Configurações de Layout
              </CardTitle>
              <CardDescription>
                Configure estrutura, espaçamentos e organização visual
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Configurações Gerais */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Largura Máxima do Container</Label>
                  <Select
                    value={settings.containerMaxWidth}
                    onValueChange={(value) => handleSettingsChange('containerMaxWidth', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1024px">1024px (Compacto)</SelectItem>
                      <SelectItem value="1200px">1200px (Padrão)</SelectItem>
                      <SelectItem value="1400px">1400px (Amplo)</SelectItem>
                      <SelectItem value="100%">100% (Tela Cheia)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label>Raio das Bordas</Label>
                  <div className="space-y-2">
                    <Slider
                      value={[settings.borderRadius]}
                      onValueChange={(value) => handleSettingsChange('borderRadius', value[0])}
                      min={0}
                      max={20}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>0px</span>
                      <span className="font-medium">{settings.borderRadius}px</span>
                      <span>20px</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Espaçamento Interno</Label>
                  <div className="space-y-2">
                    <Slider
                      value={[settings.spacing]}
                      onValueChange={(value) => handleSettingsChange('spacing', value[0])}
                      min={8}
                      max={32}
                      step={2}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>8px</span>
                      <span className="font-medium">{settings.spacing}px</span>
                      <span>32px</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Layout Específico */}
              <Separator />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Layout do Cabeçalho</Label>
                  <RadioGroup
                    value={settings.headerLayout}
                    onValueChange={(value: any) => handleSettingsChange('headerLayout', value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="default" id="header-default" />
                      <Label htmlFor="header-default">Padrão</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="centered" id="header-centered" />
                      <Label htmlFor="header-centered">Centralizado</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="minimal" id="header-minimal" />
                      <Label htmlFor="header-minimal">Minimalista</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label>Layout do Rodapé</Label>
                  <RadioGroup
                    value={settings.footerLayout}
                    onValueChange={(value: any) => handleSettingsChange('footerLayout', value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="default" id="footer-default" />
                      <Label htmlFor="footer-default">Padrão</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="minimal" id="footer-minimal" />
                      <Label htmlFor="footer-minimal">Minimalista</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="extended" id="footer-extended" />
                      <Label htmlFor="footer-extended">Estendido</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label>Posição da Sidebar</Label>
                  <RadioGroup
                    value={settings.sidebarPosition}
                    onValueChange={(value: any) => handleSettingsChange('sidebarPosition', value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="left" id="sidebar-left" />
                      <Label htmlFor="sidebar-left">Esquerda</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="right" id="sidebar-right" />
                      <Label htmlFor="sidebar-right">Direita</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="none" id="sidebar-none" />
                      <Label htmlFor="sidebar-none">Sem Sidebar</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba Componentes */}
        <TabsContent value="components" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[16px]">
                <Grid className="w-5 h-5" />
                Estilização de Componentes
              </CardTitle>
              <CardDescription>
                Personalize a aparência de botões, cards e outros elementos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Botões */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4" />
                  <h4 className="font-medium">Botões</h4>
                </div>
                
                <div className="space-y-2">
                  <Label>Estilo dos Botões</Label>
                  <RadioGroup
                    value={settings.buttonStyle}
                    onValueChange={(value: any) => handleSettingsChange('buttonStyle', value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="rounded" id="button-rounded" />
                      <Label htmlFor="button-rounded">Arredondado</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="sharp" id="button-sharp" />
                      <Label htmlFor="button-sharp">Quadrado</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="pill" id="button-pill" />
                      <Label htmlFor="button-pill">Pílula</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Preview dos Botões */}
                <div className="flex flex-wrap gap-2 p-3 bg-muted/30 rounded">
                  <Button 
                    style={{ 
                      backgroundColor: settings.primaryColor,
                      borderRadius: settings.buttonStyle === 'pill' ? '50px' : 
                                   settings.buttonStyle === 'sharp' ? '4px' : 
                                   `${settings.borderRadius}px`
                    }}
                  >
                    Botão Primário
                  </Button>
                  <Button 
                    variant="outline"
                    style={{ 
                      borderColor: settings.primaryColor,
                      color: settings.primaryColor,
                      borderRadius: settings.buttonStyle === 'pill' ? '50px' : 
                                   settings.buttonStyle === 'sharp' ? '4px' : 
                                   `${settings.borderRadius}px`
                    }}
                  >
                    Botão Secundário
                  </Button>
                  <Button 
                    variant="ghost"
                    style={{ 
                      color: settings.primaryColor,
                      borderRadius: settings.buttonStyle === 'pill' ? '50px' : 
                                   settings.buttonStyle === 'sharp' ? '4px' : 
                                   `${settings.borderRadius}px`
                    }}
                  >
                    Botão Ghost
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Cards */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4" />
                  <h4 className="font-medium">Cards e Painéis</h4>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Sombra dos Cards</Label>
                    <Select
                      value={settings.cardShadow}
                      onValueChange={(value: any) => handleSettingsChange('cardShadow', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Sem Sombra</SelectItem>
                        <SelectItem value="sm">Sombra Sutil</SelectItem>
                        <SelectItem value="md">Sombra Média</SelectItem>
                        <SelectItem value="lg">Sombra Forte</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label>Espessura da Borda</Label>
                    <div className="space-y-2">
                      <Slider
                        value={[settings.borderWidth]}
                        onValueChange={(value) => handleSettingsChange('borderWidth', value[0])}
                        min={0}
                        max={4}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>0px</span>
                        <span className="font-medium">{settings.borderWidth}px</span>
                        <span>4px</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Preview do Card */}
                <div className="p-3 bg-muted/30 rounded">
                  <Card 
                    className={`max-w-sm ${
                      settings.cardShadow === 'none' ? 'shadow-none' :
                      settings.cardShadow === 'sm' ? 'shadow-sm' :
                      settings.cardShadow === 'md' ? 'shadow-md' :
                      'shadow-lg'
                    }`}
                    style={{
                      borderRadius: `${settings.borderRadius}px`,
                      borderWidth: `${settings.borderWidth}px`
                    }}
                  >
                    <CardHeader>
                      <CardTitle>Card de Exemplo</CardTitle>
                      <CardDescription>
                        Este é um exemplo de como os cards aparecerão no site.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">
                        Conteúdo do card com texto de exemplo para demonstrar a tipografia.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba Preview */}
        <TabsContent value="preview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[16px]">
                <Eye className="w-5 h-5" />
                Visualização em Tempo Real
              </CardTitle>
              <CardDescription>
                Veja como as configurações afetam a aparência do site
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className={`mx-auto transition-all duration-300 ${getPreviewClass()}`}>
                <div 
                  className="border rounded-lg overflow-hidden"
                  style={{
                    backgroundColor: settings.backgroundColor,
                    color: settings.textColor,
                    borderRadius: `${settings.borderRadius}px`
                  }}
                >
                  {/* Header Preview */}
                  <div 
                    className="p-4 border-b"
                    style={{ 
                      backgroundColor: settings.primaryColor,
                      color: settings.backgroundColor
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white/20 rounded" />
                        <h3 style={{ fontFamily: settings.primaryFont }}>
                          {settings.brandName}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-white/20 rounded" />
                        <div className="w-6 h-6 bg-white/20 rounded" />
                      </div>
                    </div>
                  </div>

                  {/* Content Preview */}
                  <div className="p-6 space-y-4">
                    <h1 
                      style={{ 
                        fontFamily: settings.primaryFont,
                        fontSize: `${settings.fontSize * 2}px`,
                        lineHeight: settings.lineHeight
                      }}
                    >
                      Bem-vindo ao Portal
                    </h1>
                    <p 
                      style={{ 
                        fontFamily: settings.secondaryFont,
                        fontSize: `${settings.fontSize}px`,
                        lineHeight: settings.lineHeight
                      }}
                    >
                      Este é um exemplo de como o texto aparecerá no site com as 
                      configurações selecionadas. A tipografia, cores e espaçamentos 
                      são aplicados em tempo real.
                    </p>

                    {/* Buttons Preview */}
                    <div className="flex flex-wrap gap-2">
                      <button
                        className="px-4 py-2 text-white transition-all"
                        style={{
                          backgroundColor: settings.primaryColor,
                          borderRadius: settings.buttonStyle === 'pill' ? '50px' : 
                                       settings.buttonStyle === 'sharp' ? '4px' : 
                                       `${settings.borderRadius}px`,
                          fontFamily: settings.secondaryFont
                        }}
                      >
                        Botão Primário
                      </button>
                      <button
                        className="px-4 py-2 bg-transparent border transition-all"
                        style={{
                          borderColor: settings.primaryColor,
                          color: settings.primaryColor,
                          borderRadius: settings.buttonStyle === 'pill' ? '50px' : 
                                       settings.buttonStyle === 'sharp' ? '4px' : 
                                       `${settings.borderRadius}px`,
                          fontFamily: settings.secondaryFont
                        }}
                      >
                        Botão Secundário
                      </button>
                    </div>

                    {/* Card Preview */}
                    <div 
                      className={`p-4 border ${
                        settings.cardShadow === 'none' ? '' :
                        settings.cardShadow === 'sm' ? 'shadow-sm' :
                        settings.cardShadow === 'md' ? 'shadow-md' :
                        'shadow-lg'
                      }`}
                      style={{
                        borderRadius: `${settings.borderRadius}px`,
                        borderWidth: `${settings.borderWidth}px`,
                        backgroundColor: settings.backgroundColor
                      }}
                    >
                      <h3 
                        style={{ 
                          fontFamily: settings.primaryFont,
                          fontSize: `${settings.fontSize * 1.25}px`
                        }}
                      >
                        Card de Exemplo
                      </h3>
                      <p 
                        className="mt-2"
                        style={{ 
                          fontFamily: settings.secondaryFont,
                          fontSize: `${settings.fontSize * 0.875}px`,
                          lineHeight: settings.lineHeight
                        }}
                      >
                        Este card demonstra como os componentes aparecerão com as 
                        configurações aplicadas.
                      </p>
                    </div>
                  </div>

                  {/* Footer Preview */}
                  <div 
                    className="p-4 border-t text-center"
                    style={{ 
                      backgroundColor: `${settings.primaryColor}20`,
                      borderColor: `${settings.primaryColor}40`
                    }}
                  >
                    <p 
                      className="text-sm"
                      style={{ 
                        fontFamily: settings.secondaryFont,
                        fontSize: `${settings.fontSize * 0.875}px`
                      }}
                    >
                      © 2024 {settings.brandName}. Todos os direitos reservados.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dicas de Acessibilidade */}
          <Alert>
            <Contrast className="w-4 h-4" />
            <AlertDescription>
              <strong>Dica de Acessibilidade:</strong> Certifique-se de que as cores escolhidas 
              tenham contraste suficiente para garantir legibilidade e acessibilidade para todos os usuários.
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>
    </div>
  );
}