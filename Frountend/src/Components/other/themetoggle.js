import React from 'react';
import { Switch, FormControlLabel } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const ThemeToggle = ({ darkMode, setDarkMode }) => {
  return (
    <FormControlLabel
      control={
        <Switch
          checked={darkMode}
          onChange={() => setDarkMode(!darkMode)}
          icon={<Brightness7Icon />}
          checkedIcon={<Brightness4Icon />}
        />
      }
    />
  );
};

export default ThemeToggle;






