import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/UI/ProtectedRoute';
import PublicRoute from './components/common/UI/PublicRoute';
import ErrorBoundary from './components/common/UI/ErrorBoundary';
import MainLayout from './components/common/Layout/MainLayout';

// Import pages
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import ForgotPasswordPage from './pages/Auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/Auth/ResetPasswordPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import LostItemsPage from './pages/LostItemsPage';
import FoundItemsPage from './pages/FoundItemsPage';
import MyItemsPage from './pages/MyItemsPage';
import ItemDetailsPage from './pages/ItemDetailsPage';
import SearchResultsPage from './pages/SearchResultsPage';
import ReportItemPage from './pages/ReportItemPage';
import NotFoundPage from './pages/NotFoundPage';

// Enhanced Theme
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#667eea',
      light: '#a5b4fc',
      dark: '#5a67d8',
    },
    secondary: {
      main: '#764ba2',
      light: '#a78bfa',
      dark: '#6b21a8',
    },
    background: {
      default: '#0f172a',
      paper: 'rgba(255, 255, 255, 0.05)',
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 600 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 500 },
    h6: { fontWeight: 500 },
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
          WebkitBackdropFilter: 'blur(10px)', // Safari support
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
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

// Layout Wrapper Component
const LayoutWrapper = ({ children }) => {
  return <MainLayout>{children}</MainLayout>;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorBoundary>
        <AuthProvider>
          <Router>
            <Routes>
              {/* Public Routes (without Layout) - Redirect to dashboard if already logged in */}
              <Route path="/login" element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              } />
              <Route path="/register" element={
                <PublicRoute>
                  <RegisterPage />
                </PublicRoute>
              } />
              <Route path="/forgot-password" element={
                <PublicRoute>
                  <ForgotPasswordPage />
                </PublicRoute>
              } />
              <Route path="/reset-password/:token" element={
                <PublicRoute>
                  <ResetPasswordPage />
                </PublicRoute>
              } />
              
              {/* Protected Routes (with Layout) - Redirect to login if not authenticated */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <LayoutWrapper>
                      <DashboardPage />
                    </LayoutWrapper>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <LayoutWrapper>
                      <ProfilePage />
                    </LayoutWrapper>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/lost" 
                element={
                  <ProtectedRoute>
                    <LayoutWrapper>
                      <LostItemsPage />
                    </LayoutWrapper>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/found" 
                element={
                  <ProtectedRoute>
                    <LayoutWrapper>
                      <FoundItemsPage />
                    </LayoutWrapper>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/my-items" 
                element={
                  <ProtectedRoute>
                    <LayoutWrapper>
                      <MyItemsPage />
                    </LayoutWrapper>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/item/:id" 
                element={
                  <ProtectedRoute>
                    <LayoutWrapper>
                      <ItemDetailsPage />
                    </LayoutWrapper>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/search" 
                element={
                  <ProtectedRoute>
                    <LayoutWrapper>
                      <SearchResultsPage />
                    </LayoutWrapper>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/report" 
                element={
                  <ProtectedRoute>
                    <LayoutWrapper>
                      <ReportItemPage />
                    </LayoutWrapper>
                  </ProtectedRoute>
                } 
              />
              
              {/* Default Route - Redirect to dashboard if authenticated, login if not */}
              <Route path="/" element={
                <PublicRoute>
                  <Navigate to="/login" replace />
                </PublicRoute>
              } />
              
              {/* 404 Route */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Router>
        </AuthProvider>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;