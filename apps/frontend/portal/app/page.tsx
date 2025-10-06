import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Users, 
  Building2, 
  FileText, 
  Calendar,
  ExternalLink 
} from 'lucide-react';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Skip Link para acessibilidade */}
      <a href="#main-content" className="skip-link">
        Pular para o conteúdo principal
      </a>

      {/* Header/Navigation */}
      <header className="bg-primary text-primary-foreground sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary-foreground/20 rounded-lg flex items-center justify-center">
                <Building2 className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Prefeitura de Timon</h1>
                <p className="text-primary-foreground/80 text-sm">Maranhão</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/servicos" className="nav-link">
                Serviços
              </Link>
              <Link href="/noticias" className="nav-link">
                Notícias
              </Link>
              <Link href="/transparencia" className="nav-link">
                Transparência
              </Link>
              <Link href="/contato" className="nav-link">
                Contato
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="main-content" className="hero-section text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Bem-vindo ao Portal da
          </h2>
          <h3 className="text-3xl md:text-5xl font-bold mb-8">
            Prefeitura Municipal de Timon
          </h3>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Acesse serviços públicos, informações sobre a cidade e mantenha-se atualizado 
            com as últimas notícias da administração municipal.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary">
              <Users className="mr-2 h-5 w-5" />
              Serviços ao Cidadão
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
              <FileText className="mr-2 h-5 w-5" />
              Portal da Transparência
            </Button>
          </div>
        </div>
      </section>

      {/* Quick Access Cards */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Acesso Rápido</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Serviços Online',
                description: 'Acesse serviços digitais da prefeitura',
                icon: Users,
                color: 'bg-blue-500',
                href: '/servicos'
              },
              {
                title: 'Agenda do Prefeito',
                description: 'Acompanhe a agenda oficial',
                icon: Calendar,
                color: 'bg-green-500',
                href: '/agenda'
              },
              {
                title: 'Diário Oficial',
                description: 'Consulte publicações oficiais',
                icon: FileText,
                color: 'bg-purple-500',
                href: '/diario-oficial'
              },
              {
                title: 'Ouvidoria',
                description: 'Canal direto com o cidadão',
                icon: Phone,
                color: 'bg-orange-500',
                href: '/ouvidoria'
              }
            ].map((item, index) => (
              <Card key={index} className="card-hover cursor-pointer group">
                <CardHeader>
                  <div className={`w-12 h-12 ${item.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <item.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href={item.href}>
                    <Button variant="outline" size="sm" className="w-full">
                      Acessar <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Latest News */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Últimas Notícias</h2>
            <Link href="/noticias">
              <Button variant="outline">
                Ver todas <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Nova unidade de saúde inaugurada no bairro Centro',
                excerpt: 'A prefeitura inaugurou uma nova unidade básica de saúde que atenderá mais de 5.000 famílias...',
                date: '15 de Setembro, 2025',
                category: 'Saúde'
              },
              {
                title: 'Programa de asfaltamento beneficia 20 ruas da cidade',
                excerpt: 'As obras de infraestrutura continuam avançando em diversos bairros de Timon...',
                date: '12 de Setembro, 2025',
                category: 'Infraestrutura'
              },
              {
                title: 'Inscrições abertas para cursos profissionalizantes',
                excerpt: 'Mais de 500 vagas disponíveis em cursos gratuitos de capacitação profissional...',
                date: '10 de Setembro, 2025',
                category: 'Educação'
              }
            ].map((news, index) => (
              <Card key={index} className="card-hover cursor-pointer">
                <CardHeader>
                  <Badge variant="secondary" className="w-fit">
                    {news.category}
                  </Badge>
                  <CardTitle className="line-clamp-2">{news.title}</CardTitle>
                  <CardDescription className="line-clamp-3">
                    {news.excerpt}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground flex items-center">
                      <Clock className="mr-1 h-4 w-4" />
                      {news.date}
                    </span>
                    <Button variant="ghost" size="sm">
                      Ler mais
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Informações de Contato</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="font-semibold mb-2">Endereço</h3>
              <p className="text-muted-foreground">
                Av. Getúlio Vargas, 123<br />
                Centro - Timon/MA<br />
                CEP: 65630-000
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="h-8 w-8 text-secondary-foreground" />
              </div>
              <h3 className="font-semibold mb-2">Telefone</h3>
              <p className="text-muted-foreground">
                (99) 3212-1000<br />
                (99) 9 9999-9999<br />
                Atendimento: 8h às 17h
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold mb-2">E-mail</h3>
              <p className="text-muted-foreground">
                contato@timon.ma.gov.br<br />
                ouvidoria@timon.ma.gov.br<br />
                imprensa@timon.ma.gov.br
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-bold mb-4">Governo</h4>
              <ul className="space-y-2">
                <li><Link href="/prefeito" className="hover:underline">Prefeito</Link></li>
                <li><Link href="/secretarias" className="hover:underline">Secretarias</Link></li>
                <li><Link href="/organograma" className="hover:underline">Organograma</Link></li>
                <li><Link href="/historia" className="hover:underline">História</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Serviços</h4>
              <ul className="space-y-2">
                <li><Link href="/servicos" className="hover:underline">Todos os Serviços</Link></li>
                <li><Link href="/tributos" className="hover:underline">Tributos</Link></li>
                <li><Link href="/licitacoes" className="hover:underline">Licitações</Link></li>
                <li><Link href="/concursos" className="hover:underline">Concursos</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Transparência</h4>
              <ul className="space-y-2">
                <li><Link href="/transparencia" className="hover:underline">Portal da Transparência</Link></li>
                <li><Link href="/diario-oficial" className="hover:underline">Diário Oficial</Link></li>
                <li><Link href="/orcamento" className="hover:underline">Orçamento</Link></li>
                <li><Link href="/prestacao-contas" className="hover:underline">Prestação de Contas</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Contato</h4>
              <ul className="space-y-2">
                <li><Link href="/ouvidoria" className="hover:underline">Ouvidoria</Link></li>
                <li><Link href="/fale-conosco" className="hover:underline">Fale Conosco</Link></li>
                <li><Link href="/imprensa" className="hover:underline">Imprensa</Link></li>
                <li><Link href="/redes-sociais" className="hover:underline">Redes Sociais</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center">
            <p>&copy; 2025 Prefeitura Municipal de Timon - MA. Todos os direitos reservados.</p>
            <p className="text-sm mt-2 text-primary-foreground/80">
              Desenvolvido seguindo padrões de acessibilidade WCAG 2.1 AA
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}