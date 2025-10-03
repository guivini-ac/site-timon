import { useState } from 'react';

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

interface BulkActionsBasicProps {
  selectedIds: string[];
  totalItems: number;
  onSelectAll: (selected: boolean) => void;
  onClearSelection: () => void;
  actions: BulkAction[];
  onAction: (actionId: string, selectedIds: string[]) => void;
  itemName?: string;
  className?: string;
}

export function BulkActionsBasic({
  selectedIds,
  totalItems,
  onSelectAll,
  onClearSelection,
  actions,
  onAction,
  itemName = 'item',
  className = ''
}: BulkActionsBasicProps) {
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
      <div className={`flex items-center gap-2 p-3 bg-gray-50 rounded-lg border ${className}`}>
        <input
          type="checkbox"
          checked={false}
          onChange={handleSelectAll}
          className="rounded border-gray-300"
        />
        <span className="text-sm text-gray-600">
          Selecionar todos os {totalItems} {itemName}s
        </span>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-between gap-4 p-3 bg-blue-50 border border-blue-200 rounded-lg ${className}`}>
      <div className="flex items-center gap-3">
        <div className="relative">
          <input
            type="checkbox"
            checked={isAllSelected}
            onChange={handleSelectAll}
            className="rounded border-blue-300"
          />
          {isPartiallySelected && (
            <span className="absolute inset-0 flex items-center justify-center text-blue-600 pointer-events-none">
              −
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded border border-blue-200">
            {selectedIds.length} selecionado{selectedIds.length !== 1 ? 's' : ''}
          </span>
          
          <button
            onClick={onClearSelection}
            className="px-2 py-1 text-xs text-gray-600 hover:text-gray-900 border border-gray-300 rounded hover:bg-gray-100"
          >
            ✕ Limpar
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="w-px h-6 bg-gray-300"></div>
        
        <div className="flex items-center gap-1">
          {actions.map((action) => {
            const IconComponent = action.icon;
            const buttonClass = action.variant === 'destructive' 
              ? 'px-3 py-2 text-sm bg-red-600 text-white border border-red-600 rounded hover:bg-red-700'
              : 'px-3 py-2 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50';
            
            return (
              <button
                key={action.id}
                onClick={() => handleAction(action)}
                disabled={action.disabled}
                className={buttonClass}
              >
                <IconComponent className="w-4 h-4 inline mr-1" />
                {action.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Hook para gerenciar seleção em lote
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