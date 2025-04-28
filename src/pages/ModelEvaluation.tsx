import React from 'react';
import { Activity, AlertCircle, CheckCircle } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import ConfusionMatrix from '../components/visualization/ConfusionMatrix';
import BarChart from '../components/charts/BarChart';
import { useML } from '../context/MLContext';

const ModelEvaluation: React.FC = () => {
  const { 
    activeModel, 
    models, 
    evaluationMetrics, 
    activeDataset,
    getFeatureImportance
  } = useML();
  
  if (!activeModel || !evaluationMetrics) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <AlertCircle className="h-12 w-12 text-amber-500 mb-4" />
        <div className="text-xl font-medium text-gray-600 mb-4">No trained model available</div>
        <p className="text-gray-500 mb-6 text-center max-w-md">
          Please train a model before viewing evaluation metrics.
        </p>
        <Button
          variant="primary"
          onClick={() => window.location.href = '/model-training'}
        >
          Go to Model Training
        </Button>
      </div>
    );
  }
  
  const featureImportances = getFeatureImportance().slice(0, 10).map(feature => ({
    x: feature.name,
    y: feature.importance
  }));
  
  const metricData = [
    { x: 'Accuracy', y: evaluationMetrics.accuracy },
    { x: 'Precision', y: evaluationMetrics.precision },
    { x: 'Recall', y: evaluationMetrics.recall },
    { x: 'F1 Score', y: evaluationMetrics.f1Score },
    { x: 'AUC', y: evaluationMetrics.auc }
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Model Evaluation</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="flex flex-col justify-between">
          <div className="flex items-center mb-2">
            <Activity className="h-5 w-5 text-blue-500 mr-2" />
            <h3 className="text-sm font-medium text-gray-500">Accuracy</h3>
          </div>
          <div className="text-3xl font-bold text-gray-800 mb-1">
            {(evaluationMetrics.accuracy * 100).toFixed(1)}%
          </div>
          <div className="text-xs text-gray-500">Overall prediction accuracy</div>
        </Card>
        
        <Card className="flex flex-col justify-between">
          <div className="flex items-center mb-2">
            <Activity className="h-5 w-5 text-teal-500 mr-2" />
            <h3 className="text-sm font-medium text-gray-500">Precision</h3>
          </div>
          <div className="text-3xl font-bold text-gray-800 mb-1">
            {(evaluationMetrics.precision * 100).toFixed(1)}%
          </div>
          <div className="text-xs text-gray-500">Correctly predicted approvals</div>
        </Card>
        
        <Card className="flex flex-col justify-between">
          <div className="flex items-center mb-2">
            <Activity className="h-5 w-5 text-amber-500 mr-2" />
            <h3 className="text-sm font-medium text-gray-500">Recall</h3>
          </div>
          <div className="text-3xl font-bold text-gray-800 mb-1">
            {(evaluationMetrics.recall * 100).toFixed(1)}%
          </div>
          <div className="text-xs text-gray-500">Found approval rate</div>
        </Card>
        
        <Card className="flex flex-col justify-between">
          <div className="flex items-center mb-2">
            <Activity className="h-5 w-5 text-purple-500 mr-2" />
            <h3 className="text-sm font-medium text-gray-500">F1 Score</h3>
          </div>
          <div className="text-3xl font-bold text-gray-800 mb-1">
            {(evaluationMetrics.f1Score * 100).toFixed(1)}%
          </div>
          <div className="text-xs text-gray-500">Harmonic mean of precision & recall</div>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Performance Metrics">
          <BarChart 
            data={metricData}
            height={250}
            color="#3B82F6"
          />
        </Card>
        
        <Card title="Confusion Matrix">
          <ConfusionMatrix matrix={evaluationMetrics.confusionMatrix} />
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Feature Importance">
          <BarChart 
            data={featureImportances}
            height={300}
            color="#10B981"
          />
          <div className="mt-4 text-sm text-gray-500">
            Top 10 features by importance to model predictions
          </div>
        </Card>
        
        <div className="lg:col-span-2">
          <Card title="Model Insights">
            <div className="space-y-6">
              <div>
                <h3 className="text-md font-medium text-gray-800 mb-2">Key Performance Indicators</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="border border-gray-200 rounded-md p-3">
                    <div className="text-sm text-gray-500 mb-1">AUC-ROC</div>
                    <div className="text-xl font-bold text-gray-800">{evaluationMetrics.auc.toFixed(3)}</div>
                    {evaluationMetrics.auc > 0.9 ? (
                      <div className="flex items-center text-green-600 text-xs mt-1">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Excellent discrimination
                      </div>
                    ) : (
                      <div className="flex items-center text-amber-600 text-xs mt-1">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Good discrimination
                      </div>
                    )}
                  </div>
                  
                  <div className="border border-gray-200 rounded-md p-3">
                    <div className="text-sm text-gray-500 mb-1">Gini Coefficient</div>
                    <div className="text-xl font-bold text-gray-800">{(2 * evaluationMetrics.auc - 1).toFixed(3)}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      Calculated from AUC (2*AUC-1)
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-md font-medium text-gray-800 mb-2">Decision Thresholds</h3>
                <div className="border border-gray-200 rounded-md p-4">
                  <div className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-red-600 bg-red-200">
                          Reject
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">Threshold: 0.5</div>
                      <div>
                        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-200">
                          Approve
                        </span>
                      </div>
                    </div>
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                      <div style={{ width: "50%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-500"></div>
                      <div style={{ width: "50%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"></div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-center text-xs font-medium">
                    <div className="bg-gray-100 rounded p-2">
                      <div className="text-gray-500">Balanced</div>
                      <div className="text-gray-800 mt-1">0.50</div>
                    </div>
                    <div className="bg-gray-100 rounded p-2">
                      <div className="text-gray-500">Max F1</div>
                      <div className="text-gray-800 mt-1">0.48</div>
                    </div>
                    <div className="bg-gray-100 rounded p-2 border-2 border-blue-500">
                      <div className="text-blue-600">Current</div>
                      <div className="text-gray-800 mt-1">0.50</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-md font-medium text-gray-800 mb-2">Error Analysis</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600">High income, low credit score loans</span>
                      <span className="text-xs font-medium text-amber-600">24% error rate</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: '24%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600">First-time borrowers</span>
                      <span className="text-xs font-medium text-red-600">32% error rate</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div className="bg-red-500 h-1.5 rounded-full" style={{ width: '32%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600">Self-employed applicants</span>
                      <span className="text-xs font-medium text-amber-600">18% error rate</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: '18%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ModelEvaluation;