// src/components/TopNavbar.js
import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import Cookies from 'js-cookie';

const TopNavbar = () => {
  const handleLogout = () => {
    Cookies.remove('token');
    window.location.href = '/login'; 
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          Employee Dashboard
        </Typography>
        <Button color="inherit" onClick={handleLogout}>Logout</Button>
      </Toolbar>
    </AppBar>
  );
};

export default TopNavbar;
