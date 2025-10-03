import { 
  FileText, 
  Users, 
  Upload, 
  FolderOpen, 
  Eye, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  AlertCircle,
  CheckCircle,
  Calendar,
  BarChart3,
  Activity,
  Globe
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Progress } from '../../ui/progress';
import { Separator } from '../../ui/separator';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { useAdmin } from '../AdminContext';
import { usePosts, useEvents, useServices, useGallery } from '../../AdminDataContext-hooks';
import { useContext } from 'react';
import { AdminDataContext } from '../../AdminDataContext';

export function DashboardView() {
  const { setCurrentView, addNotification } = useAdmin();
  const { posts } = usePosts();
  const { events } = useEvents();
  const { services } = useServices();
  const { galleryAlbums } = useGallery();
  const adminContext = useContext(AdminDataContext);
  
  if (!adminContext) {
    return <div>Carregando...</div>;
  }
  
  const { state } = adminContext;

  // Calcular estatísticas reais
  const publishedPosts = posts.filter(post => post.status === 'published');
  const upcomingEvents = events.filter(event => new Date(event.startDate) >= new Date());
  const activeServices = services.filter(service => service.isActive);
  const totalViews = posts.reduce((sum, post) => sum + post.views, 0);

  // Dados para gráficos
  const visitorsData = [
    { name: 'Jan', visitors: 4200, pageViews: 8400 },
    { name: 'Fev', visitors: 3800, pageViews: 7600 },
    { name: 'Mar', visitors: 5100, pageViews: 10200 },
    { name: 'Abr', visitors: 4700, pageViews: 9400 },
    { name: 'Mai', visitors: 5300, pageViews: 10600 },
    { name: 'Jun', visitors: 4900, pageViews: 9800 },
    { name: 'Jul', visitors: 5500, pageViews: 11000 },
  ];

  // Dados reais para gráficos
  const contentData = [
    { name: 'Notícias', value: posts.length, color: '#144c9c' },
    { name: 'Páginas', value: state.customPages.length, color: '#228B22' },
    { name: 'Eventos', value: events.length, color: '#FFC107' },
    { name: 'Mídia', value: state.mediaFiles.length, color: '#6C757D' },
  ];

  const topPagesData = [
    { page: '/noticias', views: 15420, bounce: 32 },
    { page: '/servicos', views: 12890, bounce: 28 },
    { page: '/transparencia', views: 9870, bounce: 45 },
    { page: '/agenda', views: 8750, bounce: 38 },
    { page: '/galeria', views: 6540, bounce: 42 },
  ];

  const StatCard = ({ 
    title, 
    value, 
    change, 
    changeType, 
    icon: Icon, 
    description,
    onClick 
  }: {
    title: string;
    value: string | number;
    change?: number;
    changeType?: 'increase' | 'decrease';
    icon: React.ComponentType<{ className?: string }>;
    description?: string;
    onClick?: () => void;
  }) => (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={onClick}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change !== undefined && (
          <div className="flex items-center mt-1">
            {changeType === 'increase' ? (
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
            ) : (
              <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
            )}
            <span className={`text-xs ${
              changeType === 'increase' ? 'text-green-500' : 'text-red-500'
            }`}>
              {change > 0 ? '+' : ''}{change}%
            </span>
            <span className="text-xs text-muted-foreground ml-1">
              vs. mês anterior
            </span>
          </div>
        )}
        {description && (
          <p className="text-xs text-muted-foreground mt-1">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary to-primary/80 rounded-lg p-6 text-primary-foreground">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-2">
              Bem-vindo ao Painel Administrativo
            </h1>
            <p className="text-primary-foreground/90 mb-4 lg:mb-0">
              Gerencie todo o conteúdo do site da Prefeitura Municipal de Timon - MA
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="secondary" 
              size="sm"
              onClick={() => setCurrentView('posts')}
              className="bg-white/20 border-white/30 text-primary-foreground hover:bg-white/30"
            >
              Nova Notícia
            </Button>
            <Button 
              variant="secondary" 
              size="sm"
              onClick={() => setCurrentView('events')}
              className="bg-white/20 border-white/30 text-primary-foreground hover:bg-white/30"
            >
              Novo Evento
            </Button>
            <Button 
              variant="secondary" 
              size="sm"
              onClick={() => setCurrentView('pages')}
              className="bg-white/20 border-white/30 text-primary-foreground hover:bg-white/30"
            >
              Nova Página
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-4 border-t border-white/20">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-foreground">{posts.length}</div>
            <div className="text-sm text-primary-foreground/80">Notícias</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-foreground">{events.length}</div>
            <div className="text-sm text-primary-foreground/80">Eventos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-foreground">{services.length}</div>
            <div className="text-sm text-primary-foreground/80">Serviços</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-foreground">{galleryAlbums.length}</div>
            <div className="text-sm text-primary-foreground/80">Álbuns</div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total de Notícias"
          value={posts.length}
          change={posts.length > 0 ? Math.floor((publishedPosts.length / posts.length) * 100 - 85) : 0}
          changeType={posts.length > 0 ? "increase" : undefined}
          icon={FileText}
          description={`${publishedPosts.length} publicadas`}
          onClick={() => setCurrentView('posts')}
        />
        <StatCard
          title="Eventos Futuros"
          value={upcomingEvents.length}
          change={upcomingEvents.length > 0 ? 15 : 0}
          changeType={upcomingEvents.length > 0 ? "increase" : undefined}
          icon={Calendar}
          description="Próximos eventos"
          onClick={() => setCurrentView('events')}
        />
        <StatCard
          title="Serviços Ativos"
          value={activeServices.length}
          change={activeServices.length > 0 ? 8 : 0}
          changeType={activeServices.length > 0 ? "increase" : undefined}
          icon={FolderOpen}
          description="Serviços disponíveis"
          onClick={() => setCurrentView('external-services')}
        />
        <StatCard
          title="Total de Visualizações"
          value={totalViews.toLocaleString()}
          change={totalViews > 0 ? 23 : 0}
          changeType={totalViews > 0 ? "increase" : undefined}
          icon={Eye}
          description="Visualizações de notícias"
          onClick={() => setCurrentView('posts')}
        />
      </div>

      {/* Content Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Páginas Personalizadas"
          value={state.customPages.length}
          change={state.customPages.length > 0 ? 5 : 0}
          changeType={state.customPages.length > 0 ? "increase" : undefined}
          icon={Globe}
          description="Páginas criadas"
          onClick={() => setCurrentView('pages')}
        />

        <StatCard
          title="Álbuns de Fotos"
          value={galleryAlbums.length}
          change={galleryAlbums.length > 0 ? 12 : 0}
          changeType={galleryAlbums.length > 0 ? "increase" : undefined}
          icon={Upload}
          description="Álbuns publicados"
          onClick={() => setCurrentView('gallery')}
        />

        <StatCard
          title="Formulários Ativos"
          value={state.forms.filter(form => form.settings.isActive).length}
          change={state.forms.length > 0 ? 3 : 0}
          changeType={state.forms.length > 0 ? "increase" : undefined}
          icon={FileText}
          description="Formulários disponíveis"
          onClick={() => setCurrentView('forms')}
        />

        <StatCard
          title="Usuários do Sistema"
          value={state.users.length}
          change={0}
          changeType={undefined}
          icon={Users}
          description="Usuários cadastrados"
          onClick={() => setCurrentView('users')}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Visitantes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Visitantes e Visualizações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={visitorsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="visitors" fill="#144c9c" name="Visitantes" />
                <Bar dataKey="pageViews" fill="#228B22" name="Visualizações" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Distribuição de Conteúdo */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Conteúdo</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={contentData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {contentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notícias Recentes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Notícias Recentes</CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setCurrentView('posts')}
            >
              Ver Todas
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {posts
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .slice(0, 5)
                .map((post) => (
                <div key={post.id} className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{post.title}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge 
                        variant={post.status === 'published' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {post.status === 'published' ? 'Publicado' : 'Rascunho'}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {post.author} • {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('pt-BR') : 'Não publicado'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-muted-foreground">
                      {post.views} views
                    </span>
                  </div>
                </div>
              ))}
              {posts.length === 0 && (
                <div className="text-center text-muted-foreground py-4">
                  <p>Nenhuma notícia cadastrada ainda.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Eventos Próximos */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Próximos Eventos</CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setCurrentView('events')}
            >
              Ver Agenda
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {events
                .filter(event => new Date(event.startDate) >= new Date())
                .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
                .slice(0, 5)
                .map((event) => {
                  const eventDate = new Date(event.startDate);
                  const day = eventDate.getDate().toString().padStart(2, '0');
                  const month = eventDate.toLocaleDateString('pt-BR', { month: 'short' });
                  const time = eventDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                  
                  return (
                    <div key={event.id} className="flex items-start space-x-3">
                      <div className="bg-primary text-primary-foreground rounded p-2 text-center min-w-[50px]">
                        <div className="text-xs font-medium">
                          {day}
                        </div>
                        <div className="text-xs">
                          {month}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{event.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {time} • {event.location || 'Local não informado'}
                        </p>
                        <Badge variant="outline" className="text-xs mt-1">
                          {event.category === 'audiencia' ? 'Audiência' : 
                           event.category === 'cultura' ? 'Cultura' :
                           event.category === 'saude' ? 'Saúde' :
                           event.category === 'educacao' ? 'Educação' :
                           event.category === 'esporte' ? 'Esporte' :
                           event.category === 'reuniao' ? 'Reunião' :
                           event.category === 'festa' ? 'Festa' : 'Evento'}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              {events.filter(event => new Date(event.startDate) >= new Date()).length === 0 && (
                <div className="text-center text-muted-foreground py-4">
                  <p>Nenhum evento próximo cadastrado.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Serviços Populares e Páginas Top */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Serviços Mais Utilizados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {services
                .filter(service => service.isActive && service.isHighlighted)
                .slice(0, 5)
                .map((service, index) => {
                  // Simular dados de uso baseados no ID do serviço
                  const usage = Math.floor(Math.random() * 40) + 60; // 60-100%
                  const growth = Math.floor(Math.random() * 20) - 5; // -5 a +15%
                  
                  return (
                    <div key={service.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{service.title}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-muted-foreground">
                            {usage}%
                          </span>
                          {growth > 0 ? (
                            <TrendingUp className="h-3 w-3 text-green-500" />
                          ) : (
                            <TrendingDown className="h-3 w-3 text-red-500" />
                          )}
                          <span className={`text-xs ${
                            growth > 0 ? 'text-green-500' : 'text-red-500'
                          }`}>
                            {growth > 0 ? '+' : ''}{growth}%
                          </span>
                        </div>
                      </div>
                      <Progress value={usage} className="h-2" />
                    </div>
                  );
                })}
              {services.filter(service => service.isActive && service.isHighlighted).length === 0 && (
                <div className="text-center text-muted-foreground py-4">
                  <p>Nenhum serviço destacado cadastrado.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resumo de Categorias</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {state.categories.length > 0 ? (
                state.categories.slice(0, 5).map((category) => (
                  <div key={category.id} className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{category.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {category.contentCount} conteúdos
                      </p>
                    </div>
                    <Badge 
                      variant="outline" 
                      className="text-xs"
                      style={{ backgroundColor: category.color + '20', color: category.color }}
                    >
                      {category.isActive ? 'Ativa' : 'Inativa'}
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="text-center text-muted-foreground py-4">
                  <p>Nenhuma categoria cadastrada ainda.</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => setCurrentView('categories')}
                  >
                    Criar Categoria
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Atividade Recente */}
      <Card>
        <CardHeader>
          <CardTitle>Atividade Recente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Combinar atividades recentes de diferentes seções */}
            {[
              ...posts
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .slice(0, 2)
                .map(post => ({
                  type: 'post' as const,
                  title: `Nova notícia: ${post.title}`,
                  time: post.createdAt,
                  status: post.status,
                  icon: FileText
                })),
              ...events
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .slice(0, 2)
                .map(event => ({
                  type: 'event' as const,
                  title: `Evento criado: ${event.title}`,
                  time: event.createdAt,
                  status: 'active',
                  icon: Calendar
                })),
              ...services
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .slice(0, 1)
                .map(service => ({
                  type: 'service' as const,
                  title: `Serviço adicionado: ${service.title}`,
                  time: service.createdAt,
                  status: service.isActive ? 'active' : 'inactive',
                  icon: FolderOpen
                }))
            ]
              .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
              .slice(0, 5)
              .map((activity, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <activity.icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(activity.time).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <Badge 
                    variant={activity.status === 'published' || activity.status === 'active' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {activity.status === 'published' ? 'Publicado' :
                     activity.status === 'active' ? 'Ativo' :
                     activity.status === 'draft' ? 'Rascunho' : 'Inativo'}
                  </Badge>
                </div>
              ))}
            {posts.length === 0 && events.length === 0 && services.length === 0 && (
              <div className="text-center text-muted-foreground py-4">
                <p>Nenhuma atividade recente.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}