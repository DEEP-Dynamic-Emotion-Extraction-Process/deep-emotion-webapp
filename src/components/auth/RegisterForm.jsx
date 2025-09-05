// src/components/auth/RegisterForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../../api/authService';
import { TextField, Button, Box, Alert } from '@mui/material';

export const RegisterForm = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      await register({ username, email, password });
      navigate('/login'); // Redireciona para o login após o sucesso
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Falha ao registar. Tente novamente.';
      setError(errorMsg);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <TextField margin="normal" required fullWidth id="username" label="Nome Completo" name="username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <TextField margin="normal" required fullWidth id="email" label="Endereço de Email" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <TextField margin="normal" required fullWidth name="password" label="Senha" type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      
      {error && <Alert severity="error" sx={{ mt: 2, width: '100%' }}>{error}</Alert>}
      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
        Registar
      </Button>
    </Box>
  );
};