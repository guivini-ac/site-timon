import { useEffect, useRef, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Separator } from '../../ui/separator';
import { 
  Code2, 
  Eye, 
  Settings, 
  Copy, 
  Check, 
  RotateCcw, 
  Maximize2, 
  Minimize2,
  FileCode,
  Palette,
  Zap,
  AlertCircle,
  CheckCircle,
  Info,
  Search,
  Replace,
  Download,
  Upload,
  Lightbulb,
  Braces,
  Terminal,
  Bug,
  FileText,
  Sparkles,
  Layers,
  Cpu,
  Globe,
  ShieldCheck,
  Accessibility,
  Wand2,
  Code,
  GitBranch,
  Play,
  Pause,
  Square,
  RefreshCw,
  Save,
  FolderOpen,
  History
} from 'lucide-react';
import { Switch } from '../../ui/switch';
import { Label } from '../../ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../../ui/select';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '../../ui/tooltip';
import { Input } from '../../ui/input';
import { ScrollArea } from '../../ui/scroll-area';
import { Progress } from '../../ui/progress';
import { Textarea } from '../../ui/textarea';

interface AdvancedHTMLEditorProps {
  value: string;
  onChange: (value: string) => void;
  onValidation?: (errors: ValidationError[]) => void;
  height?: number;
  readOnly?: boolean;
  showPreview?: boolean;
  className?: string;
}

interface ValidationError {
  line: number;
  column: number;
  message: string;
  severity: 'error' | 'warning' | 'info';
  rule?: string;
  suggestion?: string;
}

interface EditorTheme {
  name: string;
  label: string;
  dark: boolean;
  description?: string;
}

interface Snippet {
  label: string;
  insertText: string;
  detail: string;
  kind: string;
  category: string;
  description?: string;
  icon?: string;
  keywords?: string[];
}

interface CodeMetrics {
  lines: number;
  characters: number;
  words: number;
  tags: number;
  readabilityScore: number;
  accessibilityScore: number;
  seoScore: number;
}

interface EditorHistory {
  id: string;
  timestamp: Date;
  content: string;
  description: string;
}

const editorThemes: EditorTheme[] = [
  { name: 'vs', label: 'Visual Studio Light', dark: false, description: 'Tema claro padrão do Visual Studio' },
  { name: 'vs-dark', label: 'Visual Studio Dark', dark: true, description: 'Tema escuro padrão do Visual Studio' },
  { name: 'hc-black', label: 'Alto Contraste', dark: true, description: 'Tema de alto contraste para acessibilidade' },
  { name: 'timon-light', label: 'Timon Light', dark: false, description: 'Tema personalizado claro da Prefeitura de Timon' },
  { name: 'timon-dark', label: 'Timon Dark', dark: true, description: 'Tema personalizado escuro da Prefeitura de Timon' },
  { name: 'github-light', label: 'GitHub Light', dark: false, description: 'Tema inspirado no GitHub modo claro' },
  { name: 'monokai', label: 'Monokai', dark: true, description: 'Tema escuro inspirado no Sublime Text' }
];

