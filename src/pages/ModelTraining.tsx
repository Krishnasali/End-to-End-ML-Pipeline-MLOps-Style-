import React, { useState } from 'react';
import { Codepen as CodepenCircle, AlertTriangle, Settings, Save } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import LineChart from '../components/charts/LineChart';
import { useML } from '../context/MLContext';

const ModelTraining: React.FC = () => {
  const { 
    activeDataset, 
    isTraining, 
    trainHistory, 
    startTraining 
  } = useML();
  
  const [modelConfig, setModelConfig] = useState({
    modelName: 'Loan Approval Model',
    description: 'Model for predicting loan approvals',
    algorithm: 'Random Forest',
    parameters: {
      max_depth: 10,
      n_estimators: 100,
      criterion: 'gini'
    },
    trainingPercentage: 80,
    seed: 42
  });
  
  const handleParamChange = (paramName: string, value: string | number) => {
    setModelConfig(prev => ({
      ...prev,
      parameters: {
        ...prev.parameters,
        [paramName]: value
      }
    }));
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setModelConfig(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleTrainingStart = () => {
    startTraining(modelConfig);
  };
  
  const accuracyData = trainHistory.map((step, index) => ({
    x: step.epoch,
    y: step.accuracy
  }));
  
  const lossData = trainHistory.map((step, index) => ({
    x: step.epoch,
    y: step.loss
  }));
  
  if (!activeDataset) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
        <div className="text-xl font-medium text-gray-600 mb-4">No dataset available</div>
        <p className="text-gray-500 mb-6 text-center max-w-md">
          Please upload or select a dataset before training a model.
        </p>
        <Button
          variant="primary"
          onClick={() => window.location.href = '/data-upload'}
        >
          Go to Data Upload
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Model Training</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card title="Training Configuration">
            <div className="space-y-4">
              <div>
                <label htmlFor="modelName" className="block text-sm font-medium text-gray-700 mb-1">
                  Model Name
                </label>
                <input
                  type="text"
                  id="modelName"
                  name="modelName"
                  value={modelConfig.modelName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="algorithm" className="block text-sm font-medium text-gray-700 mb-1">
                  Algorithm
                </label>
                <select
                  id="algorithm"
                  name="algorithm"
                  value={modelConfig.algorithm}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Random Forest">Random Forest</option>
                  <option value="Gradient Boosting">Gradient Boosting</option>
                  <option value="Logistic Regression">Logistic Regression</option>
                  <option value="Neural Network">Neural Network</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={modelConfig.description}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Model Parameters
                  </label>
                  <Button 
                    variant="outline" 
                    size="sm"
                    leftIcon={<Settings size={14} />}
                  >
                    Advanced
                  </Button>
                </div>
                
                {modelConfig.algorithm === 'Random Forest' && (
                  <div className="space-y-3 border border-gray-200 rounded-md p-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <label htmlFor="n_estimators" className="block text-xs font-medium text-gray-500">
                          Number of Trees
                        </label>
                        <span className="text-xs text-gray-500">{modelConfig.parameters.n_estimators}</span>
                      </div>
                      <input
                        type="range"
                        id="n_estimators"
                        min="10"
                        max="500"
                        step="10"
                        value={modelConfig.parameters.n_estimators}
                        onChange={(e) => handleParamChange('n_estimators', parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <label htmlFor="max_depth" className="block text-xs font-medium text-gray-500">
                          Max Depth
                        </label>
                        <span className="text-xs text-gray-500">{modelConfig.parameters.max_depth}</span>
                      </div>
                      <input
                        type="range"
                        id="max_depth"
                        min="1"
                        max="30"
                        value={modelConfig.parameters.max_depth}
                        onChange={(e) => handleParamChange('max_depth', parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="criterion" className="block text-xs font-medium text-gray-500 mb-1">
                        Split Criterion
                      </label>
                      <select
                        id="criterion"
                        value={modelConfig.parameters.criterion}
                        onChange={(e) => handleParamChange('criterion', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="gini">Gini</option>
                        <option value="entropy">Entropy</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <label htmlFor="trainingPercentage" className="block text-sm font-medium text-gray-700">
                    Training Split
                  </label>
                  <span className="text-sm text-gray-500">{modelConfig.trainingPercentage}%</span>
                </div>
                <input
                  type="range"
                  id="trainingPercentage"
                  min="50"
                  max="90"
                  step="5"
                  value={modelConfig.trainingPercentage}
                  onChange={(e) => handleInputChange({
                    target: {
                      name: 'trainingPercentage',
                      value: parseInt(e.target.value)
                    }
                  } as any)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Train: {modelConfig.trainingPercentage}%</span>
                  <span>Test: {100 - modelConfig.trainingPercentage}%</span>
                </div>
              </div>
              
              <div className="pt-4">
                <Button
                  variant="primary"
                  className="w-full"
                  leftIcon={<CodepenCircle size={18} />}
                  isLoading={isTraining}
                  onClick={handleTrainingStart}
                >
                  {isTraining ? 'Training in Progress...' : 'Start Training'}
                </Button>
              </div>
            </div>
          </Card>
          
          <Card title="Dataset Information" className="mt-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Dataset:</span>
                <span className="text-sm font-medium text-gray-800">{activeDataset.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Rows:</span>
                <span className="text-sm font-medium text-gray-800">{activeDataset.rows}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Features:</span>
                <span className="text-sm font-medium text-gray-800">{activeDataset.features.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Target Variable:</span>
                <span className="text-sm font-medium text-gray-800">{activeDataset.targetColumn}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Class Balance:</span>
                <span className="text-sm font-medium text-gray-800">56% / 44%</span>
              </div>
            </div>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          {isTraining || trainHistory.length > 0 ? (
            <>
              <Card title="Training Progress">
                <div className="flex items-center mb-4">
                  {isTraining ? (
                    <div className="flex items-center text-amber-600">
                      <div className="h-3 w-3 rounded-full bg-amber-500 animate-pulse mr-2"></div>
                      <span className="font-medium">Training in progress...</span>
                    </div>
                  ) : trainHistory.length > 0 ? (
                    <div className="flex items-center text-green-600">
                      <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                      <span className="font-medium">Training complete</span>
                    </div>
                  ) : null}
                  
                  {!isTraining && trainHistory.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="ml-auto"
                      leftIcon={<Save size={14} />}
                    >
                      Save Model
                    </Button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Accuracy Curve
                    </h4>
                    <LineChart 
                      data={accuracyData} 
                      xAxisLabel="Epoch" 
                      yAxisLabel="Accuracy"
                      color="#10B981"
                      animated={isTraining}
                    />
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Loss Curve
                    </h4>
                    <LineChart 
                      data={lossData} 
                      xAxisLabel="Epoch" 
                      yAxisLabel="Loss"
                      color="#F59E0B"
                      animated={isTraining}
                    />
                  </div>
                </div>
                
                {trainHistory.length > 0 && (
                  <div className="mt-6 border-t border-gray-200 pt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Training Log
                    </h4>
                    <div className="bg-gray-50 rounded-md p-3 h-36 overflow-y-auto font-mono text-xs">
                      {trainHistory.map((step, i) => (
                        <div key={i} className="mb-1">
                          <span className="text-gray-500">[Epoch {step.epoch}]</span>
                          <span className="text-blue-600 ml-2">loss: {step.loss.toFixed(4)},</span>
                          <span className="text-green-600 ml-2">accuracy: {step.accuracy.toFixed(4)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
              
              {!isTraining && trainHistory.length > 0 && (
                <Card title="Early Stopping Analysis" className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border border-gray-200 rounded-md p-3">
                      <div className="text-sm font-medium text-gray-600 mb-1">Best Epoch</div>
                      <div className="text-2xl font-bold text-gray-800">{trainHistory.length}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        No early stopping triggered
                      </div>
                    </div>
                    
                    <div className="border border-gray-200 rounded-md p-3">
                      <div className="text-sm font-medium text-gray-600 mb-1">Final Loss</div>
                      <div className="text-2xl font-bold text-gray-800">
                        {trainHistory[trainHistory.length - 1]?.loss.toFixed(4)}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Decreased steadily during training
                      </div>
                    </div>
                    
                    <div className="border border-gray-200 rounded-md p-3">
                      <div className="text-sm font-medium text-gray-600 mb-1">Final Accuracy</div>
                      <div className="text-2xl font-bold text-gray-800">
                        {trainHistory[trainHistory.length - 1]?.accuracy.toFixed(4)}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Increased steadily during training
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 border-t border-gray-200 pt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Hyperparameter Effectiveness
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-600">max_depth = {modelConfig.parameters.max_depth}</span>
                          <span className="text-xs px-2 py-0.5 bg-green-100 text-green-800 rounded-full">Optimal</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="bg-green-600 h-1.5 rounded-full" style={{ width: '90%' }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-600">n_estimators = {modelConfig.parameters.n_estimators}</span>
                          <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full">Good</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: '75%' }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-600">criterion = {modelConfig.parameters.criterion}</span>
                          <span className="text-xs px-2 py-0.5 bg-green-100 text-green-800 rounded-full">Optimal</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="bg-green-600 h-1.5 rounded-full" style={{ width: '95%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              )}
            </>
          ) : (
            <Card>
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-24 h-24 mb-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <CodepenCircle className="h-12 w-12 text-blue-600" />
                </div>
                <h2 className="text-xl font-medium text-gray-800 mb-2">
                  Ready to Train Your Model
                </h2>
                <p className="text-gray-500 mb-6 text-center max-w-md">
                  Configure your model parameters on the left and click "Start Training" to begin the training process.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl">
                  <div className="flex flex-col items-center text-center p-4 border border-gray-200 rounded-lg">
                    <div className="text-gray-400 mb-2">Step 1</div>
                    <div className="font-medium text-gray-800">Configure Model</div>
                  </div>
                  <div className="flex flex-col items-center text-center p-4 border border-gray-200 rounded-lg">
                    <div className="text-gray-400 mb-2">Step 2</div>
                    <div className="font-medium text-gray-800">Train Model</div>
                  </div>
                  <div className="flex flex-col items-center text-center p-4 border border-gray-200 rounded-lg">
                    <div className="text-gray-400 mb-2">Step 3</div>
                    <div className="font-medium text-gray-800">Evaluate Results</div>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModelTraining;