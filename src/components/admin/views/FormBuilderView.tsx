import { useState, useEffect } from 'react';
import { useForms, type Form, type FormField, type FieldType, type FormFormData } from '../../FormsContext';
import { 
  Plus, 
  Save, 
  X, 
  Eye, 
  Settings, 
  Palette, 
  GripVertical,
  Trash2,
  Copy,
  Edit,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  Type,
  Mail,
  Phone,
  Hash,
  AlignLeft,
  ChevronDown,
  Circle,
  Square,
  Calendar,
  Upload,
  User,
  Minus,
  Code,
  AlertTriangle
} from 'lucide-react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Label } from '../../ui/label';
import { Switch } from '../../ui/switch';
import { Badge } from '../../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription
} from '../../ui/dialog';
import { useAdmin } from '../AdminContext';
// Note: react-beautiful-dnd would be imported here in a real implementation
// For now, we'll implement a simple drag and drop simulation

// Mapeamento de ícones para tipos de campo
const fieldTypeIcons = {
  'text': Type,
  'email': Mail,
  'phone': Phone,
  'number': Hash,
  'textarea': AlignLeft,
  'select': ChevronDown,
  'radio': Circle,
  'checkbox': Square,
  'date': Calendar,
  'file': Upload,
  'cpf': User,
  'separator': Minus,
  'html': Code
};

interface FormBuilderViewProps {
  formId?: string;
  onBack: () => void;
}

export function FormBuilderView({ formId, onBack }: FormBuilderViewProps) {
  const { setBreadcrumbs, addNotification } = useAdmin();
  const { 
    getFormById, 
    addForm, 
    updateForm, 
    getFieldTypes,
    validateField 
  } = useForms();

  const [form, setForm] = useState<Form | null>(null);
  const [formData, setFormData] = useState<FormFormData>({
    title: '',
    description: '',
    slug: '',
    fields: [],
    settings: {
      submitButtonText: 'Enviar',
      successMessage: 'Formulário enviado com sucesso!',
      allowMultipleSubmissions: false,
      captchaEnabled: true,
      emailNotification: {
        enabled: false,
        recipients: [],
        subject: ''
      }
    },
    design: {
      layout: 'single-column',
      theme: 'default',
      backgroundColor: '#ffffff',
      textColor: '#333333',
      primaryColor: '#144c9c'
    },
    isActive: true,
    isPublic: true
  });
  
  const [selectedField, setSelectedField] = useState<FormField | null>(null);
  const [isFieldModalOpen, setIsFieldModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('form');
  const [previewMode, setPreviewMode] = useState(false);

  const fieldTypes = getFieldTypes();
  const isEditing = !!formId;

  useEffect(() => {
    if (isEditing && formId) {
      const existingForm = getFormById(formId);
      if (existingForm) {
        setForm(existingForm);
        setFormData({
          title: existingForm.title,
          description: existingForm.description,
          slug: existingForm.slug,
          fields: existingForm.fields,
          settings: existingForm.settings,
          design: existingForm.design,
          isActive: existingForm.isActive,
          isPublic: existingForm.isPublic
        });
      }
      setBreadcrumbs([
        { label: 'Formulários', href: '/admin/forms' },
        { label: 'Editar Formulário' }
      ]);
    } else {
      setBreadcrumbs([
        { label: 'Formulários', href: '/admin/forms' },
        { label: 'Novo Formulário' }
      ]);
    }
  }, [formId, isEditing, getFormById, setBreadcrumbs]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title)
    }));
  };

  const handleAddField = (type: FieldType) => {
    const newField: FormField = {
      id: `field-${Date.now()}`,
      type,
      label: type === 'separator' ? '' : type === 'html' ? 'Conteúdo HTML' : 'Nova Pergunta',
      required: type !== 'separator' && type !== 'html',
      order: formData.fields.length + 1,
      ...(type === 'html' && { content: '<p>Escreva seu conteúdo HTML aqui...</p>' }),
      ...((['select', 'radio', 'checkbox'].includes(type)) && {
        options: [
          { id: `opt-${Date.now()}-1`, label: 'Opção 1', value: 'opcao1' },
          { id: `opt-${Date.now()}-2`, label: 'Opção 2', value: 'opcao2' }
        ]
      })
    };

    setFormData(prev => ({
      ...prev,
      fields: [...prev.fields, newField]
    }));
    
    setSelectedField(newField);
    setIsFieldModalOpen(true);
  };

  const handleEditField = (field: FormField) => {
    setSelectedField(field);
    setIsFieldModalOpen(true);
  };

  const handleSaveField = (updatedField: FormField) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.map(field => 
        field.id === updatedField.id ? updatedField : field
      )
    }));
    setIsFieldModalOpen(false);
    setSelectedField(null);
  };

  const handleDeleteField = (fieldId: string) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.filter(field => field.id !== fieldId)
    }));
  };

  const handleDuplicateField = (field: FormField) => {
    const duplicatedField: FormField = {
      ...field,
      id: `field-${Date.now()}`,
      label: `${field.label} (Cópia)`,
      order: field.order + 1
    };

    setFormData(prev => ({
      ...prev,
      fields: [...prev.fields, duplicatedField].map((f, index) => ({
        ...f,
        order: index + 1
      }))
    }));
  };

  const moveFieldUp = (fieldId: string) => {
    const fieldIndex = formData.fields.findIndex(f => f.id === fieldId);
    if (fieldIndex > 0) {
      const fields = [...formData.fields];
      [fields[fieldIndex], fields[fieldIndex - 1]] = [fields[fieldIndex - 1], fields[fieldIndex]];
      
      const reorderedFields = fields.map((field, index) => ({
        ...field,
        order: index + 1
      }));

      setFormData(prev => ({
        ...prev,
        fields: reorderedFields
      }));
    }
  };

  const moveFieldDown = (fieldId: string) => {
    const fieldIndex = formData.fields.findIndex(f => f.id === fieldId);
    if (fieldIndex < formData.fields.length - 1) {
      const fields = [...formData.fields];
      [fields[fieldIndex], fields[fieldIndex + 1]] = [fields[fieldIndex + 1], fields[fieldIndex]];
      
      const reorderedFields = fields.map((field, index) => ({
        ...field,
        order: index + 1
      }));

      setFormData(prev => ({
        ...prev,
        fields: reorderedFields
      }));
    }
  };

  const handleSaveForm = () => {
    if (!formData.title || !formData.description) {
      addNotification({
        type: 'error',
        title: 'Campos obrigatórios',
        message: 'Título e descrição são obrigatórios.'
      });
      return;
    }

    if (formData.fields.length === 0) {
      addNotification({
        type: 'error',
        title: 'Campos necessários',
        message: 'Adicione pelo menos um campo ao formulário.'
      });
      return;
    }

    if (isEditing && formId) {
      updateForm(formId, formData);
      addNotification({
        type: 'success',
        title: 'Formulário atualizado',
        message: 'As alterações foram salvas com sucesso.'
      });
    } else {
      addForm(formData);
      addNotification({
        type: 'success',
        title: 'Formulário criado',
        message: 'O formulário foi criado e uma nova página foi gerada automaticamente.'
      });
    }
    
    onBack();
  };

  const FieldEditor = ({ field, onSave, onCancel }: {
    field: FormField;
    onSave: (field: FormField) => void;
    onCancel: () => void;
  }) => {
    const [editingField, setEditingField] = useState<FormField>({ ...field });

    const handleAddOption = () => {
      const newOption = {
        id: `opt-${Date.now()}`,
        label: `Opção ${(editingField.options?.length || 0) + 1}`,
        value: `opcao${(editingField.options?.length || 0) + 1}`
      };
      
      setEditingField(prev => ({
        ...prev,
        options: [...(prev.options || []), newOption]
      }));
    };

    const handleUpdateOption = (optionId: string, updates: { label?: string; value?: string }) => {
      setEditingField(prev => ({
        ...prev,
        options: prev.options?.map(opt => 
          opt.id === optionId ? { ...opt, ...updates } : opt
        )
      }));
    };

    const handleRemoveOption = (optionId: string) => {
      setEditingField(prev => ({
        ...prev,
        options: prev.options?.filter(opt => opt.id !== optionId)
      }));
    };

    return (
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tipo de Campo</Label>
              <Badge variant="outline" className="w-fit">
                {fieldTypes.find(t => t.value === field.type)?.label}
              </Badge>
            </div>
            <div className="space-y-2">
              <Label>Campo Obrigatório</Label>
              <Switch
                checked={editingField.required}
                onCheckedChange={(checked) => setEditingField(prev => ({ ...prev, required: checked }))}
                disabled={field.type === 'separator' || field.type === 'html'}
              />
            </div>
          </div>

          {field.type !== 'separator' && field.type !== 'html' && (
            <>
              <div className="space-y-2">
                <Label>Rótulo/Pergunta *</Label>
                <Input
                  value={editingField.label}
                  onChange={(e) => setEditingField(prev => ({ ...prev, label: e.target.value }))}
                  placeholder="Digite a pergunta ou rótulo do campo"
                />
              </div>

              <div className="space-y-2">
                <Label>Placeholder</Label>
                <Input
                  value={editingField.placeholder || ''}
                  onChange={(e) => setEditingField(prev => ({ ...prev, placeholder: e.target.value }))}
                  placeholder="Texto de exemplo para o campo"
                />
              </div>

              <div className="space-y-2">
                <Label>Descrição/Ajuda</Label>
                <Textarea
                  value={editingField.description || ''}
                  onChange={(e) => setEditingField(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Texto explicativo para ajudar o usuário"
                  rows={2}
                />
              </div>
            </>
          )}

          {field.type === 'html' && (
            <div className="space-y-2">
              <Label>Conteúdo HTML</Label>
              <Textarea
                value={editingField.content || ''}
                onChange={(e) => setEditingField(prev => ({ ...prev, content: e.target.value }))}
                placeholder="<p>Escreva seu conteúdo HTML aqui...</p>"
                rows={6}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Use HTML para adicionar texto formatado, links, listas, etc.
              </p>
            </div>
          )}

          {(['select', 'radio', 'checkbox'].includes(field.type)) && (
            <div className="space-y-2">
              <Label>Opções</Label>
              <div className="space-y-2">
                {editingField.options?.map((option, index) => (
                  <div key={option.id} className="flex gap-2">
                    <Input
                      placeholder="Rótulo da opção"
                      value={option.label}
                      onChange={(e) => handleUpdateOption(option.id, { label: e.target.value })}
                    />
                    <Input
                      placeholder="Valor"
                      value={option.value}
                      onChange={(e) => handleUpdateOption(option.id, { value: e.target.value })}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveOption(option.id)}
                      disabled={(editingField.options?.length || 0) <= 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddOption}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Opção
                </Button>
              </div>
            </div>
          )}

          {(['text', 'textarea', 'number'].includes(field.type)) && (
            <div className="space-y-4">
              <h4 className="font-medium">Validação</h4>
              <div className="grid grid-cols-2 gap-4">
                {(['text', 'textarea'].includes(field.type)) && (
                  <>
                    <div className="space-y-2">
                      <Label>Mín. Caracteres</Label>
                      <Input
                        type="number"
                        value={editingField.validation?.minLength || ''}
                        onChange={(e) => setEditingField(prev => ({
                          ...prev,
                          validation: {
                            ...prev.validation,
                            minLength: parseInt(e.target.value) || undefined
                          }
                        }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Máx. Caracteres</Label>
                      <Input
                        type="number"
                        value={editingField.validation?.maxLength || ''}
                        onChange={(e) => setEditingField(prev => ({
                          ...prev,
                          validation: {
                            ...prev.validation,
                            maxLength: parseInt(e.target.value) || undefined
                          }
                        }))}
                      />
                    </div>
                  </>
                )}
                
                {field.type === 'number' && (
                  <>
                    <div className="space-y-2">
                      <Label>Valor Mínimo</Label>
                      <Input
                        type="number"
                        value={editingField.validation?.min || ''}
                        onChange={(e) => setEditingField(prev => ({
                          ...prev,
                          validation: {
                            ...prev.validation,
                            min: parseFloat(e.target.value) || undefined
                          }
                        }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Valor Máximo</Label>
                      <Input
                        type="number"
                        value={editingField.validation?.max || ''}
                        onChange={(e) => setEditingField(prev => ({
                          ...prev,
                          validation: {
                            ...prev.validation,
                            max: parseFloat(e.target.value) || undefined
                          }
                        }))}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between pt-6 border-t">
          <Button variant="outline" onClick={onCancel}>
            <X className="h-4 w-4 mr-2" />
            Cancelar
          </Button>
          <Button onClick={() => onSave(editingField)}>
            <Save className="h-4 w-4 mr-2" />
            Salvar Campo
          </Button>
        </div>
      </div>
    );
  };

  const FormPreview = () => {
    const sortedFields = formData.fields.sort((a, b) => a.order - b.order);
    
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">{formData.title || 'Título do Formulário'}</h2>
          <p className="text-muted-foreground">
            {formData.description || 'Descrição do formulário'}
          </p>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="space-y-6">
              {sortedFields.map((field) => {
                const IconComponent = fieldTypeIcons[field.type] || Type;
                
                if (field.type === 'separator') {
                  return <hr key={field.id} className="border-gray-300" />;
                }
                
                if (field.type === 'html') {
                  return (
                    <div 
                      key={field.id}
                      dangerouslySetInnerHTML={{ __html: field.content || '' }}
                    />
                  );
                }

                return (
                  <div key={field.id} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <IconComponent className="h-4 w-4 text-muted-foreground" />
                      <Label className="flex items-center gap-2">
                        {field.label}
                        {field.required && <span className="text-destructive">*</span>}
                      </Label>
                    </div>
                    {field.description && (
                      <p className="text-sm text-muted-foreground">{field.description}</p>
                    )}
                    
                    <div className="bg-gray-50 p-3 rounded border-2 border-dashed">
                      <span className="text-sm text-muted-foreground">
                        Campo de {fieldTypes.find(t => t.value === field.type)?.label.toLowerCase()} 
                        {field.placeholder && ` - "${field.placeholder}"`}
                      </span>
                    </div>
                  </div>
                );
              })}

              <div className="pt-6 border-t">
                <Button 
                  disabled 
                  style={{ backgroundColor: formData.design.primaryColor }}
                  className="text-white"
                >
                  {formData.settings.submitButtonText}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              {isEditing ? 'Editar Formulário' : 'Novo Formulário'}
            </h1>
            <p className="text-muted-foreground">
              {isEditing ? 'Modifique o formulário existente' : 'Crie um novo formulário que gerará uma página automaticamente'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={() => setPreviewMode(!previewMode)}
          >
            <Eye className="h-4 w-4 mr-2" />
            {previewMode ? 'Editar' : 'Visualizar'}
          </Button>
          <Button onClick={handleSaveForm}>
            <Save className="h-4 w-4 mr-2" />
            {isEditing ? 'Atualizar' : 'Criar'} Formulário
          </Button>
        </div>
      </div>

      {previewMode ? (
        <FormPreview />
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="form">Formulário</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
            <TabsTrigger value="design">Design</TabsTrigger>
          </TabsList>

          <TabsContent value="form" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Form Builder */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Informações Básicas</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Título do Formulário *</Label>
                      <Input
                        value={formData.title}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        placeholder="Ex: Solicitação de Serviços Públicos"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Descrição *</Label>
                      <Textarea
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Descreva o propósito do formulário"
                        rows={3}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>URL do Formulário</Label>
                      <Input
                        value={formData.slug}
                        onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                        placeholder="url-do-formulario"
                      />
                      <p className="text-xs text-muted-foreground">
                        A página será acessível em: /formulario/{formData.slug}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={formData.isActive}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                        />
                        <Label>Formulário Ativo</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={formData.isPublic}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPublic: checked }))}
                        />
                        <Label>Público</Label>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Form Fields */}
                <Card>
                  <CardHeader>
                    <CardTitle>Campos do Formulário</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {formData.fields.length === 0 ? (
                      <div className="text-center py-8">
                        <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">
                          Nenhum campo adicionado ainda. Use o painel lateral para adicionar campos.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {formData.fields
                          .sort((a, b) => a.order - b.order)
                          .map((field, index) => {
                            const IconComponent = fieldTypeIcons[field.type] || Type;
                            
                            return (
                              <div
                                key={field.id}
                                className="flex items-center gap-3 p-3 border rounded-lg bg-card hover:bg-accent/50 transition-colors"
                              >
                                <div className="flex flex-col gap-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => moveFieldUp(field.id)}
                                    disabled={index === 0}
                                    className="h-6 w-6 p-0"
                                  >
                                    <ArrowUp className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => moveFieldDown(field.id)}
                                    disabled={index === formData.fields.length - 1}
                                    className="h-6 w-6 p-0"
                                  >
                                    <ArrowDown className="h-3 w-3" />
                                  </Button>
                                </div>
                                
                                <GripVertical className="h-4 w-4 text-muted-foreground" />
                                <IconComponent className="h-4 w-4 text-muted-foreground" />
                                
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">
                                      {field.label || 'Campo sem rótulo'}
                                    </span>
                                    {field.required && (
                                      <Badge variant="outline" className="text-xs">Obrigatório</Badge>
                                    )}
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    {fieldTypes.find(t => t.value === field.type)?.label}
                                    {field.description && ` - ${field.description}`}
                                  </p>
                                </div>
                                
                                <div className="flex items-center gap-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleEditField(field)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDuplicateField(field)}
                                  >
                                    <Copy className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteField(field.id)}
                                    className="text-destructive hover:text-destructive"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Field Types Sidebar */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Adicionar Campos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-2">
                      {fieldTypes.map((fieldType) => {
                        const IconComponent = fieldTypeIcons[fieldType.value] || Type;
                        
                        return (
                          <Button
                            key={fieldType.value}
                            variant="outline"
                            className="justify-start h-auto p-3"
                            onClick={() => handleAddField(fieldType.value)}
                          >
                            <div className="flex items-start gap-3">
                              <IconComponent className="h-4 w-4 mt-0.5" />
                              <div className="text-left">
                                <div className="font-medium">{fieldType.label}</div>
                                <div className="text-xs text-muted-foreground">
                                  {fieldType.description}
                                </div>
                              </div>
                            </div>
                          </Button>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Estatísticas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Total de campos:</span>
                        <Badge variant="outline">{formData.fields.length}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Campos obrigatórios:</span>
                        <Badge variant="outline">
                          {formData.fields.filter(f => f.required).length}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Tempo estimado:</span>
                        <Badge variant="outline">
                          {Math.max(2, Math.ceil(formData.fields.length * 0.5))} min
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Configurações de Envio</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Texto do Botão de Envio</Label>
                    <Input
                      value={formData.settings.submitButtonText}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        settings: { ...prev.settings, submitButtonText: e.target.value }
                      }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Mensagem de Sucesso</Label>
                    <Textarea
                      value={formData.settings.successMessage}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        settings: { ...prev.settings, successMessage: e.target.value }
                      }))}
                      rows={3}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>URL de Redirecionamento (Opcional)</Label>
                    <Input
                      value={formData.settings.redirectUrl || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        settings: { ...prev.settings, redirectUrl: e.target.value }
                      }))}
                      placeholder="https://..."
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Controles e Segurança</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Permitir Múltiplas Submissões</Label>
                      <p className="text-sm text-muted-foreground">
                        Usuários podem enviar o formulário mais de uma vez
                      </p>
                    </div>
                    <Switch
                      checked={formData.settings.allowMultipleSubmissions}
                      onCheckedChange={(checked) => setFormData(prev => ({
                        ...prev,
                        settings: { ...prev.settings, allowMultipleSubmissions: checked }
                      }))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Habilitar CAPTCHA</Label>
                      <p className="text-sm text-muted-foreground">
                        Proteção contra spam e bots
                      </p>
                    </div>
                    <Switch
                      checked={formData.settings.captchaEnabled}
                      onCheckedChange={(checked) => setFormData(prev => ({
                        ...prev,
                        settings: { ...prev.settings, captchaEnabled: checked }
                      }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Limite de Submissões por Usuário</Label>
                    <Input
                      type="number"
                      value={formData.settings.submitLimit || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        settings: { 
                          ...prev.settings, 
                          submitLimit: parseInt(e.target.value) || undefined 
                        }
                      }))}
                      placeholder="Deixe vazio para ilimitado"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="design" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Aparência
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Layout</Label>
                    <Select 
                      value={formData.design.layout} 
                      onValueChange={(value: 'single-column' | 'two-column') => 
                        setFormData(prev => ({
                          ...prev,
                          design: { ...prev.design, layout: value }
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single-column">Coluna Única</SelectItem>
                        <SelectItem value="two-column">Duas Colunas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Tema</Label>
                    <Select 
                      value={formData.design.theme} 
                      onValueChange={(value: 'default' | 'modern' | 'minimal') => 
                        setFormData(prev => ({
                          ...prev,
                          design: { ...prev.design, theme: value }
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">Padrão</SelectItem>
                        <SelectItem value="modern">Moderno</SelectItem>
                        <SelectItem value="minimal">Minimalista</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Cores</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Cor de Fundo</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={formData.design.backgroundColor}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          design: { ...prev.design, backgroundColor: e.target.value }
                        }))}
                        className="w-12 h-10"
                      />
                      <Input
                        value={formData.design.backgroundColor}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          design: { ...prev.design, backgroundColor: e.target.value }
                        }))}
                        placeholder="#ffffff"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Cor do Texto</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={formData.design.textColor}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          design: { ...prev.design, textColor: e.target.value }
                        }))}
                        className="w-12 h-10"
                      />
                      <Input
                        value={formData.design.textColor}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          design: { ...prev.design, textColor: e.target.value }
                        }))}
                        placeholder="#333333"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Cor Primária (Botões)</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={formData.design.primaryColor}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          design: { ...prev.design, primaryColor: e.target.value }
                        }))}
                        className="w-12 h-10"
                      />
                      <Input
                        value={formData.design.primaryColor}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          design: { ...prev.design, primaryColor: e.target.value }
                        }))}
                        placeholder="#144c9c"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      )}

      {/* Field Editor Modal */}
      <Dialog open={isFieldModalOpen} onOpenChange={setIsFieldModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedField && fieldTypes.find(t => t.value === selectedField.type)?.label}
            </DialogTitle>
            <DialogDescription>
              Configure as propriedades e validações do campo selecionado.
            </DialogDescription>
          </DialogHeader>
          {selectedField && (
            <FieldEditor
              field={selectedField}
              onSave={handleSaveField}
              onCancel={() => {
                setIsFieldModalOpen(false);
                setSelectedField(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}