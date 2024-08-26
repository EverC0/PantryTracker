"use client"; 

import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    custom: {
      main: 'inherit', // Define your custom color here
    },
  },
});

const Header = () => {
  const router = useRouter();

  const handleNavigation = (path) => {
    console.log(`Navigating to ${path}`);
    router.push(path);
  };

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static" color="custom">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Pantry Tracker
          </Typography>
          <Button color="inherit" onClick={() => handleNavigation('/')}>
            Home
          </Button>
          <Button color="inherit" onClick={() => handleNavigation('/pantry')}>
            Pantry
          </Button>
          <Button color="inherit" onClick={() => handleNavigation('/Viewall')}>
            View
          </Button>
          <Button color="inherit" onClick={() => handleNavigation('/LogOff')}>
            LogOff
          </Button>
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  );
};

export default Header;