const htmlSnippets: Snippet[] = [
  // Estruturas básicas
  {
    label: 'Seção Padrão Governamental',
    insertText: '<section class="py-12 bg-gradient-to-br from-blue-50 to-white" aria-labelledby="section-title">\n  <div class="container mx-auto px-4 max-w-7xl">\n    <div class="text-center mb-8">\n      <h2 id="section-title" class="text-3xl font-bold text-gray-900 mb-4">Título da Seção</h2>\n      <p class="text-xl text-gray-600 max-w-3xl mx-auto">Descrição da seção seguindo padrões de acessibilidade</p>\n    </div>\n    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">\n      <!-- Conteúdo da seção aqui -->\n    </div>\n  </div>\n</section>',
    detail: 'Estrutura de seção completa com acessibilidade e responsividade',
    kind: 'Estrutura',
    category: 'Layout',
    description: 'Seção padrão seguindo diretrizes de design governamental brasileiro',
    icon: 'Layers',
    keywords: ['seção', 'layout', 'responsivo', 'acessibilidade']
  },
  {
    label: 'Header Institucional',
    insertText: '<header class="bg-gradient-to-r from-blue-800 to-blue-900 text-white" role="banner">\n  <div class="container mx-auto px-4 max-w-7xl">\n    <div class="flex items-center justify-between py-4">\n      <div class="flex items-center space-x-4">\n        <img src="/logo-timon.png" alt="Prefeitura Municipal de Timon" class="h-12 w-auto" />\n        <div>\n          <h1 class="text-xl font-bold">Prefeitura Municipal de Timon</h1>\n          <p class="text-blue-200 text-sm">Maranhão - Brasil</p>\n        </div>\n      </div>\n      <nav class="hidden md:flex space-x-6" role="navigation" aria-label="Menu principal">\n        <a href="#" class="hover:text-blue-200 transition-colors">Início</a>\n        <a href="#" class="hover:text-blue-200 transition-colors">Serviços</a>\n        <a href="#" class="hover:text-blue-200 transition-colors">Notícias</a>\n        <a href="#" class="hover:text-blue-200 transition-colors">Contato</a>\n      </nav>\n    </div>\n  </div>\n</header>',
    detail: 'Cabeçalho institucional completo com navegação e acessibilidade',
    kind: 'Componente',
    category: 'Navegação',
    description: 'Header padrão para páginas institucionais',
    icon: 'Globe',
    keywords: ['header', 'cabeçalho', 'navegação', 'institucional']
  },
  {
    label: 'Card de Serviço Público',
    insertText: '<article class="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">\n  <div class="relative">\n    <div class="h-48 bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">\n      <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center">\n        <svg class="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">\n          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>\n        </svg>\n      </div>\n    </div>\n    <div class="absolute top-4 right-4">\n      <span class="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">Ativo</span>\n    </div>\n  </div>\n  <div class="p-6">\n    <h3 class="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">Nome do Serviço</h3>\n    <p class="text-gray-600 mb-4 line-clamp-3">Descrição detalhada do serviço público oferecido pela prefeitura aos cidadãos.</p>\n    <div class="flex items-center justify-between">\n      <div class="flex items-center space-x-2 text-sm text-gray-500">\n        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">\n          <path d="M10 2L3 7v11a1 1 0 001 1h12a1 1 0 001-1V7l-7-5z"></path>\n        </svg>\n        <span>Disponível online</span>\n      </div>\n      <a href="#" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium" aria-label="Acessar serviço: Nome do Serviço">\n        Acessar\n      </a>\n    </div>\n  </div>\n</article>',
    detail: 'Card moderno para apresentação de serviços públicos',
    kind: 'Componente',
    category: 'Conteúdo',
    description: 'Card otimizado para exibir serviços públicos com design atrativo',
    icon: 'FileText',
    keywords: ['card', 'serviço', 'público', 'design']
  },
  {
    label: 'Timeline de Eventos',
    insertText: '<div class="timeline-container max-w-4xl mx-auto">\n  <div class="relative">\n    <!-- Linha vertical -->\n    <div class="absolute left-8 top-0 bottom-0 w-0.5 bg-blue-200"></div>\n    \n    <!-- Item do timeline -->\n    <div class="relative flex items-start mb-8">\n      <div class="flex-shrink-0 w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">\n        01\n      </div>\n      <div class="ml-6 bg-white rounded-lg shadow-md p-6 flex-1">\n        <div class="flex items-center justify-between mb-2">\n          <h3 class="text-xl font-bold text-gray-900">Título do Evento</h3>\n          <span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">Em andamento</span>\n        </div>\n        <p class="text-gray-600 mb-3">Descrição detalhada do evento ou marco importante na administração pública.</p>\n        <div class="flex items-center text-sm text-gray-500">\n          <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">\n            <path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zM4 7h12v9H4V7z"></path>\n          </svg>\n          <time datetime="2024-01-15">15 de Janeiro de 2024</time>\n        </div>\n      </div>\n    </div>\n    \n    <!-- Repetir para outros eventos -->\n  </div>\n</div>',
    detail: 'Timeline visual para exibir cronologia de eventos e projetos',
    kind: 'Componente',
    category: 'Conteúdo',
    description: 'Linha do tempo responsiva para apresentar histórico ou planejamento',
    icon: 'GitBranch',
    keywords: ['timeline', 'cronologia', 'eventos', 'histórico']
  },
  {
    label: 'Formulário de Contato Avançado',
    insertText: '<form class="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8" novalidate>\n  <div class="text-center mb-8">\n    <h2 class="text-2xl font-bold text-gray-900 mb-2">Entre em Contato</h2>\n    <p class="text-gray-600">Envie sua mensagem e responderemos em até 24 horas</p>\n  </div>\n  \n  <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">\n    <div class="form-group">\n      <label for="nome" class="block text-sm font-semibold text-gray-700 mb-2">\n        Nome Completo <span class="text-red-500" aria-label="obrigatório">*</span>\n      </label>\n      <input \n        type="text" \n        id="nome" \n        name="nome" \n        required \n        aria-describedby="nome-error"\n        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"\n        placeholder="Digite seu nome completo"\n      />\n      <div id="nome-error" class="text-red-500 text-sm mt-1 hidden" role="alert"></div>\n    </div>\n    \n    <div class="form-group">\n      <label for="email" class="block text-sm font-semibold text-gray-700 mb-2">\n        E-mail <span class="text-red-500" aria-label="obrigatório">*</span>\n      </label>\n      <input \n        type="email" \n        id="email" \n        name="email" \n        required \n        aria-describedby="email-error"\n        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"\n        placeholder="seu@email.com"\n      />\n      <div id="email-error" class="text-red-500 text-sm mt-1 hidden" role="alert"></div>\n    </div>\n  </div>\n  \n  <div class="mb-6">\n    <label for="assunto" class="block text-sm font-semibold text-gray-700 mb-2">Assunto</label>\n    <select id="assunto" name="assunto" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">\n      <option value="">Selecione um assunto</option>\n      <option value="duvida">Dúvida</option>\n      <option value="sugestao">Sugestão</option>\n      <option value="reclamacao">Reclamação</option>\n      <option value="elogio">Elogio</option>\n    </select>\n  </div>\n  \n  <div class="mb-6">\n    <label for="mensagem" class="block text-sm font-semibold text-gray-700 mb-2">\n      Mensagem <span class="text-red-500" aria-label="obrigatório">*</span>\n    </label>\n    <textarea \n      id="mensagem" \n      name="mensagem" \n      rows="5" \n      required \n      aria-describedby="mensagem-error"\n      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-vertical"\n      placeholder="Digite sua mensagem aqui..."\n    ></textarea>\n    <div id="mensagem-error" class="text-red-500 text-sm mt-1 hidden" role="alert"></div>\n  </div>\n  \n  <div class="flex items-center justify-between">\n    <div class="flex items-center">\n      <input type="checkbox" id="politica" name="politica" required class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />\n      <label for="politica" class="ml-2 text-sm text-gray-700">\n        Aceito a <a href="#" class="text-blue-600 hover:underline">política de privacidade</a>\n      </label>\n    </div>\n    <button type="submit" class="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all duration-200 font-semibold">\n      Enviar Mensagem\n    </button>\n  </div>\n</form>',
    detail: 'Formulário de contato completo com validação e acessibilidade',
    kind: 'Componente',
    category: 'Formulário',
    description: 'Formulário avançado com validação, acessibilidade e UX otimizada',
    icon: 'Terminal',
    keywords: ['formulário', 'contato', 'validação', 'acessibilidade']
  },
  {
    label: 'Galeria de Imagens Responsiva',
    insertText: '<div class="gallery-container max-w-6xl mx-auto">\n  <div class="text-center mb-8">\n    <h2 class="text-3xl font-bold text-gray-900 mb-4">Galeria de Imagens</h2>\n    <p class="text-gray-600">Confira os registros mais recentes da nossa cidade</p>\n  </div>\n  \n  <!-- Filtros -->\n  <div class="flex flex-wrap justify-center gap-4 mb-8">\n    <button class="filter-btn active px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors" data-filter="all">Todas</button>\n    <button class="filter-btn px-4 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors" data-filter="eventos">Eventos</button>\n    <button class="filter-btn px-4 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors" data-filter="obras">Obras</button>\n    <button class="filter-btn px-4 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors" data-filter="cultura">Cultura</button>\n  </div>\n  \n  <!-- Grid de imagens -->\n  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">\n    <div class="gallery-item group cursor-pointer" data-category="eventos">\n      <div class="relative overflow-hidden rounded-lg aspect-square">\n        <img src="/api/placeholder/400/400" alt="Evento da cidade" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />\n        <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">\n          <div class="opacity-0 group-hover:opacity-100 transition-opacity duration-300">\n            <button class="bg-white text-gray-900 p-2 rounded-full hover:bg-gray-100 transition-colors" aria-label="Ver imagem em tamanho completo">\n              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">\n                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>\n              </svg>\n            </button>\n          </div>\n        </div>\n      </div>\n      <div class="mt-3">\n        <h3 class="font-semibold text-gray-900">Evento Comunitário</h3>\n        <p class="text-sm text-gray-600">Descrição do evento realizado</p>\n      </div>\n    </div>\n    <!-- Repetir para outras imagens -->\n  </div>\n  \n  <!-- Paginação -->\n  <div class="flex justify-center mt-12">\n    <nav class="flex space-x-2" aria-label="Paginação da galeria">\n      <button class="px-3 py-2 text-gray-500 hover:text-gray-700 disabled:opacity-50" disabled>\n        Anterior\n      </button>\n      <button class="px-3 py-2 bg-blue-600 text-white rounded">1</button>\n      <button class="px-3 py-2 text-gray-700 hover:text-gray-900">2</button>\n      <button class="px-3 py-2 text-gray-700 hover:text-gray-900">3</button>\n      <button class="px-3 py-2 text-gray-700 hover:text-gray-900">\n        Próximo\n      </button>\n    </nav>\n  </div>\n</div>',
    detail: 'Galeria responsiva com filtros e lightbox',
    kind: 'Componente',
    category: 'Mídia',
    description: 'Galeria completa com filtros, hover effects e navegação',
    icon: 'Sparkles',
    keywords: ['galeria', 'imagens', 'filtros', 'responsivo']
  },
  {
    label: 'Tabela de Dados Governamentais',
    insertText: '<div class="overflow-hidden bg-white shadow-xl rounded-lg">\n  <div class="px-6 py-4 border-b border-gray-200">\n    <div class="flex items-center justify-between">\n      <h3 class="text-lg font-semibold text-gray-900">Dados Municipais</h3>\n      <div class="flex space-x-2">\n        <button class="btn-export px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm">\n          Exportar CSV\n        </button>\n        <button class="btn-print px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm">\n          Imprimir\n        </button>\n      </div>\n    </div>\n  </div>\n  \n  <div class="overflow-x-auto">\n    <table class="min-w-full divide-y divide-gray-200">\n      <thead class="bg-gray-50">\n        <tr>\n          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">\n            <div class="flex items-center space-x-1">\n              <span>Indicador</span>\n              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">\n                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"></path>\n              </svg>\n            </div>\n          </th>\n          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor Atual</th>\n          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Meta</th>\n          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progresso</th>\n          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>\n        </tr>\n      </thead>\n      <tbody class="bg-white divide-y divide-gray-200">\n        <tr class="hover:bg-gray-50 transition-colors">\n          <td class="px-6 py-4 whitespace-nowrap">\n            <div class="flex items-center">\n              <div class="flex-shrink-0 h-8 w-8">\n                <div class="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">\n                  <svg class="h-4 w-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">\n                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>\n                  </svg>\n                </div>\n              </div>\n              <div class="ml-4">\n                <div class="text-sm font-medium text-gray-900">Pavimentação de Ruas</div>\n                <div class="text-sm text-gray-500">Quilômetros pavimentados</div>\n              </div>\n            </div>\n          </td>\n          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">45.2 km</td>\n          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">60 km</td>\n          <td class="px-6 py-4 whitespace-nowrap">\n            <div class="w-full bg-gray-200 rounded-full h-2">\n              <div class="bg-blue-600 h-2 rounded-full" style="width: 75%"></div>\n            </div>\n            <span class="text-xs text-gray-500 mt-1">75%</span>\n          </td>\n          <td class="px-6 py-4 whitespace-nowrap">\n            <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">\n              Em Progresso\n            </span>\n          </td>\n        </tr>\n        <!-- Repetir para outros dados -->\n      </tbody>\n    </table>\n  </div>\n  \n  <!-- Paginação -->\n  <div class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">\n    <div class="flex items-center justify-between">\n      <div class="flex-1 flex justify-between sm:hidden">\n        <button class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">Anterior</button>\n        <button class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">Próximo</button>\n      </div>\n      <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">\n        <div>\n          <p class="text-sm text-gray-700">Mostrando <span class="font-medium">1</span> a <span class="font-medium">10</span> de <span class="font-medium">25</span> resultados</p>\n        </div>\n        <div>\n          <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Paginação">\n            <!-- Botões de paginação -->\n          </nav>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>',
    detail: 'Tabela avançada com ordenação, filtros e exportação',
    kind: 'Componente',
    category: 'Dados',
    description: 'Tabela completa para exibição de dados governamentais com funcionalidades avançadas',
    icon: 'Cpu',
    keywords: ['tabela', 'dados', 'exportar', 'ordenação']
  },
  {
    label: 'Banner de Alerta Emergencial',
    insertText: '<div class="emergency-banner bg-gradient-to-r from-red-600 to-red-700 text-white" role="alert" aria-live="assertive">\n  <div class="container mx-auto px-4 max-w-7xl">\n    <div class="flex items-center justify-between py-4">\n      <div class="flex items-center space-x-4">\n        <div class="flex-shrink-0">\n          <div class="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center animate-pulse">\n            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">\n              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>\n            </svg>\n          </div>\n        </div>\n        <div>\n          <h2 class="text-lg font-bold">Alerta Emergencial</h2>\n          <p class="text-red-100">Informação importante para a população de Timon. Mantenha-se informado sobre as últimas atualizações.</p>\n        </div>\n      </div>\n      <div class="flex items-center space-x-4">\n        <a href="#" class="bg-white text-red-600 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors font-semibold">\n          Saiba Mais\n        </a>\n        <button class="text-white hover:text-red-200 transition-colors" aria-label="Fechar alerta">\n          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">\n            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>\n          </svg>\n        </button>\n      </div>\n    </div>\n  </div>\n</div>',
    detail: 'Banner de alerta para situações emergenciais',
    kind: 'Componente',
    category: 'Notificação',
    description: 'Banner de destaque para comunicar informações urgentes à população',
    icon: 'AlertCircle',
    keywords: ['alerta', 'emergência', 'notificação', 'urgente']
  },
  {
    label: 'Seção de Transparência',
    insertText: '<section class="transparency-section bg-gray-50 py-16" aria-labelledby="transparency-title">\n  <div class="container mx-auto px-4 max-w-7xl">\n    <div class="text-center mb-12">\n      <h2 id="transparency-title" class="text-3xl font-bold text-gray-900 mb-4">Portal da Transparência</h2>\n      <p class="text-xl text-gray-600 max-w-3xl mx-auto">Acesse informações sobre gastos públicos, licitações e dados da administração municipal</p>\n    </div>\n    \n    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">\n      <!-- Card de Receitas -->\n      <div class="transparency-card bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 group">\n        <div class="flex items-center justify-between mb-4">\n          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">\n            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">\n              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>\n            </svg>\n          </div>\n          <span class="text-2xl font-bold text-green-600">R$ 15,2M</span>\n        </div>\n        <h3 class="text-lg font-semibold text-gray-900 mb-2">Receitas</h3>\n        <p class="text-gray-600 text-sm mb-4">Total arrecadado no mês atual</p>\n        <a href="#" class="text-green-600 hover:text-green-700 font-medium text-sm flex items-center">\n          Ver detalhes\n          <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">\n            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>\n          </svg>\n        </a>\n      </div>\n      \n      <!-- Card de Despesas -->\n      <div class="transparency-card bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 group">\n        <div class="flex items-center justify-between mb-4">\n          <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition-colors">\n            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">\n              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>\n            </svg>\n          </div>\n          <span class="text-2xl font-bold text-red-600">R$ 12,8M</span>\n        </div>\n        <h3 class="text-lg font-semibold text-gray-900 mb-2">Despesas</h3>\n        <p class="text-gray-600 text-sm mb-4">Total gasto no mês atual</p>\n        <a href="#" class="text-red-600 hover:text-red-700 font-medium text-sm flex items-center">\n          Ver detalhes\n          <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">\n            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>\n          </svg>\n        </a>\n      </div>\n      \n      <!-- Card de Licitações -->\n      <div class="transparency-card bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 group">\n        <div class="flex items-center justify-between mb-4">\n          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">\n            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">\n              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>\n            </svg>\n          </div>\n          <span class="text-2xl font-bold text-blue-600">24</span>\n        </div>\n        <h3 class="text-lg font-semibold text-gray-900 mb-2">Licitações</h3>\n        <p class="text-gray-600 text-sm mb-4">Processos em andamento</p>\n        <a href="#" class="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center">\n          Ver detalhes\n          <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">\n            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>\n          </svg>\n        </a>\n      </div>\n      \n      <!-- Card de Contratos -->\n      <div class="transparency-card bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 group">\n        <div class="flex items-center justify-between mb-4">\n          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">\n            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">\n              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>\n            </svg>\n          </div>\n          <span class="text-2xl font-bold text-purple-600">156</span>\n        </div>\n        <h3 class="text-lg font-semibold text-gray-900 mb-2">Contratos</h3>\n        <p class="text-gray-600 text-sm mb-4">Contratos ativos</p>\n        <a href="#" class="text-purple-600 hover:text-purple-700 font-medium text-sm flex items-center">\n          Ver detalhes\n          <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">\n            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>\n          </svg>\n        </a>\n      </div>\n    </div>\n    \n    <!-- Links rápidos -->\n    <div class="mt-12">\n      <h3 class="text-xl font-bold text-gray-900 mb-6 text-center">Acesso Rápido</h3>\n      <div class="flex flex-wrap justify-center gap-4">\n        <a href="#" class="bg-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-gray-700 hover:text-blue-600 font-medium">\n          Lei de Responsabilidade Fiscal\n        </a>\n        <a href="#" class="bg-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-gray-700 hover:text-blue-600 font-medium">\n          Relatórios de Gestão\n        </a>\n        <a href="#" class="bg-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-gray-700 hover:text-blue-600 font-medium">\n          Diário Oficial\n        </a>\n        <a href="#" class="bg-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-gray-700 hover:text-blue-600 font-medium">\n          Folha de Pagamento\n        </a>\n      </div>\n    </div>\n  </div>\n</section>',
    detail: 'Seção completa de transparência pública com métricas e links',
    kind: 'Seção',
    category: 'Transparência',
    description: 'Portal da transparência com cards informativos e acesso rápido a dados públicos',
    icon: 'ShieldCheck',
    keywords: ['transparência', 'dados', 'público', 'governo']
  },
  {
    label: 'Footer Institucional Completo',
    insertText: '<footer class="bg-gray-900 text-white" role="contentinfo">\n  <div class="container mx-auto px-4 max-w-7xl">\n    <!-- Seção principal do footer -->\n    <div class="py-12">\n      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">\n        <!-- Informações da prefeitura -->\n        <div class="lg:col-span-2">\n          <div class="flex items-center space-x-4 mb-6">\n            <img src="/logo-timon-white.png" alt="Prefeitura Municipal de Timon" class="h-12 w-auto" />\n            <div>\n              <h3 class="text-xl font-bold">Prefeitura Municipal de Timon</h3>\n              <p class="text-gray-400">Administração 2021-2024</p>\n            </div>\n          </div>\n          <p class="text-gray-300 mb-6 max-w-md">Trabalhando pelo desenvolvimento e bem-estar da população timonense. Transparência, eficiência e inovação na gestão pública.</p>\n          \n          <!-- Redes sociais -->\n          <div class="flex space-x-4">\n            <a href="#" class="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors" aria-label="Facebook da Prefeitura">\n              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">\n                <path fill-rule="evenodd" d="M20 10C20 4.477 15.523 0 10 0S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z" clip-rule="evenodd"></path>\n              </svg>\n            </a>\n            <a href="#" class="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors" aria-label="Twitter da Prefeitura">\n              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">\n                <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84"></path>\n              </svg>\n            </a>\n            <a href="#" class="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center hover:bg-pink-700 transition-colors" aria-label="Instagram da Prefeitura">\n              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">\n                <path fill-rule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clip-rule="evenodd"></path>\n              </svg>\n            </a>\n            <a href="#" class="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors" aria-label="YouTube da Prefeitura">\n              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">\n                <path fill-rule="evenodd" d="M2 6a6 6 0 1112 0v2a6 6 0 01-12 0V6z" clip-rule="evenodd"></path>\n              </svg>\n            </a>\n          </div>\n        </div>\n        \n        <!-- Links rápidos -->\n        <div>\n          <h4 class="text-lg font-semibold mb-6">Links Rápidos</h4>\n          <ul class="space-y-3">\n            <li><a href="#" class="text-gray-300 hover:text-white transition-colors">Portal da Transparência</a></li>\n            <li><a href="#" class="text-gray-300 hover:text-white transition-colors">Diário Oficial</a></li>\n            <li><a href="#" class="text-gray-300 hover:text-white transition-colors">Licitações</a></li>\n            <li><a href="#" class="text-gray-300 hover:text-white transition-colors">Concursos Públicos</a></li>\n            <li><a href="#" class="text-gray-300 hover:text-white transition-colors">Ouvidoria</a></li>\n            <li><a href="#" class="text-gray-300 hover:text-white transition-colors">e-SIC</a></li>\n          </ul>\n        </div>\n        \n        <!-- Contato -->\n        <div>\n          <h4 class="text-lg font-semibold mb-6">Contato</h4>\n          <div class="space-y-3">\n            <div class="flex items-start space-x-3">\n              <svg class="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">\n                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>\n                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>\n              </svg>\n              <div>\n                <p class="text-gray-300">Rua da Prefeitura, 123</p>\n                <p class="text-gray-300">Centro - Timon/MA</p>\n                <p class="text-gray-300">CEP: 65633-000</p>\n              </div>\n            </div>\n            <div class="flex items-center space-x-3">\n              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">\n                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>\n              </svg>\n              <p class="text-gray-300">(99) 3212-3456</p>\n            </div>\n            <div class="flex items-center space-x-3">\n              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">\n                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>\n              </svg>\n              <p class="text-gray-300">contato@timon.ma.gov.br</p>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n    \n    <!-- Seção de acessibilidade e informações legais -->\n    <div class="border-t border-gray-800 py-8">\n      <div class="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">\n        <div class="flex items-center space-x-6">\n          <button class="accessibility-btn flex items-center space-x-2 text-gray-300 hover:text-white transition-colors" aria-label="Ativar recursos de acessibilidade">\n            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">\n              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>\n            </svg>\n            <span>Acessibilidade</span>\n          </button>\n          <a href="#" class="text-gray-300 hover:text-white transition-colors">Política de Privacidade</a>\n          <a href="#" class="text-gray-300 hover:text-white transition-colors">Termos de Uso</a>\n        </div>\n        <div class="text-center md:text-right">\n          <p class="text-gray-400 text-sm">\n            © 2024 Prefeitura Municipal de Timon. Todos os direitos reservados.\n          </p>\n          <p class="text-gray-500 text-xs mt-1">\n            Desenvolvido seguindo padrões de acessibilidade WCAG 2.1 AA\n          </p>\n        </div>\n      </div>\n    </div>\n  </div>\n</footer>',
    detail: 'Footer institucional completo com informações de contato e links',
    kind: 'Componente',
    category: 'Layout',
    description: 'Rodapé completo para sites governamentais com todas as informações necessárias',
    icon: 'Layers',
    keywords: ['footer', 'rodapé', 'contato', 'institucional']
  }
];

