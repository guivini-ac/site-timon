import { useState, useEffect } from 'react';
import { useAdmin } from '../AdminContext';
import { 
  Code2, 
  FileCode, 
  Save, 
  Download, 
  Upload, 
  Eye, 
  Settings, 
  Palette,
  Zap,
  Book,
  Lightbulb,
  Globe,
  Smartphone,
  Monitor,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Copy,
  ExternalLink,
  X,
  Plus
} from 'lucide-react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Badge } from '../../ui/badge';
import { Separator } from '../../ui/separator';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../../ui/select';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Switch } from '../../ui/switch';
import { AdvancedHTMLEditor } from '../components/AdvancedHTMLEditor';
import { CodeEditorField } from '../components/CodeEditorField';
import { useCodeEditor } from '../../../hooks/useCodeEditor';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '../../ui/dialog';
import { ScrollArea } from '../../ui/scroll-area';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '../../ui/tooltip';

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  code: string;
  preview?: string;
}

const htmlTemplates: Template[] = [
  {
    id: 'basic-page',
    name: 'Página Básica Governamental',
    description: 'Template padrão para páginas institucionais',
    category: 'Páginas',
    code: `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Título da Página - Prefeitura de Timon</title>
    <meta name="description" content="Descrição da página para SEO">
    <link href="https://cdn.tailwindcss.com/3.4.0/tailwind.min.css" rel="stylesheet">
</head>
<body class="bg-gray-50">
    <header class="bg-blue-600 text-white py-4">
        <div class="container mx-auto px-4 max-w-7xl">
            <h1 class="text-2xl font-bold">Prefeitura Municipal de Timon</h1>
            <p class="text-blue-100">Servindo com transparência e eficiência</p>
        </div>
    </header>
    
    <main class="container mx-auto px-4 max-w-7xl py-8">
        <nav aria-label="Breadcrumb" class="mb-6">
            <ol class="flex space-x-2 text-sm">
                <li><a href="/" class="text-blue-600 hover:underline">Início</a></li>
                <li><span class="text-gray-500">></span></li>
                <li class="text-gray-700">Página Atual</li>
            </ol>
        </nav>
        
        <section class="bg-white rounded-lg shadow-sm p-8">
            <header class="mb-6">
                <h1 class="text-3xl font-bold text-gray-900 mb-2">Título Principal da Página</h1>
                <p class="text-lg text-gray-600">Subtítulo ou descrição da página</p>
            </header>
            
            <div class="prose prose-lg max-w-none">
                <p class="lead">Este é um parágrafo de destaque que introduz o conteúdo principal da página.</p>
                
                <h2>Seção Principal</h2>
                <p>Conteúdo principal da página. Use esta área para fornecer informações detalhadas sobre o assunto da página.</p>
                
                <h3>Subseção</h3>
                <p>Informações adicionais organizadas em subseções para melhor legibilidade.</p>
                
                <ul>
                    <li>Item de lista 1</li>
                    <li>Item de lista 2</li>
                    <li>Item de lista 3</li>
                </ul>
            </div>
        </section>
    </main>
    
    <footer class="bg-gray-800 text-white py-8 mt-12">
        <div class="container mx-auto px-4 max-w-7xl">
            <p class="text-center text-gray-300">© 2025 Prefeitura Municipal de Timon - Todos os direitos reservados</p>
        </div>
    </footer>
</body>
</html>`
  },
  {
    id: 'service-page',
    name: 'Página de Serviços',
    description: 'Template para páginas de serviços públicos',
    category: 'Serviços',
    code: `<section class="py-8">
    <div class="container mx-auto px-4 max-w-7xl">
        <header class="text-center mb-12">
            <h1 class="text-3xl font-bold text-gray-900 mb-4">Nossos Serviços</h1>
            <p class="text-lg text-gray-600 max-w-2xl mx-auto">
                A Prefeitura de Timon oferece diversos serviços para facilitar a vida do cidadão
            </p>
        </header>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div class="service-card bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div class="service-icon bg-blue-100 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
                    <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                </div>
                <h3 class="text-xl font-semibold text-gray-900 mb-2">Documentos</h3>
                <p class="text-gray-600 mb-4">Emissão de certidões, alvarás e documentos municipais</p>
                <a href="#" class="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
                    Acessar serviço
                    <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                </a>
            </div>
            
            <div class="service-card bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div class="service-icon bg-green-100 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
                    <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                    </svg>
                </div>
                <h3 class="text-xl font-semibold text-gray-900 mb-2">Saúde</h3>
                <p class="text-gray-600 mb-4">Agendamento de consultas e informações sobre UBS</p>
                <a href="#" class="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
                    Acessar serviço
                    <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                </a>
            </div>
            
            <div class="service-card bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div class="service-icon bg-yellow-100 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
                    <svg class="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                    </svg>
                </div>
                <h3 class="text-xl font-semibold text-gray-900 mb-2">Educação</h3>
                <p class="text-gray-600 mb-4">Matrícula escolar e informações educacionais</p>
                <a href="#" class="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
                    Acessar serviço
                    <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                </a>
            </div>
        </div>
    </div>
</section>`
  },
  {
    id: 'news-section',
    name: 'Seção de Notícias',
    description: 'Grid de notícias com cards responsivos',
    category: 'Notícias',
    code: `<section class="py-12 bg-gray-50">
    <div class="container mx-auto px-4 max-w-7xl">
        <header class="text-center mb-12">
            <h2 class="text-3xl font-bold text-gray-900 mb-4">Últimas Notícias</h2>
            <p class="text-lg text-gray-600">Mantenha-se informado sobre as novidades da cidade</p>
        </header>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <article class="news-card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div class="news-image aspect-video bg-gray-200 overflow-hidden">
                    <img src="/api/placeholder/400/250" alt="Notícia" class="w-full h-full object-cover hover:scale-105 transition-transform duration-300">
                </div>
                <div class="p-6">
                    <div class="flex items-center gap-2 mb-3">
                        <span class="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">Saúde</span>
                        <time class="text-sm text-gray-500">15 de Agosto, 2025</time>
                    </div>
                    <h3 class="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                        Nova UBS inaugurada no Bairro São José
                    </h3>
                    <p class="text-gray-600 mb-4 line-clamp-3">
                        A nova Unidade Básica de Saúde vai atender mais de 5 mil famílias da região com serviços de saúde primária e especializada.
                    </p>
                    <a href="#" class="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
                        Leia mais
                        <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                    </a>
                </div>
            </article>
            
            <article class="news-card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div class="news-image aspect-video bg-gray-200 overflow-hidden">
                    <img src="/api/placeholder/400/250" alt="Notícia" class="w-full h-full object-cover hover:scale-105 transition-transform duration-300">
                </div>
                <div class="p-6">
                    <div class="flex items-center gap-2 mb-3">
                        <span class="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">Infraestrutura</span>
                        <time class="text-sm text-gray-500">12 de Agosto, 2025</time>
                    </div>
                    <h3 class="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                        Programa de Pavimentação atinge 80% das obras
                    </h3>
                    <p class="text-gray-600 mb-4 line-clamp-3">
                        Mais 15 ruas receberam asfalto neste mês, melhorando significativamente a mobilidade urbana na cidade.
                    </p>
                    <a href="#" class="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
                        Leia mais
                        <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                    </a>
                </div>
            </article>
            
            <article class="news-card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div class="news-image aspect-video bg-gray-200 overflow-hidden">
                    <img src="/api/placeholder/400/250" alt="Notícia" class="w-full h-full object-cover hover:scale-105 transition-transform duration-300">
                </div>
                <div class="p-6">
                    <div class="flex items-center gap-2 mb-3">
                        <span class="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">Cultura</span>
                        <time class="text-sm text-gray-500">10 de Agosto, 2025</time>
                    </div>
                    <h3 class="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                        Festival de Cultura Popular movimenta o centro
                    </h3>
                    <p class="text-gray-600 mb-4 line-clamp-3">
                        Evento celebra as tradições culturais timonenses com shows, exposições e apresentações folclóricas.
                    </p>
                    <a href="#" class="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
                        Leia mais
                        <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                    </a>
                </div>
            </article>
        </div>
        
        <div class="text-center mt-10">
            <a href="/noticias" class="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                Ver todas as notícias
                <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                </svg>
            </a>
        </div>
    </div>
</section>`
  },
  {
    id: 'contact-form',
    name: 'Formulário de Contato Governamental',
    description: 'Formulário acessível para contato com a prefeitura',
    category: 'Formulários',
    code: `<section class="py-12">
    <div class="container mx-auto px-4 max-w-4xl">
        <div class="bg-white rounded-lg shadow-lg p-8">
            <header class="text-center mb-8">
                <h2 class="text-3xl font-bold text-gray-900 mb-4">Entre em Contato</h2>
                <p class="text-lg text-gray-600">
                    Envie sua mensagem, sugestão ou solicitação para a Prefeitura de Timon
                </p>
            </header>
            
            <form class="space-y-6" id="contato-form" method="POST" action="/api/contato">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label for="nome" class="block text-sm font-medium text-gray-700 mb-2">
                            Nome completo *
                        </label>
                        <input 
                            type="text" 
                            id="nome" 
                            name="nome" 
                            required
                            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="Seu nome completo"
                            aria-describedby="nome-help"
                        >
                        <p id="nome-help" class="mt-1 text-sm text-gray-500">Digite seu nome completo</p>
                    </div>
                    
                    <div>
                        <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                            E-mail *
                        </label>
                        <input 
                            type="email" 
                            id="email" 
                            name="email" 
                            required
                            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="seu@email.com"
                            aria-describedby="email-help"
                        >
                        <p id="email-help" class="mt-1 text-sm text-gray-500">Seu melhor e-mail para contato</p>
                    </div>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label for="telefone" class="block text-sm font-medium text-gray-700 mb-2">
                            Telefone
                        </label>
                        <input 
                            type="tel" 
                            id="telefone" 
                            name="telefone"
                            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="(99) 99999-9999"
                            aria-describedby="telefone-help"
                        >
                        <p id="telefone-help" class="mt-1 text-sm text-gray-500">Opcional - para contato mais rápido</p>
                    </div>
                    
                    <div>
                        <label for="assunto" class="block text-sm font-medium text-gray-700 mb-2">
                            Assunto *
                        </label>
                        <select 
                            id="assunto" 
                            name="assunto" 
                            required
                            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            aria-describedby="assunto-help"
                        >
                            <option value="">Selecione o assunto</option>
                            <option value="duvida">Dúvida</option>
                            <option value="sugestao">Sugestão</option>
                            <option value="reclamacao">Reclamação</option>
                            <option value="elogio">Elogio</option>
                            <option value="solicitacao">Solicitação de Serviço</option>
                            <option value="denuncia">Denúncia</option>
                            <option value="outros">Outros</option>
                        </select>
                        <p id="assunto-help" class="mt-1 text-sm text-gray-500">Escolha o tipo da sua mensagem</p>
                    </div>
                </div>
                
                <div>
                    <label for="mensagem" class="block text-sm font-medium text-gray-700 mb-2">
                        Mensagem *
                    </label>
                    <textarea 
                        id="mensagem" 
                        name="mensagem" 
                        rows="6" 
                        required
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-y"
                        placeholder="Descreva sua mensagem, dúvida ou solicitação..."
                        aria-describedby="mensagem-help"
                    ></textarea>
                    <p id="mensagem-help" class="mt-1 text-sm text-gray-500">
                        Seja claro e detalhado. Mínimo de 10 caracteres.
                    </p>
                </div>
                
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div class="flex items-start gap-3">
                        <svg class="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <div class="text-sm text-blue-800">
                            <p class="font-medium mb-1">Informações importantes:</p>
                            <ul class="space-y-1 text-blue-700">
                                <li>• Responderemos em até 5 dias úteis</li>
                                <li>• Para emergências, ligue: (99) 3212-3456</li>
                                <li>• Seus dados são protegidos pela LGPD</li>
                            </ul>
                        </div>
                    </div>
                </div>
                
                <div class="flex items-center">
                    <input 
                        type="checkbox" 
                        id="concordo" 
                        name="concordo" 
                        required
                        class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    >
                    <label for="concordo" class="ml-2 text-sm text-gray-700">
                        Concordo com os <a href="/termos" class="text-blue-600 hover:underline">termos de uso</a> 
                        e <a href="/privacidade" class="text-blue-600 hover:underline">política de privacidade</a> *
                    </label>
                </div>
                
                <div class="flex flex-col sm:flex-row gap-4 pt-4">
                    <button 
                        type="submit" 
                        class="flex-1 bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
                    >
                        <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                        </svg>
                        Enviar Mensagem
                    </button>
                    <button 
                        type="reset" 
                        class="px-8 py-4 border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors font-medium"
                    >
                        Limpar Formulário
                    </button>
                </div>
            </form>
        </div>
    </div>
</section>`
  }
];

