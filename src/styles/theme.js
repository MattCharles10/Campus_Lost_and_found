import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#4361ee', // Vibrant blue
      light: '#4895ef',
      dark: '#3a0ca3',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#f72585', // Energetic pink
      light: '#ffafcc',
      dark: '#b5179e',
      contrastText: '#ffffff',
    },
    success: {
      main: '#4cc9f0', // Cyan accent
      light: '#8ae9ff',
    },
    background: {
      default: 'linear-gradient(135deg, #f5f7fa 0%, #f8fafc 100%)', // Gradient background
      paper: 'rgba(255, 255, 255, 0.95)', // Semi-transparent white
    },
    text: {
      primary: '#1a202c',
      secondary: '#4a5568',
      disabled: '#a0aec0',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 800,
      fontSize: '3rem',
      background: 'linear-gradient(90deg, #4361ee 0%, #f72585 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      '@media (min-width:600px)': { fontSize: '3.5rem' }
    },
    h2: {
      fontWeight: 700,
      fontSize: '2.25rem',
      color: '#2d3748',
      '@media (min-width:600px)': { fontSize: '2.75rem' }
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
      color: '#4361ee',
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: 'linear-gradient(135deg, #f5f7fa 0%, #f8fafc 100%)',
          backgroundAttachment: 'fixed',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 12,
          padding: '10px 24px',
          fontSize: '1rem',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
          },
        },
      },
      variants: [
        {
          props: { variant: 'contained', color: 'primary' },
          style: {
            background: 'linear-gradient(90deg, #4361ee 0%, #4895ef 100%)',
            boxShadow: '0 4px 15px rgba(67, 97, 238, 0.3)',
          },
        },
        {
          props: { variant: 'contained', color: 'secondary' },
          style: {
            background: 'linear-gradient(90deg, #f72585 0%, #ffafcc 100%)',
            boxShadow: '0 4px 15px rgba(247, 37, 133, 0.3)',
          },
        },
      ],
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.8)',
          borderRadius: 20,
          boxShadow: `
            0 10px 30px rgba(0, 0, 0, 0.08),
            0 1px 2px rgba(0, 0, 0, 0.05),
            inset 0 0 0 1px rgba(255, 255, 255, 0.9)
          `,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: `
              0 20px 40px rgba(0, 0, 0, 0.12),
              0 4px 8px rgba(0, 0, 0, 0.06),
              inset 0 0 0 1px rgba(255, 255, 255, 0.9)
            `,
          },
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
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            transition: 'all 0.3s ease',
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#4361ee',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#4361ee',
              borderWidth: 2,
            },
          },
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(90deg, transparent, #4361ee, transparent)',
          height: '1px',
          border: 'none',
        },
      },
    },
  },
});

export default theme;