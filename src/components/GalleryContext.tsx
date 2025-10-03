import React, { createContext, useContext, useState, useEffect } from 'react';

export interface GalleryImage {
  id: string;
  mediaId: string; // ID da imagem na biblioteca de mídia
  title: string;
  description?: string;
  alt: string;
  url: string;
  thumbnail: string;
  dimensions: { width: number; height: number };
  order: number;
  isPublic: boolean;
  isFeatured: boolean;
  uploadedAt: Date;
  views: number;
  likes: number;
}

export interface GalleryAlbum {
  id: string;
  name: string;
  description: string;
  slug: string;
  category: 'eventos' | 'obras' | 'natureza' | 'cultura' | 'esportes' | 'educacao' | 'saude' | 'outros';
  coverImageId?: string;
  images: GalleryImage[];
  isPublic: boolean;
  isFeatured: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  views: number;
}

export interface GalleryFormData {
  name: string;
  description: string;
  slug: string;
  category: GalleryAlbum['category'];
  coverImageId?: string;
  isPublic: boolean;
  isFeatured: boolean;
  order: number;
}

interface GalleryContextType {
  albums: GalleryAlbum[];
  addAlbum: (album: GalleryFormData) => void;
  updateAlbum: (id: string, album: Partial<GalleryAlbum>) => void;
  deleteAlbum: (id: string) => void;
  toggleAlbumStatus: (id: string) => void;
  toggleAlbumFeatured: (id: string) => void;
  addImageToAlbum: (albumId: string, imageData: Omit<GalleryImage, 'id' | 'order' | 'views' | 'likes' | 'uploadedAt'>) => void;
  updateImageInAlbum: (albumId: string, imageId: string, imageData: Partial<GalleryImage>) => void;
  removeImageFromAlbum: (albumId: string, imageId: string) => void;
  toggleImageStatus: (albumId: string, imageId: string) => void;
  toggleImageFeatured: (albumId: string, imageId: string) => void;
  reorderImages: (albumId: string, images: GalleryImage[]) => void;
  reorderAlbums: (albums: GalleryAlbum[]) => void;
  getAlbumsByCategory: (category: GalleryAlbum['category']) => GalleryAlbum[];
  getFeaturedAlbums: () => GalleryAlbum[];
  getPublicAlbums: () => GalleryAlbum[];
  getAlbumBySlug: (slug: string) => GalleryAlbum | undefined;
  incrementAlbumViews: (id: string) => void;
  incrementImageViews: (albumId: string, imageId: string) => void;
  incrementImageLikes: (albumId: string, imageId: string) => void;
  getCategoryLabel: (category: GalleryAlbum['category']) => string;
  getCategoryColor: (category: GalleryAlbum['category']) => string;
  getCategoryIcon: (category: GalleryAlbum['category']) => string;
  getTotalImages: () => number;
  getTotalViews: () => number;
}

const GalleryContext = createContext<GalleryContextType | undefined>(undefined);

