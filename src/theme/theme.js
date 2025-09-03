// src/theme/theme.js
import { createTheme } from '@mui/material/styles';

/**
 * Criação de um tema customizado para a aplicação usando o Material-UI.
 * Este tema define a paleta de cores, tipografia e outros estilos globais.
 */
export const theme = createTheme({
  palette: {
    mode: 'dark', // Define o tema escuro como padrão
    primary: {
      main: '#90caf9', // Azul claro para elementos principais
    },
    secondary: {
      main: '#f48fb1', // Rosa claro para elementos secundários
    },
    background: {
      default: '#121212', // Cor de fundo principal da aplicação
      paper: '#1e1e1e',   // Cor de fundo para componentes como Cards e Menus
    },
    text: {
      primary: '#ffffff', // Cor principal do texto
      secondary: '#b0bec5', // Cor secundária para textos de apoio
    }
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    }
  },
});