// src/components/analysis/EditableTitle.jsx
import React, { useState, useEffect } from 'react';
import { Typography, TextField, IconButton, Box } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';

/**
 * Um componente de título que pode ser editado ao clicar.
 * @param {object} props
 * @param {string} props.initialTitle - O título inicial a ser exibido.
 * @param {Function} props.onSave - Função a ser chamada quando o novo título é guardado.
 */
export const EditableTitle = ({ initialTitle, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(initialTitle);

  // Garante que o estado interno é atualizado se o título inicial mudar
  useEffect(() => {
    setTitle(initialTitle);
  }, [initialTitle]);

  const handleSave = () => {
    // Aqui, chamaríamos a API para guardar o novo título.
    // Por agora, apenas chamamos a função onSave e atualizamos a UI.
    if (typeof onSave === 'function') {
      onSave(title);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSave();
    }
  };

  if (isEditing) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <TextField
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          variant="standard"
          autoFocus
          sx={{ flexGrow: 1, '& .MuiInputBase-input': { fontSize: '2.125rem', fontWeight: 400 } }}
        />
        <IconButton onClick={handleSave} color="primary">
          <CheckIcon />
        </IconButton>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }} onClick={() => setIsEditing(true)}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 0 }}>
        {title}
      </Typography>
      <IconButton color="primary" size="small">
        <EditIcon fontSize="inherit" />
      </IconButton>
    </Box>
  );
};