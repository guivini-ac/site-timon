import React from 'react';
import { Search, Loader2, FileText, Calendar, Image, Building, Settings, Users } from 'lucide-react';
import { SearchResult } from '../hooks/useSearch';

interface SearchResultsProps {
  results: SearchResult[];
  isSearching: boolean;
  selectedIndex: number;
  onResultClick: (result: SearchResult) => void;
  onMouseEnter: (index: number) => void;
  query: string;
}

const getTypeIcon = (type: SearchResult['type']) => {
  switch (type) {
    case 'page':
      return <FileText className="h-4 w-4" />;
    case 'form':
      return <FileText className="h-4 w-4" />;
    case 'service':
      return <Settings className="h-4 w-4" />;
    case 'secretaria':
      return <Building className="h-4 w-4" />;
    case 'event':
      return <Calendar className="h-4 w-4" />;
    case 'gallery':
      return <Image className="h-4 w-4" />;
    default:
      return <FileText className="h-4 w-4" />;
  }
};

const getTypeColor = (type: SearchResult['type']) => {
  switch (type) {
    case 'page':
      return 'text-blue-600';
    case 'form':
      return 'text-green-600';
    case 'service':
      return 'text-purple-600';
    case 'secretaria':
      return 'text-orange-600';
    case 'event':
      return 'text-red-600';
    case 'gallery':
      return 'text-pink-600';
    default:
      return 'text-gray-600';
  }
};

const highlightText = (text: string, query: string) => {
  if (!query.trim()) return text;
  
  const regex = new RegExp(`(${query})`, 'gi');
  const parts = text.split(regex);
  
  return parts.map((part, index) => 
    regex.test(part) ? (
      <mark key={index} className="bg-yellow-200 px-1 rounded">
        {part}
      </mark>
    ) : (
      part
    )
  );
};

export default function SearchResults({
  results,
  isSearching,
  selectedIndex,
  onResultClick,
  onMouseEnter,
  query
}: SearchResultsProps) {
  if (isSearching) {
    return (
      <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4">
        <div className="flex items-center justify-center space-x-2 text-gray-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm">Buscando...</span>
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4">
        <div className="flex items-center justify-center space-x-2 text-gray-500">
          <Search className="h-4 w-4" />
          <span className="text-sm">
            {query.length < 2 
              ? 'Digite pelo menos 2 caracteres para buscar'
              : 'Nenhum resultado encontrado'
            }
          </span>
        </div>
      </div>
    );
  }

  // Agrupar resultados por categoria
  const groupedResults = results.reduce((groups, result) => {
    const category = result.category || 'Outros';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(result);
    return groups;
  }, {} as Record<string, SearchResult[]>);

  let currentIndex = 0;

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
      <div className="p-2">
        <div className="text-xs text-gray-500 mb-2 px-2">
          {results.length} resultado{results.length !== 1 ? 's' : ''} encontrado{results.length !== 1 ? 's' : ''}
        </div>
        
        {Object.entries(groupedResults).map(([category, categoryResults]) => (
          <div key={category} className="mb-3 last:mb-0">
            <div className="text-xs font-medium text-gray-700 px-2 py-1 bg-gray-50 rounded-md mb-1">
              {category}
            </div>
            
            {categoryResults.map((result) => {
              const isSelected = currentIndex === selectedIndex;
              const itemIndex = currentIndex++;
              
              return (
                <button
                  key={result.id}
                  className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                    isSelected 
                      ? 'bg-blue-50 border border-blue-200' 
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => onResultClick(result)}
                  onMouseEnter={() => onMouseEnter(itemIndex)}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`flex-shrink-0 mt-0.5 ${getTypeColor(result.type)}`}>
                      {result.icon ? (
                        <span className="text-sm">{result.icon}</span>
                      ) : (
                        getTypeIcon(result.type)
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">
                        {highlightText(result.title, query)}
                      </div>
                      <div className="text-sm text-gray-600 line-clamp-2">
                        {highlightText(result.description, query)}
                      </div>
                      
                      {result.type && (
                        <div className="flex items-center mt-1">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            result.type === 'page' ? 'bg-blue-100 text-blue-700' :
                            result.type === 'form' ? 'bg-green-100 text-green-700' :
                            result.type === 'service' ? 'bg-purple-100 text-purple-700' :
                            result.type === 'secretaria' ? 'bg-orange-100 text-orange-700' :
                            result.type === 'event' ? 'bg-red-100 text-red-700' :
                            result.type === 'gallery' ? 'bg-pink-100 text-pink-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {result.type === 'page' ? 'Página' :
                             result.type === 'form' ? 'Formulário' :
                             result.type === 'service' ? 'Serviço' :
                             result.type === 'secretaria' ? 'Secretaria' :
                             result.type === 'event' ? 'Evento' :
                             result.type === 'gallery' ? 'Galeria' :
                             'Outro'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        ))}
        
        <div className="border-t pt-2 mt-2">
          <div className="text-xs text-gray-500 px-2">
            Use as setas ↑↓ para navegar, Enter para selecionar, Esc para fechar
          </div>
        </div>
      </div>
    </div>
  );
}