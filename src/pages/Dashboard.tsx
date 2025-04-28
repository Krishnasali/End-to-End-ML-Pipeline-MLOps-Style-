import React from 'react';
import { Activity, Database, BarChart2, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';
import Card from '../components/common/Card';
import { useML } from '../context/MLContext';
import LineChart from '../components/charts/LineChart';

const Dashboard: React.FC = () => {
  const { datasets, models, activeModel, evaluationMetrics, trainHistory } = useML();
  
  const accuracyData = trainHistory.map((step, index) => ({
    x: step.epoch,
    y: step.accuracy
  }));
  
  const lossData = trainHistory.map((step, index) => ({
    x: step.epoch,
    y: step.loss
  }));
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">ML Pipeline Dashboard</h1>
        <div className="text-sm text-gray-500">Last updated: {new Date().toLocaleString()}</div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="flex flex-col">
          <div className="flex items-center mb-2">
            <Database className="h-5 w-5 text-blue-500 mr-2" />
            <h3 className="text-sm font-medium text-gray-500">Datasets</h3>
          </div>
          <div className="text-3xl font-bold text-gray-800 mb-1">{datasets.length}</div>
          <div className="text-sm text-gray-500">Total datasets available</div>
        </Card>
        
        <Card className="flex flex-col">
          <div className="flex items-center mb-2">
            <BarChart2 className="h-5 w-5 text-teal-500 mr-2" />
            <h3 className="text-sm font-medium text-gray-500">Models</h3>
          </div>
          <div className="text-3xl font-bold text-gray-800 mb-1">{models.length}</div>
          <div className="text-sm text-gray-500">Trained models</div>
        </Card>
        
        <Card className="flex flex-col">
          <div className="flex items-center mb-2">
            <Activity className="h-5 w-5 text-amber-500 mr-2" />
            <h3 className="text-sm font-medium text-gray-500">Accuracy</h3>
          </div>
          <div className="text-3xl font-bold text-gray-800 mb-1">
            {evaluationMetrics ? `${(evaluationMetrics.accuracy * 100).toFixed(1)}%` : 'N/A'}
          </div>
          <div className="text-sm text-gray-500">Current model accuracy</div>
        </Card>
        
        <Card className="flex flex-col">
          <div className="flex items-center mb-2">
            <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
            <h3 className="text-sm font-medium text-gray-500">Deployment Status</h3>
          </div>
          <div className="text-3xl font-bold text-gray-800 mb-1">
            {activeModel ? 'Active' : 'Not Deployed'}
          </div>
          <div className="text-sm text-gray-500">
            {activeModel ? `Model: ${activeModel.name}` : 'No model deployed'}
          </div>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {trainHistory.length > 0 && (
          <Card title="Training History">
            <LineChart 
              data={accuracyData} 
              xAxisLabel="Epoch" 
              yAxisLabel="Accuracy"
              color="#3B82F6"
              height={250}
            />
          </Card>
        )}
        
        {trainHistory.length > 0 && (
          <Card title="Loss Curve">
            <LineChart 
              data={lossData} 
              xAxisLabel="Epoch" 
              yAxisLabel="Loss"
              color="#F59E0B"
              height={250}
            />
          </Card>
        )}
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <Card title="ML Pipeline Workflow">
          <div className="relative">
            <div className="absolute top-0 left-1/2 w-0.5 h-full bg-gray-200 transform -translate-x-1/2"></div>
            
            <div className="relative z-10 flex items-start mb-8">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                <Database className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">1. Data Upload</h3>
                <p className="text-gray-600 mt-1">Upload your dataset to begin the ML pipeline process.</p>
                <p className="text-sm text-gray-500 mt-2">Status: {datasets.length > 0 ? 'Completed' : 'Pending'}</p>
              </div>
              <div className="ml-auto flex-shrink-0">
                {datasets.length > 0 ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Complete
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    <Clock className="h-3 w-3 mr-1" />
                    Pending
                  </span>
                )}
              </div>
            </div>
            
            <div className="relative z-10 flex items-start mb-8">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                <BarChart2 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">2. Data Exploration</h3>
                <p className="text-gray-600 mt-1">Explore and visualize your data to gain insights.</p>
                <p className="text-sm text-gray-500 mt-2">Status: {datasets.length > 0 ? 'Available' : 'Waiting for data'}</p>
              </div>
              <div className="ml-auto flex-shrink-0">
                {datasets.length > 0 ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Available
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Waiting
                  </span>
                )}
              </div>
            </div>
            
            <div className="relative z-10 flex items-start mb-8">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                <Activity className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">3. Model Training</h3>
                <p className="text-gray-600 mt-1">Train machine learning models with your data.</p>
                <p className="text-sm text-gray-500 mt-2">Status: {models.length > 0 ? `${models.length} models trained` : 'No models yet'}</p>
              </div>
              <div className="ml-auto flex-shrink-0">
                {models.length > 0 ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Completed
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    <Clock className="h-3 w-3 mr-1" />
                    Pending
                  </span>
                )}
              </div>
            </div>
            
            <div className="relative z-10 flex items-start">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                <CheckCircle2 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">4. Deployment & Prediction</h3>
                <p className="text-gray-600 mt-1">Deploy your model and make predictions.</p>
                <p className="text-sm text-gray-500 mt-2">Status: {activeModel ? 'Model deployed' : 'No active model'}</p>
              </div>
              <div className="ml-auto flex-shrink-0">
                {activeModel ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Deployed
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    <Clock className="h-3 w-3 mr-1" />
                    Pending
                  </span>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;