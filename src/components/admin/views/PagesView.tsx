import { useState, useEffect } from 'react';
import { usePages, type CustomPage } from '../../PagesContext';
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  FolderOpen,
  Save,
  X,
  GripVertical,
  Link as LinkIcon,
  Settings,
  Globe,
  FileText,
  Calendar,
  User,
  Tag,
  Layout,
  ExternalLink
} from 'lucide-react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Badge } from '../../ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../../ui/table';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '../../ui/dropdown-menu';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '../../ui/dialog';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Switch } from '../../ui/switch';
import { Separator } from '../../ui/separator';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Checkbox } from '../../ui/checkbox';
import { useAdmin } from '../AdminContext';
import { BulkActions, useBulkSelection, type BulkAction } from '../components/BulkActions';

export function PagesView() {
  const { setBreadcrumbs, addNotification } = useAdmin();
  const { 
    pages, 
    addPage, 
    updatePage, 
    deletePage, 
    togglePageStatus, 
    togglePageVisibility 
  } = usePages();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<CustomPage | null>(null);
  const [previewPage, setPreviewPage] = useState<CustomPage | null>(null);

  useEffect(() => {
    setBreadcrumbs([{ label: 'Páginas' }]);
  }, [setBreadcrumbs]);

  const filteredPages = pages
    .filter(page => {
      const matchesSearch = page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           page.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           page.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || page.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

  // Bulk actions
  const bulkSelection = useBulkSelection(filteredPages);

  const handleDeletePage = (pageId: number) => {
    deletePage(pageId);
    addNotification({
      type: 'success',
      title: 'Página excluída',
      message: 'A página foi excluída com sucesso.'
    });
  };

  const handleToggleStatus = (pageId: number) => {
    const page = pages.find(p => p.id === pageId);
    togglePageStatus(pageId);
    addNotification({
      type: 'success',
      title: `Página ${page?.status === 'published' ? 'despublicada' : 'publicada'}`,
      message: `A página foi ${page?.status === 'published' ? 'despublicada' : 'publicada'} com sucesso.`
    });
  };

  const handleToggleVisibility = (pageId: number) => {
    const page = pages.find(p => p.id === pageId);
    togglePageVisibility(pageId);
    addNotification({
      type: 'success',
      title: `Página ${page?.isVisible ? 'ocultada' : 'exibida'}`,
      message: `A página foi ${page?.isVisible ? 'ocultada' : 'exibida'} com sucesso.`
    });
  };

  // Bulk actions handlers
  const handleBulkAction = (actionId: string, selectedIds: string[]) => {
    switch (actionId) {
      case 'delete':
        selectedIds.forEach(id => deletePage(parseInt(id)));
        bulkSelection.clearSelection();
        addNotification({
          type: 'success',
          title: `${selectedIds.length} página${selectedIds.length !== 1 ? 's' : ''} excluída${selectedIds.length !== 1 ? 's' : ''}`,
          message: 'As páginas selecionadas foram excluídas com sucesso.'
        });
        break;
        
      case 'publish':
        selectedIds.forEach(id => {
          const page = pages.find(p => p.id.toString() === id);
          if (page && page.status !== 'published') {
            togglePageStatus(parseInt(id));
          }
        });
        bulkSelection.clearSelection();
        addNotification({
          type: 'success',
          title: `${selectedIds.length} página${selectedIds.length !== 1 ? 's' : ''} publicada${selectedIds.length !== 1 ? 's' : ''}`,
          message: 'As páginas selecionadas foram publicadas com sucesso.'
        });
        break;
        
      case 'draft':
        selectedIds.forEach(id => {
          const page = pages.find(p => p.id.toString() === id);
          if (page && page.status === 'published') {
            togglePageStatus(parseInt(id));
          }
        });
        bulkSelection.clearSelection();
        addNotification({
          type: 'success',
          title: `${selectedIds.length} página${selectedIds.length !== 1 ? 's' : ''} despublicada${selectedIds.length !== 1 ? 's' : ''}`,
          message: 'As páginas selecionadas foram despublicadas com sucesso.'
        });
        break;
        
      case 'show':
        selectedIds.forEach(id => {
          const page = pages.find(p => p.id.toString() === id);
          if (page && !page.isVisible) {
            togglePageVisibility(parseInt(id));
          }
        });
        bulkSelection.clearSelection();
        addNotification({
          type: 'success',
          title: `${selectedIds.length} página${selectedIds.length !== 1 ? 's' : ''} exibida${selectedIds.length !== 1 ? 's' : ''}`,
          message: 'As páginas selecionadas foram exibidas com sucesso.'
        });
        break;
        
      case 'hide':
        selectedIds.forEach(id => {
          const page = pages.find(p => p.id.toString() === id);
          if (page && page.isVisible) {
            togglePageVisibility(parseInt(id));
          }
        });
        bulkSelection.clearSelection();
        addNotification({
          type: 'success',
          title: `${selectedIds.length} página${selectedIds.length !== 1 ? 's' : ''} ocultada${selectedIds.length !== 1 ? 's' : ''}`,
          message: 'As páginas selecionadas foram ocultadas com sucesso.'
        });
        break;
    }
  };

  const bulkActions: BulkAction[] = [
    {
      id: 'publish',
      label: 'Publicar',
      icon: Globe,
      variant: 'outline'
    },
    {
      id: 'draft',
      label: 'Despublicar',
      icon: FileText,
      variant: 'outline'
    },
    {
      id: 'show',
      label: 'Exibir',
      icon: Eye,
      variant: 'outline'
    },
    {
      id: 'hide',
      label: 'Ocultar',
      icon: EyeOff,
      variant: 'outline'
    },
    {
      id: 'delete',
      label: 'Excluir',
      icon: Trash2,
      variant: 'destructive',
      requiresConfirmation: true,
      confirmationTitle: 'Excluir páginas selecionadas',
      confirmationDescription: 'Esta ação não pode ser desfeita. As páginas selecionadas serão permanentemente removidas.'
    }
  ];

  const PageForm = ({ page, onSave, onCancel }: {
    page?: CustomPage;
    onSave: (pageData: Omit<CustomPage, 'id' | 'createdAt' | 'updatedAt'>) => void;
    onCancel: () => void;
  }) => {
    const [formData, setFormData] = useState({
      title: page?.title || '',
      slug: page?.slug || '',
      content: page?.content || '',
      excerpt: page?.excerpt || '',
      status: page?.status || 'draft' as const,
      isVisible: page?.isVisible ?? true,
      showInMenu: page?.showInMenu ?? false,
      menuOrder: page?.menuOrder || 999,
      seoTitle: page?.seoTitle || '',
      seoDescription: page?.seoDescription || '',
      coverImage: page?.coverImage || '',
      author: page?.author || 'Admin Municipal',
      pageType: page?.pageType || 'standard' as const,
      parentPageId: page?.parentPageId,
      template: page?.template || 'default' as const
    });

    // Auto-gerar slug baseado no título
    useEffect(() => {
      if (!page && formData.title) {
        const slug = formData.title
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim();
        setFormData(prev => ({ ...prev, slug }));
      }
    }, [formData.title, page]);

    const handleSubmit = () => {
      if (!formData.title || !formData.slug) {
        addNotification({
          type: 'error',
          title: 'Campos obrigatórios',
          message: 'Título e slug são obrigatórios.'
        });
        return;
      }

      // Verificar se o slug já existe (exceto para a página sendo editada)
      const existingPage = pages.find(p => p.slug === formData.slug && p.id !== page?.id);
      if (existingPage) {
        addNotification({
          type: 'error',
          title: 'Slug já existe',
          message: 'Este slug já está sendo usado por outra página.'
        });
        return;
      }

      onSave(formData);
    };

    return (
      <Tabs defaultValue="content" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="content">Conteúdo</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-4">
          <div className="grid gap-4">
            <div>
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Digite o título da página"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="slug">Slug *</Label>
              <div className="relative mt-1">
                <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="url-da-pagina"
                  className="pl-10"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                URL: /pagina/{formData.slug}
              </p>
            </div>

            <div>
              <Label htmlFor="excerpt">Resumo</Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="Breve descrição da página"
                className="mt-1"
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="content">Conteúdo *</Label>
              <Tabs defaultValue="editor" className="mt-1">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="editor">Editor HTML</TabsTrigger>
                  <TabsTrigger value="templates">Templates</TabsTrigger>
                </TabsList>
                
                <TabsContent value="editor" className="border rounded-lg overflow-hidden bg-background">
                  {/* Toolbar com botões de inserção */}
                  <div className="flex flex-wrap items-center gap-1 px-3 py-2 bg-muted/50 border-b">
                    <div className="flex items-center gap-1 mr-4">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Ferramentas:</span>
                    </div>
                    
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const textarea = document.getElementById('content') as HTMLTextAreaElement;
                        const start = textarea.selectionStart;
                        const end = textarea.selectionEnd;
                        const newText = formData.content?.slice(0, start) + '<h1>Título Principal</h1>' + formData.content?.slice(end);
                        setFormData({ ...formData, content: newText });
                        setTimeout(() => textarea.focus(), 0);
                      }}
                      className="flex items-center gap-1 text-xs"
                    >
                      <span>H1</span>
                    </Button>
                    
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const textarea = document.getElementById('content') as HTMLTextAreaElement;
                        const start = textarea.selectionStart;
                        const end = textarea.selectionEnd;
                        const newText = formData.content?.slice(0, start) + '<h2>Título da Seção</h2>' + formData.content?.slice(end);
                        setFormData({ ...formData, content: newText });
                        setTimeout(() => textarea.focus(), 0);
                      }}
                      className="flex items-center gap-1 text-xs"
                    >
                      <span>H2</span>
                    </Button>
                    
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const textarea = document.getElementById('content') as HTMLTextAreaElement;
                        const start = textarea.selectionStart;
                        const end = textarea.selectionEnd;
                        const newText = formData.content?.slice(0, start) + '<p>Parágrafo de texto aqui.</p>' + formData.content?.slice(end);
                        setFormData({ ...formData, content: newText });
                        setTimeout(() => textarea.focus(), 0);
                      }}
                      className="flex items-center gap-1 text-xs"
                    >
                      <span>Parágrafo</span>
                    </Button>
                    
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const textarea = document.getElementById('content') as HTMLTextAreaElement;
                        const start = textarea.selectionStart;
                        const end = textarea.selectionEnd;
                        const newText = formData.content?.slice(0, start) + '<img src="https://via.placeholder.com/800x400?text=Sua+Imagem" alt="Descrição da imagem" />' + formData.content?.slice(end);
                        setFormData({ ...formData, content: newText });
                        setTimeout(() => textarea.focus(), 0);
                      }}
                      className="flex items-center gap-1 text-xs"
                    >
                      <span>Imagem</span>
                    </Button>
                    
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const textarea = document.getElementById('content') as HTMLTextAreaElement;
                        const start = textarea.selectionStart;
                        const end = textarea.selectionEnd;
                        const newText = formData.content?.slice(0, start) + '<a href="https://timon.ma.gov.br">Link para o site</a>' + formData.content?.slice(end);
                        setFormData({ ...formData, content: newText });
                        setTimeout(() => textarea.focus(), 0);
                      }}
                      className="flex items-center gap-1 text-xs"
                    >
                      <LinkIcon className="h-3 w-3" />
                      <span>Link</span>
                    </Button>
                    
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const textarea = document.getElementById('content') as HTMLTextAreaElement;
                        const start = textarea.selectionStart;
                        const end = textarea.selectionEnd;
                        const listHtml = `<ul>
  <li>Primeiro item</li>
  <li>Segundo item</li>
  <li>Terceiro item</li>
</ul>`;
                        const newText = formData.content?.slice(0, start) + listHtml + formData.content?.slice(end);
                        setFormData({ ...formData, content: newText });
                        setTimeout(() => textarea.focus(), 0);
                      }}
                      className="flex items-center gap-1 text-xs"
                    >
                      <span>Lista</span>
                    </Button>
                    
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const textarea = document.getElementById('content') as HTMLTextAreaElement;
                        const start = textarea.selectionStart;
                        const end = textarea.selectionEnd;
                        const tableHtml = `<table>
  <thead>
    <tr>
      <th>Coluna 1</th>
      <th>Coluna 2</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Dados 1</td>
      <td>Dados 2</td>
    </tr>
  </tbody>
</table>`;
                        const newText = formData.content?.slice(0, start) + tableHtml + formData.content?.slice(end);
                        setFormData({ ...formData, content: newText });
                        setTimeout(() => textarea.focus(), 0);
                      }}
                      className="flex items-center gap-1 text-xs"
                    >
                      <span>Tabela</span>
                    </Button>
                  </div>
                  
                  {/* Header com botões de ação */}
                  <div className="flex items-center justify-between px-3 py-2 bg-muted border-b">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Editor de Código HTML</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // Formatar/identar o HTML
                          try {
                            const formatted = formData.content
                              ?.replace(/></g, '>\n<')
                              .replace(/^\s*\n/gm, '')
                              .split('\n')
                              .map((line, index, arr) => {
                                const trimmed = line.trim();
                                if (!trimmed) return '';
                                
                                let indent = 0;
                                for (let i = 0; i < index; i++) {
                                  const prevLine = arr[i].trim();
                                  if (prevLine.match(/<(?!\/)[^>]*>/) && !prevLine.match(/<[^>]*\/>/)) {
                                    indent++;
                                  }
                                  if (prevLine.match(/<\/[^>]*>/)) {
                                    indent--;
                                  }
                                }
                                
                                if (trimmed.match(/^<\/[^>]*>/)) {
                                  indent--;
                                }
                                
                                return '  '.repeat(Math.max(0, indent)) + trimmed;
                              })
                              .join('\n');
                            
                            setFormData({ ...formData, content: formatted });
                          } catch (e) {
                            console.warn('Erro ao formatar HTML:', e);
                          }
                        }}
                        className="flex items-center gap-1"
                      >
                        <Layout className="h-4 w-4" />
                        Formatar
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (!formData.content?.trim()) {
                            alert('Adicione conteúdo antes de visualizar');
                            return;
                          }
                          const previewContent = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pré-visualização - ${formData.title || 'Nova Página'}</title>
    <style>
        body { 
            font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            margin: 0; 
            padding: 20px; 
            background: #f9f9f9;
        }
        .preview-container { 
            max-width: 1200px; 
            margin: 0 auto; 
            background: white; 
            padding: 30px; 
            border-radius: 8px; 
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .preview-header {
            background: #144c9c;
            color: white;
            padding: 15px 20px;
            margin: -30px -30px 30px -30px;
            border-radius: 8px 8px 0 0;
        }
        .preview-badge {
            display: inline-block;
            background: rgba(255,255,255,0.2);
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            margin-bottom: 10px;
        }
        h1 { color: #144c9c; margin-top: 0; }
        h2 { color: #228B22; border-bottom: 2px solid #228B22; padding-bottom: 8px; }
        h3 { color: #144c9c; }
        a { color: #144c9c; text-decoration: none; }
        a:hover { text-decoration: underline; }
        img { max-width: 100%; height: auto; border-radius: 8px; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background-color: #f5f5f5; font-weight: 600; color: #144c9c; }
        .content { font-size: 16px; }
        .alert { padding: 15px; margin: 20px 0; border-radius: 8px; }
        .alert-info { background: #e8f4fd; border: 1px solid #144c9c; color: #144c9c; }
        .alert-success { background: #d4edda; border: 1px solid #228B22; color: #228B22; }
        .btn { display: inline-block; padding: 10px 20px; margin: 5px; border-radius: 5px; text-decoration: none; font-weight: 600; }
        .btn-primary { background: #144c9c; color: white; }
        .btn-secondary { background: #228B22; color: white; }
        ul, ol { margin: 1rem 0; padding-left: 2rem; }
        li { margin-bottom: 0.5rem; }
    </style>
</head>
<body>
    <div class="preview-container">
        <div class="preview-header">
            <div class="preview-badge">🔍 PRÉ-VISUALIZAÇÃO</div>
            <h1 style="color: white; margin: 0;">${formData.title || 'Nova Página'}</h1>
            <p style="margin: 0; opacity: 0.9;">Esta é uma pré-visualização da página antes da publicação</p>
        </div>
        <div class="content">
            ${formData.content}
        </div>
    </div>
</body>
</html>`;
                          const blob = new Blob([previewContent], { type: 'text/html' });
                          const url = URL.createObjectURL(blob);
                          const newWindow = window.open(url, '_blank');
                          if (newWindow) {
                            newWindow.onload = () => URL.revokeObjectURL(url);
                          }
                        }}
                        className="flex items-center gap-1"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Preview
                      </Button>
                    </div>
                  </div>
                  
                  {/* Editor de código */}
                  <div className="relative">
                    {/* Indicador de linhas corrigido */}
                    <div className="absolute left-0 top-0 w-14 h-full bg-muted/30 border-r border-border pointer-events-none overflow-hidden">
                      <div className="pt-4 pb-4 font-mono text-xs text-muted-foreground">
                        {(() => {
                          const content = formData.content || '';
                          const lines = content.split('\n');
                          return lines.map((_, index) => (
                            <div 
                              key={index + 1} 
                              className="text-right pr-3 leading-6 h-6 flex items-center justify-end"
                              style={{ lineHeight: '1.5' }}
                            >
                              {index + 1}
                            </div>
                          ));
                        })()}
                      </div>
                    </div>
                    
                    <textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      placeholder="Digite ou cole seu código HTML aqui..."
                      className="w-full h-96 pl-16 pr-4 py-4 font-mono text-sm border-0 resize-none focus:ring-0 focus:outline-none bg-background leading-6"
                      style={{
                        fontFamily: "'JetBrains Mono', 'Fira Code', 'Monaco', 'Consolas', monospace",
                        lineHeight: '1.5',
                        tabSize: 2
                      }}
                      spellCheck={false}
                    />
                  </div>
                  
                  {/* Footer com informações */}
                  <div className="px-3 py-2 bg-muted/50 border-t text-xs text-muted-foreground flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <span>Linhas: {(formData.content || '').split('\n').length}</span>
                      <span>Caracteres: {(formData.content || '').length}</span>
                      <span>Palavras: {(formData.content || '').split(/\s+/).filter(word => word.length > 0).length}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>HTML</span>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="templates" className="border rounded-lg p-4 bg-background">
                  <div className="space-y-4">
                    <div className="text-sm text-muted-foreground mb-4">
                      Clique no template para aplicá-lo automaticamente ao editor:
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4">
                      {/* Apenas Template Básico */}
                      <Card className="cursor-pointer hover:shadow-md transition-shadow"
                            onClick={() => {
                              const basicTemplate = `<h1>Título Principal da Página</h1>
<p>Este é um parágrafo introdutório que explica o conteúdo da página de forma clara e objetiva.</p>

<h2>Seção Importante</h2>
<p>Aqui você pode adicionar informações relevantes sobre o assunto tratado na página.</p>

<h3>Lista de Informações</h3>
<ul>
  <li>Primeiro item da lista</li>
  <li>Segundo item da lista</li>
  <li>Terceiro item da lista</li>
</ul>

<h3>Link Útil</h3>
<p>Para mais informações, acesse o <a href="https://timon.ma.gov.br">site oficial da Prefeitura</a>.</p>`;
                              setFormData({ ...formData, content: basicTemplate });
                              // Mudar automaticamente para a aba do editor
                              const editorTab = document.querySelector('[value="editor"]') as HTMLButtonElement;
                              if (editorTab) editorTab.click();
                            }}>
                        <CardHeader>
                          <CardTitle className="text-sm">Página Básica</CardTitle>
                          <CardDescription>Estrutura simples com título, parágrafos e lista. Clique para aplicar ao editor.</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="text-xs text-muted-foreground">
                            Inclui: Título H1, Seção H2, Subtítulo H3, Parágrafos, Lista e Link
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div className="mt-6 p-4 bg-accent/50 rounded-lg">
                      <h4 className="font-medium mb-2">Mais templates em breve!</h4>
                      <p className="text-sm text-muted-foreground">
                        Estamos preparando mais templates para facilitar a criação de páginas. 
                        Por enquanto, use o template básico e os botões de inserção de tags no editor.
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              <p className="text-xs text-muted-foreground mt-2">
                Use os botões da toolbar para inserir tags HTML rapidamente. O preview abre em nova aba.
              </p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Rascunho</SelectItem>
                  <SelectItem value="published">Publicado</SelectItem>
                  <SelectItem value="archived">Arquivado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="pageType">Tipo de Página</Label>
              <Select value={formData.pageType} onValueChange={(value: any) => setFormData({ ...formData, pageType: value })}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Padrão</SelectItem>
                  <SelectItem value="landing">Landing Page</SelectItem>
                  <SelectItem value="institutional">Institucional</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="template">Template</Label>
              <Select value={formData.template} onValueChange={(value: any) => setFormData({ ...formData, template: value })}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Padrão</SelectItem>
                  <SelectItem value="fullwidth">Largura Total</SelectItem>
                  <SelectItem value="sidebar">Com Sidebar</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="author">Autor</Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                className="mt-1"
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Página Visível</Label>
                <p className="text-sm text-muted-foreground">
                  Controla se a página aparece no site
                </p>
              </div>
              <Switch
                checked={formData.isVisible}
                onCheckedChange={(checked) => setFormData({ ...formData, isVisible: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Exibir no Menu</Label>
                <p className="text-sm text-muted-foreground">
                  Adicionar link no menu principal
                </p>
              </div>
              <Switch
                checked={formData.showInMenu}
                onCheckedChange={(checked) => setFormData({ ...formData, showInMenu: checked })}
              />
            </div>

            {formData.showInMenu && (
              <div>
                <Label htmlFor="menuOrder">Ordem no Menu</Label>
                <Input
                  id="menuOrder"
                  type="number"
                  value={formData.menuOrder}
                  onChange={(e) => setFormData({ ...formData, menuOrder: parseInt(e.target.value) || 999 })}
                  className="mt-1"
                  min="1"
                  max="999"
                />
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="seo" className="space-y-4">
          <div>
            <Label htmlFor="seoTitle">Título SEO</Label>
            <Input
              id="seoTitle"
              value={formData.seoTitle}
              onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
              placeholder="Título para mecanismos de busca"
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {formData.seoTitle.length}/60 caracteres recomendados
            </p>
          </div>

          <div>
            <Label htmlFor="seoDescription">Descrição SEO</Label>
            <Textarea
              id="seoDescription"
              value={formData.seoDescription}
              onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
              placeholder="Descrição para mecanismos de busca"
              className="mt-1"
              rows={3}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {formData.seoDescription.length}/160 caracteres recomendados
            </p>
          </div>

          <div>
            <Label htmlFor="coverImage">Imagem de Capa (URL)</Label>
            <Input
              id="coverImage"
              value={formData.coverImage}
              onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
              placeholder="https://exemplo.com/imagem.jpg"
              className="mt-1"
            />
          </div>
        </TabsContent>

        <div className="flex justify-between pt-6 border-t">
          <Button variant="outline" onClick={onCancel}>
            <X className="h-4 w-4 mr-2" />
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>
            <Save className="h-4 w-4 mr-2" />
            {page ? 'Atualizar Página' : 'Criar Página'}
          </Button>
        </div>
      </Tabs>
    );
  };

  const PagePreview = ({ page }: { page: CustomPage }) => (
    <div className="max-w-4xl mx-auto">
      <div className="border border-border rounded-lg overflow-hidden bg-card">
        {page.coverImage && (
          <div className="aspect-video bg-muted overflow-hidden">
            <img 
              src={page.coverImage} 
              alt={page.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant={page.status === 'published' ? 'default' : 'secondary'}>
              {page.status === 'published' ? 'Publicado' : 'Rascunho'}
            </Badge>
            <Badge variant="outline">{page.pageType}</Badge>
            <Badge variant="outline">{page.template}</Badge>
          </div>
          
          <h1 className="text-3xl font-bold mb-4">{page.title}</h1>
          
          {page.excerpt && (
            <p className="text-lg text-muted-foreground mb-6">{page.excerpt}</p>
          )}
          
          <div 
            className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
          
          <div className="flex items-center gap-4 pt-6 mt-6 border-t text-sm text-muted-foreground">
            <span>Por: {page.author}</span>
            <span>•</span>
            <span>Atualizado em: {page.updatedAt.toLocaleDateString('pt-BR')}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Páginas Customizadas</h1>
          <p className="text-muted-foreground">
            Gerencie páginas customizadas que não fazem parte da estrutura base do site
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Página
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{pages.length}</p>
              </div>
              <FolderOpen className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Publicadas</p>
                <p className="text-2xl font-bold text-green-600">
                  {pages.filter(p => p.status === 'published').length}
                </p>
              </div>
              <Globe className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Rascunhos</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {pages.filter(p => p.status === 'draft').length}
                </p>
              </div>
              <FileText className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">No Menu</p>
                <p className="text-2xl font-bold">
                  {pages.filter(p => p.showInMenu).length}
                </p>
              </div>
              <Layout className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pages Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[16px]">
            <FileText className="h-4 w-4" />
            Páginas ({filteredPages.length})
          </CardTitle>
          <div className="mt-4 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar páginas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <FileText className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="published">Publicado</SelectItem>
                  <SelectItem value="draft">Rascunho</SelectItem>
                  <SelectItem value="archived">Arquivado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Bulk Actions */}
          <div className="mb-4">
            <BulkActions
              selectedIds={bulkSelection.selectedIds}
              totalItems={filteredPages.length}
              onSelectAll={bulkSelection.selectAll}
              onClearSelection={bulkSelection.clearSelection}
              actions={bulkActions}
              onAction={handleBulkAction}
              itemName="página"
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={bulkSelection.selectedIds.length === filteredPages.length && filteredPages.length > 0}
                    onCheckedChange={bulkSelection.selectAll}
                    className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                </TableHead>
                <TableHead>Página</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Autor</TableHead>
                <TableHead>Atualização</TableHead>
                <TableHead className="text-left">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPages.map((page) => (
                <TableRow key={page.id}>
                  <TableCell>
                    <Checkbox
                      checked={bulkSelection.isSelected(page.id)}
                      onCheckedChange={() => bulkSelection.selectItem(page.id)}
                      className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{page.title}</span>
                        {page.showInMenu && <Tag className="h-3 w-3 text-muted-foreground" />}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-muted-foreground">/{page.slug}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-5 w-5 p-0"
                          onClick={() => setPreviewPage(page)}
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge variant={
                        page.status === 'published' ? 'default' :
                        page.status === 'draft' ? 'secondary' : 'outline'
                      }>
                        {page.status === 'published' ? 'Publicado' :
                         page.status === 'draft' ? 'Rascunho' : 'Arquivado'}
                      </Badge>
                      {!page.isVisible && <EyeOff className="h-3 w-3 text-muted-foreground" />}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{page.pageType}</Badge>
                  </TableCell>
                  <TableCell>{page.author}</TableCell>
                  <TableCell>{page.updatedAt.toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell className="text-left">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEditingPage(page)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setPreviewPage(page)}>
                          <Eye className="h-4 w-4 mr-2" />
                          Visualizar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleStatus(page.id)}>
                          {page.status === 'published' ? (
                            <><EyeOff className="h-4 w-4 mr-2" />Despublicar</>
                          ) : (
                            <><Globe className="h-4 w-4 mr-2" />Publicar</>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleVisibility(page.id)}>
                          {page.isVisible ? (
                            <><EyeOff className="h-4 w-4 mr-2" />Ocultar</>
                          ) : (
                            <><Eye className="h-4 w-4 mr-2" />Exibir</>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleDeletePage(page.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredPages.length === 0 && (
            <div className="text-center py-12">
              <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Nenhuma página encontrada com os filtros aplicados'
                  : 'Nenhuma página criada ainda'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Page Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nova Página</DialogTitle>
            <DialogDescription>
              Crie uma nova página customizada que complementa a estrutura base do site da prefeitura.
            </DialogDescription>
          </DialogHeader>
          <PageForm
            onSave={(pageData) => {
              addPage(pageData);
              setIsCreateModalOpen(false);
              addNotification({
                type: 'success',
                title: 'Página criada',
                message: 'A página foi criada com sucesso.'
              });
            }}
            onCancel={() => setIsCreateModalOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Page Modal */}
      <Dialog open={!!editingPage} onOpenChange={() => setEditingPage(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Página</DialogTitle>
            <DialogDescription>
              Faça as alterações necessárias na página selecionada.
            </DialogDescription>
          </DialogHeader>
          {editingPage && (
            <PageForm
              page={editingPage}
              onSave={(pageData) => {
                updatePage(editingPage.id, pageData);
                setEditingPage(null);
                addNotification({
                  type: 'success',
                  title: 'Página atualizada',
                  message: 'As alterações foram salvas com sucesso.'
                });
              }}
              onCancel={() => setEditingPage(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Preview Page Modal */}
      <Dialog open={!!previewPage} onOpenChange={() => setPreviewPage(null)}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Visualização da Página
            </DialogTitle>
            <DialogDescription>
              Preview de como a página aparecerá no site
            </DialogDescription>
          </DialogHeader>
          {previewPage && <PagePreview page={previewPage} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}