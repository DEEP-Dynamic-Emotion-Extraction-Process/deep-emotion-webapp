// src/routes/AppRouter.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Importando as Páginas (ainda vazias, mas já as referenciamos)
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { DashboardPage } from '../pages/DashboardPage';
import { UserConfigPage } from '../pages/UserConfigPage';
import { AnalysisDetailPage } from '../pages/AnalysisDetailPage';

import { MainLayout } from '../layouts/MainLayout';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { ProtectedRoute } from '../components/common/ProtectedRoute';

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/dashboard/analysis/:analysisId" element={<AnalysisDetailPage />} />
            <Route path="/settings" element={<UserConfigPage />} />
          </Route>
        </Route>
        
      </Routes>
    </BrowserRouter>
  );
};