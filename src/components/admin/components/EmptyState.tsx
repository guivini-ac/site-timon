import { 
  FileImage, 
  Calendar, 
  Grid, 
  Image, 
  MessageSquare, 
  AlertCircle,
  FolderOpen,
  Users,
  Settings,
  Tag,
  Shield,
  Search,
  Palette,
  Wrench,
  Menu,
  FormInput,
  Plus,
  ArrowRight
} from 'lucide-react';
import { Button } from '../../ui/button';
import { Card, CardContent } from '../../ui/card';

interface EmptyStateProps {
  title: string;
  description: string;
  icon: 'FileImage' | 'Calendar' | 'Grid' | 'Image' | 'MessageSquare' | 'AlertCircle' | 'FolderOpen' | 'Users' | 'Settings' | 'Tag' | 'Shield' | 'Search' | 'Palette' | 'Wrench' | 'Menu' | 'FormInput';
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
}

const iconMap = {
  FileImage,
  Calendar,
  Grid,
  Image,
  MessageSquare,
  AlertCircle,
  FolderOpen,
  Users,
  Settings,
  Tag,
  Shield,
  Search,
  Palette,
  Wrench,
  Menu,
  FormInput
};

export function EmptyState({
  title,
  description,
  icon,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction
}: EmptyStateProps) {
  const IconComponent = iconMap[icon];

  // Fallback para ícone inválido
  if (!IconComponent) {
    console.warn(`Icon "${icon}" not found in iconMap. Using AlertCircle as fallback.`);
    const FallbackIcon = AlertCircle;
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center text-center p-8">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <FallbackIcon className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
              {description}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              {actionLabel && onAction && (
                <Button onClick={onAction} className="flex-1">
                  <Plus className="h-4 w-4 mr-2" />
                  {actionLabel}
                </Button>
              )}
              {secondaryActionLabel && onSecondaryAction && (
                <Button 
                  variant="outline" 
                  onClick={onSecondaryAction}
                  className="flex-1"
                >
                  {secondaryActionLabel}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
            <div className="mt-6 text-xs text-muted-foreground">
              Esta funcionalidade está sendo desenvolvida
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center text-center p-8">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <IconComponent className="h-8 w-8 text-muted-foreground" />
          </div>
          
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
            {description}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            {actionLabel && onAction && (
              <Button onClick={onAction} className="flex-1">
                <Plus className="h-4 w-4 mr-2" />
                {actionLabel}
              </Button>
            )}
            
            {secondaryActionLabel && onSecondaryAction && (
              <Button 
                variant="outline" 
                onClick={onSecondaryAction}
                className="flex-1"
              >
                {secondaryActionLabel}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
          

        </CardContent>
      </Card>
    </div>
  );
}