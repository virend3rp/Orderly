import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Import the necessary components and colors from MUI
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { red, amber } from '@mui/material/colors';

// Create our custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: red[700], // A deep, professional red
    },
    secondary: {
      main: amber[800], // A warm, golden-amber accent
    },
    background: {
      default: '#fafafa', // A very light grey for the page background
      paper: '#ffffff',   // White for surfaces like cards and modals
    },
  },
  typography: {
    // You can customize fonts here if you'd like
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  // Add some global style overrides for a softer, more modern look
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8, // Softer, rounded corners for buttons
          textTransform: 'none', // Use normal case for button text (e.g., "Sign In" instead of "SIGN IN")
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12, // Slightly more rounded corners for cards and paper surfaces
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12, // Consistent rounded corners for cards
        },
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);