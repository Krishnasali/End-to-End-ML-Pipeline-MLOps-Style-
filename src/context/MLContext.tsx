import React, { createContext, useContext, useState, ReactNode } from 'react';
import { DatasetType, ModelType, FeatureType, EvaluationMetricsType } from '../utils/types';
import { dummyLoanData } from '../utils/dummyData';

interface MLContextType {
  datasets: DatasetType[];
  models: ModelType[];
  activeDataset: DatasetType | null;
  activeModel: ModelType | null;
  isTraining: boolean;
  trainHistory: any[];
  evaluationMetrics: EvaluationMetricsType | null;
  addDataset: (dataset: DatasetType) => void;
  setActiveDataset: (datasetId: string) => void;
  addModel: (model: ModelType) => void;
  setActiveModel: (modelId: string) => void;
  startTraining: (config: any) => Promise<void>;
  predict: (data: any) => Promise<any>;
  getFeatureImportance: () => FeatureType[];
}

const MLContext = createContext<MLContextType | undefined>(undefined);

export const MLContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [datasets, setDatasets] = useState<DatasetType[]>([
    {
      id: 'default-dataset',
      name: 'Loan Approval Dataset',
      description: 'Default dataset for loan approval prediction',
      createdAt: new Date().toISOString(),
      rows: 1000,
      columns: 10,
      features: [
        { name: 'age', type: 'numeric', importance: 0.15 },
        { name: 'income', type: 'numeric', importance: 0.25 },
        { name: 'loan_amount', type: 'numeric', importance: 0.2 },
        { name: 'loan_term', type: 'numeric', importance: 0.1 },
        { name: 'credit_score', type: 'numeric', importance: 0.3 },
        { name: 'employment_length', type: 'numeric', importance: 0.12 },
        { name: 'home_ownership', type: 'categorical', importance: 0.08 },
        { name: 'loan_purpose', type: 'categorical', importance: 0.05 },
        { name: 'debt_to_income', type: 'numeric', importance: 0.18 },
        { name: 'has_default', type: 'categorical', importance: 0.07 }
      ],
      data: dummyLoanData(),
      targetColumn: 'approved'
    }
  ]);
  
  const [activeDataset, setActiveDatasetState] = useState<DatasetType | null>(datasets[0]);
  const [models, setModels] = useState<ModelType[]>([]);
  const [activeModel, setActiveModelState] = useState<ModelType | null>(null);
  const [isTraining, setIsTraining] = useState<boolean>(false);
  const [trainHistory, setTrainHistory] = useState<any[]>([]);
  const [evaluationMetrics, setEvaluationMetrics] = useState<EvaluationMetricsType | null>(null);

  const addDataset = (dataset: DatasetType) => {
    setDatasets([...datasets, dataset]);
  };

  const setActiveDataset = (datasetId: string) => {
    const dataset = datasets.find(d => d.id === datasetId) || null;
    setActiveDatasetState(dataset);
  };

  const addModel = (model: ModelType) => {
    setModels([...models, model]);
  };

  const setActiveModel = (modelId: string) => {
    const model = models.find(m => m.id === modelId) || null;
    setActiveModelState(model);
  };

  const startTraining = async (config: any) => {
    if (!activeDataset) return;
    
    setIsTraining(true);
    
    // Simulate training process
    const trainingSteps = 10;
    const newHistory: any[] = [];
    
    for (let i = 1; i <= trainingSteps; i++) {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const step = {
        epoch: i,
        loss: 0.5 * Math.pow(0.85, i) + Math.random() * 0.05,
        accuracy: 0.7 + (0.2 * (i / trainingSteps)) + (Math.random() * 0.05 - 0.025)
      };
      
      newHistory.push(step);
      setTrainHistory([...newHistory]);
    }
    
    // Generate model
    const newModel: ModelType = {
      id: `model-${Date.now()}`,
      name: config.modelName || `Model ${models.length + 1}`,
      description: config.description || 'Trained model for loan approval prediction',
      algorithm: config.algorithm || 'Random Forest',
      createdAt: new Date().toISOString(),
      datasetId: activeDataset.id,
      parameters: config.parameters || {
        max_depth: 10,
        n_estimators: 100,
        criterion: 'gini'
      },
      version: '1.0',
      status: 'active'
    };
    
    // Generate evaluation metrics
    const metrics: EvaluationMetricsType = {
      accuracy: 0.89 + (Math.random() * 0.04 - 0.02),
      precision: 0.87 + (Math.random() * 0.05 - 0.025),
      recall: 0.85 + (Math.random() * 0.06 - 0.03),
      f1Score: 0.86 + (Math.random() * 0.05 - 0.025),
      auc: 0.91 + (Math.random() * 0.03 - 0.015),
      confusionMatrix: {
        truePositives: 430 + Math.floor(Math.random() * 20),
        falsePositives: 60 + Math.floor(Math.random() * 15),
        trueNegatives: 440 + Math.floor(Math.random() * 20),
        falseNegatives: 70 + Math.floor(Math.random() * 15)
      }
    };
    
    setEvaluationMetrics(metrics);
    addModel(newModel);
    setActiveModelState(newModel);
    setIsTraining(false);
  };

  const predict = async (data: any) => {
    if (!activeModel) throw new Error('No active model selected');
    
    // Simulate prediction process
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Simple prediction logic based on some of the key features
    // This is a simplified version just for demonstration
    let probabilityApproved = 0.5; // base probability
    
    if (data.credit_score > 700) probabilityApproved += 0.2;
    else if (data.credit_score < 600) probabilityApproved -= 0.2;
    
    if (data.income > 80000) probabilityApproved += 0.15;
    else if (data.income < 40000) probabilityApproved -= 0.15;
    
    if (data.loan_amount > 200000) probabilityApproved -= 0.1;
    
    if (data.debt_to_income > 0.4) probabilityApproved -= 0.2;
    
    if (data.has_default === 'yes') probabilityApproved -= 0.25;
    
    // Add some randomness
    probabilityApproved += (Math.random() * 0.1 - 0.05);
    
    // Clamp between 0 and 1
    probabilityApproved = Math.max(0, Math.min(1, probabilityApproved));
    
    return {
      approved: probabilityApproved > 0.5,
      probability: probabilityApproved,
      confidence: Math.abs(probabilityApproved - 0.5) * 2 // higher when far from decision boundary
    };
  };

  const getFeatureImportance = () => {
    if (!activeDataset) return [];
    return [...activeDataset.features].sort((a, b) => b.importance - a.importance);
  };

  return (
    <MLContext.Provider
      value={{
        datasets,
        models,
        activeDataset,
        activeModel,
        isTraining,
        trainHistory,
        evaluationMetrics,
        addDataset,
        setActiveDataset,
        addModel,
        setActiveModel,
        startTraining,
        predict,
        getFeatureImportance
      }}
    >
      {children}
    </MLContext.Provider>
  );
};

export const useML = () => {
  const context = useContext(MLContext);
  if (context === undefined) {
    throw new Error('useML must be used within a MLContextProvider');
  }
  return context;
};