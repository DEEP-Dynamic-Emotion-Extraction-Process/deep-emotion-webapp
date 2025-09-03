// src/App.jsx
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from './theme/theme';
import { Typography } from '@mui/material'; // Apenas para teste inicial

/**
 * Componente raiz da aplicação.
 * Responsável por prover o tema do MUI e, futuramente,
 * o contexto de autenticação e o roteador de páginas.
 */
function App() {
  return (
    <ThemeProvider theme={theme}>
      {/* CssBaseline é um componente do MUI que reseta o CSS do navegador
          para garantir consistência visual em diferentes browsers. */}
      <CssBaseline />

      {/* Placeholder temporário para verificar se o tema está funcionando */}
      <Typography variant="h1" color="primary" align="center" sx={{ mt: 4 }}>
        DeepEmotion WebApp
      </Typography>
    </ThemeProvider>
  );
}

export default App;