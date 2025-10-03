import { ArrowLeft, Scale, Shield, Users, Globe, FileText, AlertTriangle, Calendar } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Alert, AlertDescription } from './ui/alert';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import Breadcrumb from './Breadcrumb';

interface TermsOfUsePageProps {
  onNavigateBack: () => void;
}

export default function TermsOfUsePage({ onNavigateBack }: TermsOfUsePageProps) {
  const { elementRef: contentRef, isVisible: isContentVisible } = useScrollAnimation();
  const lastUpdated = "15 de setembro de 2025";

  const breadcrumbItems = [
    {
      label: 'Início',
      onClick: onNavigateBack
    },
    {
      label: 'Termos de Uso'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <Breadcrumb items={breadcrumbItems} />

      {/* Title Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center mb-4">
          <Scale className="h-8 w-8 text-[#144c9c] mr-4" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Termos de Uso</h1>
            <p className="text-gray-600 mt-1">Leia atentamente os termos e condições para uso do portal oficial</p>
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
        <Alert className="mb-8 border-blue-200 bg-blue-50">
          <AlertTriangle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>Importante:</strong> Ao acessar e utilizar este portal, você concorda com os termos e condições aqui estabelecidos. 
            Leia atentamente antes de prosseguir.
          </AlertDescription>
        </Alert>

        {/* Quick Navigation */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              Navegação Rápida
            </CardTitle>
            <CardDescription>
              Clique nos tópicos abaixo para ir diretamente à seção desejada
            </CardDescription>
          </CardHeader>
          <CardContent>
            <nav className="grid grid-cols-1 md:grid-cols-2 gap-3" aria-label="Navegação pelos termos de uso">
              {[
                { id: 'acceptance', title: 'Aceitação dos Termos', icon: Shield },
                { id: 'purpose', title: 'Finalidade do Portal', icon: Globe },
                { id: 'user-obligations', title: 'Obrigações do Usuário', icon: Users },
                { id: 'intellectual-property', title: 'Propriedade Intelectual', icon: Scale },
                { id: 'privacy', title: 'Proteção de Dados', icon: Shield },
                { id: 'limitations', title: 'Limitações de Responsabilidade', icon: AlertTriangle }
              ].map(({ id, title, icon: Icon }) => (
                <Button
                  key={id}
                  variant="ghost"
                  className="justify-start h-auto p-3 text-left hover:bg-blue-50 focus:ring-2 focus:ring-blue-500"
                  onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <Icon className="h-4 w-4 mr-3 text-blue-600 flex-shrink-0" />
                  <span className="text-sm">{title}</span>
                </Button>
              ))}
            </nav>
          </CardContent>
        </Card>

        {/* Terms Content */}
        <div className="space-y-8">
          {/* Section 1: Acceptance */}
          <section id="acceptance" className="scroll-mt-24">
            <Card className="border-l-4 border-l-blue-600">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  1. Aceitação dos Termos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Ao acessar e utilizar o Portal Oficial da Prefeitura Municipal de Timon - MA 
                  (<strong>timon.ma.gov.br</strong>), o usuário declara ter lido, compreendido e 
                  concordado integralmente com estes Termos de Uso.
                </p>
                <p>
                  Estes termos constituem um acordo legal entre você (usuário) e a Prefeitura 
                  Municipal de Timon, estabelecendo as condições para o uso deste portal.
                </p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Atenção:</strong> Caso não concorde com qualquer disposição destes termos, 
                    você deve interromper imediatamente o uso do portal.
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Section 2: Purpose */}
          <section id="purpose" className="scroll-mt-24">
            <Card className="border-l-4 border-l-green-600">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-green-600" />
                  2. Finalidade do Portal
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Este portal tem como finalidades principais:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Fornecer informações oficiais sobre a administração municipal</li>
                  <li>Disponibilizar serviços públicos digitais aos cidadãos</li>
                  <li>Promover a transparência e o acesso à informação pública</li>
                  <li>Facilitar a comunicação entre o poder público e a sociedade</li>
                  <li>Divulgar notícias, eventos e ações governamentais</li>
                </ul>
                <p>
                  O portal é mantido pela Prefeitura Municipal de Timon e suas informações são 
                  de responsabilidade dos órgãos e secretarias municipais.
                </p>
              </CardContent>
            </Card>
          </section>

          {/* Section 3: User Obligations */}
          <section id="user-obligations" className="scroll-mt-24">
            <Card className="border-l-4 border-l-blue-600">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  3. Obrigações do Usuário
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>Ao utilizar este portal, o usuário se compromete a:</p>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">3.1. Uso Adequado</h4>
                    <ul className="list-disc pl-6 space-y-1 text-sm">
                      <li>Utilizar o portal apenas para fins legítimos e legais</li>
                      <li>Não interferir no funcionamento do sistema</li>
                      <li>Não tentar acessar áreas restritas sem autorização</li>
                      <li>Respeitar os direitos de propriedade intelectual</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">3.2. Informações Pessoais</h4>
                    <ul className="list-disc pl-6 space-y-1 text-sm">
                      <li>Fornecer informações verdadeiras e atualizadas quando necessário</li>
                      <li>Manter a confidencialidade de senhas e dados de acesso</li>
                      <li>Notificar imediatamente sobre uso não autorizado de conta</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">3.3. Condutas Proibidas</h4>
                    <ul className="list-disc pl-6 space-y-1 text-sm">
                      <li>Enviar conteúdo ofensivo, difamatório ou ilegal</li>
                      <li>Realizar ataques ou tentativas de invasão ao sistema</li>
                      <li>Distribuir vírus, malware ou códigos maliciosos</li>
                      <li>Utilizar o portal para atividades comerciais não autorizadas</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Section 4: Intellectual Property */}
          <section id="intellectual-property" className="scroll-mt-24">
            <Card className="border-l-4 border-l-purple-600">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="h-5 w-5 text-purple-600" />
                  4. Propriedade Intelectual
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">4.1. Conteúdo Oficial</h4>
                  <p className="text-sm">
                    Todo o conteúdo oficial deste portal, incluindo textos, imagens, logotipos, 
                    vídeos e documentos, é de propriedade da Prefeitura Municipal de Timon ou 
                    está devidamente licenciado para uso.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">4.2. Uso Permitido</h4>
                  <p className="text-sm">
                    É permitida a reprodução de conteúdo para fins educacionais, informativos 
                    ou jornalísticos, desde que citada a fonte e respeitados os direitos autorais.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">4.3. Símbolos Oficiais</h4>
                  <p className="text-sm">
                    O uso dos símbolos oficiais do município (brasão, bandeira, hino) está 
                    sujeito às disposições da Lei Orgânica Municipal e legislação específica.
                  </p>
                </div>

                <Alert className="border-purple-200 bg-purple-50">
                  <AlertDescription className="text-purple-800 text-sm">
                    <strong>Importante:</strong> O uso comercial não autorizado de qualquer 
                    conteúdo ou símbolo oficial pode constituir violação de direitos autorais 
                    e estar sujeito às penalidades legais.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </section>

          {/* Section 5: Privacy */}
          <section id="privacy" className="scroll-mt-24">
            <Card className="border-l-4 border-l-green-600">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  5. Proteção de Dados e Privacidade
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">5.1. Conformidade Legal</h4>
                  <p className="text-sm">
                    O tratamento de dados pessoais neste portal segue as disposições da 
                    Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018) e da 
                    Lei de Acesso à Informação (LAI - Lei nº 12.527/2011).
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">5.2. Coleta de Dados</h4>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>Dados são coletados apenas quando necessário para prestação de serviços</li>
                    <li>O usuário será informado sobre a finalidade da coleta</li>
                    <li>Cookies são utilizados para melhorar a experiência de navegação</li>
                    <li>Logs de acesso são mantidos para fins de segurança e auditoria</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">5.3. Direitos do Titular</h4>
                  <p className="text-sm">
                    Os usuários têm direito de acessar, corrigir, excluir ou portar seus dados 
                    pessoais, conforme previsto na LGPD. Para exercer esses direitos, entre em 
                    contato através dos canais oficiais da prefeitura.
                  </p>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-green-800">
                    <strong>Política de Privacidade:</strong> Para informações detalhadas sobre 
                    como tratamos seus dados, consulte nossa Política de Privacidade específica.
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Section 6: Limitations */}
          <section id="limitations" className="scroll-mt-24">
            <Card className="border-l-4 border-l-red-600">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  6. Limitações de Responsabilidade
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">6.1. Disponibilidade do Serviço</h4>
                  <p className="text-sm">
                    A Prefeitura Municipal de Timon se esforça para manter o portal disponível 
                    24 horas por dia, mas não pode garantir funcionamento ininterrupto devido a:
                  </p>
                  <ul className="list-disc pl-6 space-y-1 text-sm mt-2">
                    <li>Manutenções programadas</li>
                    <li>Falhas técnicas imprevistas</li>
                    <li>Problemas de conectividade</li>
                    <li>Casos fortuitos ou de força maior</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">6.2. Informações de Terceiros</h4>
                  <p className="text-sm">
                    O portal pode conter links para sites externos. A prefeitura não se 
                    responsabiliza pelo conteúdo, práticas de privacidade ou políticas 
                    desses sites de terceiros.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">6.3. Atualização de Informações</h4>
                  <p className="text-sm">
                    Embora nos esforcemos para manter as informações atualizadas e precisas, 
                    não podemos garantir a exatidão, completude ou atualidade de todo o conteúdo.
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Additional Sections */}
          <section className="scroll-mt-24">
            <Card>
              <CardHeader>
                <CardTitle>7. Modificações dos Termos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm">
                  A Prefeitura Municipal de Timon se reserva o direito de modificar estes 
                  Termos de Uso a qualquer momento. As alterações entrarão em vigor 
                  imediatamente após sua publicação no portal.
                </p>
                <p className="text-sm">
                  É responsabilidade do usuário verificar periodicamente eventuais atualizações. 
                  O uso continuado do portal após as modificações constitui aceitação dos novos termos.
                </p>
              </CardContent>
            </Card>
          </section>

          <section className="scroll-mt-24">
            <Card>
              <CardHeader>
                <CardTitle>8. Lei Aplicável e Foro</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm">
                  Estes Termos de Uso são regidos pelas leis da República Federativa do Brasil. 
                  Qualquer controvérsia será resolvida no foro da Comarca de Timon - MA.
                </p>
              </CardContent>
            </Card>
          </section>

          <section className="scroll-mt-24">
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-900">9. Contato</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-blue-800">
                  Para dúvidas, sugestões ou exercício de direitos relacionados a estes 
                  Termos de Uso, entre em contato:
                </p>
                <div className="space-y-2 text-sm text-blue-800">
                  <p><strong>Prefeitura Municipal de Timon</strong></p>
                  <p>Endereço: [Endereço da Prefeitura]</p>
                  <p>Telefone: [Telefone de contato]</p>
                  <p>E-mail: contato@timon.ma.gov.br</p>
                  <p>Portal: www.timon.ma.gov.br</p>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>

        <Separator className="my-12" />

        {/* Footer */}
        <div className="text-center text-sm text-gray-600">
          <p>
            <strong>Termos de Uso - Portal Oficial da Prefeitura Municipal de Timon - MA</strong>
          </p>
          <p className="mt-2">
            Última atualização: {lastUpdated}
          </p>
          <p className="mt-4">
            Este documento está em conformidade com a legislação brasileira vigente, 
            incluindo a Lei de Acesso à Informação e a Lei Geral de Proteção de Dados.
          </p>
        </div>
      </div>
    </div>
  );
}