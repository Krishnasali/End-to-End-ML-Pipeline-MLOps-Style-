import React, { useState } from 'react';
import { CheckCircle as CircleCheck, AlertCircle, TargetIcon, ArrowRight, RefreshCw } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { useML } from '../context/MLContext';
import { PredictionInput, PredictionResult } from '../utils/types';

const Prediction: React.FC = () => {
  const { activeModel, activeDataset, predict } = useML();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  
  const [formState, setFormState] = useState<PredictionInput>({
    age: 35,
    income: 80000,
    loan_amount: 30000,
    loan_term: 60,
    credit_score: 720,
    employment_length: 8,
    home_ownership: 'RENT',
    loan_purpose: 'DEBT_CONSOLIDATION',
    debt_to_income: 0.25,
    has_default: 'no'
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormState({
      ...formState,
      [name]: type === 'number' ? parseFloat(value) : value
    });
  };
  
  const handlePrediction = async () => {
    if (!activeModel) return;
    
    setIsLoading(true);
    try {
      const result = await predict(formState);
      setResult(result);
    } catch (error) {
      console.error('Prediction error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const resetForm = () => {
    setFormState({
      age: 35,
      income: 80000,
      loan_amount: 30000,
      loan_term: 60,
      credit_score: 720,
      employment_length: 8,
      home_ownership: 'RENT',
      loan_purpose: 'DEBT_CONSOLIDATION',
      debt_to_income: 0.25,
      has_default: 'no'
    });
    setResult(null);
  };
  
  if (!activeModel) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <AlertCircle className="h-12 w-12 text-amber-500 mb-4" />
        <div className="text-xl font-medium text-gray-600 mb-4">No active model</div>
        <p className="text-gray-500 mb-6 text-center max-w-md">
          Please train and select a model before making predictions.
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
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Make Predictions</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card title="Loan Application Data">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Age
                </label>
                <div className="flex rounded-md shadow-sm">
                  <input
                    type="number"
                    name="age"
                    value={formState.age}
                    onChange={handleInputChange}
                    className="flex-1 min-w-0 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Annual Income ($)
                </label>
                <div className="flex rounded-md shadow-sm">
                  <input
                    type="number"
                    name="income"
                    value={formState.income}
                    onChange={handleInputChange}
                    className="flex-1 min-w-0 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Loan Amount ($)
                </label>
                <div className="flex rounded-md shadow-sm">
                  <input
                    type="number"
                    name="loan_amount"
                    value={formState.loan_amount}
                    onChange={handleInputChange}
                    className="flex-1 min-w-0 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Loan Term (months)
                </label>
                <select
                  name="loan_term"
                  value={formState.loan_term}
                  onChange={handleInputChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value={36}>36 months</option>
                  <option value={60}>60 months</option>
                  <option value={120}>120 months</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Credit Score
                </label>
                <div className="flex rounded-md shadow-sm">
                  <input
                    type="number"
                    name="credit_score"
                    min="300"
                    max="850"
                    value={formState.credit_score}
                    onChange={handleInputChange}
                    className="flex-1 min-w-0 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Employment Length (years)
                </label>
                <div className="flex rounded-md shadow-sm">
                  <input
                    type="number"
                    name="employment_length"
                    value={formState.employment_length}
                    onChange={handleInputChange}
                    className="flex-1 min-w-0 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Home Ownership
                </label>
                <select
                  name="home_ownership"
                  value={formState.home_ownership}
                  onChange={handleInputChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="RENT">Rent</option>
                  <option value="MORTGAGE">Mortgage</option>
                  <option value="OWN">Own</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Loan Purpose
                </label>
                <select
                  name="loan_purpose"
                  value={formState.loan_purpose}
                  onChange={handleInputChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="DEBT_CONSOLIDATION">Debt Consolidation</option>
                  <option value="CREDIT_CARD">Credit Card</option>
                  <option value="HOME_IMPROVEMENT">Home Improvement</option>
                  <option value="MAJOR_PURCHASE">Major Purchase</option>
                  <option value="MEDICAL">Medical</option>
                  <option value="EDUCATION">Education</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Debt-to-Income Ratio
                </label>
                <div className="flex rounded-md shadow-sm">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="1"
                    name="debt_to_income"
                    value={formState.debt_to_income}
                    onChange={handleInputChange}
                    className="flex-1 min-w-0 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Previous Defaults
                </label>
                <select
                  name="has_default"
                  value={formState.has_default}
                  onChange={handleInputChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={resetForm}
                leftIcon={<RefreshCw size={16} />}
              >
                Reset Form
              </Button>
              <Button
                variant="primary"
                onClick={handlePrediction}
                isLoading={isLoading}
                leftIcon={<TargetIcon size={16} />}
              >
                Make Prediction
              </Button>
            </div>
          </Card>
        </div>
        
        <div>
          <Card title="Prediction Result">
            {result ? (
              <div className="flex flex-col items-center py-6">
                <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-4 ${
                  result.approved ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {result.approved ? (
                    <CircleCheck className="h-12 w-12 text-green-600" />
                  ) : (
                    <AlertCircle className="h-12 w-12 text-red-600" />
                  )}
                </div>
                
                <h3 className={`text-xl font-bold mb-2 ${
                  result.approved ? 'text-green-600' : 'text-red-600'
                }`}>
                  {result.approved ? 'Loan Approved' : 'Loan Denied'}
                </h3>
                
                <div className="text-sm text-gray-500 mb-6">
                  Confidence: {(result.confidence * 100).toFixed(1)}%
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                  <div 
                    className={`h-2.5 rounded-full ${result.approved ? 'bg-green-600' : 'bg-red-600'}`} 
                    style={{ width: `${result.probability * 100}%` }}
                  ></div>
                </div>
                
                <div className="text-sm text-gray-600 w-full flex justify-between">
                  <span>0% (Deny)</span>
                  <span>50%</span>
                  <span>100% (Approve)</span>
                </div>
                
                <div className="mt-6 text-center w-full">
                  <div className="text-gray-700 font-medium mb-2">Approval probability</div>
                  <div className="text-3xl font-bold text-gray-800">
                    {(result.probability * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <TargetIcon className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-500 text-center">
                  Fill out the loan application form and click "Make Prediction" to see results.
                </p>
              </div>
            )}
          </Card>
          
          <Card title="Model Information" className="mt-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Model Name:</span>
                <span className="text-sm font-medium text-gray-800">{activeModel.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Algorithm:</span>
                <span className="text-sm font-medium text-gray-800">{activeModel.algorithm}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Accuracy:</span>
                <span className="text-sm font-medium text-gray-800">89.2%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Created:</span>
                <span className="text-sm font-medium text-gray-800">
                  {new Date(activeModel.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Status:</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Active
                </span>
              </div>
            </div>
          </Card>
          
          <Card title="Risk Factors" className="mt-6">
            {result && (
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className={`flex-shrink-0 h-5 w-5 rounded-full ${
                    formState.credit_score < 650 ? 'bg-red-100' : 'bg-green-100'
                  } flex items-center justify-center mr-2`}>
                    <span className={`text-xs font-medium ${
                      formState.credit_score < 650 ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {formState.credit_score < 650 ? '-' : '+'}
                    </span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-800">Credit Score</div>
                    <div className="text-xs text-gray-500">
                      {formState.credit_score < 650 
                        ? 'Low credit score increases risk' 
                        : 'Good credit score reduces risk'}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className={`flex-shrink-0 h-5 w-5 rounded-full ${
                    formState.debt_to_income > 0.4 ? 'bg-red-100' : 'bg-green-100'
                  } flex items-center justify-center mr-2`}>
                    <span className={`text-xs font-medium ${
                      formState.debt_to_income > 0.4 ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {formState.debt_to_income > 0.4 ? '-' : '+'}
                    </span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-800">Debt-to-Income</div>
                    <div className="text-xs text-gray-500">
                      {formState.debt_to_income > 0.4 
                        ? 'High debt relative to income' 
                        : 'Manageable debt level'}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className={`flex-shrink-0 h-5 w-5 rounded-full ${
                    formState.has_default === 'yes' ? 'bg-red-100' : 'bg-green-100'
                  } flex items-center justify-center mr-2`}>
                    <span className={`text-xs font-medium ${
                      formState.has_default === 'yes' ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {formState.has_default === 'yes' ? '-' : '+'}
                    </span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-800">Previous Defaults</div>
                    <div className="text-xs text-gray-500">
                      {formState.has_default === 'yes' 
                        ? 'History of defaults is concerning' 
                        : 'No previous defaults is positive'}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className={`flex-shrink-0 h-5 w-5 rounded-full ${
                    formState.loan_amount > 0.5 * formState.income ? 'bg-amber-100' : 'bg-green-100'
                  } flex items-center justify-center mr-2`}>
                    <span className={`text-xs font-medium ${
                      formState.loan_amount > 0.5 * formState.income ? 'text-amber-600' : 'text-green-600'
                    }`}>
                      {formState.loan_amount > 0.5 * formState.income ? '!' : '+'}
                    </span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-800">Loan-to-Income</div>
                    <div className="text-xs text-gray-500">
                      {formState.loan_amount > 0.5 * formState.income 
                        ? 'Loan is large relative to income' 
                        : 'Loan amount is reasonable for income'}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {!result && (
              <div className="text-center py-4 text-gray-500">
                Make a prediction to see risk factors
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Prediction;