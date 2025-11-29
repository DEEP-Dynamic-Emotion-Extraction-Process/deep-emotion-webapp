// src/components/auth/RegisterForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../../api/authService';
import { TextField, Button, Box, Alert } from '@mui/material';
import { useTranslation } from 'react-i18next';

export const RegisterForm = () => {
  const { t } = useTranslation();

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
      navigate('/login');
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Registration failed. Please try again.';
      setError(errorMsg);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <TextField margin="normal" required fullWidth id="username" label={t('auth.fullName')} name="username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <TextField margin="normal" required fullWidth id="email" label={t('auth.email')} name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <TextField margin="normal" required fullWidth name="password" label={t('auth.password')} type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      
      {error && <Alert severity="error" sx={{ mt: 2, width: '100%' }}>{error}</Alert>}
      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
        {t('auth.registerButton')}
      </Button>
    </Box>
  );
};