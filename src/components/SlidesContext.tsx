import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Slide {
  id: number;
  title: string;
  description?: string;
  imageUrl: string;
  imageAlt: string;
  order: number;
  isActive: boolean;
  hasButton: boolean;
  buttonText?: string;
  buttonLink?: string;
  createdAt: string;
  updatedAt: string;
}

interface SlidesContextType {
  slides: Slide[];
  activeSlides: Slide[];
  setSlides: (slides: Slide[]) => void;
  addSlide: (slide: Omit<Slide, 'id'>) => void;
  updateSlide: (id: number, updates: Partial<Slide>) => void;
  deleteSlide: (id: number) => void;
  toggleSlideStatus: (id: number) => void;
  reorderSlides: (newOrder: Slide[]) => void;
}

const SlidesContext = createContext<SlidesContextType | undefined>(undefined);

export const useSlides = () => {
  const context = useContext(SlidesContext);
  if (context === undefined) {
    throw new Error('useSlides must be used within a SlidesProvider');
  }
  return context;
};

interface SlidesProviderProps {
  children: ReactNode;
}

export const SlidesProvider = ({ children }: SlidesProviderProps) => {
  const [slides, setSlides] = useState<Slide[]>([]);

  // Carregar slides iniciais (simulando dados salvos)
  useEffect(() => {
    // Em produção, isso seria uma chamada para API
    const savedSlides = localStorage.getItem('timon-slides');
    if (savedSlides) {
      try {
        setSlides(JSON.parse(savedSlides));
      } catch (error) {
        console.error('Erro ao carregar slides salvos:', error);
        loadDefaultSlides();
      }
    } else {
      loadDefaultSlides();
    }
  }, []);

  // Salvar slides automaticamente quando houver mudanças
  useEffect(() => {
    if (slides.length > 0) {
      localStorage.setItem('timon-slides', JSON.stringify(slides));
    }
  }, [slides]);

  const loadDefaultSlides = () => {
    const defaultSlides: Slide[] = [
      {
        id: 1,
        title: 'Nova Unidade Básica de Saúde inaugurada',
        description: 'A UBS vai atender mais de 5 mil famílias da região com serviços de saúde primária',
        imageUrl: 'https://images.unsplash.com/photo-1605934079907-5028658e4cab?w=1200',
        imageAlt: 'Inauguração da UBS',
        order: 1,
        isActive: true,
        hasButton: true,
        buttonText: 'Saiba mais',
        buttonLink: '/noticias/nova-ubs',
        createdAt: '2025-01-18T10:30:00',
        updatedAt: '2025-01-18T10:30:00'
      },
      {
        id: 2,
        title: 'Programa de Pavimentação Asfáltica',
        description: 'Mais 15 ruas receberam asfalto neste mês, melhorando a mobilidade urbana',
        imageUrl: 'https://images.unsplash.com/photo-1595176889189-bbc4a4af88aa?w=1200',
        imageAlt: 'Pavimentação de ruas',
        order: 2,
        isActive: true,
        hasButton: true,
        buttonText: 'Ver progresso',
        buttonLink: '/obras/pavimentacao',
        createdAt: '2025-01-17T14:15:00',
        updatedAt: '2025-01-17T14:15:00'
      },
      {
        id: 3,
        title: 'Festival de Cultura Popular',
        description: 'Evento celebra as tradições culturais timonenses com shows e exposições',
        imageUrl: 'https://images.unsplash.com/photo-1678544759093-2cae8fa21c9e?w=1200',
        imageAlt: 'Festival de cultura',
        order: 3,
        isActive: true,
        hasButton: true,
        buttonText: 'Conhecer programação',
        buttonLink: '/eventos/festival-cultura',
        createdAt: '2025-01-16T16:00:00',
        updatedAt: '2025-01-16T16:00:00'
      }
    ];
    setSlides(defaultSlides);
  };

  // Slides ativos e ordenados para o frontend
  const activeSlides = slides
    .filter(slide => slide.isActive)
    .sort((a, b) => a.order - b.order);

  const addSlide = (slideData: Omit<Slide, 'id'>) => {
    const newSlide: Slide = {
      ...slideData,
      id: Date.now(), // Em produção seria gerado pelo backend
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setSlides(prev => [...prev, newSlide]);
  };

  const updateSlide = (id: number, updates: Partial<Slide>) => {
    setSlides(prev => prev.map(slide => 
      slide.id === id 
        ? { ...slide, ...updates, updatedAt: new Date().toISOString() }
        : slide
    ));
  };

  const deleteSlide = (id: number) => {
    setSlides(prev => prev.filter(slide => slide.id !== id));
  };

  const toggleSlideStatus = (id: number) => {
    setSlides(prev => prev.map(slide => 
      slide.id === id 
        ? { ...slide, isActive: !slide.isActive, updatedAt: new Date().toISOString() }
        : slide
    ));
  };

  const reorderSlides = (newOrder: Slide[]) => {
    const updatedSlides = newOrder.map((slide, index) => ({
      ...slide,
      order: index + 1,
      updatedAt: new Date().toISOString()
    }));
    setSlides(updatedSlides);
  };

  const value: SlidesContextType = {
    slides,
    activeSlides,
    setSlides,
    addSlide,
    updateSlide,
    deleteSlide,
    toggleSlideStatus,
    reorderSlides
  };

  return (
    <SlidesContext.Provider value={value}>
      {children}
    </SlidesContext.Provider>
  );
};