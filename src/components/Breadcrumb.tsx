import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb = ({ items }: BreadcrumbProps) => {
  return (
    <nav 
      className="bg-gray-50 border-b"
      role="navigation"
      aria-label="Navegação estrutural"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ol className="flex items-center py-3 space-x-2 text-sm" role="list">
          <li role="listitem">
            <Home className="h-4 w-4 text-gray-500" aria-hidden="true" />
            <span className="sr-only">Você está em:</span>
          </li>
          {items.map((item, index) => (
            <li key={index} className="flex items-center space-x-2" role="listitem">
              <ChevronRight className="h-4 w-4 text-gray-400" aria-hidden="true" />
              {item.onClick ? (
                <button
                  onClick={item.onClick}
                  className="text-[rgba(20,76,156,1)] hover:text-blue-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1 py-1"
                  aria-label={`Ir para ${item.label}`}
                >
                  {item.label}
                </button>
              ) : (
                <span 
                  className="text-gray-700 font-medium"
                  aria-current="page"
                >
                  {item.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
};

export default Breadcrumb;