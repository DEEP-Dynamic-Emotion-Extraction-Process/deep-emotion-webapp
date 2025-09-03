// src/routes/AppRouter.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Importando as Páginas (ainda vazias, mas já as referenciamos)
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { DashboardPage } from '../pages/DashboardPage';
import { UserConfigPage } from '../pages/UserConfigPage';
import { AnalysisDetailPage } from '../pages/AnalysisDetailPage';

// Importando os Layouts e a Proteção
import { MainLayout } from '../layouts/MainLayout';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { ProtectedRoute } from '../components/common/ProtectedRoute';

/**
 * Componente que gerencia toda a navegação da aplicação.
 */
export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- Rotas Públicas --- */}
        {/* Todas as rotas dentro deste grupo usarão o MainLayout (com a Navbar simples) */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* --- Rotas Privadas / Protegidas --- */}
        {/* Este grupo primeiro verifica a autenticação com ProtectedRoute */}
        <Route element={<ProtectedRoute />}>
          {/* Se autenticado, usa o DashboardLayout (com Navbar e Sidebar) */}
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/dashboard/analysis/:analysisId" element={<AnalysisDetailPage />} />
            <Route path="/settings" element={<UserConfigPage />} />
          </Route>
        </Route>
        
        {/* Adicionar aqui uma página de "Não Encontrado" (404) seria uma boa prática */}
        
      </Routes>
    </BrowserRouter>
  );
};