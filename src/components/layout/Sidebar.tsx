import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Upload, BarChart2, Codepen as CodepenCircle, Activity, TargetIcon, Database, Layers } from 'lucide-react';

const navItems = [
  { name: 'Dashboard', path: '/', icon: Home },
  { name: 'Data Upload', path: '/data-upload', icon: Upload },
  { name: 'Data Exploration', path: '/data-exploration', icon: BarChart2 },
  { name: 'Model Training', path: '/model-training', icon: CodepenCircle },
  { name: 'Model Evaluation', path: '/model-evaluation', icon: Activity },
  { name: 'Prediction', path: '/prediction', icon: TargetIcon },
  { name: 'Model Registry', path: '/model-registry', icon: Database },
];

const Sidebar: React.FC = () => {
  return (
    <div className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Layers className="h-8 w-8 text-blue-600" />
          <span className="text-xl font-bold text-gray-800">MLOps Pro</span>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
            ML
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-800">ML Engineer</span>
            <span className="text-xs text-gray-500">admin@mlops.pro</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;