export function HTMLEditorView() {
  const { setBreadcrumbs, addNotification } = useAdmin();
  
  const codeEditor = useCodeEditor(htmlTemplates[0].code);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [fileName, setFileName] = useState('');
  const [viewportSize, setViewportSize] = useState('desktop');
  const [currentTab, setCurrentTab] = useState('editor');

  useEffect(() => {
    setBreadcrumbs([{ label: 'Editor HTML Avançado' }]);
  }, [setBreadcrumbs]);

  const handleTemplateSelect = (template: Template) => {
    codeEditor.setInitialContent(template.code);
    setSelectedTemplate(template);
    setIsTemplateModalOpen(false);
    addNotification({
      type: 'success',
      title: 'Template carregado',
      message: `Template "${template.name}" foi carregado no editor.`
    });
  };

  const handleSaveFile = () => {
    const name = fileName || 'pagina.html';
    const blob = new Blob([codeEditor.content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name.endsWith('.html') ? name : `${name}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    codeEditor.saveContent();
    addNotification({
      type: 'success',
      title: 'Arquivo salvo',
      message: `Arquivo "${a.download}" foi baixado com sucesso.`
    });
  };

  const handleLoadFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        codeEditor.setInitialContent(content);
        setFileName(file.name.replace('.html', ''));
        addNotification({
          type: 'success',
          title: 'Arquivo carregado',
          message: `Arquivo "${file.name}" foi carregado no editor.`
        });
      };
      reader.readAsText(file);
    }
    // Reset input
    event.target.value = '';
  };

  const templateCategories = Array.from(new Set(htmlTemplates.map(t => t.category)));
  
  const stats = codeEditor.getStats();

  const getViewportClasses = () => {
    switch (viewportSize) {
      case 'mobile':
        return 'max-w-sm mx-auto';
      case 'tablet':
        return 'max-w-2xl mx-auto';
      default:
        return 'w-full';
    }
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Code2 className="h-6 w-6 text-primary" />
              Editor HTML Avançado
            </h1>
            <p className="text-muted-foreground">
              Editor profissional com syntax highlighting, autocomplete e templates governamentais
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setIsTemplateModalOpen(true)}>
              <Book className="h-4 w-4 mr-2" />
              Templates
            </Button>
            
            <input
              type="file"
              accept=".html,.htm"
              onChange={handleLoadFile}
              className="hidden"
              id="load-file"
            />
            <Button variant="outline" onClick={() => document.getElementById('load-file')?.click()}>
              <Upload className="h-4 w-4 mr-2" />
              Abrir
            </Button>
            
            <Button onClick={handleSaveFile} disabled={!codeEditor.content.trim()}>
              <Download className="h-4 w-4 mr-2" />
              Salvar
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.characters}</div>
                <div className="text-xs text-muted-foreground">Caracteres</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.lines}</div>
                <div className="text-xs text-muted-foreground">Linhas</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.words}</div>
                <div className="text-xs text-muted-foreground">Palavras</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-destructive">{stats.errors}</div>
                <div className="text-xs text-muted-foreground">Erros</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-warning">{stats.warnings}</div>
                <div className="text-xs text-muted-foreground">Avisos</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  {codeEditor.hasUnsavedChanges ? (
                    <AlertCircle className="h-4 w-4 text-warning" />
                  ) : (
                    <CheckCircle className="h-4 w-4 text-success" />
                  )}
                </div>
                <div className="text-xs text-muted-foreground">
                  {codeEditor.hasUnsavedChanges ? 'Modificado' : 'Salvo'}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Editor */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <div className="xl:col-span-3">
            <Card className="h-[600px]">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <FileCode className="h-4 w-4" />
                    {fileName || 'Novo Arquivo'}
                    {codeEditor.hasUnsavedChanges && <span className="text-warning">*</span>}
                  </CardTitle>
                  
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Nome do arquivo"
                      value={fileName}
                      onChange={(e) => setFileName(e.target.value)}
                      className="w-40 h-8 text-xs"
                    />
                    
                    <Separator orientation="vertical" className="h-6" />
                    
                    <div className="flex items-center gap-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant={viewportSize === 'mobile' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setViewportSize('mobile')}
                            className="p-2"
                          >
                            <Smartphone className="h-3 w-3" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Mobile</TooltipContent>
                      </Tooltip>
                      
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant={viewportSize === 'tablet' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setViewportSize('tablet')}
                            className="p-2"
                          >
                            <Monitor className="h-3 w-3" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Tablet</TooltipContent>
                      </Tooltip>
                      
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant={viewportSize === 'desktop' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setViewportSize('desktop')}
                            className="p-2"
                          >
                            <Monitor className="h-3 w-3" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Desktop</TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-0 h-[calc(100%-80px)]">
                <Tabs value={currentTab} onValueChange={setCurrentTab} className="h-full flex flex-col">
                  <div className="border-b px-6">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="editor">Editor</TabsTrigger>
                      <TabsTrigger value="preview">Preview</TabsTrigger>
                    </TabsList>
                  </div>
                  
                  <TabsContent value="editor" className="flex-1 m-0">
                    <div className="h-full">
                      <AdvancedHTMLEditor
                        value={codeEditor.content}
                        onChange={codeEditor.updateContent}
                        onValidation={codeEditor.setValidationErrors}
                        height={500}
                        showPreview={false}
                        className="h-full border-0"
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="preview" className="flex-1 m-0 p-6">
                    <div className="h-full border border-border rounded-lg overflow-hidden bg-white">
                      <div className="border-b p-3 bg-muted/30 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Eye className="h-4 w-4" />
                          <span className="text-sm font-medium">Preview</span>
                          <Badge variant="outline" className="text-xs">
                            {viewportSize.charAt(0).toUpperCase() + viewportSize.slice(1)}
                          </Badge>
                        </div>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newWindow = window.open('', '_blank');
                            if (newWindow) {
                              newWindow.document.write(codeEditor.content);
                              newWindow.document.close();
                            }
                          }}
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Nova Aba
                        </Button>
                      </div>
                      
                      <ScrollArea className="h-[calc(100%-60px)]">
                        <div className={`p-4 ${getViewportClasses()}`}>
                          <div 
                            dangerouslySetInnerHTML={{ __html: codeEditor.content }}
                            className="prose prose-sm max-w-none"
                          />
                        </div>
                      </ScrollArea>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-4">
            {/* Quick Actions */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={codeEditor.formatCode}
                >
                  <Code2 className="h-4 w-4 mr-2" />
                  Formatar Código
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigator.clipboard.writeText(codeEditor.content)}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copiar Código
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={codeEditor.resetContent}
                  disabled={!codeEditor.hasUnsavedChanges}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reverter
                </Button>
              </CardContent>
            </Card>
            
            {/* Current Template */}
            {selectedTemplate && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Template Atual</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">{selectedTemplate.name}</h4>
                    <p className="text-xs text-muted-foreground">{selectedTemplate.description}</p>
                    <Badge variant="outline" className="text-xs">
                      {selectedTemplate.category}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Validation Results */}
            {codeEditor.validationErrors.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    Validação
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {codeEditor.validationErrors.slice(0, 3).map((error, index) => (
                      <div key={index} className="text-xs p-2 rounded bg-muted">
                        <div className="font-medium">{error.message}</div>
                        <div className="text-muted-foreground">
                          Linha {error.line}, Coluna {error.column}
                        </div>
                      </div>
                    ))}
                    {codeEditor.validationErrors.length > 3 && (
                      <p className="text-xs text-center text-muted-foreground">
                        +{codeEditor.validationErrors.length - 3} mais
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Template Modal */}
        <Dialog open={isTemplateModalOpen} onOpenChange={setIsTemplateModalOpen}>
          <DialogContent className="max-w-6xl max-h-[85vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Book className="h-5 w-5" />
                Templates HTML Governamentais
              </DialogTitle>
              <DialogDescription>
                Escolha um template otimizado para sites governamentais como base para seu código
              </DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue={templateCategories[0]} className="flex-1">
              <TabsList className="grid w-full grid-cols-4">
                {templateCategories.map(category => (
                  <TabsTrigger key={category} value={category}>
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {templateCategories.map(category => (
                <TabsContent key={category} value={category} className="mt-4">
                  <ScrollArea className="h-[60vh]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-4">
                      {htmlTemplates
                        .filter(template => template.category === category)
                        .map(template => (
                          <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-sm">{template.name}</CardTitle>
                              <CardDescription className="text-xs">
                                {template.description}
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-3">
                                <div className="bg-gray-100 rounded p-3 font-mono text-xs overflow-hidden">
                                  <pre className="line-clamp-4">
                                    {template.code.substring(0, 200)}...
                                  </pre>
                                </div>
                                <Button 
                                  onClick={() => handleTemplateSelect(template)}
                                  className="w-full"
                                  size="sm"
                                >
                                  <Plus className="h-3 w-3 mr-1" />
                                  Usar Template
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
              ))}
            </Tabs>
            
            <div className="flex justify-end pt-4 border-t">
              <Button variant="outline" onClick={() => setIsTemplateModalOpen(false)}>
                <X className="h-4 w-4 mr-2" />
                Fechar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}