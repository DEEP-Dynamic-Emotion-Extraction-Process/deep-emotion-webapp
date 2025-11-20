// src/contexts/AnalysisContext.jsx

import React, { createContext, useState, useEffect, useContext } from 'react';
import io from 'socket.io-client';
import { getUserVideos } from '../api/videoService';

const AnalysisContext = createContext(null);

const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000');

export const AnalysisProvider = ({ children }) => {
  const [analyses, setAnalyses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [justCompletedId, setJustCompletedId] = useState(null);

  const fetchAnalyses = async () => {
    try {
      setIsLoading(true);
      const userVideos = await getUserVideos();
      setAnalyses(userVideos);
    } catch (err) {
      setError('Failed to load analyses. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyses();

    socket.on('processing_update', (data) => {
      if (data.status === 'COMPLETED') {
        setJustCompletedId(data.video_id);
      }
      
      setAnalyses(currentAnalyses =>
        currentAnalyses.map(analysis => {
          if (analysis.id === data.video_id) {
            return { ...analysis, status: data.status, progress: data.progress };
          }
          return analysis;
        })
      );
    });

    return () => {
      socket.off('processing_update');
    };
  }, []);

  const addAnalysis = (newAnalysis) => {
    setAnalyses(currentAnalyses => [newAnalysis, ...currentAnalyses]);
  };

  const updateAnalysisTitle = (analysisId, newTitle) => {
    setAnalyses(currentAnalyses =>
      currentAnalyses.map(analysis =>
        analysis.id === analysisId ? { ...analysis, title: newTitle } : analysis
      )
    );
  };

  const value = {
    analyses,
    isLoading,
    error,
    addAnalysis,
    updateAnalysisTitle,
    justCompletedId,
    setJustCompletedId,
  };

  return (
    <AnalysisContext.Provider value={value}>
      {children}
    </AnalysisContext.Provider>
  );
};

export const useAnalyses = () => {
  const context = useContext(AnalysisContext);
  if (!context) {
    throw new Error('useAnalyses must be used within an AnalysisProvider');
  }
  return context;
};