const accessibilitySnippets: Snippet[] = [
  {
    label: 'Skip Navigation Link',
    insertText: '<a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50 transition-all">Pular para o conteúdo principal</a>',
    detail: 'Link para pular navegação, essencial para acessibilidade',
    kind: 'Acessibilidade',
    category: 'Navegação',
    description: 'Permite que usuários de leitores de tela pulem para o conteúdo principal',
    icon: 'Accessibility',
    keywords: ['skip', 'acessibilidade', 'navegação', 'screen reader']
  },
  {
    label: 'Landmark Navigation',
    insertText: '<nav role="navigation" aria-label="Menu principal">\n  <ul role="menubar" class="flex space-x-4">\n    <li role="none">\n      <a href="#" role="menuitem" class="block px-3 py-2 text-gray-700 hover:text-blue-600" aria-current="page">Início</a>\n    </li>\n    <li role="none">\n      <a href="#" role="menuitem" class="block px-3 py-2 text-gray-700 hover:text-blue-600">Serviços</a>\n    </li>\n  </ul>\n</nav>',
    detail: 'Navegação com landmarks e roles para melhor acessibilidade',
    kind: 'Acessibilidade',
    category: 'Navegação',
    description: 'Estrutura de navegação semanticamente correta',
    icon: 'Accessibility',
    keywords: ['landmark', 'navigation', 'aria', 'role']
  }
];

