"use client"; 

import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const Header = () => {
  // Use next/navigation instead of next/router
  const router = useRouter();

  const handleNavigation = (path) => {
    console.log(`Navigating to ${path}`);
    router.push(path);
  };

  return (
    <AppBar position="static">
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
  );
};

export default Header;
