export interface FeatureType {
  name: string;
  type: 'numeric' | 'categorical';
  importance: number;
}

export interface DatasetType {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  rows: number;
  columns: number;
  features: FeatureType[];
  data: any[];
  targetColumn: string;
}

export interface ModelType {
  id: string;
  name: string;
  description: string;
  algorithm: string;
  createdAt: string;
  datasetId: string;
  parameters: Record<string, any>;
  version: string;
  status: 'training' | 'active' | 'archived';
}

export interface ConfusionMatrixType {
  truePositives: number;
  falsePositives: number;
  trueNegatives: number;
  falseNegatives: number;
}

export interface EvaluationMetricsType {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  auc: number;
  confusionMatrix: ConfusionMatrixType;
}

export interface ChartDataPoint {
  x: number | string;
  y: number;
}

export interface TrainingConfig {
  modelName: string;
  description: string;
  algorithm: string;
  parameters: Record<string, any>;
  trainingPercentage: number;
  seed: number;
}

export interface PredictionInput {
  age: number;
  income: number;
  loan_amount: number;
  loan_term: number;
  credit_score: number;
  employment_length: number;
  home_ownership: string;
  loan_purpose: string;
  debt_to_income: number;
  has_default: string;
}

export interface PredictionResult {
  approved: boolean;
  probability: number;
  confidence: number;
}