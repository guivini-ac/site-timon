import { useState, useEffect } from 'react';
import { useForms, type Form, type FormField } from './FormsContext';
import { useAccessibility } from './AccessibilityContext';
import { 
  ArrowLeft, 
  Send, 
  Upload, 
  Calendar, 
  Check,
  AlertCircle,
  Clock,
  Users,
  FileText,
  Shield
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from './ui/select';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Separator } from './ui/separator';

interface FormPageProps {
  slug: string;
  onNavigateBack: () => void;
}

const FormPage = ({ slug, onNavigateBack }: FormPageProps) => {
  const { announceToScreenReader } = useAccessibility();
  const { getFormBySlug, addSubmission, validateField } = useForms();
  
  const [form, setForm] = useState<Form | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showValidation, setShowValidation] = useState(false);

  useEffect(() => {
    const foundForm = getFormBySlug(slug);
    if (foundForm) {
      setForm(foundForm);
      announceToScreenReader(`Formulário carregado: ${foundForm.title}`);
    }
  }, [slug, getFormBySlug, announceToScreenReader]);

  useEffect(() => {
    if (form) {
      document.title = `${form.title} - Prefeitura de Timon`;
    }
  }, [form]);

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
    
    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[fieldId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    if (!form) return false;

    const newErrors: Record<string, string> = {};
    
    form.fields.forEach(field => {
      if (field.type === 'separator' || field.type === 'html') return;
      
      const error = validateField(field, formData[field.id]);
      if (error) {
        newErrors[field.id] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;

    setShowValidation(true);
    
    if (!validateForm()) {
      announceToScreenReader('Formulário contém erros. Verifique os campos destacados.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simular delay de envio
      await new Promise(resolve => setTimeout(resolve, 1500));

      addSubmission({
        formId: form.id,
        data: formData,
        submitterEmail: formData['email'] || formData['field-2'], // Tentar pegar email do campo
        submitterName: formData['nome'] || formData['field-1'], // Tentar pegar nome do campo
        status: 'pending'
      });

      setIsSubmitted(true);
      announceToScreenReader(form.settings.successMessage);
    } catch (error) {
      announceToScreenReader('Erro ao enviar formulário. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatFieldValue = (field: FormField, value: any): string => {
    if (!value) return '';
    
    if (field.type === 'checkbox' && Array.isArray(value)) {
      return field.options
        ?.filter(option => value.includes(option.value))
        .map(option => option.label)
        .join(', ') || '';
    }
    
    if ((field.type === 'select' || field.type === 'radio') && field.options) {
      const option = field.options.find(opt => opt.value === value);
      return option?.label || value;
    }
    
    return String(value);
  };

  const shouldShowField = (field: FormField): boolean => {
    if (!field.conditionalLogic?.showIf) return true;
    
    const condition = field.conditionalLogic.showIf;
    const dependentValue = formData[condition.fieldId];
    
    if (!dependentValue) return false;
    
    switch (condition.operator) {
      case 'equals':
        return Array.isArray(condition.value) 
          ? condition.value.includes(dependentValue)
          : dependentValue === condition.value;
      case 'not_equals':
        return Array.isArray(condition.value)
          ? !condition.value.includes(dependentValue)
          : dependentValue !== condition.value;
      case 'contains':
        return Array.isArray(dependentValue)
          ? dependentValue.some((v: string) => condition.value.includes(v))
          : String(dependentValue).includes(String(condition.value));
      case 'not_contains':
        return Array.isArray(dependentValue)
          ? !dependentValue.some((v: string) => condition.value.includes(v))
          : !String(dependentValue).includes(String(condition.value));
      default:
        return true;
    }
  };

  const renderField = (field: FormField) => {
    if (!shouldShowField(field)) return null;

    const hasError = errors[field.id];
    const value = formData[field.id];

    switch (field.type) {
      case 'html':
        return (
          <div 
            key={field.id}
            className="py-4"
            dangerouslySetInnerHTML={{ __html: field.content || '' }}
          />
        );

      case 'separator':
        return (
          <div key={field.id} className="py-4">
            <Separator />
          </div>
        );

      case 'text':
      case 'email':
      case 'phone':
      case 'cpf':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className="flex items-center gap-2">
              {field.label}
              {field.required && <span className="text-destructive">*</span>}
            </Label>
            {field.description && (
              <p className="text-sm text-muted-foreground">{field.description}</p>
            )}
            <Input
              id={field.id}
              type={field.type === 'email' ? 'email' : field.type === 'phone' ? 'tel' : 'text'}
              placeholder={field.placeholder}
              value={value || ''}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              required={field.required}
              aria-invalid={hasError ? 'true' : 'false'}
              aria-describedby={hasError ? `${field.id}-error` : undefined}
              className={hasError ? 'border-destructive' : ''}
            />
            {hasError && (
              <p id={`${field.id}-error`} className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {hasError}
              </p>
            )}
          </div>
        );

      case 'number':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className="flex items-center gap-2">
              {field.label}
              {field.required && <span className="text-destructive">*</span>}
            </Label>
            {field.description && (
              <p className="text-sm text-muted-foreground">{field.description}</p>
            )}
            <Input
              id={field.id}
              type="number"
              placeholder={field.placeholder}
              value={value || ''}
              onChange={(e) => handleFieldChange(field.id, parseFloat(e.target.value) || '')}
              min={field.validation?.min}
              max={field.validation?.max}
              required={field.required}
              aria-invalid={hasError ? 'true' : 'false'}
              className={hasError ? 'border-destructive' : ''}
            />
            {hasError && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {hasError}
              </p>
            )}
          </div>
        );

      case 'textarea':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className="flex items-center gap-2">
              {field.label}
              {field.required && <span className="text-destructive">*</span>}
            </Label>
            {field.description && (
              <p className="text-sm text-muted-foreground">{field.description}</p>
            )}
            <Textarea
              id={field.id}
              placeholder={field.placeholder}
              value={value || ''}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              required={field.required}
              rows={4}
              aria-invalid={hasError ? 'true' : 'false'}
              className={hasError ? 'border-destructive' : ''}
            />
            {hasError && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {hasError}
              </p>
            )}
          </div>
        );

      case 'select':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className="flex items-center gap-2">
              {field.label}
              {field.required && <span className="text-destructive">*</span>}
            </Label>
            {field.description && (
              <p className="text-sm text-muted-foreground">{field.description}</p>
            )}
            <Select value={value || ''} onValueChange={(newValue) => handleFieldChange(field.id, newValue)}>
              <SelectTrigger className={hasError ? 'border-destructive' : ''}>
                <SelectValue placeholder={field.placeholder || 'Selecione uma opção'} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option) => (
                  <SelectItem key={option.id} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {hasError && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {hasError}
              </p>
            )}
          </div>
        );

      case 'radio':
        return (
          <div key={field.id} className="space-y-2">
            <Label className="flex items-center gap-2">
              {field.label}
              {field.required && <span className="text-destructive">*</span>}
            </Label>
            {field.description && (
              <p className="text-sm text-muted-foreground">{field.description}</p>
            )}
            <RadioGroup
              value={value || ''}
              onValueChange={(newValue) => handleFieldChange(field.id, newValue)}
              className={hasError ? 'border border-destructive rounded-md p-3' : ''}
            >
              {field.options?.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={option.id} />
                  <Label htmlFor={option.id}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
            {hasError && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {hasError}
              </p>
            )}
          </div>
        );

      case 'checkbox':
        if (field.options && field.options.length > 1) {
          // Múltiplas opções de checkbox
          return (
            <div key={field.id} className="space-y-2">
              <Label className="flex items-center gap-2">
                {field.label}
                {field.required && <span className="text-destructive">*</span>}
              </Label>
              {field.description && (
                <p className="text-sm text-muted-foreground">{field.description}</p>
              )}
              <div className={`space-y-2 ${hasError ? 'border border-destructive rounded-md p-3' : ''}`}>
                {field.options.map((option) => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={option.id}
                      checked={(value || []).includes(option.value)}
                      onCheckedChange={(checked) => {
                        const currentValues = value || [];
                        if (checked) {
                          handleFieldChange(field.id, [...currentValues, option.value]);
                        } else {
                          handleFieldChange(field.id, currentValues.filter((v: string) => v !== option.value));
                        }
                      }}
                    />
                    <Label htmlFor={option.id}>{option.label}</Label>
                  </div>
                ))}
              </div>
              {hasError && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {hasError}
                </p>
              )}
            </div>
          );
        } else {
          // Checkbox único
          return (
            <div key={field.id} className="space-y-2">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id={field.id}
                  checked={value || false}
                  onCheckedChange={(checked) => handleFieldChange(field.id, checked)}
                />
                <Label htmlFor={field.id} className="flex items-center gap-2">
                  {field.label}
                  {field.required && <span className="text-destructive">*</span>}
                </Label>
              </div>
              {field.description && (
                <p className="text-sm text-muted-foreground ml-6">{field.description}</p>
              )}
              {hasError && (
                <p className="text-sm text-destructive flex items-center gap-1 ml-6">
                  <AlertCircle className="h-4 w-4" />
                  {hasError}
                </p>
              )}
            </div>
          );
        }

      case 'date':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className="flex items-center gap-2">
              {field.label}
              {field.required && <span className="text-destructive">*</span>}
            </Label>
            {field.description && (
              <p className="text-sm text-muted-foreground">{field.description}</p>
            )}
            <div className="relative">
              <Input
                id={field.id}
                type="date"
                value={value || ''}
                onChange={(e) => handleFieldChange(field.id, e.target.value)}
                required={field.required}
                aria-invalid={hasError ? 'true' : 'false'}
                className={hasError ? 'border-destructive' : ''}
              />
              <Calendar className="absolute right-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
            {hasError && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {hasError}
              </p>
            )}
          </div>
        );

      case 'file':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className="flex items-center gap-2">
              {field.label}
              {field.required && <span className="text-destructive">*</span>}
            </Label>
            {field.description && (
              <p className="text-sm text-muted-foreground">{field.description}</p>
            )}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-2">
                Clique para selecionar arquivos ou arraste-os aqui
              </p>
              <Input
                id={field.id}
                type="file"
                multiple
                onChange={(e) => handleFieldChange(field.id, e.target.files)}
                required={field.required}
                className="hidden"
              />
              <Label
                htmlFor={field.id}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm cursor-pointer hover:bg-gray-50"
              >
                Selecionar Arquivos
              </Label>
            </div>
            {value && value.length > 0 && (
              <div className="text-sm text-gray-600">
                {Array.from(value).map((file: File, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    {file.name} ({Math.round(file.size / 1024)}KB)
                  </div>
                ))}
              </div>
            )}
            {hasError && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {hasError}
              </p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  if (!form) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Formulário não encontrado</h1>
            <p className="text-gray-600 mb-6">
              O formulário solicitado não existe ou não está mais disponível.
            </p>
            <Button onClick={onNavigateBack} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao início
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Formulário enviado com sucesso!</h1>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              {form.settings.successMessage}
            </p>
            <div className="space-y-3">
              <Button onClick={onNavigateBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar ao início
              </Button>
              {form.settings.allowMultipleSubmissions && (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsSubmitted(false);
                    setFormData({});
                    setErrors({});
                    setShowValidation(false);
                  }}
                >
                  Enviar novamente
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const sortedFields = form.fields.sort((a, b) => a.order - b.order);

  return (
    <div 
      className="min-h-screen py-8"
      style={{ 
        backgroundColor: form.design.backgroundColor,
        color: form.design.textColor 
      }}
    >
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={onNavigateBack}
            className="mb-4 hover:bg-black/5"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">{form.title}</h1>
            {form.description && (
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {form.description}
              </p>
            )}
          </div>
        </div>

        {/* Form Info */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Tempo estimado: 3-5 minutos</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>{form.submissionCount} pessoas já preencheram</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>Dados protegidos e seguros</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Form */}
        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {showValidation && Object.keys(errors).length > 0 && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Por favor, corrija os erros destacados abaixo antes de continuar.
                  </AlertDescription>
                </Alert>
              )}

              <div className={form.design.layout === 'two-column' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'space-y-6'}>
                {sortedFields.map(renderField)}
              </div>

              <div className="pt-6 border-t">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto"
                    style={{ backgroundColor: form.design.primaryColor }}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        {form.settings.submitButtonText}
                      </>
                    )}
                  </Button>
                  
                  <p className="text-sm text-muted-foreground text-center sm:text-left">
                    Ao enviar, você concorda com nossos termos de uso e política de privacidade.
                  </p>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Footer Info */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            Formulário criado pela Prefeitura Municipal de Timon - MA
          </p>
          <p>
            Dúvidas? Entre em contato: (99) 3212-3456
          </p>
        </div>
      </div>
    </div>
  );
};

export default FormPage;