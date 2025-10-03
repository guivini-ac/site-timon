import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CalendarEvent {
  id: number;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  startTime?: string;
  endTime?: string;
  isAllDay: boolean;
  location?: string;
  category: 'reuniao' | 'audiencia' | 'cultural-esportivo' | 'atividades-governo' | 'servicos-mutiroes' | 'anuncios-editais' | 'feriados-datas';
  status: 'scheduled' | 'cancelled' | 'completed';
  isPublic: boolean;
  organizer: string;
  contact?: string;
  url?: string;
  maxParticipants?: number;
  currentParticipants?: number;
  requiresRegistration: boolean;
  createdAt: Date;
  updatedAt: Date;
  color?: string;
}

export interface CalendarEventFormData {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  startTime?: string;
  endTime?: string;
  isAllDay: boolean;
  location?: string;
  category: CalendarEvent['category'];
  status: CalendarEvent['status'];
  isPublic: boolean;
  organizer: string;
  contact?: string;
  url?: string;
  maxParticipants?: number;
  requiresRegistration: boolean;
}

interface CalendarContextType {
  events: CalendarEvent[];
  addEvent: (event: CalendarEventFormData) => void;
  updateEvent: (id: number, event: Partial<CalendarEvent>) => void;
  deleteEvent: (id: number) => void;
  getEventsByDate: (date: Date) => CalendarEvent[];
  getEventsByDateRange: (startDate: Date, endDate: Date) => CalendarEvent[];
  getEventsByCategory: (category: CalendarEvent['category']) => CalendarEvent[];
  getPublicEvents: () => CalendarEvent[];
  getUpcomingEvents: (limit?: number) => CalendarEvent[];
  getCategoryColor: (category: CalendarEvent['category']) => string;
  getCategoryLabel: (category: CalendarEvent['category']) => string;
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

export function CalendarProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  // Cores e labels das categorias
  const categoryConfig = {
    'reuniao': { color: '#144c9c', label: 'Reuniões' },
    'audiencia': { color: '#DC3545', label: 'Audiências Públicas' },
    'cultural-esportivo': { color: '#28A745', label: 'Eventos Culturais e Esportivos' },
    'atividades-governo': { color: '#FFC107', label: 'Atividades do Governo' },
    'servicos-mutiroes': { color: '#17A2B8', label: 'Serviços e Mutirões' },
    'anuncios-editais': { color: '#6F42C1', label: 'Anúncios e Editais' },
    'feriados-datas': { color: '#FD7E14', label: 'Feriados e Datas Comemorativas' }
  };

