import { FileSpreadsheet, Upload, Table } from 'lucide-react';

const Navbar = ({ activeView, onViewChange }) => {

  const navItems = [
    {
      id: 'process',
      label: 'Procesar',
      icon: Upload,
      description: 'Subir y procesar archivos Excel'
    },
    {
      id: 'data',
      label: 'Tabla de datos',
      icon: Table,
      description: 'Ver historial de procesamiento'
    }
  ];

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo y título */}
          <div className="flex items-center">
            <FileSpreadsheet className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-xl font-semibold text-gray-900">
              Ivitec
            </h1>
          </div>

          {/* Navegación */}
          <nav className="flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  className={`
                    flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors
                    ${
                      isActive
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }
                  `}
                  title={item.description}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;