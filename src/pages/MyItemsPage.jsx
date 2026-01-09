import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  Tab,
  Tabs,
  TextField,
  InputAdornment,
  IconButton,
  Avatar,
  Stack,
  Divider,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
  Refresh as RefreshIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Archive as ArchiveIcon,
  Visibility as ViewIcon,
  Chat as ChatIcon,
  Notifications as NotificationsIcon,
  TrendingUp,
  TrendingDown,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  AutoAwesome
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { itemService } from '../services/itemService';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/UI/LoadingSpinner';
import EnhancedItemCard from '../components/items/EnhancedItemCard';

const PageContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
}));

const StatsCard = styled(Card)(({ theme, color }) => ({
  background: color === 'purple' ? 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' :
              color === 'blue' ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' :
              color === 'green' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' :
              color === 'orange' ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' :
              'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
  color: 'white',
  borderRadius: '16px',
  height: '100%',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
  }
}));

const FilterCard = styled(Card)(({ theme }) => ({
  borderRadius: '16px',
  border: '3px solid #e2e8f0',
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
  marginBottom: theme.spacing(3),
  backgroundColor: '#ffffff',
  padding: theme.spacing(2),
  position: 'relative',
  zIndex: 1,
}));

const FilterContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  marginBottom: theme.spacing(2),
}));

// Search Bar Styling (Light Blue Theme)
const SearchTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: '#f0f9ff',
    border: '2px solid #bae6fd',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: '#e0f2fe',
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: '#38bdf8',
        borderWidth: '2px',
      }
    },
    '&.Mui-focused': {
      backgroundColor: '#e0f2fe',
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: '#0ea5e9',
        borderWidth: '2px',
      }
    },
  },
  '& .MuiInputBase-input': {
    color: '#0369a1',
    fontWeight: 500,
  },
  '& .MuiInputLabel-root': {
    color: '#0284c7',
  }
}));

// Filter Dropdown Styling
const FilterSelect = styled(Select)(({ theme }) => ({
  backgroundColor: '#faf5ff',
  borderRadius: '12px !important',
  border: '2px solid #e9d5ff',
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: 'transparent !important',
  },
  '&:hover': {
    backgroundColor: '#f3e8ff',
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#c084fc !important',
    }
  },
  '&.Mui-focused': {
    backgroundColor: '#f3e8ff',
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#8b5cf6 !important',
      borderWidth: '2px !important',
    }
  },
  '& .MuiSelect-select': {
    color: '#6b21a8',
    fontWeight: 500,
  }
}));

// Filter Label Styling
const FilterLabel = styled(InputLabel)(({ theme }) => ({
  color: '#8b5cf6 !important',
  fontWeight: '600 !important',
  fontSize: '0.9rem !important',
  backgroundColor: 'transparent',
  paddingLeft: '4px',
  '&.Mui-focused': {
    color: '#7c3aed !important',
  },
}));

// Form Control Container Styling
const StyledFormControl = styled(FormControl)(({ theme }) => ({
  '& .MuiFormLabel-filled': {
    color: '#8b5cf6 !important',
  }
}));

// Custom Tabs Styling
const StyledTabs = styled(Tabs)(({ theme }) => ({
  backgroundColor: '#f8fafc',
  borderRadius: '12px',
  padding: '4px',
  '& .MuiTab-root': {
    fontWeight: 600,
    textTransform: 'none',
    fontSize: '0.9rem',
    minHeight: 40,
    borderRadius: '8px',
    margin: '2px',
    color: '#64748b',
    '&.Mui-selected': {
      backgroundColor: 'white',
      color: '#8b5cf6',
      boxShadow: '0 2px 8px rgba(139, 92, 246, 0.2)',
    }
  },
  '& .MuiTabs-indicator': {
    display: 'none',
  }
}));

const MyItemsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [stats, setStats] = useState({
    totalItems: 0,
    lostItems: 0,
    foundItems: 0,
    resolvedItems: 0,
    pendingMatches: 0,
    activeChats: 0
  });
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState(null);

  const tabs = ['All Items', 'Lost Items', 'Found Items'];
  const statusOptions = ['ACTIVE', 'RESOLVED', 'IN_PROGRESS', 'ARCHIVED'];

  // Fetch data with useCallback to prevent unnecessary re-renders
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [itemsData, statsData] = await Promise.all([
        itemService.getMyItems({
          type: activeTab === 0 ? 'all' : activeTab === 1 ? 'LOST' : 'FOUND',
          status: filterType === 'all' ? '' : filterType,
          sortBy,
          search: searchQuery
        }),
        itemService.getMyItemsStats()
      ]);
      
      setItems(itemsData);
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load items. Please try again.');
    } finally {
      setLoading(false);
      setSearchLoading(false);
    }
  }, [activeTab, filterType, sortBy, searchQuery]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSearch = () => {
    setSearchLoading(true);
    fetchData();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    
    try {
      await itemService.deleteItem(itemToDelete.id);
      fetchData();
      setShowDeleteDialog(false);
      setItemToDelete(null);
    } catch (error) {
      setError('Failed to delete item. Please try again.');
    }
  };

  const handleArchiveItem = async (itemId) => {
    try {
      await itemService.archiveItem(itemId);
      fetchData();
    } catch (error) {
      setError('Failed to archive item. Please try again.');
    }
  };

  const handleUpdateStatus = async (itemId, status) => {
    try {
      await itemService.updateItemStatus(itemId, status);
      fetchData();
    } catch (error) {
      setError('Failed to update status. Please try again.');
    }
  };

  const handleRefresh = () => {
    setSearchLoading(true);
    fetchData();
  };

  // Helper function to get tab value from URL or state
  const getItemType = (tabIndex) => {
    switch(tabIndex) {
      case 0: return 'all';
      case 1: return 'LOST';
      case 2: return 'FOUND';
      default: return 'all';
    }
  };

  // Render stats cards
  const renderStatsCards = () => {
    const statsData = [
      { label: 'Total Items', value: stats.totalItems, color: 'purple' },
      { label: 'Lost Items', value: stats.lostItems, color: 'orange' },
      { label: 'Found Items', value: stats.foundItems, color: 'green' },
      { label: 'Resolved', value: stats.resolvedItems, color: 'blue' },
      { label: 'Pending Matches', value: stats.pendingMatches, color: 'purple' },
      { label: 'Active Chats', value: stats.activeChats, color: 'green' }
    ];

    return statsData.map((stat, index) => (
      <Grid item xs={6} sm={4} md={2} key={index}>
        <StatsCard color={stat.color}>
          <CardContent sx={{ p: 2.5, position: 'relative', zIndex: 1 }}>
            <Typography variant="h3" sx={{ 
              fontWeight: 900, 
              mb: 1,
              fontSize: { xs: '1.8rem', md: '2.5rem' }
            }}>
              {stat.value}
            </Typography>
            <Typography variant="body2" sx={{ 
              opacity: 0.9,
              fontSize: { xs: '0.7rem', md: '0.875rem' }
            }}>
              {stat.label}
            </Typography>
          </CardContent>
        </StatsCard>
      </Grid>
    ));
  };

  if (loading && items.length === 0) {
    return <LoadingSpinner fullScreen text="Loading your items..." />;
  }

  return (
    <PageContainer maxWidth="xl">
      {/* Error Alert */}
      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 3, borderRadius: '12px' }}
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}

      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/dashboard')}
          sx={{
            color: '#64748b',
            mb: 3,
            borderRadius: '10px',
            '&:hover': { backgroundColor: '#f1f5f9' }
          }}
        >
          Back to Dashboard
        </Button>

        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: { xs: 'stretch', md: 'flex-start' },
          mb: 4,
          flexDirection: { xs: 'column', md: 'row' },
          gap: { xs: 2, md: 0 }
        }}>
          <Box>
            <Typography variant="h3" sx={{ 
              fontWeight: 900, 
              color: '#1e1b4b',
              fontSize: { xs: '2rem', md: '2.5rem' },
              mb: 1
            }}>
              📋 My Items
            </Typography>
            <Typography variant="h6" sx={{ 
              color: '#64748b', 
              fontWeight: 500,
              fontSize: { xs: '1rem', md: '1.25rem' }
            }}>
              Manage your lost and found items
            </Typography>
            <Typography variant="body2" sx={{ 
              color: '#94a3b8', 
              mt: 1,
              fontSize: { xs: '0.8rem', md: '0.875rem' }
            }}>
              User: {user?.name || 'Guest'} • Email: {user?.email || 'Not signed in'}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={handleRefresh}
              disabled={searchLoading}
              sx={{
                borderRadius: '12px',
                borderColor: '#e2e8f0',
                color: '#64748b',
                '&:hover': {
                  borderColor: '#cbd5e1',
                  backgroundColor: '#f8fafc'
                }
              }}
            >
              Refresh
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/report-item')}
              sx={{
                background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                color: 'white',
                fontWeight: 800,
                borderRadius: '12px',
                px: 3,
                py: 1.5,
                boxShadow: '0 8px 25px rgba(139, 92, 246, 0.4)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
                  transform: 'translateY(-2px)',
                }
              }}
            >
              Report New Item
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {renderStatsCards()}
      </Grid>

      {/* Search and Filter */}
      <FilterCard>
        <CardContent sx={{ p: '16px !important', position: 'relative', zIndex: 1000 }}>
          <Grid container spacing={3}>
            {/* Search Bar */}
            <Grid item xs={12}>
              <SearchTextField
                fullWidth
                placeholder="Search your items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: '#0ea5e9' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton 
                        onClick={handleSearch}
                        disabled={searchLoading}
                        sx={{ 
                          color: '#0ea5e9',
                          animation: searchLoading ? 'spin 1s linear infinite' : 'none'
                        }}
                      >
                        {searchLoading ? <RefreshIcon /> : <SearchIcon />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>

            {/* Tabs Filter */}
            <Grid item xs={12} md={4}>
              <FilterContainer>
                <StyledTabs
                  value={activeTab}
                  onChange={(e, newValue) => setActiveTab(newValue)}
                  variant="fullWidth"
                >
                  {tabs.map((tab, index) => (
                    <Tab key={tab} label={tab} />
                  ))}
                </StyledTabs>
              </FilterContainer>
            </Grid>

            {/* Status Filter */}
            <Grid item xs={12} md={4}>
              <FilterContainer>
                <StyledFormControl fullWidth variant="outlined" size="small">
                  <FilterLabel shrink>Status</FilterLabel>
                  <FilterSelect
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    displayEmpty
                    inputProps={{ 'aria-label': 'Status' }}
                  >
                    <MenuItem value="all">All Status</MenuItem>
                    {statusOptions.map(option => (
                      <MenuItem key={option} value={option}>{option}</MenuItem>
                    ))}
                  </FilterSelect>
                </StyledFormControl>
              </FilterContainer>
            </Grid>

            {/* Sort By Filter */}
            <Grid item xs={12} md={4}>
              <FilterContainer>
                <StyledFormControl fullWidth variant="outlined" size="small">
                  <FilterLabel shrink>Sort By</FilterLabel>
                  <FilterSelect
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    displayEmpty
                    inputProps={{ 'aria-label': 'Sort By' }}
                  >
                    <MenuItem value="newest">Newest First</MenuItem>
                    <MenuItem value="oldest">Oldest First</MenuItem>
                    <MenuItem value="title">Title A-Z</MenuItem>
                    <MenuItem value="status">Status</MenuItem>
                  </FilterSelect>
                </StyledFormControl>
              </FilterContainer>
            </Grid>
          </Grid>
        </CardContent>
      </FilterCard>

      {/* Loading State */}
      {searchLoading && !loading && (
        <LinearProgress sx={{ mb: 3, borderRadius: '8px' }} />
      )}

      {/* Items Grid */}
      {items.length === 0 ? (
        <Box sx={{ 
          textAlign: 'center', 
          py: 8, 
          backgroundColor: 'white',
          borderRadius: '20px',
          border: '3px solid #e2e8f0'
        }}>
          <AutoAwesome sx={{ fontSize: 80, color: '#cbd5e1', mb: 2 }} />
          <Typography variant="h5" sx={{ 
            fontWeight: 700, 
            color: '#1e1b4b',
            mb: 1,
            fontSize: { xs: '1.25rem', md: '1.5rem' }
          }}>
            No items found
          </Typography>
          <Typography variant="body2" sx={{ 
            color: '#64748b', 
            mb: 3,
            fontSize: { xs: '0.875rem', md: '1rem' }
          }}>
            {searchQuery ? 'Try a different search term' : 'Start by reporting a lost or found item'}
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/report-item')}
            sx={{
              background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
              color: 'white',
              fontWeight: 700,
              borderRadius: '12px',
              px: 3,
              fontSize: { xs: '0.875rem', md: '1rem' }
            }}
          >
            Report Item
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {items.map((item) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
              <EnhancedItemCard
                item={item}
                onViewDetails={() => navigate(`/items/${item.id}`)}
                onEdit={() => navigate(`/edit-item/${item.id}`)}
                onDelete={() => handleDeleteClick(item)}
                onArchive={() => handleArchiveItem(item.id)}
                onUpdateStatus={(status) => handleUpdateStatus(item.id, status)}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Delete Dialog */}
      <Dialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Delete Item
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2, borderRadius: '8px' }}>
            Are you sure you want to delete this item? This action cannot be undone.
          </Alert>
          {itemToDelete && (
            <Typography variant="body1" sx={{ color: '#64748b' }}>
              Item: <strong>{itemToDelete.title}</strong>
              <br />
              Type: <strong>{itemToDelete.type}</strong>
              <br />
              Status: <strong>{itemToDelete.status}</strong>
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setShowDeleteDialog(false)}
            sx={{ color: '#64748b' }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteConfirm}
          >
            Delete Item
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add CSS for spinner animation */}
      <style jsx="true">{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </PageContainer>
  );
};

export default MyItemsPage;