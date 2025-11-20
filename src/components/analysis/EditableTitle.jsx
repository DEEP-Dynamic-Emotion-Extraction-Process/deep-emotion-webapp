// src/components/analysis/EditableTitle.jsx
import React, { useState, useEffect } from 'react';
import { Typography, TextField, IconButton, Box } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';

export const EditableTitle = ({ initialTitle, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(initialTitle);

  useEffect(() => {
    setTitle(initialTitle);
  }, [initialTitle]);

  const handleSave = () => {
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