import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#667eea',
      light: '#a5b4fc',
      dark: '#5a67d8',
      contrastText: '#ffffff', 
    },
    secondary: {
      main: '#764ba2',
      light: '#a78bfa',
      dark: '#6b21a8',
      contrastText: '#ffffff', 
    },
    background: {
      default: '#0f172a',
      paper: 'rgba(255, 255, 255, 0.05)',
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)',
      disabled: 'rgba(255, 255, 255, 0.5)', 
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: { 
      fontWeight: 700,
      fontSize: '2.5rem',
      '@media (min-width:600px)': { fontSize: '3rem' } 
    },
    h2: { 
      fontWeight: 600,
      fontSize: '2rem',
      '@media (min-width:600px)': { fontSize: '2.5rem' }
    },
    
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { 
          textTransform: 'none', 
          fontWeight: 600,
          borderRadius: 8, 
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)', 
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)', 
          borderRadius: 16, 
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)', 
        },
      },
    },
  },
});