const seoSnippets: Snippet[] = [
  {
    label: 'SEO Meta Tags Básicas',
    insertText: '<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n<meta name="description" content="Prefeitura Municipal de Timon - Serviços públicos, transparência e informações para o cidadão.">\n<meta name="keywords" content="prefeitura, timon, maranhão, serviços públicos, transparência">\n<meta name="author" content="Prefeitura Municipal de Timon">\n<meta name="robots" content="index, follow">\n<title>Página Título - Prefeitura Municipal de Timon</title>',
    detail: 'Meta tags essenciais para SEO',
    kind: 'SEO',
    category: 'Meta Tags',
    description: 'Tags básicas para otimização em mecanismos de busca',
    icon: 'Globe',
    keywords: ['seo', 'meta', 'tags', 'otimização']
  },
  {
    label: 'Open Graph Meta Tags',
    insertText: '<meta property="og:type" content="website">\n<meta property="og:title" content="Título da Página - Prefeitura de Timon">\n<meta property="og:description" content="Descrição da página para compartilhamento em redes sociais">\n<meta property="og:image" content="https://timon.ma.gov.br/images/og-image.jpg">\n<meta property="og:url" content="https://timon.ma.gov.br">\n<meta property="og:site_name" content="Prefeitura Municipal de Timon">\n<meta property="og:locale" content="pt_BR">',
    detail: 'Meta tags Open Graph para redes sociais',
    kind: 'SEO',
    category: 'Social Media',
    description: 'Tags para otimizar compartilhamento em redes sociais',
    icon: 'Globe',
    keywords: ['open graph', 'facebook', 'social media', 'compartilhamento']
  }
];

