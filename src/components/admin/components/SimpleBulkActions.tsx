import { useState } from 'react';
import {
  Trash2,
  Eye,
  EyeOff,
  CheckSquare,
  Square,
  Minus,
  Check,
  X
} from 'lucide-react';
import { Button } from '../../ui/button';
import { Checkbox } from '../../ui/checkbox';
import { Badge } from '../../ui/badge';
import { Separator } from '../../ui/separator';

export interface BulkAction {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary';
  requiresConfirmation?: boolean;
  confirmationTitle?: string;
  confirmationDescription?: string;
  disabled?: boolean;
}

interface SimpleBulkActionsProps {
  selectedIds: string[];
  totalItems: number;
  onSelectAll: (selected: boolean) => void;
  onClearSelection: () => void;
  actions: BulkAction[];
  onAction: (actionId: string, selectedIds: string[]) => void;
  itemName?: string;
  className?: string;
}

export function SimpleBulkActions({
  selectedIds,
  totalItems,
  onSelectAll,
  onClearSelection,
  actions,
  onAction,
  itemName = 'item',
  className = ''
}: SimpleBulkActionsProps) {
  const [pendingAction, setPendingAction] = useState<BulkAction | null>(null);
  
  const isAllSelected = selectedIds.length === totalItems && totalItems > 0;
  const isPartiallySelected = selectedIds.length > 0 && selectedIds.length < totalItems;
  const hasSelection = selectedIds.length > 0;

  const handleSelectAll = () => {
    if (isAllSelected) {
      onSelectAll(false);
    } else {
      onSelectAll(true);
    }
  };

  const handleAction = (action: BulkAction) => {
    if (action.requiresConfirmation) {
      if (confirm(`${action.confirmationTitle || 'Confirmar Ação'}\n\n${action.confirmationDescription || `Tem certeza que deseja executar esta ação em ${selectedIds.length} ${itemName}${selectedIds.length !== 1 ? 's' : ''} selecionado${selectedIds.length !== 1 ? 's' : ''}?`}`)) {
        onAction(action.id, selectedIds);
      }
    } else {
      onAction(action.id, selectedIds);
    }
  };

  if (!hasSelection) {
    return (
      <div className={`flex items-center gap-2 p-3 bg-muted/50 rounded-lg border ${className}`}>
        <Checkbox
          checked={false}
          onCheckedChange={handleSelectAll}
          className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
        />
        <span className="text-sm text-muted-foreground">
          Selecionar todos os {totalItems} {itemName}s
        </span>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-between gap-4 p-3 bg-primary/5 border border-primary/20 rounded-lg ${className}`}>
      <div className="flex items-center gap-3">
        <div className="relative">
          <Checkbox
            checked={isAllSelected}
            onCheckedChange={handleSelectAll}
            className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          />
          {isPartiallySelected && (
            <Minus className="absolute inset-0 h-4 w-4 text-primary pointer-events-none" />
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
            {selectedIds.length} selecionado{selectedIds.length !== 1 ? 's' : ''}
          </Badge>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
          >
            <X className="h-3 w-3 mr-1" />
            Limpar
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Separator orientation="vertical" className="h-6" />
        
        <div className="flex items-center gap-1">
          {actions.map((action) => {
            const IconComponent = action.icon;
            return (
              <Button
                key={action.id}
                variant={action.variant || 'outline'}
                size="sm"
                onClick={() => handleAction(action)}
                disabled={action.disabled}
                className="h-8 px-3"
              >
                <IconComponent className="h-4 w-4 mr-1" />
                {action.label}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Hook para gerenciar seleção em lote (igual ao anterior)
export function useBulkSelection<T extends { id: string | number }>(items: T[]) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const selectItem = (id: string | number) => {
    const idStr = id.toString();
    setSelectedIds(prev => 
      prev.includes(idStr) 
        ? prev.filter(selectedId => selectedId !== idStr)
        : [...prev, idStr]
    );
  };

  const selectAll = (selected: boolean) => {
    if (selected) {
      setSelectedIds(items.map(item => item.id.toString()));
    } else {
      setSelectedIds([]);
    }
  };

  const clearSelection = () => {
    setSelectedIds([]);
  };

  const isSelected = (id: string | number) => {
    return selectedIds.includes(id.toString());
  };

  return {
    selectedIds,
    selectItem,
    selectAll,
    clearSelection,
    isSelected,
    hasSelection: selectedIds.length > 0,
    selectedCount: selectedIds.length
  };
}