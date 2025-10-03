import React, { createContext, useContext, useState, useEffect } from 'react';

// Interfaces para o sistema de comentários
export interface Comment {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    email?: string;
  };
  postId: string;
  postType: 'news' | 'gallery' | 'photo';
  parentId?: string; // Para respostas a comentários
  createdAt: string;
  updatedAt: string;
  isApproved: boolean;
  likes: number;
  replies?: Comment[];
}

export interface FacebookUser {
  id: string;
  name: string;
  email?: string;
  picture: {
    data: {
      url: string;
    };
  };
}

export interface CommentsState {
  comments: Comment[];
  isLoading: boolean;
  error: string | null;
  user: FacebookUser | null;
  isLoggedIn: boolean;
}

interface CommentsContextType extends CommentsState {
  // Autenticação Facebook
  loginWithFacebook: () => Promise<void>;
  logout: () => void;
  
  // Gerenciamento de comentários
  loadComments: (postId: string, postType: 'news' | 'gallery' | 'photo') => Promise<void>;
  addComment: (content: string, postId: string, postType: 'news' | 'gallery' | 'photo', parentId?: string) => Promise<void>;
  editComment: (commentId: string, content: string) => Promise<void>;
  deleteComment: (commentId: string) => Promise<void>;
  likeComment: (commentId: string) => Promise<void>;
  moderateComment: (commentId: string, isApproved: boolean) => Promise<void>;
  
  // Utilitários
  getCommentsCount: (postId: string, postType: 'news' | 'gallery' | 'photo') => number;
  clearComments: () => void;
}

const CommentsContext = createContext<CommentsContextType | undefined>(undefined);

// Configuração do Facebook SDK
const FACEBOOK_APP_ID = '1234567890123456'; // Substitua pelo seu App ID do Facebook

