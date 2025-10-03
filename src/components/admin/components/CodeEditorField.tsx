import { useState } from 'react';
import { Label } from '../../ui/label';
import { AdvancedHTMLEditor } from './AdvancedHTMLEditor';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Code2, Eye, AlertCircle, CheckCircle, Lightbulb } from 'lucide-react';
import { Button } from '../../ui/button';
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../../ui/collapsible';

interface CodeEditorFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  description?: string;
  placeholder?: string;
  required?: boolean;
  language?: 'html' | 'css' | 'javascript';
  height?: number;
  showPreview?: boolean;
  showSnippets?: boolean;
  className?: string;
}

interface ValidationError {
  line: number;
  column: number;
  message: string;
  severity: 'error' | 'warning' | 'info';
}

const languageInfo = {
  html: {
    name: 'HTML',
    description: 'HyperText Markup Language',
    icon: Code2,
    color: 'text-orange-600',
    tips: [
      'Use tags semânticas como <header>, <main>, <section>, <article>',
      'Sempre inclua atributos alt em imagens para acessibilidade',
      'Use classes CSS do Tailwind para estilização consistente',
      'Mantenha a estrutura hierárquica correta com headings (h1, h2, h3...)'
    ]
  },
  css: {
    name: 'CSS',
    description: 'Cascading Style Sheets',
    icon: Code2,
    color: 'text-blue-600',
    tips: [
      'Prefira classes utilitárias do Tailwind CSS',
      'Use unidades relativas (rem, %) para responsividade',
      'Mantenha especificidade baixa para facilitar manutenção',
      'Use CSS Grid e Flexbox para layouts modernos'
    ]
  },
  javascript: {
    name: 'JavaScript',
    description: 'Linguagem de programação dinâmica',
    icon: Code2,
    color: 'text-yellow-600',
    tips: [
      'Use let/const ao invés de var',
      'Prefira funções arrow para callbacks',
      'Implemente tratamento de erros com try/catch',
      'Use async/await para operações assíncronas'
    ]
  }
};

export function CodeEditorField({
  label,
  value,
  onChange,
  description,
  placeholder,
  required = false,
  language = 'html',
  height = 300,
  showPreview = true,
  showSnippets = true,
  className = ''
}: CodeEditorFieldProps) {
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [showTips, setShowTips] = useState(false);
  
  const langInfo = languageInfo[language];
  const hasErrors = validationErrors.filter(e => e.severity === 'error').length > 0;
  const hasWarnings = validationErrors.filter(e => e.severity === 'warning').length > 0;

  const handleValidation = (errors: ValidationError[]) => {
    setValidationErrors(errors);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Label e Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Label className="text-sm font-medium">
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </Label>
          <Badge variant="outline" className="text-xs">
            <langInfo.icon className="h-3 w-3 mr-1" />
            {langInfo.name}
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          {validationErrors.length > 0 && (
            <Badge 
              variant={hasErrors ? 'destructive' : hasWarnings ? 'secondary' : 'default'}
              className="text-xs"
            >
              {hasErrors ? (
                <AlertCircle className="h-3 w-3 mr-1" />
              ) : (
                <CheckCircle className="h-3 w-3 mr-1" />
              )}
              {validationErrors.length} {validationErrors.length === 1 ? 'problema' : 'problemas'}
            </Badge>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowTips(!showTips)}
            className="text-xs h-7"
          >
            <Lightbulb className="h-3 w-3 mr-1" />
            Dicas
          </Button>
        </div>
      </div>

      {/* Descrição */}
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}

      {/* Dicas de Código */}
      <Collapsible open={showTips} onOpenChange={setShowTips}>
        <CollapsibleContent>
          <Card className="mb-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                Dicas de {langInfo.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="space-y-2">
                {langInfo.tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span className="text-muted-foreground">{tip}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>

      {/* Editor */}
      <div className="border border-border rounded-lg overflow-hidden">
        <AdvancedHTMLEditor
          value={value}
          onChange={onChange}
          onValidation={handleValidation}
          height={height}
          showPreview={showPreview}
          className="rounded-none border-0"
        />
      </div>

      {/* Caracteres e Linha */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <span>{value.length} caracteres</span>
          <span>{value.split('\n').length} linhas</span>
          {value.trim() && (
            <span>{value.split(/\s+/).filter(word => word.length > 0).length} palavras</span>
          )}
        </div>
        
        {validationErrors.length === 0 && value.trim() && (
          <div className="flex items-center gap-1 text-green-600">
            <CheckCircle className="h-3 w-3" />
            <span>Código válido</span>
          </div>
        )}
      </div>

      {/* Erros de Validação */}
      {validationErrors.length > 0 && (
        <div className="space-y-2">
          {validationErrors.slice(0, 3).map((error, index) => (
            <div 
              key={index} 
              className={`flex items-start gap-2 p-3 rounded-md text-sm ${
                error.severity === 'error' ? 'bg-destructive/10 text-destructive' :
                error.severity === 'warning' ? 'bg-yellow-50 text-yellow-800' :
                'bg-blue-50 text-blue-800'
              }`}
            >
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-medium">{error.message}</p>
                <p className="text-xs opacity-75 mt-1">
                  Linha {error.line}, Coluna {error.column}
                </p>
              </div>
            </div>
          ))}
          
          {validationErrors.length > 3 && (
            <p className="text-xs text-muted-foreground text-center py-2">
              ... e mais {validationErrors.length - 3} {validationErrors.length - 3 === 1 ? 'problema' : 'problemas'}
            </p>
          )}
        </div>
      )}
    </div>
  );
}