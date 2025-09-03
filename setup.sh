#!/bin/bash

# --- Configuração ---
PROJECT_NAME="deep-emotion-webapp"

# --- Início do Script ---
echo "🚀 Iniciando a criação do projeto React: $PROJECT_NAME"

# 1. Criar o projeto com Vite
npm create vite@latest "$PROJECT_NAME" -- --template react
if [ $? -ne 0 ]; then
    echo "❌ Falha ao criar o projeto com Vite. Abortando."
    exit 1
fi

# 2. Entrar na pasta do projeto
cd "$PROJECT_NAME"

echo "📦 Instalando dependências..."

# 3. Instalar as bibliotecas principais
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material
npm install react-router-dom
npm install axios

if [ $? -ne 0 ]; then
    echo "❌ Falha ao instalar as dependências. Verifique seu npm e conexão."
    exit 1
fi


echo "🧹 Limpando arquivos de exemplo do Vite..."

# 4. Limpar a pasta src
rm -f src/*
rm -f src/assets/*


echo "🏗️  Criando a nova estrutura de pastas e arquivos..."

# 5. Criar a estrutura de pastas
mkdir -p src/api
mkdir -p src/assets
mkdir -p src/components/auth
mkdir -p src/components/common
mkdir -p src/components/dashboard
mkdir -p src/components/analysis
mkdir -p src/components/layout
mkdir -p src/contexts
mkdir -p src/hooks
mkdir -p src/layouts
mkdir -p src/pages
mkdir -p src/routes
mkdir -p src/theme
mkdir -p src/utils

# 6. Criar os arquivos vazios
touch src/api/api.js
touch src/api/authService.js
touch src/api/videoService.js

touch src/components/auth/AuthFormContainer.jsx
touch src/components/auth/LoginForm.jsx
touch src/components/auth/RegisterForm.jsx

touch src/components/common/ProtectedRoute.jsx
touch src/components/common/LoadingSpinner.jsx

touch src/components/dashboard/AnalysisSidebar.jsx
touch src/components/dashboard/VideoUploader.jsx
touch src/components/dashboard/AnalysisCard.jsx

touch src/components/analysis/EditableTitle.jsx
touch src/components/analysis/VideoPlayer.jsx
touch src/components/analysis/EmotionTimeline.jsx
touch src/components/analysis/InsightsCharts.jsx

touch src/components/layout/Navbar.jsx
touch src/components/layout/Sidebar.jsx

touch src/contexts/AuthContext.jsx
touch src/hooks/useAuth.js

touch src/layouts/DashboardLayout.jsx
touch src/layouts/MainLayout.jsx

touch src/pages/HomePage.jsx
touch src/pages/LoginPage.jsx
touch src/pages/RegisterPage.jsx
touch src/pages/DashboardPage.jsx
touch src/pages/AnalysisDetailPage.jsx
touch src/pages/UserConfigPage.jsx

touch src/routes/AppRouter.jsx
touch src/theme/theme.js

touch src/App.jsx
touch src/main.jsx

# Adicionar um CSS global básico
cat > src/index.css << EOL
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #121212; /* Fundo escuro padrão */
}
EOL

# Substituir o main.jsx padrão para incluir o CSS
cat > src/main.jsx << EOL
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
EOL


echo "✅ Processo concluído com sucesso!"
echo "Agora, entre na pasta '$PROJECT_NAME' e comece a desenvolver."
echo "Para iniciar o servidor de desenvolvimento, use: npm run dev"