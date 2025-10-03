import { useState, useEffect } from 'react';
import { useCalendar, type CalendarEvent, type CalendarEventFormData } from '../../CalendarContext';
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  Calendar as CalendarIcon,
  Save,
  X,
  Clock,
  MapPin,
  Users,
  Link as LinkIcon,
  Phone,
  Mail,
  Filter,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  CheckCircle
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
import { Calendar } from '../../ui/calendar';
import { Checkbox } from '../../ui/checkbox';
import { useAdmin } from '../AdminContext';
import { BulkActions, useBulkSelection, type BulkAction } from '../components/BulkActions';

export function EventsView() {
  const { setBreadcrumbs, addNotification } = useAdmin();
  const { 
    events, 
    addEvent, 
    updateEvent, 
    deleteEvent, 
    getEventsByDate,
    getCategoryColor,
    getCategoryLabel
  } = useCalendar();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [previewEvent, setPreviewEvent] = useState<CalendarEvent | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [view, setView] = useState<'list' | 'calendar'>('list');

  useEffect(() => {
    setBreadcrumbs([{ label: 'Eventos' }]);
  }, [setBreadcrumbs]);

  const filteredEvents = events
    .filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.location?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || event.category === categoryFilter;
      const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    })
    .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

  const upcomingEvents = events
    .filter(event => event.startDate >= new Date() && event.status === 'scheduled')
    .slice(0, 5);

  // Bulk actions
  const bulkSelection = useBulkSelection(filteredEvents);

  const handleDeleteEvent = (eventId: number) => {
    deleteEvent(eventId);
    addNotification({
      type: 'success',
      title: 'Evento excluído',
      message: 'O evento foi excluído com sucesso.'
    });
  };

  // Bulk actions handlers
  const handleBulkAction = (actionId: string, selectedIds: string[]) => {
    switch (actionId) {
      case 'delete':
        selectedIds.forEach(id => deleteEvent(parseInt(id)));
        bulkSelection.clearSelection();
        addNotification({
          type: 'success',
          title: `${selectedIds.length} evento${selectedIds.length !== 1 ? 's' : ''} excluído${selectedIds.length !== 1 ? 's' : ''}`,
          message: 'Os eventos selecionados foram excluídos com sucesso.'
        });
        break;
        
      case 'schedule':
        selectedIds.forEach(id => {
          const event = events.find(e => e.id.toString() === id);
          if (event && event.status !== 'scheduled') {
            updateEvent(parseInt(id), { status: 'scheduled' });
          }
        });
        bulkSelection.clearSelection();
        addNotification({
          type: 'success',
          title: `${selectedIds.length} evento${selectedIds.length !== 1 ? 's' : ''} agendado${selectedIds.length !== 1 ? 's' : ''}`,
          message: 'Os eventos selecionados foram agendados com sucesso.'
        });
        break;
        
      case 'cancel':
        selectedIds.forEach(id => {
          const event = events.find(e => e.id.toString() === id);
          if (event && event.status !== 'cancelled') {
            updateEvent(parseInt(id), { status: 'cancelled' });
          }
        });
        bulkSelection.clearSelection();
        addNotification({
          type: 'success',
          title: `${selectedIds.length} evento${selectedIds.length !== 1 ? 's' : ''} cancelado${selectedIds.length !== 1 ? 's' : ''}`,
          message: 'Os eventos selecionados foram cancelados com sucesso.'
        });
        break;
        
      case 'complete':
        selectedIds.forEach(id => {
          const event = events.find(e => e.id.toString() === id);
          if (event && event.status !== 'completed') {
            updateEvent(parseInt(id), { status: 'completed' });
          }
        });
        bulkSelection.clearSelection();
        addNotification({
          type: 'success',
          title: `${selectedIds.length} evento${selectedIds.length !== 1 ? 's' : ''} marcado${selectedIds.length !== 1 ? 's' : ''} como concluído${selectedIds.length !== 1 ? 's' : ''}`,
          message: 'Os eventos selecionados foram marcados como concluídos.'
        });
        break;
        
      case 'public':
        selectedIds.forEach(id => {
          const event = events.find(e => e.id.toString() === id);
          if (event && !event.isPublic) {
            updateEvent(parseInt(id), { isPublic: true });
          }
        });
        bulkSelection.clearSelection();
        addNotification({
          type: 'success',
          title: `${selectedIds.length} evento${selectedIds.length !== 1 ? 's' : ''} tornado${selectedIds.length !== 1 ? 's' : ''} público${selectedIds.length !== 1 ? 's' : ''}`,
          message: 'Os eventos selecionados foram tornados públicos.'
        });
        break;
        
      case 'private':
        selectedIds.forEach(id => {
          const event = events.find(e => e.id.toString() === id);
          if (event && event.isPublic) {
            updateEvent(parseInt(id), { isPublic: false });
          }
        });
        bulkSelection.clearSelection();
        addNotification({
          type: 'success',
          title: `${selectedIds.length} evento${selectedIds.length !== 1 ? 's' : ''} tornado${selectedIds.length !== 1 ? 's' : ''} privado${selectedIds.length !== 1 ? 's' : ''}`,
          message: 'Os eventos selecionados foram tornados privados.'
        });
        break;
    }
  };

  const bulkActions: BulkAction[] = [
    {
      id: 'schedule',
      label: 'Agendar',
      icon: CalendarIcon,
      variant: 'outline'
    },
    {
      id: 'complete',
      label: 'Marcar como Concluído',
      icon: CheckCircle,
      variant: 'outline'
    },
    {
      id: 'cancel',
      label: 'Cancelar',
      icon: X,
      variant: 'outline'
    },
    {
      id: 'public',
      label: 'Tornar Público',
      icon: Eye,
      variant: 'outline'
    },
    {
      id: 'private',
      label: 'Tornar Privado',
      icon: EyeOff,
      variant: 'outline'
    },
    {
      id: 'delete',
      label: 'Excluir',
      icon: Trash2,
      variant: 'destructive',
      requiresConfirmation: true,
      confirmationTitle: 'Excluir eventos selecionados',
      confirmationDescription: 'Esta ação não pode ser desfeita. Os eventos selecionados serão permanentemente removidos do calendário.'
    }
  ];

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (time?: string) => {
    if (!time) return '';
    return time;
  };

  const EventForm = ({ event, onSave, onCancel }: {
    event?: CalendarEvent;
    onSave: (eventData: CalendarEventFormData) => void;
    onCancel: () => void;
  }) => {
    const [formData, setFormData] = useState<CalendarEventFormData>({
      title: event?.title || '',
      description: event?.description || '',
      startDate: event?.startDate ? event.startDate.toISOString().split('T')[0] : '',
      endDate: event?.endDate ? event.endDate.toISOString().split('T')[0] : '',
      startTime: event?.startTime || '',
      endTime: event?.endTime || '',
      isAllDay: event?.isAllDay ?? false,
      location: event?.location || '',
      category: event?.category || 'reuniao',
      status: event?.status || 'scheduled',
      isPublic: event?.isPublic ?? true,
      organizer: event?.organizer || 'Prefeitura Municipal',
      contact: event?.contact || '',
      url: event?.url || '',
      maxParticipants: event?.maxParticipants,
      requiresRegistration: event?.requiresRegistration ?? false
    });

    const handleSubmit = () => {
      if (!formData.title || !formData.startDate || !formData.endDate) {
        addNotification({
          type: 'error',
          title: 'Campos obrigatórios',
          message: 'Título, data de início e data de fim são obrigatórios.'
        });
        return;
      }

      onSave(formData);
    };

    return (
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Informações Básicas</TabsTrigger>
          <TabsTrigger value="details">Detalhes</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <div className="grid gap-4">
            <div>
              <Label htmlFor="title">Título do Evento *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Digite o título do evento"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="description">Descrição *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descreva o evento detalhadamente"
                className="mt-1"
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="category">Categoria</Label>
              <Select value={formData.category} onValueChange={(value: any) => setFormData({ ...formData, category: value })}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="reuniao">Reuniões</SelectItem>
                  <SelectItem value="audiencia">Audiências Públicas</SelectItem>
                  <SelectItem value="cultural-esportivo">Eventos Culturais e Esportivos</SelectItem>
                  <SelectItem value="atividades-governo">Atividades do Governo</SelectItem>
                  <SelectItem value="servicos-mutiroes">Serviços e Mutirões</SelectItem>
                  <SelectItem value="anuncios-editais">Anúncios e Editais</SelectItem>
                  <SelectItem value="feriados-datas">Feriados e Datas Comemorativas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Data de Início *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="endDate">Data de Fim *</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Evento de dia inteiro</Label>
                <p className="text-sm text-muted-foreground">
                  Marque se o evento não tem horário específico
                </p>
              </div>
              <Switch
                checked={formData.isAllDay}
                onCheckedChange={(checked) => setFormData({ ...formData, isAllDay: checked })}
              />
            </div>

            {!formData.isAllDay && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startTime">Horário de Início</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="endTime">Horário de Fim</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          <div>
            <Label htmlFor="location">Local</Label>
            <div className="relative mt-1">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Endereço ou local do evento"
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="organizer">Organizador</Label>
            <Input
              id="organizer"
              value={formData.organizer}
              onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
              placeholder="Secretaria ou departamento responsável"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="contact">Contato</Label>
            <div className="relative mt-1">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="contact"
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                placeholder="Telefone ou email para contato"
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="url">Link/URL</Label>
            <div className="relative mt-1">
              <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://timon.ma.gov.br/evento"
                className="pl-10"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <div>
            <Label htmlFor="status">Status do Evento</Label>
            <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="scheduled">Agendado</SelectItem>
                <SelectItem value="cancelled">Cancelado</SelectItem>
                <SelectItem value="completed">Concluído</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label>Evento Público</Label>
              <p className="text-sm text-muted-foreground">
                Controla se o evento aparece no calendário público
              </p>
            </div>
            <Switch
              checked={formData.isPublic}
              onCheckedChange={(checked) => setFormData({ ...formData, isPublic: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Requer Inscrição</Label>
              <p className="text-sm text-muted-foreground">
                Define se o evento precisa de inscrição prévia
              </p>
            </div>
            <Switch
              checked={formData.requiresRegistration}
              onCheckedChange={(checked) => setFormData({ ...formData, requiresRegistration: checked })}
            />
          </div>

          {formData.requiresRegistration && (
            <div>
              <Label htmlFor="maxParticipants">Máximo de Participantes</Label>
              <div className="relative mt-1">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="maxParticipants"
                  type="number"
                  value={formData.maxParticipants || ''}
                  onChange={(e) => setFormData({ ...formData, maxParticipants: parseInt(e.target.value) || undefined })}
                  placeholder="Limite de vagas (opcional)"
                  className="pl-10"
                  min="1"
                />
              </div>
            </div>
          )}
        </TabsContent>

        <div className="flex justify-between pt-6 border-t">
          <Button variant="outline" onClick={onCancel}>
            <X className="h-4 w-4 mr-2" />
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>
            <Save className="h-4 w-4 mr-2" />
            {event ? 'Atualizar Evento' : 'Criar Evento'}
          </Button>
        </div>
      </Tabs>
    );
  };

  const EventPreview = ({ event }: { event: CalendarEvent }) => (
    <div className="max-w-4xl mx-auto">
      <div className="border border-border rounded-lg overflow-hidden bg-card">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div 
              className="w-4 h-4 rounded-full" 
              style={{ backgroundColor: event.color }}
            />
            <Badge variant="outline">
              {getCategoryLabel(event.category)}
            </Badge>
            <Badge variant={
              event.status === 'scheduled' ? 'default' :
              event.status === 'cancelled' ? 'destructive' : 'secondary'
            }>
              {event.status === 'scheduled' ? 'Agendado' :
               event.status === 'cancelled' ? 'Cancelado' : 'Concluído'}
            </Badge>
            {event.requiresRegistration && (
              <Badge variant="outline">Inscrição obrigatória</Badge>
            )}
          </div>
          
          <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                <span>
                  {formatDate(event.startDate)}
                  {event.startDate.getTime() !== event.endDate.getTime() && 
                    ` até ${formatDate(event.endDate)}`
                  }
                </span>
              </div>
              
              {!event.isAllDay && (event.startTime || event.endTime) && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {formatTime(event.startTime)}
                    {event.endTime && ` às ${formatTime(event.endTime)}`}
                  </span>
                </div>
              )}
              
              {event.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{event.location}</span>
                </div>
              )}
            </div>
            
            <div className="space-y-3">
              {event.organizer && (
                <div>
                  <strong>Organizador:</strong> {event.organizer}
                </div>
              )}
              
              {event.contact && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{event.contact}</span>
                </div>
              )}
              
              {event.maxParticipants && (
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {event.currentParticipants || 0}/{event.maxParticipants} inscritos
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <div className="prose prose-sm max-w-none mb-6">
            <p>{event.description}</p>
          </div>
          
          {event.url && (
            <div className="pt-4 border-t">
              <a 
                href={event.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary hover:underline"
              >
                Mais informações
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Gerenciar Eventos</h1>
          <p className="text-muted-foreground">
            Gerencie eventos públicos, reuniões e atividades governamentais
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Evento
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{events.length}</p>
              </div>
              <CalendarIcon className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Próximos</p>
                <p className="text-2xl font-bold text-blue-600">
                  {upcomingEvents.length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Públicos</p>
                <p className="text-2xl font-bold text-green-600">
                  {events.filter(e => e.isPublic).length}
                </p>
              </div>
              <Eye className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Com Inscrição</p>
                <p className="text-2xl font-bold">
                  {events.filter(e => e.requiresRegistration).length}
                </p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Events List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[16px]">
            <CalendarIcon className="h-4 w-4" />
            Eventos ({filteredEvents.length})
          </CardTitle>
          <CardDescription>
            Gerencie eventos públicos, reuniões e atividades governamentais da prefeitura
          </CardDescription>
          <div className="mt-4 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar eventos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px]">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filtrar por categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  <SelectItem value="reuniao">Reuniões</SelectItem>
                  <SelectItem value="audiencia">Audiências Públicas</SelectItem>
                  <SelectItem value="cultural-esportivo">Cultural e Esportivo</SelectItem>
                  <SelectItem value="atividades-governo">Atividades do Governo</SelectItem>
                  <SelectItem value="servicos-mutiroes">Serviços e Mutirões</SelectItem>
                  <SelectItem value="anuncios-editais">Anúncios e Editais</SelectItem>
                  <SelectItem value="feriados-datas">Feriados e Datas</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <Clock className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="scheduled">Agendado</SelectItem>
                  <SelectItem value="cancelled">Cancelado</SelectItem>
                  <SelectItem value="completed">Concluído</SelectItem>
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
              totalItems={filteredEvents.length}
              onSelectAll={bulkSelection.selectAll}
              onClearSelection={bulkSelection.clearSelection}
              actions={bulkActions}
              onAction={handleBulkAction}
              itemName="evento"
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={bulkSelection.selectedIds.length === filteredEvents.length && filteredEvents.length > 0}
                    onCheckedChange={bulkSelection.selectAll}
                    className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                </TableHead>
                <TableHead>Evento</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Público</TableHead>
                <TableHead className="text-left">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEvents.map((event) => (
                <TableRow key={event.id}>
                  <TableCell>
                    <Checkbox
                      checked={bulkSelection.isSelected(event.id)}
                      onCheckedChange={() => bulkSelection.selectItem(event.id)}
                      className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: event.color }}
                        />
                        <span className="font-medium">{event.title}</span>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {event.location}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div>{formatDate(event.startDate)}</div>
                      {!event.isAllDay && event.startTime && (
                        <div className="text-sm text-muted-foreground">
                          {formatTime(event.startTime)}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {getCategoryLabel(event.category)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      event.status === 'scheduled' ? 'default' :
                      event.status === 'cancelled' ? 'destructive' : 'secondary'
                    }>
                      {event.status === 'scheduled' ? 'Agendado' :
                       event.status === 'cancelled' ? 'Cancelado' : 'Concluído'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {event.isPublic ? (
                      <Eye className="h-4 w-4 text-green-600" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    )}
                  </TableCell>
                  <TableCell className="text-left">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEditingEvent(event)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setPreviewEvent(event)}>
                          <Eye className="h-4 w-4 mr-2" />
                          Visualizar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleDeleteEvent(event.id)}
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

          {filteredEvents.length === 0 && (
            <div className="text-center py-12">
              <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {searchTerm || categoryFilter !== 'all' || statusFilter !== 'all'
                  ? 'Nenhum evento encontrado com os filtros aplicados'
                  : 'Nenhum evento criado ainda'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Event Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Novo Evento</DialogTitle>
            <DialogDescription>
              Crie um novo evento para o calendário público da prefeitura.
            </DialogDescription>
          </DialogHeader>
          <EventForm
            onSave={(eventData) => {
              addEvent(eventData);
              setIsCreateModalOpen(false);
              addNotification({
                type: 'success',
                title: 'Evento criado',
                message: 'O evento foi criado com sucesso.'
              });
            }}
            onCancel={() => setIsCreateModalOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Event Modal */}
      <Dialog open={!!editingEvent} onOpenChange={() => setEditingEvent(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Evento</DialogTitle>
            <DialogDescription>
              Faça as alterações necessárias no evento selecionado.
            </DialogDescription>
          </DialogHeader>
          {editingEvent && (
            <EventForm
              event={editingEvent}
              onSave={(eventData) => {
                updateEvent(editingEvent.id, {
                  ...eventData,
                  startDate: new Date(eventData.startDate),
                  endDate: new Date(eventData.endDate)
                });
                setEditingEvent(null);
                addNotification({
                  type: 'success',
                  title: 'Evento atualizado',
                  message: 'As alterações foram salvas com sucesso.'
                });
              }}
              onCancel={() => setEditingEvent(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Preview Event Modal */}
      <Dialog open={!!previewEvent} onOpenChange={() => setPreviewEvent(null)}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Visualização do Evento
            </DialogTitle>
            <DialogDescription>
              Preview de como o evento aparecerá no calendário público
            </DialogDescription>
          </DialogHeader>
          {previewEvent && <EventPreview event={previewEvent} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}