export function CommentsProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<CommentsState>({
    comments: [],
    isLoading: false,
    error: null,
    user: null,
    isLoggedIn: false
  });

  // Inicializar Facebook SDK
  useEffect(() => {
    const initFacebookSDK = () => {
      if (typeof window !== 'undefined' && !window.FB) {
        // Carregar SDK do Facebook
        window.fbAsyncInit = function() {
          window.FB.init({
            appId: FACEBOOK_APP_ID,
            cookie: true,
            xfbml: true,
            version: 'v18.0'
          });

          // Verificar status de login ao carregar
          window.FB.getLoginStatus((response: any) => {
            if (response.status === 'connected') {
              fetchUserInfo(response.authResponse.accessToken);
            }
          });
        };

        // Carregar script do Facebook
        const script = document.createElement('script');
        script.id = 'facebook-jssdk';
        script.src = 'https://connect.facebook.net/pt_BR/sdk.js';
        script.async = true;
        script.defer = true;
        script.crossOrigin = 'anonymous';
        document.head.appendChild(script);
      }
    };

    initFacebookSDK();
  }, []);

  // Buscar informações do usuário do Facebook
  const fetchUserInfo = async (accessToken: string) => {
    try {
      window.FB.api('/me', { fields: 'name,email,picture' }, (response: FacebookUser) => {
        setState(prev => ({
          ...prev,
          user: response,
          isLoggedIn: true
        }));
      });
    } catch (error) {
      console.error('Erro ao buscar informações do usuário:', error);
    }
  };

  // Login com Facebook
  const loginWithFacebook = async (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!window.FB) {
        reject(new Error('Facebook SDK não carregado'));
        return;
      }

      setState(prev => ({ ...prev, isLoading: true, error: null }));

      window.FB.login((response: any) => {
        if (response.authResponse) {
          fetchUserInfo(response.authResponse.accessToken);
          setState(prev => ({ ...prev, isLoading: false }));
          resolve();
        } else {
          setState(prev => ({ 
            ...prev, 
            isLoading: false,
            error: 'Login cancelado ou falhou'
          }));
          reject(new Error('Login cancelado'));
        }
      }, { scope: 'email' });
    });
  };

  // Logout
  const logout = () => {
    if (window.FB) {
      window.FB.logout();
    }
    setState(prev => ({
      ...prev,
      user: null,
      isLoggedIn: false
    }));
  };

  // Carregar comentários de um post
  const loadComments = async (postId: string, postType: 'news' | 'gallery' | 'photo'): Promise<void> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Simular chamada à API - substitua pela sua implementação real
      const mockComments: Comment[] = [
        {
          id: '1',
          content: 'Excelente notícia! Muito importante para nossa cidade.',
          author: {
            id: 'user1',
            name: 'Maria Silva',
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
          },
          postId,
          postType,
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T10:30:00Z',
          isApproved: true,
          likes: 12,
          replies: [
            {
              id: '2',
              content: 'Concordo totalmente! Esta é uma iniciativa muito bem-vinda.',
              author: {
                id: 'user2',
                name: 'João Santos',
                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
              },
              postId,
              postType,
              parentId: '1',
              createdAt: '2024-01-15T11:00:00Z',
              updatedAt: '2024-01-15T11:00:00Z',
              isApproved: true,
              likes: 5
            },
            {
              id: '5',
              content: 'Finalmente algo de bom acontecendo na nossa região!',
              author: {
                id: 'user5',
                name: 'Carlos Mendes',
                avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
              },
              postId,
              postType,
              parentId: '1',
              createdAt: '2024-01-15T14:20:00Z',
              updatedAt: '2024-01-15T14:20:00Z',
              isApproved: true,
              likes: 3
            }
          ]
        },
        {
          id: '3',
          content: 'Quando será implementado? Estamos ansiosos para ver os resultados!',
          author: {
            id: 'user3',
            name: 'Ana Costa',
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
          },
          postId,
          postType,
          createdAt: '2024-01-15T12:15:00Z',
          updatedAt: '2024-01-15T12:15:00Z',
          isApproved: true,
          likes: 8,
          replies: [
            {
              id: '4',
              content: 'Segundo o cronograma, deve começar no próximo mês.',
              author: {
                id: 'user4',
                name: 'Pedro Lima',
                avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
              },
              postId,
              postType,
              parentId: '3',
              createdAt: '2024-01-15T13:45:00Z',
              updatedAt: '2024-01-15T13:45:00Z',
              isApproved: true,
              likes: 2
            }
          ]
        },
        {
          id: '6',
          content: 'Parabéns pela transparência na comunicação com os cidadãos!',
          author: {
            id: 'user6',
            name: 'Lúcia Fernandes',
            avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face'
          },
          postId,
          postType,
          createdAt: '2024-01-15T16:30:00Z',
          updatedAt: '2024-01-15T16:30:00Z',
          isApproved: true,
          likes: 15
        }
      ];

      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 1000));

      setState(prev => ({
        ...prev,
        comments: mockComments,
        isLoading: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Erro ao carregar comentários',
        isLoading: false
      }));
    }
  };

  // Adicionar comentário
  const addComment = async (
    content: string, 
    postId: string, 
    postType: 'news' | 'gallery' | 'photo',
    parentId?: string
  ): Promise<void> => {
    if (!state.isLoggedIn || !state.user) {
      throw new Error('Usuário não está logado');
    }

    setState(prev => ({ ...prev, isLoading: true }));

    try {
      const newComment: Comment = {
        id: Date.now().toString(),
        content,
        author: {
          id: state.user.id,
          name: state.user.name,
          avatar: state.user.picture.data.url,
          email: state.user.email
        },
        postId,
        postType,
        parentId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isApproved: true, // Em produção, pode precisar de moderação
        likes: 0
      };

      // Simular chamada à API
      await new Promise(resolve => setTimeout(resolve, 500));

      setState(prev => {
        const updatedComments = [...prev.comments];
        
        if (parentId) {
          // Adicionar como resposta
          const parentIndex = updatedComments.findIndex(c => c.id === parentId);
          if (parentIndex !== -1) {
            if (!updatedComments[parentIndex].replies) {
              updatedComments[parentIndex].replies = [];
            }
            updatedComments[parentIndex].replies!.push(newComment);
          }
        } else {
          // Adicionar como comentário principal
          updatedComments.unshift(newComment);
        }

        return {
          ...prev,
          comments: updatedComments,
          isLoading: false
        };
      });

      // Feedback visual de sucesso
      console.log(parentId ? 'Resposta adicionada com sucesso!' : 'Comentário adicionado com sucesso!');
      
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: parentId ? 'Erro ao adicionar resposta' : 'Erro ao adicionar comentário',
        isLoading: false
      }));
      throw error;
    }
  };

  // Editar comentário
  const editComment = async (commentId: string, content: string): Promise<void> => {
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      // Simular chamada à API
      await new Promise(resolve => setTimeout(resolve, 500));

      setState(prev => ({
        ...prev,
        comments: prev.comments.map(comment => {
          if (comment.id === commentId) {
            return {
              ...comment,
              content,
              updatedAt: new Date().toISOString()
            };
          }
          if (comment.replies) {
            return {
              ...comment,
              replies: comment.replies.map(reply => 
                reply.id === commentId 
                  ? { ...reply, content, updatedAt: new Date().toISOString() }
                  : reply
              )
            };
          }
          return comment;
        }),
        isLoading: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Erro ao editar comentário',
        isLoading: false
      }));
    }
  };

  // Excluir comentário
  const deleteComment = async (commentId: string): Promise<void> => {
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      // Simular chamada à API
      await new Promise(resolve => setTimeout(resolve, 500));

      setState(prev => ({
        ...prev,
        comments: prev.comments.filter(comment => {
          if (comment.id === commentId) return false;
          if (comment.replies) {
            comment.replies = comment.replies.filter(reply => reply.id !== commentId);
          }
          return true;
        }),
        isLoading: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Erro ao excluir comentário',
        isLoading: false
      }));
    }
  };

  // Curtir comentário
  const likeComment = async (commentId: string): Promise<void> => {
    try {
      setState(prev => ({
        ...prev,
        comments: prev.comments.map(comment => {
          if (comment.id === commentId) {
            return { ...comment, likes: comment.likes + 1 };
          }
          if (comment.replies) {
            return {
              ...comment,
              replies: comment.replies.map(reply => 
                reply.id === commentId 
                  ? { ...reply, likes: reply.likes + 1 }
                  : reply
              )
            };
          }
          return comment;
        })
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Erro ao curtir comentário'
      }));
    }
  };

  // Moderar comentário (apenas para administradores)
  const moderateComment = async (commentId: string, isApproved: boolean): Promise<void> => {
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      // Simular chamada à API
      await new Promise(resolve => setTimeout(resolve, 500));

      setState(prev => ({
        ...prev,
        comments: prev.comments.map(comment => {
          if (comment.id === commentId) {
            return { ...comment, isApproved };
          }
          if (comment.replies) {
            return {
              ...comment,
              replies: comment.replies.map(reply => 
                reply.id === commentId 
                  ? { ...reply, isApproved }
                  : reply
              )
            };
          }
          return comment;
        }),
        isLoading: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Erro ao moderar comentário',
        isLoading: false
      }));
    }
  };

  // Obter contagem de comentários
  const getCommentsCount = (postId: string, postType: 'news' | 'gallery' | 'photo'): number => {
    const postComments = state.comments.filter(
      comment => comment.postId === postId && comment.postType === postType
    );
    
    return postComments.reduce((total, comment) => {
      return total + 1 + (comment.replies?.length || 0);
    }, 0);
  };

  // Limpar comentários
  const clearComments = () => {
    setState(prev => ({
      ...prev,
      comments: [],
      error: null
    }));
  };

  const contextValue: CommentsContextType = {
    ...state,
    loginWithFacebook,
    logout,
    loadComments,
    addComment,
    editComment,
    deleteComment,
    likeComment,
    moderateComment,
    getCommentsCount,
    clearComments
  };

  return (
    <CommentsContext.Provider value={contextValue}>
      {children}
    </CommentsContext.Provider>
  );
}

export function useComments() {
  const context = useContext(CommentsContext);
  if (context === undefined) {
    throw new Error('useComments deve ser usado dentro de um CommentsProvider');
  }
  return context;
}

// Declaração de tipos para o Facebook SDK
declare global {
  interface Window {
    FB: any;
    fbAsyncInit: any;
  }
}