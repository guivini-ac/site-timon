import { useState, useMemo } from 'react';
import { 
  MessageSquare, 
  Download, 
  Eye,
  Filter,
  Calendar,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Search,
  ArrowLeft
} from 'lucide-react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Input } from '../../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Alert, AlertDescription } from '../../ui/alert';
import { EmptyState } from '../components/EmptyState';
import { useForms } from '../../FormsContext';
import { useAdmin } from '../AdminContext';

export function FormSubmissionsView() {
  const { forms, submissions, getSubmissionsByForm, updateSubmissionStatus, exportSubmissions } = useForms();
  const { setCurrentView } = useAdmin();
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const selectedForm = selectedFormId ? forms.find(f => f.id === selectedFormId) : null;
  const formSubmissions = selectedFormId ? getSubmissionsByForm(selectedFormId) : [];

  const filteredSubmissions = useMemo(() => {
    return formSubmissions.filter(submission => {
      const matchesSearch = searchTerm === '' || 
        submission.submitterName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        submission.submitterEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        Object.values(submission.data).some(value => 
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        );
      
      const matchesStatus = statusFilter === 'all' || submission.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [formSubmissions, searchTerm, statusFilter]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejected': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'reviewed': return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'approved': return 'Aprovada';
      case 'rejected': return 'Rejeitada';
      case 'reviewed': return 'Analisada';
      default: return 'Pendente';
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'approved': return 'default';
      case 'rejected': return 'destructive';
      case 'reviewed': return 'secondary';
      default: return 'outline';
    }
  };

  const formatFieldValue = (field: any, value: any) => {
    if (!value) return '-';
    
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    
    if (field?.type === 'checkbox') {
      return value ? 'Sim' : 'Não';
    }
    
    if (field?.type === 'select' || field?.type === 'radio') {
      const option = field.options?.find((opt: any) => opt.value === value);
      return option?.label || value;
    }
    
    return String(value);
  };

  if (forms.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Respostas de Formulários</h1>
          <p className="text-muted-foreground">
            Visualize e gerencie as respostas dos formulários
          </p>
        </div>

        <EmptyState
          title="Nenhum formulário encontrado"
          description="Crie formulários primeiro para começar a receber respostas."
          icon="FileText"
          actionLabel="Criar Formulário"
          onAction={() => setCurrentView('forms')}
        />
      </div>
    );
  }

  if (selectedForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedFormId(null)}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Respostas: {selectedForm.title}</h1>
            <p className="text-muted-foreground">
              {formSubmissions.length} submissões recebidas
            </p>
          </div>
          <Button
            onClick={() => exportSubmissions(selectedForm.id)}
            className="gap-2"
            disabled={formSubmissions.length === 0}
          >
            <Download className="h-4 w-4" />
            Exportar CSV
          </Button>
        </div>

        {formSubmissions.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <EmptyState
                title="Nenhuma resposta encontrada"
                description="Este formulário ainda não recebeu nenhuma submissão."
                icon="MessageSquare"
              />
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Filtros */}
            <div className="flex gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome, email ou conteúdo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="reviewed">Analisada</SelectItem>
                  <SelectItem value="approved">Aprovada</SelectItem>
                  <SelectItem value="rejected">Rejeitada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Tabela de Respostas */}
            <Card>
              <CardHeader>
                <CardTitle>Submissões ({filteredSubmissions.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {filteredSubmissions.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground">
                    Nenhuma submissão encontrada com os filtros aplicados.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredSubmissions.map((submission) => (
                      <Card key={submission.id} className="border-l-4 border-l-primary/20">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-2">
                                {getStatusIcon(submission.status)}
                                <Badge variant={getStatusVariant(submission.status)}>
                                  {getStatusLabel(submission.status)}
                                </Badge>
                              </div>
                              <span className="text-sm text-muted-foreground">
                                {submission.submittedAt.toLocaleString('pt-BR')}
                              </span>
                            </div>
                            <div className="flex gap-2">
                              <Select 
                                value={submission.status} 
                                onValueChange={(value: any) => updateSubmissionStatus(submission.id, value)}
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Pendente</SelectItem>
                                  <SelectItem value="reviewed">Analisada</SelectItem>
                                  <SelectItem value="approved">Aprovada</SelectItem>
                                  <SelectItem value="rejected">Rejeitada</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          {(submission.submitterName || submission.submitterEmail) && (
                            <div className="text-sm">
                              <strong>Enviado por:</strong> {submission.submitterName || 'Não informado'}
                              {submission.submitterEmail && (
                                <span className="text-muted-foreground ml-2">
                                  ({submission.submitterEmail})
                                </span>
                              )}
                            </div>
                          )}
                        </CardHeader>
                        <CardContent>
                          <div className="overflow-x-auto">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Campo</TableHead>
                                  <TableHead>Resposta</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {selectedForm.fields
                                  .filter(field => 
                                    field.type !== 'separator' && 
                                    field.type !== 'html' && 
                                    submission.data[field.id] !== undefined
                                  )
                                  .map((field) => (
                                    <TableRow key={field.id}>
                                      <TableCell className="font-medium w-1/3">
                                        {field.label}
                                        {field.required && (
                                          <span className="text-red-500 ml-1">*</span>
                                        )}
                                      </TableCell>
                                      <TableCell>
                                        {formatFieldValue(field, submission.data[field.id])}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                              </TableBody>
                            </Table>
                          </div>
                          {submission.notes && (
                            <Alert className="mt-4">
                              <AlertCircle className="h-4 w-4" />
                              <AlertDescription>
                                <strong>Observações:</strong> {submission.notes}
                              </AlertDescription>
                            </Alert>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Respostas de Formulários</h1>
        <p className="text-muted-foreground">
          Selecione um formulário para visualizar suas respostas
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {forms.map((form) => {
          const formSubmissions = getSubmissionsByForm(form.id);
          const pendingCount = formSubmissions.filter(s => s.status === 'pending').length;
          const reviewedCount = formSubmissions.filter(s => s.status === 'reviewed').length;
          const approvedCount = formSubmissions.filter(s => s.status === 'approved').length;
          const rejectedCount = formSubmissions.filter(s => s.status === 'rejected').length;

          return (
            <Card key={form.id} className="cursor-pointer hover:shadow-md transition-shadow flex flex-col h-full">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="line-clamp-2">{form.title}</CardTitle>
                    <CardDescription className="line-clamp-2 mt-1">
                      {form.description}
                    </CardDescription>
                  </div>
                  <Badge variant={form.isActive ? 'default' : 'secondary'}>
                    {form.isActive ? 'Ativo' : 'Inativo'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col h-full">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MessageSquare className="h-4 w-4" />
                      <span>Total de respostas</span>
                    </div>
                    <span className="font-bold text-2xl">{formSubmissions.length}</span>
                  </div>

                  {formSubmissions.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Status das respostas:</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-gray-600" />
                          <span>Pendente: {pendingCount}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <AlertCircle className="h-3 w-3 text-yellow-600" />
                          <span>Analisada: {reviewedCount}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CheckCircle className="h-3 w-3 text-green-600" />
                          <span>Aprovada: {approvedCount}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <XCircle className="h-3 w-3 text-red-600" />
                          <span>Rejeitada: {rejectedCount}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-4 mt-auto">
                  <Button 
                    size="sm" 
                    className="flex-1 gap-2"
                    onClick={() => setSelectedFormId(form.id)}
                  >
                    <Eye className="h-4 w-4" />
                    Ver Respostas
                  </Button>
                  {formSubmissions.length > 0 && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => exportSubmissions(form.id)}
                      className="gap-2"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}