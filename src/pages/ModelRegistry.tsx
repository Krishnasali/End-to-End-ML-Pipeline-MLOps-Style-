import React, { useState } from 'react';
import { Database, Download, Clock, CheckCircle, ArrowUpDown, Tag, MoreHorizontal } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { useML } from '../context/MLContext';

const ModelRegistry: React.FC = () => {
  const { models, activeModel, setActiveModel } = useML();
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  
  const handleModelActivation = (modelId: string) => {
    setActiveModel(modelId);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Model Registry</h1>
        <Button
          variant="outline"
          size="sm"
          leftIcon={<ArrowUpDown size={14} />}
        >
          Sort Models
        </Button>
      </div>
      
      {models.length === 0 ? (
        <Card>
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-24 h-24 mb-6 bg-blue-100 rounded-full flex items-center justify-center">
              <Database className="h-12 w-12 text-blue-600" />
            </div>
            <h2 className="text-xl font-medium text-gray-800 mb-2">
              No Models Available
            </h2>
            <p className="text-gray-500 mb-6 text-center max-w-md">
              Train your first model to see it in the registry.
            </p>
            <Button
              variant="primary"
              onClick={() => window.location.href = '/model-training'}
            >
              Go to Model Training
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {models.map((model) => (
            <Card
              key={model.id}
              className={`transition-all duration-200 hover:shadow-md ${
                model.id === activeModel?.id ? 'border-2 border-blue-500' : ''
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div className="mb-4 md:mb-0">
                  <div className="flex items-center mb-2">
                    <h3 className="text-xl font-semibold text-gray-800 mr-2">{model.name}</h3>
                    {model.id === activeModel?.id && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-gray-500 mb-2">{model.description}</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100">
                      {model.algorithm}
                    </span>
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100">
                      <Tag className="h-3 w-3 mr-1" />
                      v{model.version}
                    </span>
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100">
                      <Clock className="h-3 w-3 mr-1" />
                      {new Date(model.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<Download size={14} />}
                  >
                    Export Model
                  </Button>
                  
                  {model.id !== activeModel?.id ? (
                    <Button
                      variant="primary"
                      size="sm"
                      leftIcon={<CheckCircle size={14} />}
                      onClick={() => handleModelActivation(model.id)}
                    >
                      Activate Model
                    </Button>
                  ) : (
                    <Button
                      variant="secondary"
                      size="sm"
                      leftIcon={<MoreHorizontal size={14} />}
                    >
                      Actions
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="mt-6 border-t border-gray-200 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Accuracy</div>
                    <div className="text-lg font-semibold text-gray-800">89.2%</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">F1 Score</div>
                    <div className="text-lg font-semibold text-gray-800">0.863</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">AUC</div>
                    <div className="text-lg font-semibold text-gray-800">0.912</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Dataset</div>
                    <div className="text-sm font-medium text-gray-800 truncate">
                      Loan Approval Dataset
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <details className="group">
                  <summary className="list-none flex items-center cursor-pointer">
                    <span className="text-sm text-gray-500 flex items-center">
                      <span className="mr-1">Model Parameters</span>
                      <svg 
                        className="h-4 w-4 transition-transform transform group-open:rotate-180" 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 20 20" 
                        fill="currentColor"
                      >
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </span>
                  </summary>
                  <div className="mt-3 text-sm">
                    <pre className="bg-gray-50 p-3 rounded-md text-xs overflow-x-auto">
                      {JSON.stringify(model.parameters, null, 2)}
                    </pre>
                  </div>
                </details>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ModelRegistry;