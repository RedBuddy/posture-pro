import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AnalysisResult } from '@/services/api';

interface AnalysisData {
  videoFile: File | null;
  analyzedVideoBlob: Blob | null;
  exerciseType: string;
  stats: AnalysisResult | null;
  isAnalyzing: boolean;
}

interface AnalysisContextType {
  analysisData: AnalysisData;
  setAnalysisData: (data: Partial<AnalysisData>) => void;
  resetAnalysis: () => void;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

const initialData: AnalysisData = {
  videoFile: null,
  analyzedVideoBlob: null,
  exerciseType: 'sentadilla',
  stats: null,
  isAnalyzing: false,
};

export const AnalysisProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [analysisData, setAnalysisDataState] = useState<AnalysisData>(initialData);

  const setAnalysisData = (data: Partial<AnalysisData>) => {
    setAnalysisDataState(prev => ({ ...prev, ...data }));
  };

  const resetAnalysis = () => {
    setAnalysisDataState(initialData);
  };

  return (
    <AnalysisContext.Provider value={{ analysisData, setAnalysisData, resetAnalysis }}>
      {children}
    </AnalysisContext.Provider>
  );
};

export const useAnalysis = () => {
  const context = useContext(AnalysisContext);
  if (context === undefined) {
    throw new Error('useAnalysis must be used within an AnalysisProvider');
  }
  return context;
};