  // Inicializar com eventos de exemplo
  useEffect(() => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    
    const nextWeek = new Date(now);
    nextWeek.setDate(now.getDate() + 7);
    
    const nextMonth = new Date(now);
    nextMonth.setMonth(now.getMonth() + 1);

    const initialEvents: CalendarEvent[] = [
      {
        id: 1,
        title: 'Reunião Ordinária da Câmara Municipal',
        description: 'Reunião ordinária da Câmara Municipal de Timon para discussão dos projetos em pauta. Participação aberta ao público.',
        startDate: tomorrow,
        endDate: tomorrow,
        startTime: '09:00',
        endTime: '12:00',
        isAllDay: false,
        location: 'Câmara Municipal de Timon - Plenário Principal',
        category: 'reuniao',
        status: 'scheduled',
        isPublic: true,
        organizer: 'Câmara Municipal',
        contact: '(99) 3212-3458',
        maxParticipants: 50,
        currentParticipants: 12,
        requiresRegistration: false,
        createdAt: new Date('2024-11-01'),
        updatedAt: new Date('2024-11-15'),
        color: categoryConfig.reuniao.color
      },
      {
        id: 2,
        title: 'Audiência Pública - Orçamento Municipal 2025',
        description: 'Audiência pública para apresentação e discussão da proposta orçamentária do município para o exercício de 2025. Participação da comunidade é fundamental.',
        startDate: nextWeek,
        endDate: nextWeek,
        startTime: '19:00',
        endTime: '21:30',
        isAllDay: false,
        location: 'Centro de Convenções Municipal',
        category: 'audiencia',
        status: 'scheduled',
        isPublic: true,
        organizer: 'Secretaria de Planejamento',
        contact: 'planejamento@timon.ma.gov.br',
        requiresRegistration: true,
        maxParticipants: 200,
        currentParticipants: 45,
        createdAt: new Date('2024-10-15'),
        updatedAt: new Date('2024-11-10'),
        color: categoryConfig.audiencia.color
      },
      {
        id: 3,
        title: 'Festival de Inverno de Timon',
        description: 'Festival cultural com apresentações musicais, teatro, dança e gastronomia típica. Evento gratuito para toda a família.',
        startDate: nextMonth,
        endDate: new Date(nextMonth.getTime() + 2 * 24 * 60 * 60 * 1000), // 2 dias depois
        isAllDay: true,
        location: 'Praça Central e Ruas do Centro Histórico',
        category: 'cultural-esportivo',
        status: 'scheduled',
        isPublic: true,
        organizer: 'Secretaria de Cultura',
        contact: 'cultura@timon.ma.gov.br',
        url: 'https://timon.ma.gov.br/festival-inverno',
        requiresRegistration: false,
        createdAt: new Date('2024-09-20'),
        updatedAt: new Date('2024-11-01'),
        color: categoryConfig['cultural-esportivo'].color
      },
      {
        id: 4,
        title: 'Visita do Prefeito às Obras da Escola Municipal',
        description: 'Agenda oficial: Prefeito visita as obras de reforma da Escola Municipal José da Silva para acompanhar o andamento dos trabalhos.',
        startDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000), // 3 dias
        endDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
        startTime: '08:30',
        endTime: '10:00',
        isAllDay: false,
        location: 'Escola Municipal José da Silva - Bairro Centro',
        category: 'atividades-governo',
        status: 'scheduled',
        isPublic: true,
        organizer: 'Gabinete do Prefeito',
        contact: 'gabinete@timon.ma.gov.br',
        requiresRegistration: false,
        createdAt: new Date('2024-11-12'),
        updatedAt: new Date('2024-11-12'),
        color: categoryConfig['atividades-governo'].color
      },
      {
        id: 5,
        title: 'Mutirão de Limpeza - Bairro São José',
        description: 'Mutirão de limpeza urbana no Bairro São José. Participe! Traga equipamentos de proteção individual.',
        startDate: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000), // 5 dias
        endDate: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
        startTime: '07:00',
        endTime: '11:00',
        isAllDay: false,
        location: 'Concentração: Praça do Bairro São José',
        category: 'servicos-mutiroes',
        status: 'scheduled',
        isPublic: true,
        organizer: 'Secretaria de Limpeza Urbana',
        contact: '(99) 3212-3460',
        requiresRegistration: true,
        maxParticipants: 100,
        currentParticipants: 23,
        createdAt: new Date('2024-11-08'),
        updatedAt: new Date('2024-11-14'),
        color: categoryConfig['servicos-mutiroes'].color
      }
    ];

    setEvents(initialEvents);
  }, []);

  const addEvent = (eventData: CalendarEventFormData) => {
    const newEvent: CalendarEvent = {
      ...eventData,
      id: Date.now(),
      startDate: new Date(eventData.startDate),
      endDate: new Date(eventData.endDate),
      currentParticipants: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      color: categoryConfig[eventData.category].color
    };
    setEvents(prev => [...prev, newEvent]);
  };

  const updateEvent = (id: number, updates: Partial<CalendarEvent>) => {
    setEvents(prev => prev.map(event => 
      event.id === id 
        ? { 
            ...event, 
            ...updates, 
            updatedAt: new Date(),
            color: updates.category ? categoryConfig[updates.category].color : event.color
          }
        : event
    ));
  };

  const deleteEvent = (id: number) => {
    setEvents(prev => prev.filter(event => event.id !== id));
  };

  const getEventsByDate = (date: Date) => {
    return events.filter(event => {
      const eventStart = new Date(event.startDate);
      const eventEnd = new Date(event.endDate);
      const targetDate = new Date(date);
      
      // Normalizar as datas para comparação (sem horário)
      eventStart.setHours(0, 0, 0, 0);
      eventEnd.setHours(23, 59, 59, 999);
      targetDate.setHours(0, 0, 0, 0);
      
      return targetDate >= eventStart && targetDate <= eventEnd;
    });
  };

  const getEventsByDateRange = (startDate: Date, endDate: Date) => {
    return events.filter(event => {
      const eventStart = new Date(event.startDate);
      const eventEnd = new Date(event.endDate);
      
      return (eventStart <= endDate && eventEnd >= startDate);
    });
  };

  const getEventsByCategory = (category: CalendarEvent['category']) => {
    return events.filter(event => event.category === category);
  };

  const getPublicEvents = () => {
    return events.filter(event => event.isPublic && event.status !== 'cancelled');
  };

  const getUpcomingEvents = (limit: number = 5) => {
    const now = new Date();
    return events
      .filter(event => event.isPublic && event.startDate >= now && event.status === 'scheduled')
      .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
      .slice(0, limit);
  };

  const getCategoryColor = (category: CalendarEvent['category']) => {
    return categoryConfig[category].color;
  };

  const getCategoryLabel = (category: CalendarEvent['category']) => {
    return categoryConfig[category].label;
  };

  const value: CalendarContextType = {
    events,
    addEvent,
    updateEvent,
    deleteEvent,
    getEventsByDate,
    getEventsByDateRange,
    getEventsByCategory,
    getPublicEvents,
    getUpcomingEvents,
    getCategoryColor,
    getCategoryLabel
  };

  return (
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  );
}

export function useCalendar() {
  const context = useContext(CalendarContext);
  if (context === undefined) {
    throw new Error('useCalendar must be used within a CalendarProvider');
  }
  return context;
}