export function GalleryProvider({ children }: { children: React.ReactNode }) {
  const [albums, setAlbums] = useState<GalleryAlbum[]>([]);

  // Configuração de categorias
  const categoryConfig = {
    'eventos': { 
      label: 'Eventos', 
      color: '#144c9c', 
      icon: 'Calendar'
    },
    'obras': { 
      label: 'Obras Públicas', 
      color: '#F4B728', 
      icon: 'Building'
    },
    'natureza': { 
      label: 'Natureza e Meio Ambiente', 
      color: '#228B22', 
      icon: 'Leaf'
    },
    'cultura': { 
      label: 'Cultura e Arte', 
      color: '#9C27B0', 
      icon: 'Palette'
    },
    'esportes': { 
      label: 'Esportes e Lazer', 
      color: '#FF5722', 
      icon: 'Trophy'
    },
    'educacao': { 
      label: 'Educação', 
      color: '#2196F3', 
      icon: 'GraduationCap'
    },
    'saude': { 
      label: 'Saúde', 
      color: '#E91E63', 
      icon: 'Heart'
    },
    'outros': { 
      label: 'Outros', 
      color: '#607D8B', 
      icon: 'Grid'
    }
  };

  // Inicializar com álbuns de exemplo
  useEffect(() => {
    const initialAlbums: GalleryAlbum[] = [
      {
        id: '1',
        name: 'Inauguração da Nova Escola Municipal',
        description: 'Cerimônia de inauguração da Escola Municipal Professora Maria das Graças',
        slug: 'inauguracao-nova-escola-municipal',
        category: 'educacao',
        coverImageId: 'img1',
        isPublic: true,
        isFeatured: true,
        order: 1,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-20'),
        views: 1245,
        images: [
          {
            id: 'img1',
            mediaId: 'media1',
            title: 'Fachada da Nova Escola',
            description: 'Vista frontal da nova escola municipal inaugurada em janeiro de 2024',
            alt: 'Fachada principal da Escola Municipal Professora Maria das Graças',
            url: '/gallery/escola-fachada.jpg',
            thumbnail: '/gallery/escola-fachada-thumb.jpg',
            dimensions: { width: 1920, height: 1080 },
            order: 1,
            isPublic: true,
            isFeatured: true,
            uploadedAt: new Date('2024-01-15'),
            views: 342,
            likes: 28
          },
          {
            id: 'img2',
            mediaId: 'media2',
            title: 'Cerimônia de Inauguração',
            description: 'Momento do corte da fita durante a cerimônia de inauguração',
            alt: 'Prefeito cortando a fita de inauguração da escola',
            url: '/gallery/cerimonia-inauguracao.jpg',
            thumbnail: '/gallery/cerimonia-inauguracao-thumb.jpg',
            dimensions: { width: 1920, height: 1080 },
            order: 2,
            isPublic: true,
            isFeatured: false,
            uploadedAt: new Date('2024-01-15'),
            views: 198,
            likes: 15
          },
          {
            id: 'img3',
            mediaId: 'media3',
            title: 'Salas de Aula Modernas',
            description: 'Interior das novas salas de aula com equipamentos modernos',
            alt: 'Sala de aula com carteiras e quadro digital',
            url: '/gallery/salas-aula.jpg',
            thumbnail: '/gallery/salas-aula-thumb.jpg',
            dimensions: { width: 1920, height: 1080 },
            order: 3,
            isPublic: true,
            isFeatured: false,
            uploadedAt: new Date('2024-01-15'),
            views: 156,
            likes: 12
          }
        ]
      },
      {
        id: '2',
        name: 'Campanha de Vacinação 2024',
        description: 'Registro da campanha de vacinação contra a gripe realizada nas UBS',
        slug: 'campanha-vacinacao-2024',
        category: 'saude',
        coverImageId: 'img4',
        isPublic: true,
        isFeatured: true,
        order: 2,
        createdAt: new Date('2024-02-01'),
        updatedAt: new Date('2024-02-05'),
        views: 867,
        images: [
          {
            id: 'img4',
            mediaId: 'media4',
            title: 'Vacinação na UBS Central',
            description: 'Profissionais de saúde aplicando vacinas na população',
            alt: 'Enfermeira aplicando vacina em paciente idoso',
            url: '/gallery/vacinacao-ubs.jpg',
            thumbnail: '/gallery/vacinacao-ubs-thumb.jpg',
            dimensions: { width: 1920, height: 1080 },
            order: 1,
            isPublic: true,
            isFeatured: true,
            uploadedAt: new Date('2024-02-01'),
            views: 234,
            likes: 19
          },
          {
            id: 'img5',
            mediaId: 'media5',
            title: 'Fila Organizada',
            description: 'População aguardando em fila organizada para vacinação',
            alt: 'Pessoas em fila respeitando distanciamento para vacinação',
            url: '/gallery/fila-vacinacao.jpg',
            thumbnail: '/gallery/fila-vacinacao-thumb.jpg',
            dimensions: { width: 1920, height: 1080 },
            order: 2,
            isPublic: true,
            isFeatured: false,
            uploadedAt: new Date('2024-02-01'),
            views: 178,
            likes: 8
          }
        ]
      },
      {
        id: '3',
        name: 'Reforma da Praça Central',
        description: 'Acompanhe o progresso da revitalização da Praça Central de Timon',
        slug: 'reforma-praca-central',
        category: 'obras',
        coverImageId: 'img6',
        isPublic: true,
        isFeatured: false,
        order: 3,
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-02-15'),
        views: 623,
        images: [
          {
            id: 'img6',
            mediaId: 'media6',
            title: 'Antes da Reforma',
            description: 'Estado da praça antes do início das obras de revitalização',
            alt: 'Praça Central antes da reforma com gramado antigo',
            url: '/gallery/praca-antes.jpg',
            thumbnail: '/gallery/praca-antes-thumb.jpg',
            dimensions: { width: 1920, height: 1080 },
            order: 1,
            isPublic: true,
            isFeatured: true,
            uploadedAt: new Date('2024-01-10'),
            views: 145,
            likes: 6
          },
          {
            id: 'img7',
            mediaId: 'media7',
            title: 'Obras em Andamento',
            description: 'Progresso das obras de revitalização da praça',
            alt: 'Trabalhadores reformando a praça com equipamentos',
            url: '/gallery/praca-obras.jpg',
            thumbnail: '/gallery/praca-obras-thumb.jpg',
            dimensions: { width: 1920, height: 1080 },
            order: 2,
            isPublic: true,
            isFeatured: false,
            uploadedAt: new Date('2024-02-01'),
            views: 123,
            likes: 4
          }
        ]
      },
      {
        id: '4',
        name: 'Festival Cultural de Timon 2024',
        description: 'Momentos especiais do Festival Cultural anual da cidade',
        slug: 'festival-cultural-timon-2024',
        category: 'cultura',
        coverImageId: 'img8',
        isPublic: false, // Álbum privado para demonstrar funcionalidade
        isFeatured: false,
        order: 4,
        createdAt: new Date('2024-03-01'),
        updatedAt: new Date('2024-03-05'),
        views: 0,
        images: [
          {
            id: 'img8',
            mediaId: 'media8',
            title: 'Apresentação de Dança Folclórica',
            description: 'Grupo de dança apresentando folclore maranhense',
            alt: 'Dançarinos em trajes típicos do Maranhão',
            url: '/gallery/danca-folclorica.jpg',
            thumbnail: '/gallery/danca-folclorica-thumb.jpg',
            dimensions: { width: 1920, height: 1080 },
            order: 1,
            isPublic: false,
            isFeatured: false,
            uploadedAt: new Date('2024-03-01'),
            views: 0,
            likes: 0
          }
        ]
      }
    ];

    setAlbums(initialAlbums);
  }, []);

  const addAlbum = (albumData: GalleryFormData) => {
    const newAlbum: GalleryAlbum = {
      ...albumData,
      id: Date.now().toString(),
      images: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      views: 0
    };
    setAlbums(prev => [...prev, newAlbum]);
  };

  const updateAlbum = (id: string, updates: Partial<GalleryAlbum>) => {
    setAlbums(prev => prev.map(album => 
      album.id === id 
        ? { 
            ...album, 
            ...updates, 
            updatedAt: new Date()
          }
        : album
    ));
  };

  const deleteAlbum = (id: string) => {
    setAlbums(prev => prev.filter(album => album.id !== id));
  };

  const toggleAlbumStatus = (id: string) => {
    setAlbums(prev => prev.map(album =>
      album.id === id
        ? { ...album, isPublic: !album.isPublic, updatedAt: new Date() }
        : album
    ));
  };

  const toggleAlbumFeatured = (id: string) => {
    setAlbums(prev => prev.map(album =>
      album.id === id
        ? { ...album, isFeatured: !album.isFeatured, updatedAt: new Date() }
        : album
    ));
  };

  const addImageToAlbum = (albumId: string, imageData: Omit<GalleryImage, 'id' | 'order' | 'views' | 'likes' | 'uploadedAt'>) => {
    setAlbums(prev => prev.map(album => {
      if (album.id === albumId) {
        const newImage: GalleryImage = {
          ...imageData,
          id: Date.now().toString(),
          order: album.images.length + 1,
          views: 0,
          likes: 0,
          uploadedAt: new Date()
        };
        return {
          ...album,
          images: [...album.images, newImage],
          updatedAt: new Date()
        };
      }
      return album;
    }));
  };

  const updateImageInAlbum = (albumId: string, imageId: string, imageData: Partial<GalleryImage>) => {
    setAlbums(prev => prev.map(album => {
      if (album.id === albumId) {
        return {
          ...album,
          images: album.images.map(image =>
            image.id === imageId ? { ...image, ...imageData } : image
          ),
          updatedAt: new Date()
        };
      }
      return album;
    }));
  };

  const removeImageFromAlbum = (albumId: string, imageId: string) => {
    setAlbums(prev => prev.map(album => {
      if (album.id === albumId) {
        return {
          ...album,
          images: album.images.filter(image => image.id !== imageId),
          updatedAt: new Date()
        };
      }
      return album;
    }));
  };

  const toggleImageStatus = (albumId: string, imageId: string) => {
    setAlbums(prev => prev.map(album => {
      if (album.id === albumId) {
        return {
          ...album,
          images: album.images.map(image =>
            image.id === imageId ? { ...image, isPublic: !image.isPublic } : image
          ),
          updatedAt: new Date()
        };
      }
      return album;
    }));
  };

  const toggleImageFeatured = (albumId: string, imageId: string) => {
    setAlbums(prev => prev.map(album => {
      if (album.id === albumId) {
        return {
          ...album,
          images: album.images.map(image =>
            image.id === imageId ? { ...image, isFeatured: !image.isFeatured } : image
          ),
          updatedAt: new Date()
        };
      }
      return album;
    }));
  };

  const reorderImages = (albumId: string, images: GalleryImage[]) => {
    setAlbums(prev => prev.map(album => {
      if (album.id === albumId) {
        return {
          ...album,
          images: images.map((image, index) => ({ ...image, order: index + 1 })),
          updatedAt: new Date()
        };
      }
      return album;
    }));
  };

  const reorderAlbums = (reorderedAlbums: GalleryAlbum[]) => {
    setAlbums(reorderedAlbums.map((album, index) => ({ ...album, order: index + 1 })));
  };

  const getAlbumsByCategory = (category: GalleryAlbum['category']) => {
    return albums
      .filter(album => album.category === category && album.isPublic)
      .sort((a, b) => a.order - b.order);
  };

  const getFeaturedAlbums = () => {
    return albums
      .filter(album => album.isFeatured && album.isPublic)
      .sort((a, b) => a.order - b.order);
  };

  const getPublicAlbums = () => {
    return albums
      .filter(album => album.isPublic)
      .sort((a, b) => a.order - b.order);
  };

  const getAlbumBySlug = (slug: string) => {
    return albums.find(album => album.slug === slug && album.isPublic);
  };

  const incrementAlbumViews = (id: string) => {
    setAlbums(prev => prev.map(album =>
      album.id === id
        ? { ...album, views: album.views + 1 }
        : album
    ));
  };

  const incrementImageViews = (albumId: string, imageId: string) => {
    setAlbums(prev => prev.map(album => {
      if (album.id === albumId) {
        return {
          ...album,
          images: album.images.map(image =>
            image.id === imageId ? { ...image, views: image.views + 1 } : image
          )
        };
      }
      return album;
    }));
  };

  const incrementImageLikes = (albumId: string, imageId: string) => {
    setAlbums(prev => prev.map(album => {
      if (album.id === albumId) {
        return {
          ...album,
          images: album.images.map(image =>
            image.id === imageId ? { ...image, likes: image.likes + 1 } : image
          )
        };
      }
      return album;
    }));
  };

  const getCategoryLabel = (category: GalleryAlbum['category']) => {
    return categoryConfig[category].label;
  };

  const getCategoryColor = (category: GalleryAlbum['category']) => {
    return categoryConfig[category].color;
  };

  const getCategoryIcon = (category: GalleryAlbum['category']) => {
    return categoryConfig[category].icon;
  };

  const getTotalImages = () => {
    return albums.reduce((total, album) => total + album.images.length, 0);
  };

  const getTotalViews = () => {
    return albums.reduce((total, album) => total + album.views, 0);
  };

  const value: GalleryContextType = {
    albums,
    addAlbum,
    updateAlbum,
    deleteAlbum,
    toggleAlbumStatus,
    toggleAlbumFeatured,
    addImageToAlbum,
    updateImageInAlbum,
    removeImageFromAlbum,
    toggleImageStatus,
    toggleImageFeatured,
    reorderImages,
    reorderAlbums,
    getAlbumsByCategory,
    getFeaturedAlbums,
    getPublicAlbums,
    getAlbumBySlug,
    incrementAlbumViews,
    incrementImageViews,
    incrementImageLikes,
    getCategoryLabel,
    getCategoryColor,
    getCategoryIcon,
    getTotalImages,
    getTotalViews
  };

  return (
    <GalleryContext.Provider value={value}>
      {children}
    </GalleryContext.Provider>
  );
}

export function useGallery() {
  const context = useContext(GalleryContext);
  if (context === undefined) {
    throw new Error('useGallery must be used within a GalleryProvider');
  }
  return context;
}