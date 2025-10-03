import { usePages, type CustomPage } from './PagesContext';
import { ArrowLeft, Calendar, User, Eye, Share2 } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Separator } from './ui/separator';

interface CustomPageViewProps {
  slug: string;
  onNavigateBack: () => void;
}

export default function CustomPageView({ slug, onNavigateBack }: CustomPageViewProps) {
  const { getPageBySlug } = usePages();
  const page = getPageBySlug(slug);

  if (!page) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <Button 
                variant="ghost" 
                onClick={onNavigateBack}
                className="mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar ao início
              </Button>
            </div>

            {/* 404 Content */}
            <Card>
              <CardContent className="text-center py-16">
                <h1 className="text-4xl font-bold mb-4">Página não encontrada</h1>
                <p className="text-lg text-muted-foreground mb-8">
                  A página que você está procurando não existe ou foi removida.
                </p>
                <Button onClick={onNavigateBack}>
                  Voltar ao início
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: page.title,
        text: page.excerpt || page.title,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // Aqui você poderia adicionar uma notificação de sucesso
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className={`mx-auto ${
          page.template === 'fullwidth' ? 'max-w-7xl' : 
          page.template === 'sidebar' ? 'max-w-6xl' : 'max-w-4xl'
        }`}>
          {/* Header */}
          <div className="mb-6">
            <Button 
              variant="ghost" 
              onClick={onNavigateBack}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao início
            </Button>
          </div>

          {/* Page Content */}
          <div className={page.template === 'sidebar' ? 'grid grid-cols-1 lg:grid-cols-4 gap-8' : ''}>
            {/* Main Content */}
            <div className={page.template === 'sidebar' ? 'lg:col-span-3' : ''}>
              <Card>
                {/* Cover Image */}
                {page.coverImage && (
                  <div className="aspect-video bg-muted overflow-hidden rounded-t-lg">
                    <img 
                      src={page.coverImage} 
                      alt={page.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <CardContent className="p-6 lg:p-8">
                  {/* Page Meta */}
                  <div className="flex flex-wrap items-center gap-3 mb-6">
                    <Badge variant="outline">
                      {page.pageType === 'institutional' ? 'Institucional' :
                       page.pageType === 'landing' ? 'Landing Page' : 'Página Padrão'}
                    </Badge>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="h-4 w-4" />
                      {page.author}
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      Atualizado em {page.updatedAt.toLocaleDateString('pt-BR')}
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleShare}
                      className="ml-auto"
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Compartilhar
                    </Button>
                  </div>

                  {/* Page Title */}
                  <h1 className="text-3xl lg:text-4xl font-bold mb-6 text-foreground">
                    {page.title}
                  </h1>

                  {/* Page Excerpt */}
                  {page.excerpt && (
                    <div className="mb-8">
                      <p className="text-lg text-muted-foreground leading-relaxed">
                        {page.excerpt}
                      </p>
                      <Separator className="mt-6" />
                    </div>
                  )}

                  {/* Page Content */}
                  <div 
                    className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-foreground prose-li:text-foreground prose-strong:text-foreground prose-a:text-primary prose-a:no-underline hover:prose-a:underline"
                    dangerouslySetInnerHTML={{ __html: page.content }}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            {page.template === 'sidebar' && (
              <div className="lg:col-span-1">
                <div className="space-y-6">
                  {/* Quick Info */}
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-3">Informações</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span>Autor: {page.author}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>Criado em: {page.createdAt.toLocaleDateString('pt-BR')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Eye className="h-4 w-4 text-muted-foreground" />
                          <span>Atualizado em: {page.updatedAt.toLocaleDateString('pt-BR')}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Related Actions */}
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-3">Ações</h3>
                      <div className="space-y-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleShare}
                          className="w-full justify-start"
                        >
                          <Share2 className="h-4 w-4 mr-2" />
                          Compartilhar página
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.print()}
                          className="w-full justify-start"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Imprimir página
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Contact Info */}
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-3">Contato</h3>
                      <div className="space-y-2 text-sm">
                        <p>Para mais informações sobre este conteúdo:</p>
                        <p><strong>Email:</strong> prefeitura@timon.ma.gov.br</p>
                        <p><strong>Telefone:</strong> (99) 3212-3456</p>
                        <p><strong>Horário:</strong> 8h às 17h</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Actions */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" onClick={onNavigateBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao início
            </Button>
            <Button variant="outline" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Compartilhar esta página
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}