import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Dashboard from './pages/Dashboard';
import DataUpload from './pages/DataUpload';
import DataExploration from './pages/DataExploration';
import ModelTraining from './pages/ModelTraining';
import ModelEvaluation from './pages/ModelEvaluation';
import Prediction from './pages/Prediction';
import ModelRegistry from './pages/ModelRegistry';
import { MLContextProvider } from './context/MLContext';

const App: React.FC = () => {
  return (
    <MLContextProvider>
      <Router>
        <div className="flex h-screen bg-gray-50">
          <Sidebar />
          <div className="flex flex-col flex-1 overflow-hidden">
            <Header />
            <main className="flex-1 overflow-y-auto p-4 md:p-6">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/data-upload" element={<DataUpload />} />
                <Route path="/data-exploration" element={<DataExploration />} />
                <Route path="/model-training" element={<ModelTraining />} />
                <Route path="/model-evaluation" element={<ModelEvaluation />} />
                <Route path="/prediction" element={<Prediction />} />
                <Route path="/model-registry" element={<ModelRegistry />} />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </MLContextProvider>
  );
};

export default App;