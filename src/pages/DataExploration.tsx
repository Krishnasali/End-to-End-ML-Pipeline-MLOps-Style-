import React, { useState } from 'react';
import { BarChart as BarChartIcon, ChevronDown, ChevronUp } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import BarChart from '../components/charts/BarChart';
import { useML } from '../context/MLContext';

const DataExploration: React.FC = () => {
  const { activeDataset, getFeatureImportance } = useML();
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [showDataTable, setShowDataTable] = useState(false);
  
  if (!activeDataset) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="text-xl font-medium text-gray-600 mb-4">No dataset available</div>
        <p className="text-gray-500 mb-6 text-center max-w-md">
          Please upload or select a dataset to begin exploration.
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
  
  const featureImportances = getFeatureImportance().map(feature => ({
    x: feature.name,
    y: feature.importance
  }));
  
  // Generate histogram data for selected feature
  const generateHistogramData = (featureName: string) => {
    if (!activeDataset || !featureName) return [];
    
    const feature = activeDataset.features.find(f => f.name === featureName);
    if (!feature) return [];
    
    if (feature.type === 'categorical') {
      // For categorical data, count occurrences of each category
      const counts: Record<string, number> = {};
      
      activeDataset.data.forEach(item => {
        const value = item[featureName];
        if (value in counts) {
          counts[value]++;
        } else {
          counts[value] = 1;
        }
      });
      
      return Object.entries(counts).map(([cat, count]) => ({
        x: cat,
        y: count
      }));
    } else {
      // For numerical data, create bins
      const values = activeDataset.data.map(item => parseFloat(item[featureName]));
      const min = Math.min(...values);
      const max = Math.max(...values);
      const binCount = 10;
      const binWidth = (max - min) / binCount;
      
      const bins = Array(binCount).fill(0);
      
      values.forEach(value => {
        const binIndex = Math.min(Math.floor((value - min) / binWidth), binCount - 1);
        bins[binIndex]++;
      });
      
      return bins.map((count, i) => ({
        x: `${(min + i * binWidth).toFixed(1)}-${(min + (i + 1) * binWidth).toFixed(1)}`,
        y: count
      }));
    }
  };
  
  const histogramData = selectedFeature ? generateHistogramData(selectedFeature) : [];
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Data Exploration</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card title="Feature Importance">
            <BarChart 
              data={featureImportances} 
              xAxisLabel="Features" 
              yAxisLabel="Importance Score"
              height={300}
            />
          </Card>
          
          {selectedFeature && (
            <Card title={`Distribution: ${selectedFeature}`} className="mt-6">
              <BarChart 
                data={histogramData} 
                xAxisLabel={selectedFeature} 
                yAxisLabel="Count"
                color="#16A34A"
                height={250}
              />
            </Card>
          )}
        </div>
        
        <div>
          <Card title="Features">
            <div className="space-y-4">
              {activeDataset.features.map((feature) => (
                <div 
                  key={feature.name} 
                  className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                    selectedFeature === feature.name 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                  onClick={() => setSelectedFeature(feature.name)}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-gray-800">{feature.name}</h3>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      feature.type === 'numeric'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-teal-100 text-teal-800'
                    }`}>
                      {feature.type}
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    Importance: {(feature.importance * 100).toFixed(1)}%
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1.5">
                    <div 
                      className="bg-blue-600 h-1.5 rounded-full" 
                      style={{ width: `${feature.importance * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          
          <Card title="Dataset Preview" className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <div className="text-sm text-gray-500">
                {activeDataset.rows} rows × {activeDataset.columns} columns
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDataTable(!showDataTable)}
                rightIcon={showDataTable ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              >
                {showDataTable ? 'Hide data' : 'Show data'}
              </Button>
            </div>
            
            {showDataTable && (
              <div className="border border-gray-200 rounded-lg overflow-auto max-h-96">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {activeDataset.features.slice(0, 5).map((feature) => (
                        <th 
                          key={feature.name}
                          className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {feature.name}
                        </th>
                      ))}
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {activeDataset.targetColumn}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {activeDataset.data.slice(0, 10).map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {activeDataset.features.slice(0, 5).map((feature) => (
                          <td key={feature.name} className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                            {row[feature.name]}
                          </td>
                        ))}
                        <td className="px-3 py-2 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            row[activeDataset.targetColumn] 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {row[activeDataset.targetColumn] ? 'Approved' : 'Rejected'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="bg-gray-50 px-3 py-2 text-xs text-gray-500 border-t border-gray-200">
                  Showing 10 of {activeDataset.rows} rows
                </div>
              </div>
            )}
            
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-600 mb-2">Summary Statistics</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Approved loans:</span>
                    <span className="font-medium text-gray-800">56%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Rejected loans:</span>
                    <span className="font-medium text-gray-800">44%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Avg. credit score:</span>
                    <span className="font-medium text-gray-800">680</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Avg. loan amount:</span>
                    <span className="font-medium text-gray-800">$24,500</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Avg. income:</span>
                    <span className="font-medium text-gray-800">$78,300</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Most common term:</span>
                    <span className="font-medium text-gray-800">60 months</span>
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

export default DataExploration;