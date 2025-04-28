import React, { useState, useRef } from 'react';
import { Upload, CheckCircle, AlertTriangle } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { useML } from '../context/MLContext';

const DataUpload: React.FC = () => {
  const { datasets, addDataset } = useML();
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files[0]);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files[0]);
    }
  };
  
  const handleFiles = (file: File) => {
    setUploadError(null);
    setUploadSuccess(false);
    
    // Check file type (only allow CSV for this demo)
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      setUploadError('Only CSV files are supported');
      return;
    }
    
    // Simulate file processing (in a real app, we'd parse the CSV here)
    setFileName(file.name);
    
    // Fake successful upload after a short delay
    setTimeout(() => {
      setUploadSuccess(true);
      
      // Here we would normally process the CSV and add the real dataset
      // For our demo, we're just using the dummy data defined in context
    }, 1500);
  };
  
  const onButtonClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Data Upload</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card title="Upload Dataset">
            <div 
              className={`border-2 border-dashed rounded-lg p-8 ${
                dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
              } transition-colors duration-200 flex flex-col items-center justify-center cursor-pointer`}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={onButtonClick}
            >
              <input
                ref={inputRef}
                type="file"
                accept=".csv"
                onChange={handleChange}
                className="hidden"
              />
              
              {!uploadSuccess ? (
                <>
                  <div className="w-16 h-16 mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                    <Upload className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    Drag & Drop your dataset here
                  </h3>
                  <p className="text-sm text-gray-500 mb-4 text-center">
                    Or click to browse. Supports CSV files up to 10 MB.
                  </p>
                  <Button
                    variant="outline"
                    size="md"
                    onClick={(e) => {
                      e.stopPropagation();
                      onButtonClick();
                    }}
                  >
                    Browse Files
                  </Button>
                </>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 mb-4 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-800 mb-1">
                    File uploaded successfully!
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    {fileName}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setUploadSuccess(false);
                      setFileName(null);
                    }}
                  >
                    Upload Another File
                  </Button>
                </div>
              )}
              
              {uploadError && (
                <div className="mt-4 flex items-center text-red-600">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  <span className="text-sm">{uploadError}</span>
                </div>
              )}
            </div>
            
            <div className="border-t border-gray-200 mt-6 pt-6">
              <h4 className="text-sm font-medium text-gray-500 mb-2">
                Data Validation Rules
              </h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                    <span className="text-xs font-medium text-blue-600">1</span>
                  </div>
                  <span>CSV format with header row containing feature names</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                    <span className="text-xs font-medium text-blue-600">2</span>
                  </div>
                  <span>Target column should be labeled 'approved' with binary values</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                    <span className="text-xs font-medium text-blue-600">3</span>
                  </div>
                  <span>No missing values allowed in critical fields (credit_score, income, loan_amount)</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                    <span className="text-xs font-medium text-blue-600">4</span>
                  </div>
                  <span>Maximum file size: 10 MB</span>
                </li>
              </ul>
            </div>
          </Card>
        </div>
        
        <div>
          <Card title="Available Datasets">
            <div className="space-y-4">
              {datasets.map((dataset) => (
                <div key={dataset.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-gray-800">{dataset.name}</h3>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                      Active
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-2">{dataset.description}</p>
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                    <div>
                      <span className="font-medium">Rows:</span> {dataset.rows}
                    </div>
                    <div>
                      <span className="font-medium">Columns:</span> {dataset.columns}
                    </div>
                    <div>
                      <span className="font-medium">Created:</span> {new Date(dataset.createdAt).toLocaleDateString()}
                    </div>
                    <div>
                      <span className="font-medium">Target:</span> {dataset.targetColumn}
                    </div>
                  </div>
                </div>
              ))}
              
              {datasets.length === 0 && (
                <div className="text-center py-6">
                  <p className="text-gray-500">No datasets available yet.</p>
                </div>
              )}
            </div>
          </Card>
          
          <Card title="Data Quality Metrics" className="mt-6">
            {datasets.length > 0 ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Missing Values</span>
                  <span className="text-sm font-medium text-gray-800">0%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '0%' }}></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Outliers</span>
                  <span className="text-sm font-medium text-gray-800">2.3%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '2.3%' }}></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Class Balance</span>
                  <span className="text-sm font-medium text-gray-800">Good</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
                
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="text-sm text-gray-500">
                    Class distribution:
                  </div>
                  <div className="flex mt-2">
                    <div className="flex-1 mr-2">
                      <div className="text-xs text-gray-500 mb-1">Approved</div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '56%' }}></div>
                      </div>
                      <div className="text-xs text-right mt-1">56%</div>
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-gray-500 mb-1">Rejected</div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '44%' }}></div>
                      </div>
                      <div className="text-xs text-right mt-1">44%</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500">Upload a dataset to see quality metrics</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DataUpload;