export function AdvancedHTMLEditor({
  value,
  onChange,
  onValidation,
  height = 400,
  readOnly = false,
  showPreview = true,
  className = ''
}: AdvancedHTMLEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const monacoRef = useRef<any>(null);
  const editorInstanceRef = useRef<any>(null);
  
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [theme, setTheme] = useState('vs');
  const [fontSize, setFontSize] = useState(14);
  const [showMinimap, setShowMinimap] = useState(true);
  const [wordWrap, setWordWrap] = useState(true);
  const [autoFormat, setAutoFormat] = useState(true);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [copied, setCopied] = useState(false);
  const [currentTab, setCurrentTab] = useState('editor');
  const [searchTerm, setSearchTerm] = useState('');
  const [replaceTerm, setReplaceTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [codeMetrics, setCodeMetrics] = useState<CodeMetrics>({
    lines: 0,
    characters: 0,
    words: 0,
    tags: 0,
    readabilityScore: 0,
    accessibilityScore: 0,
    seoScore: 0
  });
  const [editorHistory, setEditorHistory] = useState<EditorHistory[]>([]);
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [enableBracketMatching, setEnableBracketMatching] = useState(true);
  const [enableAutoCloseTags, setEnableAutoCloseTags] = useState(true);
  const [enableLiveValidation, setEnableLiveValidation] = useState(true);
  const [tabSize, setTabSize] = useState(2);
  const [insertSpaces, setInsertSpaces] = useState(true);
  const [selectedSnippetCategory, setSelectedSnippetCategory] = useState('all');

  // Combinar todos os snippets
  const allSnippets = [...htmlSnippets, ...accessibilitySnippets, ...seoSnippets];
  const filteredSnippets = selectedSnippetCategory === 'all' 
    ? allSnippets 
    : allSnippets.filter(snippet => snippet.category.toLowerCase() === selectedSnippetCategory);

  // Inicializar Monaco Editor
  useEffect(() => {
    const loadMonaco = async () => {
      try {
        // Carregar Monaco Editor via CDN
        if (!window.monaco) {
          const script = document.createElement('script');
          script.src = 'https://unpkg.com/monaco-editor@0.45.0/min/vs/loader.js';
          script.onload = () => {
            window.require.config({ paths: { vs: 'https://unpkg.com/monaco-editor@0.45.0/min/vs' } });
            window.require(['vs/editor/editor.main'], () => {
              initializeEditor();
            });
          };
          document.head.appendChild(script);
        } else {
          initializeEditor();
        }
      } catch (error) {
        console.error('Erro ao carregar Monaco Editor:', error);
      }
    };

    const initializeEditor = () => {
      if (!editorRef.current || !window.monaco) return;

      monacoRef.current = window.monaco;

      // Configurar temas personalizados aprimorados
      const timonLightTheme = {
        base: 'vs',
        inherit: true,
        rules: [
          { token: 'comment', foreground: '6C757D', fontStyle: 'italic' },
          { token: 'keyword', foreground: '144c9c', fontStyle: 'bold' },
          { token: 'string', foreground: '228B22' },
          { token: 'number', foreground: 'DC3545' },
          { token: 'tag', foreground: '144c9c' },
          { token: 'attribute.name', foreground: '228B22' },
          { token: 'attribute.value', foreground: 'FFC107' },
          { token: 'delimiter.html', foreground: '144c9c' },
          { token: 'metatag', foreground: 'DC3545' },
          { token: 'metatag.content.html', foreground: '228B22' }
        ],
        colors: {
          'editor.background': '#ffffff',
          'editor.foreground': '#144c9c',
          'editorLineNumber.foreground': '#6C757D',
          'editor.selectionBackground': '#e6f2ff',
          'editor.lineHighlightBackground': '#f8f9fa',
          'editorCursor.foreground': '#144c9c',
          'editor.findMatchBackground': '#ffeb3b',
          'editor.findMatchHighlightBackground': '#fff59d',
          'editorBracketMatch.background': '#e6f2ff',
          'editorBracketMatch.border': '#144c9c'
        }
      };

      const timonDarkTheme = {
        base: 'vs-dark',
        inherit: true,
        rules: [
          { token: 'comment', foreground: '9CA3AF', fontStyle: 'italic' },
          { token: 'keyword', foreground: '60A5FA', fontStyle: 'bold' },
          { token: 'string', foreground: '34D399' },
          { token: 'number', foreground: 'F87171' },
          { token: 'tag', foreground: '60A5FA' },
          { token: 'attribute.name', foreground: '34D399' },
          { token: 'attribute.value', foreground: 'FBBF24' },
          { token: 'delimiter.html', foreground: '60A5FA' },
          { token: 'metatag', foreground: 'F87171' },
          { token: 'metatag.content.html', foreground: '34D399' }
        ],
        colors: {
          'editor.background': '#1F2937',
          'editor.foreground': '#F9FAFB',
          'editorLineNumber.foreground': '#9CA3AF',
          'editor.selectionBackground': '#374151',
          'editor.lineHighlightBackground': '#111827',
          'editorCursor.foreground': '#60A5FA',
          'editor.findMatchBackground': '#FFC107',
          'editor.findMatchHighlightBackground': '#FFD54F',
          'editorBracketMatch.background': '#374151',
          'editorBracketMatch.border': '#60A5FA'
        }
      };

      const githubLightTheme = {
        base: 'vs',
        inherit: true,
        rules: [
          { token: 'comment', foreground: '6A737D', fontStyle: 'italic' },
          { token: 'keyword', foreground: 'D73A49', fontStyle: 'bold' },
          { token: 'string', foreground: '032F62' },
          { token: 'number', foreground: '005CC5' },
          { token: 'tag', foreground: '22863A' },
          { token: 'attribute.name', foreground: '6F42C1' },
          { token: 'attribute.value', foreground: '032F62' }
        ],
        colors: {
          'editor.background': '#ffffff',
          'editor.foreground': '#24292e',
          'editorLineNumber.foreground': '#6A737D',
          'editor.selectionBackground': '#0366d625',
          'editor.lineHighlightBackground': '#f6f8fa'
        }
      };

      const monokaiTheme = {
        base: 'vs-dark',
        inherit: true,
        rules: [
          { token: 'comment', foreground: '75715E', fontStyle: 'italic' },
          { token: 'keyword', foreground: 'F92672', fontStyle: 'bold' },
          { token: 'string', foreground: 'E6DB74' },
          { token: 'number', foreground: 'AE81FF' },
          { token: 'tag', foreground: 'F92672' },
          { token: 'attribute.name', foreground: 'A6E22E' },
          { token: 'attribute.value', foreground: 'E6DB74' }
        ],
        colors: {
          'editor.background': '#272822',
          'editor.foreground': '#F8F8F2',
          'editorLineNumber.foreground': '#75715E',
          'editor.selectionBackground': '#49483E',
          'editor.lineHighlightBackground': '#3E3D32'
        }
      };

      monacoRef.current.editor.defineTheme('timon-light', timonLightTheme);
      monacoRef.current.editor.defineTheme('timon-dark', timonDarkTheme);
      monacoRef.current.editor.defineTheme('github-light', githubLightTheme);
      monacoRef.current.editor.defineTheme('monokai', monokaiTheme);

      // Configurar autocomplete aprimorado
      const completionProvider = monacoRef.current.languages.registerCompletionItemProvider('html', {
        provideCompletionItems: (model: any, position: any) => {
          const suggestions = allSnippets.map(snippet => ({
            label: snippet.label,
            kind: monacoRef.current.languages.CompletionItemKind.Snippet,
            insertText: snippet.insertText,
            insertTextRules: monacoRef.current.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            detail: snippet.detail,
            documentation: {
              value: `**${snippet.label}**\n\n${snippet.detail}\n\n*Categoria: ${snippet.category}*`
            },
            sortText: snippet.category === 'Layout' ? '0' : '1'
          }));

          return { suggestions };
        }
      });

      // Configurar hover provider para documentação
      const hoverProvider = monacoRef.current.languages.registerHoverProvider('html', {
        provideHover: (model: any, position: any) => {
          const word = model.getWordAtPosition(position);
          if (word) {
            const tagName = word.word.toLowerCase();
            const tagDocumentation = getTagDocumentation(tagName);
            if (tagDocumentation) {
              return {
                range: new monacoRef.current.Range(position.lineNumber, word.startColumn, position.lineNumber, word.endColumn),
                contents: [
                  { value: `**${tagName.toUpperCase()}**` },
                  { value: tagDocumentation }
                ]
              };
            }
          }
          return null;
        }
      });

      // Criar instância do editor com configurações avançadas
      editorInstanceRef.current = monacoRef.current.editor.create(editorRef.current, {
        value: value,
        language: 'html',
        theme: theme,
        fontSize: fontSize,
        fontFamily: 'JetBrains Mono, Fira Code, Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
        fontLigatures: true,
        minimap: { enabled: showMinimap },
        wordWrap: wordWrap ? 'on' : 'off',
        lineNumbers: showLineNumbers ? 'on' : 'off',
        readOnly: readOnly,
        automaticLayout: true,
        scrollBeyondLastLine: false,
        folding: true,
        foldingStrategy: 'indentation',
        brackets: enableBracketMatching ? 'always' : 'never',
        autoIndent: 'full',
        formatOnPaste: autoFormat,
        formatOnType: autoFormat,
        renderWhitespace: 'boundary',
        suggestOnTriggerCharacters: true,
        acceptSuggestionOnEnter: 'on',
        tabCompletion: 'on',
        quickSuggestions: {
          other: true,
          comments: false,
          strings: true
        },
        contextmenu: true,
        find: {
          addExtraSpaceOnTop: false,
          autoFindInSelection: 'never',
          seedSearchStringFromSelection: 'always'
        },
        tabSize: tabSize,
        insertSpaces: insertSpaces,
        autoClosingBrackets: 'always',
        autoClosingQuotes: 'always',
        autoSurround: 'languageDefined',
        mouseWheelZoom: true,
        cursorBlinking: 'smooth',
        cursorSmoothCaretAnimation: true,
        smoothScrolling: true,
        renderLineHighlight: 'all',
        occurrencesHighlight: true,
        selectionHighlight: true,
        codeLens: true,
        colorDecorators: true,
        links: true,
        dragAndDrop: true
      });

      // Event listeners
      editorInstanceRef.current.onDidChangeModelContent(() => {
        const newValue = editorInstanceRef.current.getValue();
        onChange(newValue);
        if (enableLiveValidation) {
          validateHTML(newValue);
        }
        calculateMetrics(newValue);
      });

      // Comandos personalizados avançados
      editorInstanceRef.current.addAction({
        id: 'format-html',
        label: 'Formatar HTML',
        keybindings: [monacoRef.current.KeyMod.Shift | monacoRef.current.KeyMod.Alt | monacoRef.current.KeyCode.KeyF],
        contextMenuGroupId: 'modification',
        run: () => {
          editorInstanceRef.current.getAction('editor.action.formatDocument').run();
        }
      });

      editorInstanceRef.current.addAction({
        id: 'toggle-comment',
        label: 'Alternar Comentário',
        keybindings: [monacoRef.current.KeyMod.CtrlCmd | monacoRef.current.KeyCode.Slash],
        contextMenuGroupId: 'modification',
        run: () => {
          editorInstanceRef.current.getAction('editor.action.commentLine').run();
        }
      });

      editorInstanceRef.current.addAction({
        id: 'duplicate-line',
        label: 'Duplicar Linha',
        keybindings: [monacoRef.current.KeyMod.Shift | monacoRef.current.KeyMod.Alt | monacoRef.current.KeyCode.DownArrow],
        contextMenuGroupId: 'modification',
        run: () => {
          editorInstanceRef.current.getAction('editor.action.copyLinesDownAction').run();
        }
      });

      editorInstanceRef.current.addAction({
        id: 'move-line-up',
        label: 'Mover Linha Para Cima',
        keybindings: [monacoRef.current.KeyMod.Alt | monacoRef.current.KeyCode.UpArrow],
        contextMenuGroupId: 'modification',
        run: () => {
          editorInstanceRef.current.getAction('editor.action.moveLinesUpAction').run();
        }
      });

      editorInstanceRef.current.addAction({
        id: 'move-line-down',
        label: 'Mover Linha Para Baixo',
        keybindings: [monacoRef.current.KeyMod.Alt | monacoRef.current.KeyCode.DownArrow],
        contextMenuGroupId: 'modification',
        run: () => {
          editorInstanceRef.current.getAction('editor.action.moveLinesDownAction').run();
        }
      });

      editorInstanceRef.current.addAction({
        id: 'select-all-occurrences',
        label: 'Selecionar Todas as Ocorrências',
        keybindings: [monacoRef.current.KeyMod.CtrlCmd | monacoRef.current.KeyMod.Shift | monacoRef.current.KeyCode.KeyL],
        contextMenuGroupId: 'selection',
        run: () => {
          editorInstanceRef.current.getAction('editor.action.selectHighlights').run();
        }
      });

      // Auto-close tags se habilitado
      if (enableAutoCloseTags) {
        setupAutoCloseTags();
      }
    };

    loadMonaco();

    return () => {
      if (editorInstanceRef.current) {
        editorInstanceRef.current.dispose();
      }
    };
  }, []);

  // Função para documentação de tags
  const getTagDocumentation = (tagName: string): string | null => {
    const tagDocs: { [key: string]: string } = {
      'div': 'Elemento de divisão genérico para agrupamento de conteúdo',
      'section': 'Seção temática do documento, geralmente com cabeçalho',
      'article': 'Conteúdo independente e autônomo',
      'header': 'Cabeçalho de seção ou página',
      'footer': 'Rodapé de seção ou página',
      'nav': 'Navegação principal ou seção de links',
      'main': 'Conteúdo principal do documento',
      'aside': 'Conteúdo relacionado ao conteúdo principal',
      'h1': 'Cabeçalho de primeiro nível (mais importante)',
      'h2': 'Cabeçalho de segundo nível',
      'h3': 'Cabeçalho de terceiro nível',
      'p': 'Parágrafo de texto',
      'a': 'Link ou âncora',
      'img': 'Imagem - requer alt para acessibilidade',
      'button': 'Botão interativo',
      'form': 'Formulário para entrada de dados',
      'input': 'Campo de entrada de dados',
      'label': 'Rótulo para elemento de formulário',
      'table': 'Tabela de dados',
      'thead': 'Cabeçalho da tabela',
      'tbody': 'Corpo da tabela',
      'tr': 'Linha da tabela',
      'th': 'Célula de cabeçalho da tabela',
      'td': 'Célula de dados da tabela'
    };
    
    return tagDocs[tagName] || null;
  };

  // Auto-close tags
  const setupAutoCloseTags = () => {
    if (!editorInstanceRef.current || !monacoRef.current) return;

    editorInstanceRef.current.onDidType((text: string) => {
      if (text === '>') {
        const position = editorInstanceRef.current.getPosition();
        const model = editorInstanceRef.current.getModel();
        const lineContent = model.getLineContent(position.lineNumber);
        const beforeCursor = lineContent.substring(0, position.column - 1);
        
        const tagMatch = beforeCursor.match(/<([a-zA-Z][a-zA-Z0-9]*)[^>]*>$/);
        if (tagMatch) {
          const tagName = tagMatch[1];
          const selfClosingTags = ['img', 'br', 'hr', 'input', 'meta', 'link', 'area', 'base', 'col', 'embed', 'source', 'track', 'wbr'];
          
          if (!selfClosingTags.includes(tagName.toLowerCase())) {
            const closeTag = `</${tagName}>`;
            editorInstanceRef.current.executeEdits('auto-close-tag', [{
              range: new monacoRef.current.Range(position.lineNumber, position.column, position.lineNumber, position.column),
              text: closeTag
            }]);
            
            // Mover cursor para entre as tags
            editorInstanceRef.current.setPosition({
              lineNumber: position.lineNumber,
              column: position.column
            });
          }
        }
      }
    });
  };

  // Atualizar valor do editor quando prop value muda
  useEffect(() => {
    if (editorInstanceRef.current && value !== editorInstanceRef.current.getValue()) {
      editorInstanceRef.current.setValue(value);
    }
  }, [value]);

  // Atualizar configurações do editor
  useEffect(() => {
    if (editorInstanceRef.current) {
      editorInstanceRef.current.updateOptions({
        theme: theme,
        fontSize: fontSize,
        minimap: { enabled: showMinimap },
        wordWrap: wordWrap ? 'on' : 'off',
        formatOnPaste: autoFormat,
        formatOnType: autoFormat,
        lineNumbers: showLineNumbers ? 'on' : 'off',
        brackets: enableBracketMatching ? 'always' : 'never',
        tabSize: tabSize,
        insertSpaces: insertSpaces
      });
    }
  }, [theme, fontSize, showMinimap, wordWrap, autoFormat, showLineNumbers, enableBracketMatching, tabSize, insertSpaces]);

  // Validação HTML aprimorada
  const validateHTML = useCallback((html: string) => {
    const errors: ValidationError[] = [];
    
    // Verificar estrutura básica
    if (!html.includes('<!DOCTYPE') && !html.includes('<html')) {
      errors.push({
        line: 1,
        column: 1,
        message: 'Documento deve incluir DOCTYPE html',
        severity: 'warning',
        rule: 'doctype-required',
        suggestion: 'Adicione <!DOCTYPE html> no início do documento'
      });
    }

    // Verificar tags não fechadas (validação melhorada)
    const tagRegex = /<([a-zA-Z][a-zA-Z0-9]*)[^>]*>/g;
    const closeTagRegex = /<\/([a-zA-Z][a-zA-Z0-9]*)>/g;
    
    let match;
    const openTags: string[] = [];
    const openTagPositions: number[] = [];
    
    while ((match = tagRegex.exec(html)) !== null) {
      const tagName = match[1].toLowerCase();
      const selfClosingTags = ['img', 'br', 'hr', 'input', 'meta', 'link', 'area', 'base', 'col', 'embed', 'source', 'track', 'wbr'];
      
      if (!selfClosingTags.includes(tagName) && !match[0].endsWith('/>')) {
        openTags.push(tagName);
        openTagPositions.push(match.index);
      }
    }
    
    while ((match = closeTagRegex.exec(html)) !== null) {
      const tagName = match[1].toLowerCase();
      const lastOpenIndex = openTags.lastIndexOf(tagName);
      if (lastOpenIndex !== -1) {
        openTags.splice(lastOpenIndex, 1);
        openTagPositions.splice(lastOpenIndex, 1);
      } else {
        errors.push({
          line: html.substring(0, match.index).split('\n').length,
          column: match.index - html.lastIndexOf('\n', match.index),
          message: `Tag de fechamento </${tagName}> sem tag de abertura correspondente`,
          severity: 'error',
          rule: 'unmatched-closing-tag'
        });
      }
    }
    
    openTags.forEach((tagName, index) => {
      const position = openTagPositions[index];
      errors.push({
        line: html.substring(0, position).split('\n').length,
        column: position - html.lastIndexOf('\n', position),
        message: `Tag <${tagName}> não foi fechada`,
        severity: 'warning',
        rule: 'unclosed-tag',
        suggestion: `Adicione </${tagName}> para fechar a tag`
      });
    });

    // Verificar acessibilidade
    if (html.includes('<img') && !html.includes('alt=')) {
      errors.push({
        line: 1,
        column: 1,
        message: 'Imagens devem ter o atributo alt para acessibilidade',
        severity: 'warning',
        rule: 'img-alt-required',
        suggestion: 'Adicione alt="descrição da imagem" a todas as tags <img>'
      });
    }

    if (html.includes('<a') && html.includes('href="#"') && !html.includes('aria-label')) {
      errors.push({
        line: 1,
        column: 1,
        message: 'Links vazios (href="#") devem ter aria-label ou texto descritivo',
        severity: 'warning',
        rule: 'link-accessibility',
        suggestion: 'Adicione aria-label="descrição do link" ou texto descritivo'
      });
    }

    // Verificar semântica
    const headingRegex = /<h([1-6])[^>]*>/g;
    const headings: number[] = [];
    while ((match = headingRegex.exec(html)) !== null) {
      headings.push(parseInt(match[1]));
    }

    for (let i = 1; i < headings.length; i++) {
      if (headings[i] > headings[i-1] + 1) {
        errors.push({
          line: 1,
          column: 1,
          message: `Hierarquia de headings irregular: h${headings[i-1]} seguido por h${headings[i]}`,
          severity: 'warning',
          rule: 'heading-hierarchy',
          suggestion: 'Use hierarquia sequencial de headings (h1, h2, h3...)'
        });
      }
    }

    // Verificar performance
    const inlineStyleRegex = /style\s*=\s*["'][^"']*["']/g;
    const inlineStyleCount = (html.match(inlineStyleRegex) || []).length;
    if (inlineStyleCount > 5) {
      errors.push({
        line: 1,
        column: 1,
        message: `Muitos estilos inline detectados (${inlineStyleCount}). Considere usar CSS externo.`,
        severity: 'info',
        rule: 'inline-styles-performance',
        suggestion: 'Mova estilos para arquivo CSS separado para melhor performance'
      });
    }

    setValidationErrors(errors);
    onValidation?.(errors);
  }, [onValidation]);

  // Calcular métricas do código
  const calculateMetrics = useCallback((html: string) => {
    const lines = html.split('\n').length;
    const characters = html.length;
    const words = html.split(/\s+/).filter(word => word.length > 0).length;
    const tags = (html.match(/<[^>]+>/g) || []).length;
    
    // Score de legibilidade (simples)
    const avgLineLength = characters / lines;
    const readabilityScore = Math.max(0, Math.min(100, 100 - (avgLineLength - 50) * 2));
    
    // Score de acessibilidade
    let accessibilityScore = 100;
    if (html.includes('<img') && !html.includes('alt=')) accessibilityScore -= 20;
    if (html.includes('<a') && html.includes('href="#"') && !html.includes('aria-label')) accessibilityScore -= 15;
    if (!html.includes('lang=')) accessibilityScore -= 10;
    if (html.includes('<table') && !html.includes('<caption')) accessibilityScore -= 10;
    
    // Score de SEO
    let seoScore = 100;
    if (!html.includes('<title>')) seoScore -= 25;
    if (!html.includes('meta name="description"')) seoScore -= 20;
    if (!html.includes('<h1')) seoScore -= 15;
    if (!html.includes('meta charset=')) seoScore -= 10;
    
    setCodeMetrics({
      lines,
      characters,
      words,
      tags,
      readabilityScore: Math.round(readabilityScore),
      accessibilityScore: Math.max(0, accessibilityScore),
      seoScore: Math.max(0, seoScore)
    });
  }, []);

  // Salvar no histórico
  const saveToHistory = useCallback((description: string) => {
    const newEntry: EditorHistory = {
      id: Date.now().toString(),
      timestamp: new Date(),
      content: value,
      description
    };
    
    setEditorHistory(prev => [newEntry, ...prev.slice(0, 9)]); // Manter apenas 10 entradas
  }, [value]);

  const handleCopyCode = useCallback(() => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [value]);

  const handleFormatCode = useCallback(() => {
    if (editorInstanceRef.current) {
      editorInstanceRef.current.getAction('editor.action.formatDocument').run();
      saveToHistory('Código formatado');
    }
  }, [saveToHistory]);

  const handleInsertSnippet = useCallback((snippet: Snippet) => {
    if (editorInstanceRef.current) {
      const selection = editorInstanceRef.current.getSelection();
      const range = selection || {
        startLineNumber: 1,
        startColumn: 1,
        endLineNumber: 1,
        endColumn: 1
      };
      
      const operation = {
        range: range,
        text: snippet.insertText,
        forceMoveMarkers: true
      };
      
      editorInstanceRef.current.executeEdits('insert-snippet', [operation]);
      editorInstanceRef.current.focus();
      saveToHistory(`Snippet inserido: ${snippet.label}`);
    }
  }, [saveToHistory]);

  const handleToggleFullscreen = useCallback(() => {
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);

  const handleSearch = useCallback(() => {
    if (editorInstanceRef.current) {
      editorInstanceRef.current.getAction('actions.find').run();
    }
  }, []);

  const handleReplace = useCallback(() => {
    if (editorInstanceRef.current) {
      editorInstanceRef.current.getAction('editor.action.startFindReplaceAction').run();
    }
  }, []);

  const handleDownloadCode = useCallback(() => {
    const blob = new Blob([value], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pagina.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [value]);

  const handleUploadFile = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.html,.htm,.txt';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          onChange(content);
          saveToHistory(`Arquivo carregado: ${file.name}`);
        };
        reader.readAsText(file);
      }
    };
    input.click();
  }, [onChange, saveToHistory]);

  const handleRestoreFromHistory = useCallback((entry: EditorHistory) => {
    onChange(entry.content);
    saveToHistory(`Histórico restaurado: ${entry.description}`);
  }, [onChange, saveToHistory]);

  const handleValidateNow = useCallback(() => {
    validateHTML(value);
  }, [value, validateHTML]);

  const handleBeautifyCode = useCallback(() => {
    if (editorInstanceRef.current) {
      // Implementar beautify personalizado se necessário
      handleFormatCode();
    }
  }, [handleFormatCode]);

  const handleMinifyCode = useCallback(() => {
    if (editorInstanceRef.current) {
      const minified = value
        .replace(/\s+/g, ' ')
        .replace(/>\s+</g, '><')
        .trim();
      onChange(minified);
      saveToHistory('Código minificado');
    }
  }, [value, onChange, saveToHistory]);

  const renderPreview = () => (
    <div className="h-full border border-border rounded-lg overflow-hidden bg-background">
      <div className="border-b border-border p-3 bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            <span className="text-sm font-medium">Visualização</span>
            <Badge variant="outline" className="text-xs">
              Live Preview
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => window.open('about:blank')?.document.write(value)}>
              <Globe className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      <ScrollArea className="h-[calc(100%-60px)]">
        <div 
          className="p-6 prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: value }}
        />
      </ScrollArea>
    </div>
  );

  const renderMetrics = () => (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Linhas</p>
            <p className="text-2xl font-bold">{codeMetrics.lines}</p>
          </div>
          <FileText className="h-8 w-8 text-blue-500" />
        </div>
      </Card>
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Caracteres</p>
            <p className="text-2xl font-bold">{codeMetrics.characters}</p>
          </div>
          <Code className="h-8 w-8 text-green-500" />
        </div>
      </Card>
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Tags HTML</p>
            <p className="text-2xl font-bold">{codeMetrics.tags}</p>
          </div>
          <Braces className="h-8 w-8 text-purple-500" />
        </div>
      </Card>
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Palavras</p>
            <p className="text-2xl font-bold">{codeMetrics.words}</p>
          </div>
          <FileCode className="h-8 w-8 text-orange-500" />
        </div>
      </Card>
    </div>
  );

  const renderQualityScores = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card className="p-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Legibilidade</span>
            <span className="text-sm text-muted-foreground">{codeMetrics.readabilityScore}%</span>
          </div>
          <Progress value={codeMetrics.readabilityScore} className="h-2" />
        </div>
      </Card>
      <Card className="p-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Acessibilidade</span>
            <span className="text-sm text-muted-foreground">{codeMetrics.accessibilityScore}%</span>
          </div>
          <Progress value={codeMetrics.accessibilityScore} className="h-2" />
        </div>
      </Card>
      <Card className="p-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">SEO</span>
            <span className="text-sm text-muted-foreground">{codeMetrics.seoScore}%</span>
          </div>
          <Progress value={codeMetrics.seoScore} className="h-2" />
        </div>
      </Card>
    </div>
  );

  const editorContainerClass = `
    ${className}
    ${isFullscreen ? 'fixed inset-0 z-50 bg-background' : 'h-[500px]'}
  `;

  const snippetCategories = [
    { value: 'all', label: 'Todos' },
    { value: 'layout', label: 'Layout' },
    { value: 'conteúdo', label: 'Conteúdo' },
    { value: 'navegação', label: 'Navegação' },
    { value: 'formulário', label: 'Formulário' },
    { value: 'mídia', label: 'Mídia' },
    { value: 'dados', label: 'Dados' },
    { value: 'notificação', label: 'Notificação' },
    { value: 'transparência', label: 'Transparência' },
    { value: 'acessibilidade', label: 'Acessibilidade' },
    { value: 'seo', label: 'SEO' }
  ];

  return (
    <TooltipProvider>
      <div className={editorContainerClass}>
        <Card className="h-full flex flex-col">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <FileCode className="h-4 w-4" />
                Editor HTML Profissional
                {validationErrors.length > 0 && (
                  <Badge variant={validationErrors.some(e => e.severity === 'error') ? 'destructive' : 'secondary'}>
                    {validationErrors.length} {validationErrors.length === 1 ? 'problema' : 'problemas'}
                  </Badge>
                )}
              </CardTitle>
              
              <div className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" onClick={handleCopyCode}>
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {copied ? 'Copiado!' : 'Copiar código'}
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" onClick={handleFormatCode}>
                      <Wand2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Formatar código (Shift+Alt+F)
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" onClick={handleSearch}>
                      <Search className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Buscar no código (Ctrl+F)
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" onClick={handleUploadFile}>
                      <Upload className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Carregar arquivo
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" onClick={handleDownloadCode}>
                      <Download className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Baixar código
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" onClick={handleValidateNow}>
                      <Bug className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Validar código agora
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" onClick={handleToggleFullscreen}>
                      {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {isFullscreen ? 'Sair do modo tela cheia' : 'Modo tela cheia'}
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col min-h-0 p-0">
            <Tabs value={currentTab} onValueChange={setCurrentTab} className="flex-1 flex flex-col">
              <div className="border-b border-border px-6">
                <TabsList className="grid w-full grid-cols-6">
                  <TabsTrigger value="editor" className="flex items-center gap-2">
                    <Code2 className="h-4 w-4" />
                    Editor
                  </TabsTrigger>
                  <TabsTrigger value="preview" disabled={!showPreview}>
                    <Eye className="h-4 w-4" />
                    Preview
                  </TabsTrigger>
                  <TabsTrigger value="snippets">
                    <Zap className="h-4 w-4" />
                    Snippets
                  </TabsTrigger>
                  <TabsTrigger value="metrics">
                    <Cpu className="h-4 w-4" />
                    Métricas
                  </TabsTrigger>
                  <TabsTrigger value="history">
                    <History className="h-4 w-4" />
                    Histórico
                  </TabsTrigger>
                  <TabsTrigger value="settings">
                    <Settings className="h-4 w-4" />
                    Config
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="flex-1 min-h-0">
                <TabsContent value="editor" className="h-full m-0 data-[state=active]:flex">
                  <div className="flex-1 flex">
                    <div className={showPreview && currentTab === 'editor' ? 'w-1/2' : 'w-full'}>
                      <div 
                        ref={editorRef} 
                        className="h-full"
                        style={{ height: isFullscreen ? 'calc(100vh - 200px)' : height }}
                      />
                    </div>
                    {showPreview && currentTab === 'editor' && (
                      <>
                        <Separator orientation="vertical" />
                        <div className="w-1/2">
                          {renderPreview()}
                        </div>
                      </>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="preview" className="h-full m-0 p-6">
                  {renderPreview()}
                </TabsContent>

                <TabsContent value="snippets" className="h-full m-0 p-6 overflow-auto">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Lightbulb className="h-4 w-4" />
                        <h3 className="text-sm font-medium">Snippets HTML Profissionais</h3>
                      </div>
                      <Select value={selectedSnippetCategory} onValueChange={setSelectedSnippetCategory}>
                        <SelectTrigger className="w-48">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {snippetCategories.map(cat => (
                            <SelectItem key={cat.value} value={cat.value}>
                              {cat.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid gap-4">
                      {filteredSnippets.map((snippet, index) => (
                        <Card key={index} className="cursor-pointer hover:bg-muted/50 transition-colors group">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h4 className="font-medium text-sm">{snippet.label}</h4>
                                  <Badge variant="outline" className="text-xs">
                                    {snippet.category}
                                  </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground mb-3">{snippet.detail}</p>
                                {snippet.description && (
                                  <p className="text-xs text-muted-foreground italic mb-2">{snippet.description}</p>
                                )}
                                {snippet.keywords && (
                                  <div className="flex flex-wrap gap-1 mb-2">
                                    {snippet.keywords.map((keyword, i) => (
                                      <Badge key={i} variant="secondary" className="text-xs">
                                        {keyword}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                              </div>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleInsertSnippet(snippet)}
                                className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                Inserir
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="metrics" className="h-full m-0 p-6 overflow-auto">
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Cpu className="h-4 w-4" />
                      <h3 className="text-sm font-medium">Métricas e Análise do Código</h3>
                    </div>
                    
                    {renderMetrics()}
                    {renderQualityScores()}
                    
                    {validationErrors.length > 0 && (
                      <Card className="p-4">
                        <h4 className="font-medium mb-3 flex items-center gap-2">
                          <AlertCircle className="h-4 w-4" />
                          Problemas Detectados
                        </h4>
                        <div className="space-y-2">
                          {validationErrors.map((error, index) => (
                            <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                              <div className="flex-shrink-0 mt-0.5">
                                {error.severity === 'error' ? (
                                  <AlertCircle className="h-4 w-4 text-red-500" />
                                ) : error.severity === 'warning' ? (
                                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                                ) : (
                                  <Info className="h-4 w-4 text-blue-500" />
                                )}
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium">{error.message}</p>
                                <p className="text-xs text-muted-foreground">
                                  Linha {error.line}, Coluna {error.column}
                                  {error.rule && ` • Regra: ${error.rule}`}
                                </p>
                                {error.suggestion && (
                                  <p className="text-xs text-green-600 mt-1">
                                    💡 {error.suggestion}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </Card>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="history" className="h-full m-0 p-6 overflow-auto">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <History className="h-4 w-4" />
                        <h3 className="text-sm font-medium">Histórico de Alterações</h3>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => saveToHistory('Snapshot manual')}
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Salvar Snapshot
                      </Button>
                    </div>
                    
                    <div className="space-y-3">
                      {editorHistory.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-8">
                          Nenhum item no histórico ainda
                        </p>
                      ) : (
                        editorHistory.map((entry) => (
                          <Card key={entry.id} className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium">{entry.description}</p>
                                <p className="text-xs text-muted-foreground">
                                  {entry.timestamp.toLocaleString('pt-BR')}
                                </p>
                              </div>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleRestoreFromHistory(entry)}
                              >
                                <RotateCcw className="h-4 w-4 mr-2" />
                                Restaurar
                              </Button>
                            </div>
                          </Card>
                        ))
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="settings" className="h-full m-0 p-6 overflow-auto">
                  <div className="space-y-8 max-w-2xl">
                    {/* Aparência */}
                    <div>
                      <h3 className="text-sm font-medium mb-4 flex items-center gap-2">
                        <Palette className="h-4 w-4" />
                        Aparência
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="theme">Tema do Editor</Label>
                          <Select value={theme} onValueChange={setTheme}>
                            <SelectTrigger className="mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {editorThemes.map(t => (
                                <SelectItem key={t.name} value={t.name}>
                                  <div className="flex items-center gap-2">
                                    <Palette className="h-3 w-3" />
                                    <div>
                                      <div>{t.label}</div>
                                      {t.description && (
                                        <div className="text-xs text-muted-foreground">{t.description}</div>
                                      )}
                                    </div>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="fontSize">Tamanho da Fonte</Label>
                          <Select value={fontSize.toString()} onValueChange={(v) => setFontSize(parseInt(v))}>
                            <SelectTrigger className="mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {[10, 12, 14, 16, 18, 20, 24, 28].map(size => (
                                <SelectItem key={size} value={size.toString()}>
                                  {size}px
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Comportamento do Editor */}
                    <div>
                      <h3 className="text-sm font-medium mb-4 flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        Comportamento do Editor
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="minimap">Mostrar Minimap</Label>
                            <p className="text-xs text-muted-foreground">Exibe miniatura do código no lado direito</p>
                          </div>
                          <Switch 
                            id="minimap"
                            checked={showMinimap} 
                            onCheckedChange={setShowMinimap} 
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="wordWrap">Quebra de Linha</Label>
                            <p className="text-xs text-muted-foreground">Quebra linhas longas automaticamente</p>
                          </div>
                          <Switch 
                            id="wordWrap"
                            checked={wordWrap} 
                            onCheckedChange={setWordWrap} 
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="lineNumbers">Números de Linha</Label>
                            <p className="text-xs text-muted-foreground">Mostra numeração das linhas</p>
                          </div>
                          <Switch 
                            id="lineNumbers"
                            checked={showLineNumbers} 
                            onCheckedChange={setShowLineNumbers} 
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="autoFormat">Formatação Automática</Label>
                            <p className="text-xs text-muted-foreground">Formata o código ao colar e digitar</p>
                          </div>
                          <Switch 
                            id="autoFormat"
                            checked={autoFormat} 
                            onCheckedChange={setAutoFormat} 
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="bracketMatching">Destacar Brackets</Label>
                            <p className="text-xs text-muted-foreground">Destaca brackets correspondentes</p>
                          </div>
                          <Switch 
                            id="bracketMatching"
                            checked={enableBracketMatching} 
                            onCheckedChange={setEnableBracketMatching} 
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="autoCloseTags">Fechar Tags Automaticamente</Label>
                            <p className="text-xs text-muted-foreground">Fecha tags HTML automaticamente</p>
                          </div>
                          <Switch 
                            id="autoCloseTags"
                            checked={enableAutoCloseTags} 
                            onCheckedChange={setEnableAutoCloseTags} 
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="liveValidation">Validação em Tempo Real</Label>
                            <p className="text-xs text-muted-foreground">Valida o código enquanto você digita</p>
                          </div>
                          <Switch 
                            id="liveValidation"
                            checked={enableLiveValidation} 
                            onCheckedChange={setEnableLiveValidation} 
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Indentação */}
                    <div>
                      <h3 className="text-sm font-medium mb-4 flex items-center gap-2">
                        <Code className="h-4 w-4" />
                        Indentação
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="tabSize">Tamanho da Tab</Label>
                          <Select value={tabSize.toString()} onValueChange={(v) => setTabSize(parseInt(v))}>
                            <SelectTrigger className="mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {[2, 4, 8].map(size => (
                                <SelectItem key={size} value={size.toString()}>
                                  {size} espaços
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex items-center justify-between pt-8">
                          <div>
                            <Label htmlFor="insertSpaces">Usar Espaços</Label>
                            <p className="text-xs text-muted-foreground">Inserir espaços ao invés de tabs</p>
                          </div>
                          <Switch 
                            id="insertSpaces"
                            checked={insertSpaces} 
                            onCheckedChange={setInsertSpaces} 
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Ferramentas */}
                    <div>
                      <h3 className="text-sm font-medium mb-4 flex items-center gap-2">
                        <Terminal className="h-4 w-4" />
                        Ferramentas
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <Button variant="outline" onClick={handleBeautifyCode} className="h-auto p-4">
                          <div className="text-center">
                            <Sparkles className="h-5 w-5 mx-auto mb-2" />
                            <div className="text-sm font-medium">Beautify</div>
                            <div className="text-xs text-muted-foreground">Formatar código</div>
                          </div>
                        </Button>

                        <Button variant="outline" onClick={handleMinifyCode} className="h-auto p-4">
                          <div className="text-center">
                            <RefreshCw className="h-5 w-5 mx-auto mb-2" />
                            <div className="text-sm font-medium">Minify</div>
                            <div className="text-xs text-muted-foreground">Comprimir código</div>
                          </div>
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}