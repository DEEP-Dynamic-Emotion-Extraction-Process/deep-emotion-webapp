// src/pages/UserConfigPage.jsx
import { Container, Typography, Box, Paper, Divider, Button, TextField } from '@mui/material';
import { useAuth } from '../hooks/useAuth';

/**
 * Página para o utilizador visualizar e gerir as suas informações de conta.
 */
export const UserConfigPage = () => {
  const { user } = useAuth(); // Obtém os dados do utilizador a partir do nosso contexto

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Configurações da Conta
        </Typography>

        {/* Secção de Informações do Perfil */}
        <Paper sx={{ p: 3, mt: 2, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Informações do Perfil
          </Typography>
          {user ? (
            <Box sx={{ mt: 2 }}>
              <TextField
                label="Nome de Utilizador"
                value={user.username}
                fullWidth
                margin="normal"
                InputProps={{
                  readOnly: true, // Apenas para leitura
                }}
                variant="filled"
              />
              <TextField
                label="Email"
                value={user.email}
                fullWidth
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
                variant="filled"
              />
               <TextField
                label="ID do Utilizador"
                value={user.id}
                fullWidth
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
                variant="filled"
              />
            </Box>
          ) : (
            <Typography>A carregar informações...</Typography>
          )}
        </Paper>

        {/* Secção para Futuras Ações */}
        <Paper sx={{ p: 3 }}>
           <Typography variant="h6" gutterBottom>
            Ações da Conta
          </Typography>
          <Divider sx={{my: 2}} />
          <Box sx={{mt: 2, display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'flex-start'}}>
             <Typography color="text.secondary">
                Funcionalidades como alterar a senha ou apagar a conta podem ser adicionadas aqui.
             </Typography>
             <Button variant="outlined" color="secondary" disabled>
                Alterar Senha
             </Button>
             <Button variant="contained" color="error" disabled>
                Apagar Conta
             </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};