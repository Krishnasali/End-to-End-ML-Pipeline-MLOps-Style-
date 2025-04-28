import React from 'react';
import { ConfusionMatrixType } from '../../utils/types';

interface ConfusionMatrixProps {
  matrix: ConfusionMatrixType;
}

const ConfusionMatrix: React.FC<ConfusionMatrixProps> = ({ matrix }) => {
  const total = matrix.truePositives + matrix.falsePositives + matrix.trueNegatives + matrix.falseNegatives;
  
  const getTruePositiveRate = () => {
    const denominator = matrix.truePositives + matrix.falseNegatives;
    return denominator === 0 ? 0 : (matrix.truePositives / denominator);
  };
  
  const getFalsePositiveRate = () => {
    const denominator = matrix.falsePositives + matrix.trueNegatives;
    return denominator === 0 ? 0 : (matrix.falsePositives / denominator);
  };
  
  const getColorIntensity = (value: number, max: number) => {
    const intensity = Math.min(0.9, (value / max) * 0.8 + 0.1);
    return intensity;
  };
  
  const truePositiveIntensity = getColorIntensity(matrix.truePositives, total * 0.5);
  const falsePositiveIntensity = getColorIntensity(matrix.falsePositives, total * 0.5);
  const falseNegativeIntensity = getColorIntensity(matrix.falseNegatives, total * 0.5);
  const trueNegativeIntensity = getColorIntensity(matrix.trueNegatives, total * 0.5);
  
  return (
    <div className="w-full">
      <div className="grid grid-cols-2 gap-4 mb-2">
        <div className="text-center">
          <div className="text-sm font-medium text-gray-500">True Positive Rate</div>
          <div className="text-lg font-bold text-gray-800">
            {(getTruePositiveRate() * 100).toFixed(1)}%
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm font-medium text-gray-500">False Positive Rate</div>
          <div className="text-lg font-bold text-gray-800">
            {(getFalsePositiveRate() * 100).toFixed(1)}%
          </div>
        </div>
      </div>
      
      <div className="relative grid grid-cols-2 gap-px bg-gray-200 rounded-lg overflow-hidden">
        {/* Labels */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-6 text-sm font-medium text-gray-500">
          Predicted
        </div>
        <div className="absolute top-1/2 left-0 transform -translate-x-12 -translate-y-1/2 text-sm font-medium text-gray-500 rotate-270" style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
          Actual
        </div>
        
        {/* Column Headers */}
        <div className="absolute top-0 left-1/4 transform -translate-x-1/2 -translate-y-10 text-xs font-medium text-gray-600">
          Positive
        </div>
        <div className="absolute top-0 left-3/4 transform -translate-x-1/2 -translate-y-10 text-xs font-medium text-gray-600">
          Negative
        </div>
        
        {/* Row Headers */}
        <div className="absolute top-1/4 left-0 transform -translate-x-6 -translate-y-1/2 text-xs font-medium text-gray-600">
          Positive
        </div>
        <div className="absolute top-3/4 left-0 transform -translate-x-6 -translate-y-1/2 text-xs font-medium text-gray-600">
          Negative
        </div>
        
        {/* Matrix cells */}
        <div 
          className="flex items-center justify-center p-6 bg-green-50" 
          style={{ backgroundColor: `rgba(34, 197, 94, ${truePositiveIntensity})` }}
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{matrix.truePositives}</div>
            <div className="text-xs font-medium text-gray-500 mt-1">True Positive</div>
          </div>
        </div>
        
        <div 
          className="flex items-center justify-center p-6 bg-red-50"
          style={{ backgroundColor: `rgba(239, 68, 68, ${falsePositiveIntensity})` }}
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{matrix.falsePositives}</div>
            <div className="text-xs font-medium text-gray-500 mt-1">False Positive</div>
          </div>
        </div>
        
        <div 
          className="flex items-center justify-center p-6 bg-red-50"
          style={{ backgroundColor: `rgba(239, 68, 68, ${falseNegativeIntensity})` }}
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{matrix.falseNegatives}</div>
            <div className="text-xs font-medium text-gray-500 mt-1">False Negative</div>
          </div>
        </div>
        
        <div 
          className="flex items-center justify-center p-6 bg-green-50"
          style={{ backgroundColor: `rgba(34, 197, 94, ${trueNegativeIntensity})` }}
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{matrix.trueNegatives}</div>
            <div className="text-xs font-medium text-gray-500 mt-1">True Negative</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfusionMatrix;