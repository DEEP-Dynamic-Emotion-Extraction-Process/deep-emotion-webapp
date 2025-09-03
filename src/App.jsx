// src/App.jsx
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from './theme/theme';
import { AuthProvider } from './contexts/AuthContext';
import { AppRouter } from './routes/AppRouter';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppRouter /> 
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;