// src/pages/UserConfigPage.jsx
import { Container, Typography, Box, Paper, Divider, Button, TextField } from '@mui/material';
import { useAuth } from '../hooks/useAuth';

export const UserConfigPage = () => {
  const { user } = useAuth();
  
  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Account Settings
        </Typography>

        <Paper sx={{ p: 3, mt: 2, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Profile Information
          </Typography>
          {user ? (
            <Box sx={{ mt: 2 }}>
              <TextField
                label="Username"
                value={user.username}
                fullWidth
                margin="normal"
                InputProps={{
                  readOnly: true, 
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
                label="User ID"
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
            <Typography>Loading information...</Typography>
          )}
        </Paper>

        <Paper sx={{ p: 3 }}>
           <Typography variant="h6" gutterBottom>
            Account Management
          </Typography>
          <Divider sx={{my: 2}} />
          <Box sx={{mt: 2, display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'flex-start'}}>
             <Typography color="text.secondary">
                Features like changing the password or deleting the account can be added here.
             </Typography>
             <Button variant="outlined" color="secondary" disabled>
                Change Password
             </Button>
             <Button variant="contained" color="error" disabled>
                Delete Account
             </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};