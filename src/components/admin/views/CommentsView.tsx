import React, { useState, useMemo } from 'react';
import { useComments, type Comment } from '../../CommentsContext';
import { Button } from '../../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Input } from '../../ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { Alert, AlertDescription } from '../../ui/alert';
import { Separator } from '../../ui/separator';
import { 
  MessageCircle, 
  Search, 
  Filter,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  Clock,
  Heart,
  User,
  ExternalLink,
  AlertTriangle
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { EmptyState } from '../components/EmptyState';

export function CommentsView() {
  const {
    comments,
    isLoading,
    error,
    moderateComment
  } = useComments();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'pending' | 'rejected'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'news' | 'gallery' | 'photo'>('all');

  // Filtrar comentários
  const filteredComments = useMemo(() => {
    return comments.filter(comment => {
      const matchesSearch = searchTerm === '' || 
        comment.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comment.author.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'approved' && comment.isApproved) ||
        (statusFilter === 'pending' && comment.isApproved === undefined) ||
        (statusFilter === 'rejected' && comment.isApproved === false);
      
      const matchesType = typeFilter === 'all' || comment.postType === typeFilter;
      
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [comments, searchTerm, statusFilter, typeFilter]);

  // Estatísticas
  const stats = useMemo(() => {
    const total = comments.length;
    const approved = comments.filter(c => c.isApproved === true).length;
    const pending = comments.filter(c => c.isApproved === undefined).length;
    const rejected = comments.filter(c => c.isApproved === false).length;
    const totalWithReplies = comments.reduce((acc, comment) => 
      acc + 1 + (comment.replies?.length || 0), 0
    );

    return { total, approved, pending, rejected, totalWithReplies };
  }, [comments]);

  // Formatar data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Obter status do comentário
  const getStatusBadge = (comment: Comment) => {
    if (comment.isApproved === true) {
      return (
        <Badge variant="default" className="gap-1">
          <CheckCircle2 className="h-3 w-3" />
          Aprovado
        </Badge>
      );
    } else if (comment.isApproved === false) {
      return (
        <Badge variant="destructive" className="gap-1">
          <XCircle className="h-3 w-3" />
          Rejeitado
        </Badge>
      );
    } else {
      return (
        <Badge variant="secondary" className="gap-1">
          <Clock className="h-3 w-3" />
          Pendente
        </Badge>
      );
    }
  };

  // Obter badge do tipo de post
  const getTypeBadge = (postType: string) => {
    const configs = {
      news: { label: 'Notícia', variant: 'default' as const },
      gallery: { label: 'Galeria', variant: 'secondary' as const },
      photo: { label: 'Foto', variant: 'outline' as const }
    };
    
    const config = configs[postType as keyof typeof configs] || configs.news;
    
    return (
      <Badge variant={config.variant} className="text-xs">
        {config.label}
      </Badge>
    );
  };

  // Moderar comentário
  const handleModerate = async (commentId: string, approved: boolean) => {
    try {
      await moderateComment(commentId, approved);
    } catch (error) {
      console.error('Erro ao moderar comentário:', error);
    }
  };

  if (comments.length === 0 && !isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Comentários</h1>
          <p className="text-muted-foreground">
            Modere e gerencie comentários de notícias e galerias
          </p>
        </div>

        <EmptyState
          title="Nenhum comentário encontrado"
          description="Os comentários das notícias e galerias aparecerão aqui para moderação."
          icon="MessageCircle"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Moderação de Comentários</h1>
        <p className="text-muted-foreground">
          Gerencie e modere comentários de visitantes
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalWithReplies}</div>
            <p className="text-xs text-muted-foreground">
              Comentários e respostas
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aprovados</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
            <p className="text-xs text-muted-foreground">
              Visíveis no site
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">
              Aguardando moderação
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejeitados</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
            <p className="text-xs text-muted-foreground">
              Não aprovados
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por conteúdo ou autor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos status</SelectItem>
                <SelectItem value="approved">Aprovados</SelectItem>
                <SelectItem value="pending">Pendentes</SelectItem>
                <SelectItem value="rejected">Rejeitados</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={typeFilter} onValueChange={(value: any) => setTypeFilter(value)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos tipos</SelectItem>
                <SelectItem value="news">Notícias</SelectItem>
                <SelectItem value="gallery">Galerias</SelectItem>
                <SelectItem value="photo">Fotos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Exibir erro se houver */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Lista de Comentários */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Comentários ({filteredComments.length})
          </CardTitle>
          <CardDescription>
            Clique nos botões de ação para aprovar ou rejeitar comentários
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Carregando comentários...
            </div>
          ) : filteredComments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum comentário encontrado com os filtros aplicados.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredComments.map((comment) => (
                <Card key={comment.id} className="border-l-4 border-l-primary/20">
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      {/* Header do comentário */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
                            <AvatarFallback>
                              <User className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{comment.author.name}</span>
                              {getStatusBadge(comment)}
                              {getTypeBadge(comment.postType)}
                            </div>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>Post ID: {comment.postId}</span>
                              <span>{formatDate(comment.createdAt)}</span>
                              {comment.updatedAt !== comment.createdAt && (
                                <span className="text-yellow-600">Editado</span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Heart className="h-3 w-3" />
                            {comment.likes}
                          </div>
                          <Button variant="ghost" size="sm" className="gap-1">
                            <ExternalLink className="h-3 w-3" />
                            Ver Post
                          </Button>
                        </div>
                      </div>

                      {/* Conteúdo do comentário */}
                      <div className="bg-muted/30 rounded-lg p-3">
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                          {comment.content}
                        </p>
                      </div>

                      {/* Ações de moderação */}
                      <div className="flex items-center justify-between pt-2 border-t">
                        <div className="flex items-center gap-2">
                          {comment.isApproved !== true && (
                            <Button 
                              size="sm"
                              onClick={() => handleModerate(comment.id, true)}
                              className="gap-1"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                              Aprovar
                            </Button>
                          )}
                          
                          {comment.isApproved !== false && (
                            <Button 
                              size="sm"
                              variant="destructive"
                              onClick={() => handleModerate(comment.id, false)}
                              className="gap-1"
                            >
                              <XCircle className="h-4 w-4" />
                              Rejeitar
                            </Button>
                          )}
                        </div>

                        {/* Informações adicionais */}
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          {comment.replies && comment.replies.length > 0 && (
                            <span>{comment.replies.length} resposta(s)</span>
                          )}
                          {comment.author.email && (
                            <span>{comment.author.email}</span>
                          )}
                        </div>
                      </div>

                      {/* Respostas (se houver) */}
                      {comment.replies && comment.replies.length > 0 && (
                        <div className="ml-4 pl-4 border-l-2 border-muted space-y-3">
                          <h4 className="text-sm font-medium text-muted-foreground">
                            Respostas ({comment.replies.length})
                          </h4>
                          {comment.replies.map((reply) => (
                            <div key={reply.id} className="bg-muted/20 rounded-lg p-3">
                              <div className="flex items-center gap-2 mb-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarImage src={reply.author.avatar} alt={reply.author.name} />
                                  <AvatarFallback>
                                    <User className="h-3 w-3" />
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-sm font-medium">{reply.author.name}</span>
                                {getStatusBadge(reply)}
                                <span className="text-xs text-muted-foreground">
                                  {formatDate(reply.createdAt)}
                                </span>
                              </div>
                              <p className="text-sm mb-2">{reply.content}</p>
                              <div className="flex gap-2">
                                {reply.isApproved !== true && (
                                  <Button 
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleModerate(reply.id, true)}
                                    className="gap-1 h-6 text-xs"
                                  >
                                    <CheckCircle2 className="h-3 w-3" />
                                    Aprovar
                                  </Button>
                                )}
                                {reply.isApproved !== false && (
                                  <Button 
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleModerate(reply.id, false)}
                                    className="gap-1 h-6 text-xs border-red-200 text-red-700"
                                  >
                                    <XCircle className="h-3 w-3" />
                                    Rejeitar
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}