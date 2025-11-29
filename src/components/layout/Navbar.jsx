// src/components/layout/Navbar.jsx
import { AppBar, Toolbar, Typography, Button, Box, Menu, MenuItem } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import logo from '../../assets/logo.png';
import { useTranslation } from 'react-i18next'; 
import { useState } from 'react';
import LanguageIcon from '@mui/icons-material/Language';

export const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation(); 
  
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleLanguageClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLanguageClose = (lang) => {
    if (lang) {
      i18n.changeLanguage(lang);
    }
    setAnchorEl(null);
  };

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <Link to="/">
          <img src={logo} alt="DeepEmotion Logo" style={{ height: '40px', marginRight: '16px' }} />
        </Link>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          {t('app.title')}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button
            color="inherit"
            startIcon={<LanguageIcon />}
            onClick={handleLanguageClick}
          >
            {i18n.language.toUpperCase().split('-')[0]}
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={() => handleLanguageClose(null)}
          >
            <MenuItem onClick={() => handleLanguageClose('en')}>English</MenuItem>
            <MenuItem onClick={() => handleLanguageClose('pt')}>Português</MenuItem>
          </Menu>

          {isAuthenticated ? (
            <>
              <Button color="inherit" component={Link} to="/dashboard">
                {t('app.dashboard')}
              </Button>
              <Button color="inherit" onClick={handleLogout}>
                {t('app.logout')}
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">
                {t('app.login')}
              </Button>
              <Button color="inherit" component={Link} to="/register">
                {t('app.register')}
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};