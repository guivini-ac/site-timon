import { useState, useEffect } from 'react';
import { useForms, type Form } from '../../FormsContext';
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  Copy,
  ExternalLink,
  BarChart3,
  Users,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  Download
} from 'lucide-react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Badge } from '../../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
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
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../../ui/select';
import { useAdmin } from '../AdminContext';
import { FormBuilderView } from './FormBuilderView';
import { Checkbox } from '../../ui/checkbox';
import { BulkActions, useBulkSelection, type BulkAction } from '../components/BulkActions';

export function FormsView() {
  const { setBreadcrumbs, addNotification } = useAdmin();
  const {
    forms,
    submissions,
    deleteForm,
    toggleFormStatus,
    toggleFormVisibility,
    duplicateForm,
    getActiveForms,
    getTotalForms,
    getTotalSubmissions,
    getSubmissionsByForm,
    exportSubmissions
  } = useForms();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedForm, setSelectedForm] = useState<string | null>(null);
  const [showBuilder, setShowBuilder] = useState(false);

  useEffect(() => {
    setBreadcrumbs([{ label: 'Formulários' }]);
  }, [setBreadcrumbs]);

  const filteredForms = forms.filter(form => {
    const matchesSearch = form.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         form.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         form.slug.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && form.isActive) ||
      (statusFilter === 'inactive' && !form.isActive) ||
      (statusFilter === 'public' && form.isPublic) ||
      (statusFilter === 'private' && !form.isPublic);
    return matchesSearch && matchesStatus;
  });

  // Bulk actions
  const bulkSelection = useBulkSelection(filteredForms);

  const handleDeleteForm = (formId: string) => {
    const form = forms.find(f => f.id === formId);
    if (form && confirm(`Tem certeza que deseja excluir o formulário "${form.title}"? Esta ação não pode ser desfeita.`)) {
      deleteForm(formId);
      addNotification({
        type: 'success',
        title: 'Formulário excluído',
        message: 'O formulário foi excluído com sucesso.'
      });
    }
  };

  const handleToggleStatus = (formId: string) => {
    const form = forms.find(f => f.id === formId);
    toggleFormStatus(formId);
    addNotification({
      type: 'success',
      title: `Formulário ${form?.isActive ? 'desativado' : 'ativado'}`,
      message: `O formulário foi ${form?.isActive ? 'desativado' : 'ativado'} com sucesso.`
    });
  };

  const handleToggleVisibility = (formId: string) => {
    const form = forms.find(f => f.id === formId);
    toggleFormVisibility(formId);
    addNotification({
      type: 'success',
      title: `Formulário tornado ${form?.isPublic ? 'privado' : 'público'}`,
      message: `A visibilidade do formulário foi alterada com sucesso.`
    });
  };

  const handleDuplicate = (formId: string) => {
    duplicateForm(formId);
    addNotification({
      type: 'success',
      title: 'Formulário duplicado',
      message: 'O formulário foi duplicado com sucesso. Edite-o conforme necessário.'
    });
  };

  const handleExport = (formId: string) => {
    exportSubmissions(formId);
    addNotification({
      type: 'success',
      title: 'Exportação iniciada',
      message: 'O arquivo CSV será baixado em breve.'
    });
  };

  // Bulk actions handlers
  const handleBulkAction = (actionId: string, selectedIds: string[]) => {
    switch (actionId) {
      case 'delete':
        if (confirm(`Tem certeza que deseja excluir ${selectedIds.length} formulário${selectedIds.length !== 1 ? 's' : ''}? Esta ação não pode ser desfeita.`)) {
          selectedIds.forEach(id => deleteForm(id));
          bulkSelection.clearSelection();
          addNotification({
            type: 'success',
            title: `${selectedIds.length} formulário${selectedIds.length !== 1 ? 's' : ''} excluído${selectedIds.length !== 1 ? 's' : ''}`,
            message: 'Os formulários selecionados foram excluídos com sucesso.'
          });
        }
        break;
        
      case 'activate':
        selectedIds.forEach(id => {
          const form = forms.find(f => f.id === id);
          if (form && !form.isActive) {
            toggleFormStatus(id);
          }
        });
        bulkSelection.clearSelection();
        addNotification({
          type: 'success',
          title: `${selectedIds.length} formulário${selectedIds.length !== 1 ? 's' : ''} ativado${selectedIds.length !== 1 ? 's' : ''}`,
          message: 'Os formulários selecionados foram ativados com sucesso.'
        });
        break;
        
      case 'deactivate':
        selectedIds.forEach(id => {
          const form = forms.find(f => f.id === id);
          if (form && form.isActive) {
            toggleFormStatus(id);
          }
        });
        bulkSelection.clearSelection();
        addNotification({
          type: 'success',
          title: `${selectedIds.length} formulário${selectedIds.length !== 1 ? 's' : ''} desativado${selectedIds.length !== 1 ? 's' : ''}`,
          message: 'Os formulários selecionados foram desativados com sucesso.'
        });
        break;
        
      case 'public':
        selectedIds.forEach(id => {
          const form = forms.find(f => f.id === id);
          if (form && !form.isPublic) {
            toggleFormVisibility(id);
          }
        });
        bulkSelection.clearSelection();
        addNotification({
          type: 'success',
          title: `${selectedIds.length} formulário${selectedIds.length !== 1 ? 's' : ''} tornado${selectedIds.length !== 1 ? 's' : ''} público${selectedIds.length !== 1 ? 's' : ''}`,
          message: 'Os formulários selecionados foram tornados públicos com sucesso.'
        });
        break;
        
      case 'private':
        selectedIds.forEach(id => {
          const form = forms.find(f => f.id === id);
          if (form && form.isPublic) {
            toggleFormVisibility(id);
          }
        });
        bulkSelection.clearSelection();
        addNotification({
          type: 'success',
          title: `${selectedIds.length} formulário${selectedIds.length !== 1 ? 's' : ''} tornado${selectedIds.length !== 1 ? 's' : ''} privado${selectedIds.length !== 1 ? 's' : ''}`,
          message: 'Os formulários selecionados foram tornados privados com sucesso.'
        });
        break;
    }
  };

  const bulkActions: BulkAction[] = [
    {
      id: 'activate',
      label: 'Ativar',
      icon: Eye,
      variant: 'outline'
    },
    {
      id: 'deactivate',
      label: 'Desativar',
      icon: EyeOff,
      variant: 'outline'
    },
    {
      id: 'public',
      label: 'Tornar Público',
      icon: ExternalLink,
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
      confirmationTitle: 'Excluir formulários selecionados',
      confirmationDescription: 'Esta ação não pode ser desfeita. Os formulários selecionados e todas as submissões associadas serão permanentemente removidos.'
    }
  ];

  const getFormStatusBadge = (form: Form) => {
    if (!form.isActive) {
      return <Badge variant="outline" className="text-gray-600">Inativo</Badge>;
    }
    if (!form.isPublic) {
      return <Badge variant="outline" className="text-orange-600">Privado</Badge>;
    }
    return <Badge variant="outline" className="text-green-600">Público</Badge>;
  };

  const getSubmissionStats = (formId: string) => {
    const formSubmissions = getSubmissionsByForm(formId);
    const pending = formSubmissions.filter(s => s.status === 'pending').length;
    const reviewed = formSubmissions.filter(s => s.status === 'reviewed').length;
    const approved = formSubmissions.filter(s => s.status === 'approved').length;
    
    return { total: formSubmissions.length, pending, reviewed, approved };
  };

  if (showBuilder) {
    return (
      <FormBuilderView
        formId={selectedForm || undefined}
        onBack={() => {
          setShowBuilder(false);
          setSelectedForm(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Formulários</h1>
          <p className="text-muted-foreground">
            Crie e gerencie formulários que geram páginas automaticamente no site
          </p>
        </div>
        <Button onClick={() => setShowBuilder(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Formulário
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Formulários</p>
                <p className="text-2xl font-bold">{getTotalForms()}</p>
              </div>
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Formulários Ativos</p>
                <p className="text-2xl font-bold text-green-600">
                  {getActiveForms().length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Submissões</p>
                <p className="text-2xl font-bold text-blue-600">
                  {getTotalSubmissions()}
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pendentes</p>
                <p className="text-2xl font-bold text-orange-600">
                  {submissions.filter(s => s.status === 'pending').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Forms Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[16px]">
            <FileText className="h-4 w-4" />
            Formulários ({filteredForms.length})
          </CardTitle>
          <div className="mt-4 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar formulários..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <FileText className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="active">Ativos</SelectItem>
                  <SelectItem value="inactive">Inativos</SelectItem>
                  <SelectItem value="public">Públicos</SelectItem>
                  <SelectItem value="private">Privados</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Bulk Actions */}
          {filteredForms.length > 0 && (
            <div className="mb-4">
              <BulkActions
                selectedIds={bulkSelection.selectedIds}
                totalItems={filteredForms.length}
                onSelectAll={bulkSelection.selectAll}
                onClearSelection={bulkSelection.clearSelection}
                actions={bulkActions}
                onAction={handleBulkAction}
                itemName="formulário"
              />
            </div>
          )}

          {filteredForms.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                {searchTerm || statusFilter !== 'all'
                  ? 'Nenhum formulário encontrado com os filtros aplicados'
                  : 'Nenhum formulário criado ainda'
                }
              </p>
              {(!searchTerm && statusFilter === 'all') && (
                <Button onClick={() => setShowBuilder(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeiro Formulário
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={bulkSelection.selectedIds.length === filteredForms.length && filteredForms.length > 0}
                      onCheckedChange={bulkSelection.selectAll}
                      className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                  </TableHead>
                  <TableHead>Formulário</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submissões</TableHead>
                  <TableHead>Última Atualização</TableHead>
                  <TableHead className="text-left">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredForms.map((form) => {
                  const stats = getSubmissionStats(form.id);
                  
                  return (
                    <TableRow key={form.id}>
                      <TableCell>
                        <Checkbox
                          checked={bulkSelection.isSelected(form.id)}
                          onCheckedChange={() => bulkSelection.selectItem(form.id)}
                          className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{form.title}</div>
                          <div className="text-sm text-muted-foreground line-clamp-1">
                            {form.description}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            /formulario/{form.slug}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {getFormStatusBadge(form)}
                          <div className="text-xs text-muted-foreground">
                            {form.fields.length} campo(s)
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{stats.total}</span>
                            <span className="text-muted-foreground">total</span>
                          </div>
                          {stats.pending > 0 && (
                            <div className="flex items-center gap-1 text-xs">
                              <Clock className="h-3 w-3 text-orange-600" />
                              <span className="text-orange-600">{stats.pending} pendente(s)</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {form.updatedAt.toLocaleDateString('pt-BR')}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {form.updatedAt.toLocaleTimeString('pt-BR', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                      </TableCell>
                      <TableCell className="text-left">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem 
                              onClick={() => {
                                setSelectedForm(form.id);
                                setShowBuilder(true);
                              }}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => window.open(`/formulario/${form.slug}`, '_blank')}
                              disabled={!form.isActive || !form.isPublic}
                            >
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Visualizar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDuplicate(form.id)}>
                              <Copy className="h-4 w-4 mr-2" />
                              Duplicar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleToggleStatus(form.id)}>
                              {form.isActive ? (
                                <><EyeOff className="h-4 w-4 mr-2" />Desativar</>
                              ) : (
                                <><Eye className="h-4 w-4 mr-2" />Ativar</>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleToggleVisibility(form.id)}>
                              {form.isPublic ? (
                                <><EyeOff className="h-4 w-4 mr-2" />Tornar Privado</>
                              ) : (
                                <><Eye className="h-4 w-4 mr-2" />Tornar Público</>
                              )}
                            </DropdownMenuItem>
                            {stats.total > 0 && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleExport(form.id)}>
                                  <Download className="h-4 w-4 mr-2" />
                                  Exportar Dados
                                </DropdownMenuItem>
                              </>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDeleteForm(form.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Formulários Mais Populares</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {forms
                .sort((a, b) => b.submissionCount - a.submissionCount)
                .slice(0, 5)
                .map((form) => (
                  <div key={form.id} className="flex items-center justify-between">
                    <div className="flex-1 truncate">
                      <p className="text-sm font-medium truncate">{form.title}</p>
                      <p className="text-xs text-muted-foreground">{form.slug}</p>
                    </div>
                    <Badge variant="outline">{form.submissionCount}</Badge>
                  </div>
                ))}
              {forms.length === 0 && (
                <p className="text-sm text-muted-foreground">Nenhum formulário criado</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Atividade Recente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {submissions
                .sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime())
                .slice(0, 5)
                .map((submission) => {
                  const form = forms.find(f => f.id === submission.formId);
                  return (
                    <div key={submission.id} className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        {submission.status === 'pending' && <Clock className="h-4 w-4 text-orange-600" />}
                        {submission.status === 'reviewed' && <Eye className="h-4 w-4 text-blue-600" />}
                        {submission.status === 'approved' && <CheckCircle className="h-4 w-4 text-green-600" />}
                        {submission.status === 'rejected' && <AlertCircle className="h-4 w-4 text-red-600" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {form?.title || 'Formulário removido'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {submission.submittedAt.toLocaleString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  );
                })}
              {submissions.length === 0 && (
                <p className="text-sm text-muted-foreground">Nenhuma submissão ainda</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Status das Submissões</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-orange-600" />
                  <span className="text-sm">Pendentes</span>
                </div>
                <Badge variant="outline" className="text-orange-600">
                  {submissions.filter(s => s.status === 'pending').length}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Em Revisão</span>
                </div>
                <Badge variant="outline" className="text-blue-600">
                  {submissions.filter(s => s.status === 'reviewed').length}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Aprovadas</span>
                </div>
                <Badge variant="outline" className="text-green-600">
                  {submissions.filter(s => s.status === 'approved').length}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <span className="text-sm">Rejeitadas</span>
                </div>
                <Badge variant="outline" className="text-red-600">
                  {submissions.filter(s => s.status === 'rejected').length}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}