import React from 'react';
import { Bell, Settings } from 'lucide-react';
import { useML } from '../../context/MLContext';

const Header: React.FC = () => {
  const { activeModel } = useML();

  return (
    <header className="bg-white border-b border-gray-200 py-4 px-6 flex items-center justify-between">
      <div className="flex items-center">
        <h1 className="text-xl font-semibold text-gray-800">ML Pipeline</h1>
        {activeModel && (
          <div className="ml-4 flex items-center">
            <span className="text-sm text-gray-500">Active model:</span>
            <span className="ml-2 px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
              {activeModel.name}
            </span>
          </div>
        )}
      </div>
      <div className="flex items-center space-x-4">
        <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
          <Bell size={20} className="text-gray-600" />
        </button>
        <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
          <Settings size={20} className="text-gray-600" />
        </button>
        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
          ML
        </div>
      </div>
    </header>
  );
};

export default Header;