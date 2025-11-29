// src/pages/UserConfigPage.jsx
import { Container, Typography, Box, Paper, Divider, Button, TextField } from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from 'react-i18next';

export const UserConfigPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  
  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {t('user.accountSettings')}
        </Typography>

        <Paper sx={{ p: 3, mt: 2, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            {t('user.profileInfo')}
          </Typography>
          {user ? (
            <Box sx={{ mt: 2 }}>
              <TextField
                label={t('user.name')}
                value={user.username}
                fullWidth
                margin="normal"
                InputProps={{
                  readOnly: true, 
                }}
                variant="filled"
              />
              <TextField
                label={t('user.email')}
                value={user.email}
                fullWidth
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
                variant="filled"
              />
               <TextField
                label={t('user.userID')}
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
            <Typography>{t('user.loading')}</Typography>
          )}
        </Paper>

        <Paper sx={{ p: 3 }}>
           <Typography variant="h6" gutterBottom>
            {t('user.accountManagement')}
          </Typography>
          <Divider sx={{my: 2}} />
          <Box sx={{mt: 2, display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'flex-start'}}>
             <Button variant="outlined" color="secondary" disabled>
                {t('user.changePassword')}
             </Button>
             <Button variant="contained" color="error" disabled>
                {t('user.deleteAccount')}
             </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};