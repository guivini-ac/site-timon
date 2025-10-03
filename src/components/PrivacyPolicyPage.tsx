import { ArrowLeft, Shield, Eye, Database, Lock, UserCheck, FileText, AlertTriangle, Calendar, Phone, Mail } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Alert, AlertDescription } from './ui/alert';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import Breadcrumb from './Breadcrumb';

interface PrivacyPolicyPageProps {
  onNavigateBack: () => void;
}

export default function PrivacyPolicyPage({ onNavigateBack }: PrivacyPolicyPageProps) {
  const { elementRef: contentRef, isVisible: isContentVisible } = useScrollAnimation();
  const lastUpdated = "15 de setembro de 2025";

  const breadcrumbItems = [
    {
      label: 'Início',
      onClick: onNavigateBack
    },
    {
      label: 'Política de Privacidade'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      {/* Header */}
      <Breadcrumb items={breadcrumbItems} />

      {/* Title Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center mb-4">
          <Shield className="h-8 w-8 text-[#144c9c] mr-4" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Política de Privacidade</h1>
            <p className="text-gray-600 mt-1">Como protegemos e tratamos seus dados pessoais com transparência e segurança</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div 
        ref={contentRef}
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 transition-all duration-800 ${
          isContentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        {/* Introduction Alert */}
        <Alert className="mb-8 border-green-200 bg-green-50">
          <Shield className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <strong>Compromisso com a Privacidade:</strong> A Prefeitura Municipal de Timon está comprometida em proteger 
            sua privacidade e tratar seus dados pessoais de forma transparente e segura, em conformidade com a LGPD.
          </AlertDescription>
        </Alert>

        {/* Quick Navigation */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-green-600" />
              Navegação Rápida
            </CardTitle>
            <CardDescription>
              Clique nos tópicos abaixo para ir diretamente à seção desejada
            </CardDescription>
          </CardHeader>
          <CardContent>
            <nav className="grid grid-cols-1 md:grid-cols-2 gap-3" aria-label="Navegação pela política de privacidade">
              {[
                { id: 'overview', title: 'Visão Geral', icon: Eye },
                { id: 'data-collection', title: 'Coleta de Dados', icon: Database },
                { id: 'data-usage', title: 'Uso dos Dados', icon: UserCheck },
                { id: 'data-sharing', title: 'Compartilhamento', icon: Shield },
                { id: 'security', title: 'Segurança', icon: Lock },
                { id: 'rights', title: 'Seus Direitos', icon: FileText }
              ].map(({ id, title, icon: Icon }) => (
                <Button
                  key={id}
                  variant="ghost"
                  className="justify-start h-auto p-3 text-left hover:bg-green-50 focus:ring-2 focus:ring-green-500"
                  onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <Icon className="h-4 w-4 mr-3 text-green-600 flex-shrink-0" />
                  <span className="text-sm">{title}</span>
                </Button>
              ))}
            </nav>
          </CardContent>
        </Card>

        {/* Policy Content */}
        <div className="space-y-8">
          {/* Section 1: Overview */}
          <section id="overview" className="scroll-mt-24">
            <Card className="border-l-4 border-l-green-600">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-green-600" />
                  1. Visão Geral
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Esta Política de Privacidade descreve como a Prefeitura Municipal de Timon - MA 
                  coleta, usa, processa e protege suas informações pessoais quando você utiliza 
                  nosso portal oficial (<strong>timon.ma.gov.br</strong>).
                </p>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-900 mb-2">Legislação Aplicável</h4>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018)</li>
                    <li>• Lei de Acesso à Informação (LAI - Lei nº 12.527/2011)</li>
                    <li>• Marco Civil da Internet (Lei nº 12.965/2014)</li>
                    <li>• Constituição Federal de 1988</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Controlador dos Dados</h4>
                  <p className="text-sm">
                    A Prefeitura Municipal de Timon atua como controladora dos dados pessoais 
                    coletados através deste portal, sendo responsável pelas decisões sobre o 
                    tratamento de seus dados pessoais.
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Section 2: Data Collection */}
          <section id="data-collection" className="scroll-mt-24">
            <Card className="border-l-4 border-l-blue-600">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-blue-600" />
                  2. Quais Dados Coletamos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">2.1. Dados Coletados Automaticamente</h4>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>Endereço IP e informações de localização geográfica aproximada</li>
                    <li>Tipo de navegador, sistema operacional e dispositivo utilizado</li>
                    <li>Páginas visitadas, tempo de permanência e padrões de navegação</li>
                    <li>Data e horário dos acessos</li>
                    <li>Referrer (site de origem do acesso)</li>
                    <li>Dados de cookies e tecnologias similares</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">2.2. Dados Fornecidos Voluntariamente</h4>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>Nome completo, CPF/CNPJ, RG</li>
                    <li>Endereço residencial ou comercial</li>
                    <li>Telefone, e-mail e outras formas de contato</li>
                    <li>Informações fornecidas em formulários de serviços públicos</li>
                    <li>Conteúdo de mensagens enviadas através do portal</li>
                    <li>Dados específicos para cada tipo de serviço solicitado</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">2.3. Dados Sensíveis</h4>
                  <p className="text-sm">
                    Alguns serviços podem requerer dados sensíveis como informações de saúde, 
                    dados biométricos ou outras categorias especiais. Nesses casos, você será 
                    expressamente informado e seu consentimento específico será solicitado.
                  </p>
                </div>

                <Alert className="border-blue-200 bg-blue-50">
                  <AlertTriangle className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800 text-sm">
                    <strong>Importante:</strong> Coletamos apenas os dados estritamente necessários 
                    para a prestação dos serviços públicos solicitados.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </section>

          {/* Section 3: Data Usage */}
          <section id="data-usage" className="scroll-mt-24">
            <Card className="border-l-4 border-l-purple-600">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-purple-600" />
                  3. Como Usamos Seus Dados
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">3.1. Finalidades do Tratamento</h4>
                  <ul className="list-disc pl-6 space-y-2 text-sm">
                    <li><strong>Prestação de Serviços Públicos:</strong> Processar solicitações, emitir documentos, realizar atendimentos</li>
                    <li><strong>Comunicação Oficial:</strong> Enviar informações sobre processos, serviços e notificações legais</li>
                    <li><strong>Melhoria dos Serviços:</strong> Analisar uso do portal para otimizar funcionalidades</li>
                    <li><strong>Segurança:</strong> Proteger contra fraudes, ataques e uso indevido</li>
                    <li><strong>Cumprimento Legal:</strong> Atender obrigações legais e regulamentares</li>
                    <li><strong>Transparência Pública:</strong> Disponibilizar informações conforme LAI</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">3.2. Base Legal para o Tratamento</h4>
                  <div className="grid gap-3">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="font-medium text-sm">Execução de Políticas Públicas (Art. 7º, III da LGPD)</p>
                      <p className="text-xs text-gray-600 mt-1">Para prestação de serviços públicos e execução de políticas públicas previstas em leis e regulamentos.</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="font-medium text-sm">Cumprimento de Obrigação Legal (Art. 7º, II da LGPD)</p>
                      <p className="text-xs text-gray-600 mt-1">Quando o tratamento for necessário para o cumprimento de obrigação legal ou regulatória.</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="font-medium text-sm">Exercício Regular de Direitos (Art. 7º, VI da LGPD)</p>
                      <p className="text-xs text-gray-600 mt-1">Para exercício regular de direitos em processo judicial, administrativo ou arbitral.</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="font-medium text-sm">Legítimo Interesse (Art. 7º, IX da LGPD)</p>
                      <p className="text-xs text-gray-600 mt-1">Para melhorias dos serviços e segurança do portal, respeitando direitos fundamentais.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Section 4: Data Sharing */}
          <section id="data-sharing" className="scroll-mt-24">
            <Card className="border-l-4 border-l-orange-600">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-orange-600" />
                  4. Compartilhamento de Dados
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">4.1. Quando Compartilhamos</h4>
                  <ul className="list-disc pl-6 space-y-2 text-sm">
                    <li><strong>Órgãos Públicos:</strong> Com outras secretarias, autarquias e órgãos públicos necessários para a prestação do serviço</li>
                    <li><strong>Obrigação Legal:</strong> Quando exigido por lei, ordem judicial ou autoridade competente</li>
                    <li><strong>Prestadores de Serviço:</strong> Com empresas contratadas que auxiliam na prestação de serviços públicos</li>
                    <li><strong>Transparência:</strong> Conforme previsto na Lei de Acesso à Informação, respeitando dados pessoais</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">4.2. Proteções no Compartilhamento</h4>
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <ul className="text-sm text-orange-800 space-y-1">
                      <li>• Contratos específicos com garantias de proteção de dados</li>
                      <li>• Compartilhamento apenas dos dados estritamente necessários</li>
                      <li>• Monitoramento do uso adequado pelos destinatários</li>
                      <li>• Proibição de uso para finalidades não autorizadas</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">4.3. Transferência Internacional</h4>
                  <p className="text-sm">
                    Não realizamos transferência internacional de dados pessoais, exceto quando 
                    estritamente necessário para cumprimento de obrigação legal ou proteção da vida.
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Section 5: Security */}
          <section id="security" className="scroll-mt-24">
            <Card className="border-l-4 border-l-red-600">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-red-600" />
                  5. Segurança dos Dados
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">5.1. Medidas Técnicas</h4>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>Criptografia de dados em trânsito (HTTPS/TLS)</li>
                    <li>Criptografia de dados sensíveis em repouso</li>
                    <li>Controles de acesso baseados em perfis de usuário</li>
                    <li>Monitoramento contínuo de segurança</li>
                    <li>Firewalls e sistemas de detecção de intrusão</li>
                    <li>Backups regulares e seguros</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">5.2. Medidas Organizacionais</h4>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>Treinamento regular de servidores sobre proteção de dados</li>
                    <li>Políticas internas de segurança da informação</li>
                    <li>Controle de acesso físico aos sistemas</li>
                    <li>Procedimentos para resposta a incidentes</li>
                    <li>Auditoria regular dos sistemas e processos</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">5.3. Retenção de Dados</h4>
                  <p className="text-sm">
                    Mantemos seus dados pessoais apenas pelo tempo necessário para as finalidades 
                    declaradas ou conforme exigido por lei. Após esse período, os dados são 
                    anonimizados ou eliminados de forma segura.
                  </p>
                </div>

                <Alert className="border-red-200 bg-red-50">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800 text-sm">
                    <strong>Importante:</strong> Implementamos medidas de segurança adequadas, mas 
                    nenhum sistema é 100% seguro. Recomendamos que você também adote boas práticas 
                    de segurança ao utilizar nossos serviços.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </section>

          {/* Section 6: Rights */}
          <section id="rights" className="scroll-mt-24">
            <Card className="border-l-4 border-l-green-600">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-green-600" />
                  6. Seus Direitos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm">
                  Conforme a LGPD, você possui os seguintes direitos em relação aos seus dados pessoais:
                </p>

                <div className="grid gap-4">
                  {[
                    {
                      title: "Direito de Confirmação e Acesso",
                      description: "Saber se tratamos seus dados e acessar os dados que possuímos sobre você"
                    },
                    {
                      title: "Direito de Correção",
                      description: "Solicitar a correção de dados incompletos, inexatos ou desatualizados"
                    },
                    {
                      title: "Direito de Anonimização ou Eliminação",
                      description: "Solicitar a anonimização ou eliminação de dados desnecessários ou tratados em desconformidade"
                    },
                    {
                      title: "Direito de Portabilidade",
                      description: "Solicitar a portabilidade dos dados a outro fornecedor de serviço ou produto"
                    },
                    {
                      title: "Direito de Informação",
                      description: "Obter informações sobre o compartilhamento de dados com entidades públicas e privadas"
                    },
                    {
                      title: "Direito de Oposição",
                      description: "Se opor ao tratamento realizado com fundamento no legítimo interesse"
                    },
                    {
                      title: "Direito à Revisão",
                      description: "Solicitar revisão de decisões automatizadas que afetem seus interesses"
                    }
                  ].map((right, index) => (
                    <div key={index} className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h5 className="font-medium text-green-900 text-sm">{right.title}</h5>
                      <p className="text-xs text-green-800 mt-1">{right.description}</p>
                    </div>
                  ))}
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Como Exercer Seus Direitos</h4>
                  <p className="text-sm mb-3">
                    Para exercer qualquer um dos seus direitos, entre em contato conosco através dos canais:
                  </p>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-600" />
                      <span>E-mail: privacidade@timon.ma.gov.br</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-600" />
                      <span>Telefone: (99) 3212-1500</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-gray-600 mt-0.5" />
                      <span>Presencial: Praça São José, s/n - Centro, Timon/MA</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Additional Sections */}
          <section className="scroll-mt-24">
            <Card>
              <CardHeader>
                <CardTitle>7. Cookies e Tecnologias Similares</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">7.1. Tipos de Cookies Utilizados</h4>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li><strong>Essenciais:</strong> Necessários para o funcionamento básico do portal</li>
                    <li><strong>Funcionais:</strong> Lembram suas preferências e configurações</li>
                    <li><strong>Analíticos:</strong> Coletam informações sobre como você usa o portal</li>
                    <li><strong>Segurança:</strong> Ajudam a identificar atividades suspeitas</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">7.2. Gerenciamento de Cookies</h4>
                  <p className="text-sm">
                    Você pode controlar e excluir cookies através das configurações do seu navegador. 
                    No entanto, a desabilitação pode afetar a funcionalidade de alguns serviços.
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          <section className="scroll-mt-24">
            <Card>
              <CardHeader>
                <CardTitle>8. Alterações na Política</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm">
                  Esta Política de Privacidade pode ser atualizada periodicamente para refletir 
                  mudanças em nossas práticas ou na legislação aplicável.
                </p>
                <p className="text-sm">
                  Alterações significativas serão comunicadas através do portal e, quando 
                  necessário, solicitaremos seu consentimento renovado.
                </p>
              </CardContent>
            </Card>
          </section>

          <section className="scroll-mt-24">
            <Card className="bg-green-50 border-green-200">
              <CardHeader>
                <CardTitle className="text-green-900">9. Contato e Encarregado de Dados</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-green-900 mb-2">Encarregado de Proteção de Dados (DPO)</h4>
                  <p className="text-sm text-green-800 mb-3">
                    Nosso Encarregado de Proteção de Dados está disponível para esclarecer dúvidas 
                    sobre esta política e auxiliar no exercício dos seus direitos.
                  </p>
                </div>
                <div className="space-y-2 text-sm text-green-800">
                  <p><strong>Prefeitura Municipal de Timon - MA</strong></p>
                  <p>Encarregado de Proteção de Dados</p>
                  <p>Endereço: Praça São José, s/n - Centro, Timon/MA - CEP: 65630-000</p>
                  <p>E-mail: dpo@timon.ma.gov.br</p>
                  <p>Telefone: (99) 3212-1500</p>
                  <p>Portal: www.timon.ma.gov.br</p>
                </div>
                <div className="bg-green-100 border border-green-300 rounded-lg p-3 mt-4">
                  <p className="text-xs text-green-700">
                    <strong>Autoridade Nacional de Proteção de Dados (ANPD):</strong><br />
                    Caso suas solicitações não sejam atendidas adequadamente, você pode contatar 
                    a ANPD através do site www.gov.br/anpd ou pelo e-mail comunicacao@anpd.gov.br
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>

        <Separator className="my-12" />

        {/* Footer */}
        <div className="text-center text-sm text-gray-600">
          <p>
            <strong>Política de Privacidade - Portal Oficial da Prefeitura Municipal de Timon - MA</strong>
          </p>
          <p className="mt-2">
            Última atualização: {lastUpdated}
          </p>
          <p className="mt-4">
            Esta política está em conformidade com a Lei Geral de Proteção de Dados (LGPD), 
            Lei de Acesso à Informação (LAI) e demais normas aplicáveis.
          </p>
        </div>
      </div>
    </div>
  );
}