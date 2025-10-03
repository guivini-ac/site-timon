import React, { useState, useEffect } from 'react';
import { useComments } from './CommentsContext';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Separator } from './ui/separator';
import { 
  MessageCircle, 
  Heart, 
  Reply, 
  Edit, 
  Trash2, 
  Send,
  Facebook,
  AlertCircle,
  Clock,
  User,
  MoreHorizontal
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';

interface CommentsSectionProps {
  postId: string;
  postType: 'news' | 'gallery' | 'photo';
  postTitle?: string;
  showTitle?: boolean;
  className?: string;
}

export function CommentsSection({ 
  postId, 
  postType, 
  postTitle, 
  showTitle = true,
  className = '' 
}: CommentsSectionProps) {
  const {
    comments,
    isLoading,
    error,
    user,
    isLoggedIn,
    loginWithFacebook,
    logout,
    loadComments,
    addComment,
    editComment,
    deleteComment,
    likeComment,
    getCommentsCount
  } = useComments();

  const [newCommentContent, setNewCommentContent] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Carregar comentários quando o componente é montado
  useEffect(() => {
    loadComments(postId, postType);
  }, [postId, postType]);

  // Filtrar comentários para este post
  const postComments = comments.filter(
    comment => comment.postId === postId && comment.postType === postType && comment.isApproved
  );

  const commentsCount = getCommentsCount(postId, postType);

  // Submeter novo comentário
  const handleSubmitComment = async () => {
    if (!newCommentContent.trim()) return;
    
    setIsSubmitting(true);
    try {
      await addComment(newCommentContent, postId, postType);
      setNewCommentContent('');
    } catch (error) {
      console.error('Erro ao adicionar comentário:', error);
    }
    setIsSubmitting(false);
  };

  // Submeter resposta
  const handleSubmitReply = async (parentId: string) => {
    if (!replyContent.trim()) return;
    
    setIsSubmitting(true);
    try {
      await addComment(replyContent, postId, postType, parentId);
      setReplyContent('');
      setReplyingTo(null);
    } catch (error) {
      console.error('Erro ao adicionar resposta:', error);
    }
    setIsSubmitting(false);
  };

  // Editar comentário
  const handleEditComment = async (commentId: string) => {
    if (!editContent.trim()) return;
    
    setIsSubmitting(true);
    try {
      await editComment(commentId, editContent);
      setEditingComment(null);
      setEditContent('');
    } catch (error) {
      console.error('Erro ao editar comentário:', error);
    }
    setIsSubmitting(false);
  };

  // Iniciar edição
  const startEditing = (commentId: string, currentContent: string) => {
    setEditingComment(commentId);
    setEditContent(currentContent);
  };

  // Cancelar edição
  const cancelEditing = () => {
    setEditingComment(null);
    setEditContent('');
  };

  // Formatar data relativa
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Agora';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d`;
    
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: 'short' 
    });
  };

  // Renderizar comentário individual
  const renderComment = (comment: any, isReply = false) => {
    const isOwner = user?.id === comment.author.id;
    const isEditing = editingComment === comment.id;
    const isReplying = replyingTo === comment.id;

    return (
      <div key={comment.id} className={`${isReply ? 'ml-8' : ''} mb-6`}>
        <div className="flex gap-3">
          <Avatar className={`${isReply ? 'h-8 w-8' : 'h-10 w-10'} flex-shrink-0`}>
            <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
            <AvatarFallback>
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{comment.author.name}</span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatRelativeTime(comment.createdAt)}
                  </span>
                  {comment.updatedAt !== comment.createdAt && (
                    <Badge variant="outline" className="text-xs">
                      Editado
                    </Badge>
                  )}
                </div>
                
                {isOwner && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <MoreHorizontal className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => startEditing(comment.id, comment.content)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => deleteComment(comment.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
              
              {isEditing ? (
                <div className="space-y-2">
                  <Textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    placeholder="Edite seu comentário..."
                    className="min-h-[60px]"
                  />
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      onClick={() => handleEditComment(comment.id)}
                      disabled={isSubmitting || !editContent.trim()}
                    >
                      <Send className="h-4 w-4 mr-1" />
                      Salvar
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={cancelEditing}
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {comment.content}
                </p>
              )}
            </div>
            
            {!isEditing && (
              <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                <button
                  onClick={() => likeComment(comment.id)}
                  className="flex items-center gap-1 hover:text-red-500 transition-colors p-1 rounded"
                  disabled={!isLoggedIn}
                >
                  <Heart className="h-3 w-3" />
                  <span>{comment.likes}</span>
                </button>
                
                {!isReply && isLoggedIn && (
                  <button
                    onClick={() => setReplyingTo(isReplying ? null : comment.id)}
                    className="flex items-center gap-1 hover:text-primary transition-colors p-1 rounded font-medium"
                  >
                    <Reply className="h-3 w-3" />
                    {isReplying ? 'Cancelar' : 'Responder'}
                  </button>
                )}
                
                {comment.replies && comment.replies.length > 0 && (
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <MessageCircle className="h-3 w-3" />
                    {comment.replies.length} {comment.replies.length === 1 ? 'resposta' : 'respostas'}
                  </span>
                )}
              </div>
            )}
            
            {/* Área de resposta */}
            {isReplying && (
              <div className="mt-4 p-3 bg-background border border-muted rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Reply className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Respondendo para <strong>{comment.author.name}</strong>
                  </span>
                </div>
                <div className="space-y-3">
                  <Textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Escreva sua resposta..."
                    className="min-h-[80px]"
                  />
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      onClick={() => handleSubmitReply(comment.id)}
                      disabled={isSubmitting || !replyContent.trim()}
                      className="gap-1"
                    >
                      <Send className="h-4 w-4" />
                      Responder
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        setReplyingTo(null);
                        setReplyContent('');
                      }}
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Renderizar respostas */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-4 pl-4 border-l-2 border-muted/50">
            <div className="space-y-4">
              {comment.replies.map((reply: any) => renderComment(reply, true))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        {showTitle && (
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Comentários
            {commentsCount > 0 && (
              <Badge variant="secondary">
                {commentsCount}
              </Badge>
            )}
          </CardTitle>
        )}
        
        {postTitle && (
          <p className="text-sm text-muted-foreground">
            {postTitle}
          </p>
        )}
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Área de novo comentário */}
        <div className="space-y-4">
          {!isLoggedIn ? (
            <div className="text-center space-y-4 py-6">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Para comentar, você precisa fazer login com sua conta do Facebook.
                </AlertDescription>
              </Alert>
              
              <Button 
                onClick={loginWithFacebook}
                className="gap-2"
                disabled={isLoading}
              >
                <Facebook className="h-4 w-4" />
                {isLoading ? 'Conectando...' : 'Entrar com Facebook'}
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-3 mb-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.picture?.data?.url} alt={user?.name} />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <span className="text-sm font-medium">{user?.name}</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={logout}
                    className="ml-2 h-6 text-xs"
                  >
                    Sair
                  </Button>
                </div>
              </div>
              
              <Textarea
                value={newCommentContent}
                onChange={(e) => setNewCommentContent(e.target.value)}
                placeholder="Escreva um comentário..."
                className="min-h-[80px]"
              />
              
              <div className="flex justify-end">
                <Button 
                  onClick={handleSubmitComment}
                  disabled={isSubmitting || !newCommentContent.trim()}
                  className="gap-2"
                >
                  <Send className="h-4 w-4" />
                  {isSubmitting ? 'Enviando...' : 'Comentar'}
                </Button>
              </div>
            </div>
          )}
        </div>
        
        {/* Exibir erro se houver */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <Separator />
        
        {/* Lista de comentários */}
        <div className="space-y-4">
          {isLoading && postComments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
              Carregando comentários...
            </div>
          ) : postComments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
              Nenhum comentário ainda.
              {!isLoggedIn && (
                <p className="text-sm mt-2">
                  Seja o primeiro a comentar!
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {postComments.map(comment => renderComment(comment))}
            </div>
          )}
        </div>
        
        {/* Aviso sobre moderação */}
        {isLoggedIn && (
          <div className="text-xs text-muted-foreground text-center pt-4 border-t">
            Os comentários são moderados. Seja respeitoso e construtivo em suas contribuições.
          </div>
        )}
      </CardContent>
    </Card>
  );
}