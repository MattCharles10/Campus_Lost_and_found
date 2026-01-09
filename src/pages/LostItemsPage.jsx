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
  TextField,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  Stack,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Badge
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Category as CategoryIcon,
  CheckCircle as CheckCircleIcon,
  Visibility as ViewIcon,
  Refresh as RefreshIcon,
  Sort as SortIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  Map as MapIcon,
  Chat as ChatIcon,
  ArrowBack as ArrowBackIcon,
  TrendingUp,
  TrendingDown,
  Add as AddIcon, 
  Notifications as NotificationsIcon,
  Warning as WarningIcon,
  AutoAwesome
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { itemService } from '../services/itemService';
import LoadingSpinner from '../components/common/UI/LoadingSpinner';
import EnhancedItemCard from '../components/items/EnhancedItemCard';

const PageContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
}));

const HeaderBox = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
  borderRadius: '20px',
  padding: theme.spacing(4),
  marginBottom: theme.spacing(4),
  color: 'white',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
  }
}));

const UrgentAlertCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
  color: 'white',
  borderRadius: '16px',
  marginBottom: theme.spacing(3),
  border: '3px solid #fecaca',
  animation: 'pulse 2s infinite',
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

// Search Bar Styling
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
  backgroundColor: '#fff7ed',
  borderRadius: '12px !important',
  border: '2px solid #fed7aa',
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: 'transparent !important',
  },
  '&:hover': {
    backgroundColor: '#ffedd5',
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#fb923c !important',
    }
  },
  '&.Mui-focused': {
    backgroundColor: '#ffedd5',
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#f97316 !important',
      borderWidth: '2px !important',
    }
  },
  '& .MuiSelect-select': {
    color: '#9a3412',
    fontWeight: 500,
  }
}));

// Filter Label Styling
const FilterLabel = styled(InputLabel)(({ theme }) => ({
  color: '#ea580c !important',
  fontWeight: '600 !important',
  fontSize: '0.9rem !important',
  backgroundColor: 'transparent',
  paddingLeft: '4px',
  '&.Mui-focused': {
    color: '#c2410c !important',
  },
}));

// Form Control Container Styling
const StyledFormControl = styled(FormControl)(({ theme }) => ({
  '& .MuiFormLabel-filled': {
    color: '#ea580c !important',
  }
}));

const LostItemsPage = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    location: '',
    campusZone: '',
    dateRange: 'all',
    status: 'ACTIVE',
    urgency: ''
  });
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [stats, setStats] = useState({
    totalLost: 0,
    resolved: 0,
    urgent: 0,
    recent24h: 0
  });
  const [showUrgentOnly, setShowUrgentOnly] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState(null);

  const categories = ['Electronics', 'Documents', 'Clothing', 'Accessories', 'Books', 'Other'];
  const campusZones = ['ACADEMIC', 'DINING', 'RESIDENTIAL', 'RECREATIONAL', 'ADMINISTRATIVE'];

  // Fetch data function with useCallback
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        page,
        search: searchQuery,
        ...filters,
        sortBy,
        urgentOnly: showUrgentOnly
      };
      
      const [itemsResponse, statsData] = await Promise.all([
        itemService.getLostItems(params),
        itemService.getLostItemsStats()
      ]);
      
      setItems(itemsResponse.items || []);
      setTotalPages(itemsResponse.totalPages || 1);
      setTotalItems(itemsResponse.totalItems || 0);
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load lost items. Please try again.');
    } finally {
      setLoading(false);
      setSearchLoading(false);
    }
  }, [page, filters, sortBy, showUrgentOnly, searchQuery]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setPage(1);
  };

  const handleSearch = () => {
    setSearchLoading(true);
    setPage(1);
    fetchData();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClearFilters = () => {
    setFilters({
      category: '',
      location: '',
      campusZone: '',
      dateRange: 'all',
      status: 'ACTIVE',
      urgency: ''
    });
    setSearchQuery('');
    setSortBy('newest');
    setShowUrgentOnly(false);
    setPage(1);
  };

  const handleExport = async () => {
    try {
      const data = await itemService.exportLostItems(filters);
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `lost-items-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting data:', error);
      setError('Failed to export data. Please try again.');
    }
  };

  const handleRefresh = () => {
    setSearchLoading(true);
    fetchData();
  };

  const urgentItems = items.filter(item => item.urgent);
  const recoveryRate = Math.round((stats.resolved / (stats.totalLost || 1)) * 100) || 0;

  if (loading && items.length === 0) {
    return <LoadingSpinner fullScreen text="Loading lost items..." />;
  }

  const renderStatsBox = (value, label, icon) => (
    <Box sx={{
      backgroundColor: 'rgba(255,255,255,0.15)',
      borderRadius: '12px',
      p: 2,
      backdropFilter: 'blur(10px)'
    }}>
      <Typography variant="h4" sx={{ fontWeight: 800, color: 'white' }}>
        {value}
      </Typography>
      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
        {icon} {label}
      </Typography>
    </Box>
  );

  const renderActionBox = (icon, title, description, bgColor, borderColor, iconColor, textColor) => (
    <Box sx={{ 
      textAlign: 'center', 
      p: 2,
      backgroundColor: bgColor,
      borderRadius: '12px',
      border: `2px solid ${borderColor}`,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {React.cloneElement(icon, { sx: { fontSize: 40, color: iconColor, mb: 1 } })}
      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: textColor, mb: 1 }}>
        {title}
      </Typography>
      <Typography variant="body2" sx={{ color: textColor }}>
        {description}
      </Typography>
    </Box>
  );

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

      {/* Header Section */}
      <HeaderBox>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: { xs: 'flex-start', md: 'center' },
          flexDirection: { xs: 'column', md: 'row' },
          gap: { xs: 2, md: 0 }
        }}>
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate(-1)}
              sx={{
                color: 'white',
                backgroundColor: 'rgba(255,255,255,0.2)',
                mb: 3,
                borderRadius: '12px',
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' }
              }}
            >
              Back
            </Button>
            <Typography variant="h3" sx={{ 
              fontWeight: 900, 
              mb: 1, 
              color: 'white',
              fontSize: { xs: '2rem', md: '2.5rem' }
            }}>
              🔍 Lost Items
            </Typography>
            <Typography variant="h6" sx={{ 
              opacity: 0.9, 
              fontWeight: 500, 
              color: 'white',
              fontSize: { xs: '1rem', md: '1.25rem' }
            }}>
              Search for lost items across campus. Help reunite items with their owners!
            </Typography>
          </Box>
          
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography variant="h2" sx={{ 
              fontWeight: 900, 
              color: 'white', 
              textAlign: { xs: 'left', md: 'right' },
              fontSize: { xs: '2.5rem', md: '3rem' }
            }}>
              {stats.totalLost}
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9, color: 'white' }}>
              Total Items Lost
            </Typography>
          </Box>
        </Box>

        {/* Quick Stats */}
        <Grid container spacing={3} sx={{ mt: 4, position: 'relative', zIndex: 1 }}>
          <Grid item xs={6} md={3}>
            {renderStatsBox(stats.resolved, 'Recovered Items', '✅')}
          </Grid>
          <Grid item xs={6} md={3}>
            {renderStatsBox(stats.urgent, 'Urgent Items', '⚠️')}
          </Grid>
          <Grid item xs={6} md={3}>
            {renderStatsBox(stats.recent24h, 'Last 24 Hours', '⏰')}
          </Grid>
          <Grid item xs={6} md={3}>
            {renderStatsBox(`${recoveryRate}%`, 'Recovery Rate', '🎯')}
          </Grid>
        </Grid>
      </HeaderBox>

      {/* Urgent Alert Banner */}
      {urgentItems.length > 0 && (
        <UrgentAlertCard>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 2, sm: 0 }
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <WarningIcon sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 900 }}>
                    {urgentItems.length} URGENT Items Need Attention!
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    High-value or time-sensitive items that need immediate action
                  </Typography>
                </Box>
              </Box>
              <Button
                variant="contained"
                onClick={() => setShowUrgentOnly(!showUrgentOnly)}
                sx={{
                  backgroundColor: 'white',
                  color: '#ef4444',
                  fontWeight: 800,
                  borderRadius: '12px',
                  px: 3,
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.9)' }
                }}
              >
                {showUrgentOnly ? 'Show All' : 'Show Urgent Only'}
              </Button>
            </Box>
          </CardContent>
        </UrgentAlertCard>
      )}

      {/* Search and Filters */}
      <FilterCard>
        <CardContent sx={{ p: '16px !important', position: 'relative', zIndex: 1000 }}>
          <Grid container spacing={3}>
            {/* Search Bar */}
            <Grid item xs={12}>
              <SearchTextField
                fullWidth
                placeholder="Search lost items by title, description, location..."
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

            {/* Category Filter */}
            <Grid item xs={12} sm={6} md={3}>
              <StyledFormControl fullWidth variant="outlined" size="small">
                <FilterLabel shrink>Category</FilterLabel>
                <FilterSelect
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  displayEmpty
                >
                  <MenuItem value="">All Categories</MenuItem>
                  {categories.map(cat => (
                    <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                  ))}
                </FilterSelect>
              </StyledFormControl>
            </Grid>

            {/* Campus Zone Filter */}
            <Grid item xs={12} sm={6} md={3}>
              <StyledFormControl fullWidth variant="outlined" size="small">
                <FilterLabel shrink>Campus Zone</FilterLabel>
                <FilterSelect
                  value={filters.campusZone}
                  onChange={(e) => handleFilterChange('campusZone', e.target.value)}
                  displayEmpty
                >
                  <MenuItem value="">All Zones</MenuItem>
                  {campusZones.map(zone => (
                    <MenuItem key={zone} value={zone}>{zone}</MenuItem>
                  ))}
                </FilterSelect>
              </StyledFormControl>
            </Grid>

            {/* Urgency Filter */}
            <Grid item xs={12} sm={6} md={3}>
              <StyledFormControl fullWidth variant="outlined" size="small">
                <FilterLabel shrink>Urgency</FilterLabel>
                <FilterSelect
                  value={filters.urgency}
                  onChange={(e) => handleFilterChange('urgency', e.target.value)}
                  displayEmpty
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="urgent">Urgent Only</MenuItem>
                  <MenuItem value="normal">Normal Priority</MenuItem>
                </FilterSelect>
              </StyledFormControl>
            </Grid>

            {/* Sort By Filter */}
            <Grid item xs={12} sm={6} md={3}>
              <StyledFormControl fullWidth variant="outlined" size="small">
                <FilterLabel shrink>Sort By</FilterLabel>
                <FilterSelect
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  displayEmpty
                >
                  <MenuItem value="newest">Newest First</MenuItem>
                  <MenuItem value="urgent">Urgent First</MenuItem>
                  <MenuItem value="location">Location</MenuItem>
                  <MenuItem value="category">Category</MenuItem>
                </FilterSelect>
              </StyledFormControl>
            </Grid>

            {/* Action Buttons */}
            <Grid item xs={12}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                mt: 2,
                flexDirection: { xs: 'column', sm: 'row' },
                gap: { xs: 2, sm: 0 }
              }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/report-item')}
                    sx={{
                      background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                      color: 'white',
                      fontWeight: 800,
                      borderRadius: '12px',
                      px: 3,
                      py: 1.5
                    }}
                  >
                    Report Lost Item
                  </Button>
                  <Button
                    startIcon={<FilterIcon />}
                    onClick={handleClearFilters}
                    sx={{
                      borderColor: '#64748b',
                      color: '#64748b',
                      fontWeight: 600,
                      borderRadius: '12px',
                      px: 2,
                      '&:hover': {
                        borderColor: '#475569',
                        backgroundColor: 'rgba(100, 116, 139, 0.04)'
                      }
                    }}
                    variant="outlined"
                  >
                    Clear Filters
                  </Button>
                </Box>
                
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    startIcon={<NotificationsIcon />}
                    onClick={() => navigate('/alerts')}
                    sx={{
                      borderColor: '#f97316',
                      color: '#f97316',
                      fontWeight: 700,
                      borderRadius: '12px',
                      px: 3,
                      '&:hover': {
                        borderColor: '#ea580c',
                        backgroundColor: 'rgba(249, 115, 22, 0.04)'
                      }
                    }}
                    variant="outlined"
                  >
                    Set Alert
                  </Button>
                  <Button
                    startIcon={<DownloadIcon />}
                    onClick={handleExport}
                    sx={{
                      borderColor: '#64748b',
                      color: '#64748b',
                      fontWeight: 600,
                      borderRadius: '12px',
                      px: 3,
                      '&:hover': {
                        borderColor: '#475569',
                        backgroundColor: 'rgba(100, 116, 139, 0.04)'
                      }
                    }}
                    variant="outlined"
                  >
                    Export
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </FilterCard>

      {/* Loading Indicator for Search */}
      {searchLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <CircularProgress size={24} />
        </Box>
      )}

      {/* Items Grid */}
      {items.length === 0 ? (
        <Box sx={{ 
          textAlign: 'center', 
          py: 8, 
          backgroundColor: 'white',
          borderRadius: '20px',
          border: '3px solid #e2e8f0',
          mt: 2
        }}>
          <WarningIcon sx={{ fontSize: 80, color: '#cbd5e1', mb: 2 }} />
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#475569', mb: 1 }}>
            No lost items found
          </Typography>
          <Typography variant="body2" sx={{ color: '#94a3b8', mb: 3 }}>
            {showUrgentOnly 
              ? 'No urgent items at the moment.' 
              : searchQuery 
                ? 'Try adjusting your search terms or filters.'
                : 'Try adjusting your search filters or report a lost item.'}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/report-item')}
              sx={{
                background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                color: 'white',
                fontWeight: 700,
                borderRadius: '12px',
                px: 3,
              }}
            >
              Report Lost Item
            </Button>
            {(searchQuery || Object.values(filters).some(val => val !== '' && val !== 'ACTIVE')) && (
              <Button
                variant="outlined"
                onClick={handleClearFilters}
                sx={{
                  borderColor: '#64748b',
                  color: '#64748b',
                  fontWeight: 600,
                  borderRadius: '12px',
                  px: 3,
                }}
              >
                Clear Filters
              </Button>
            )}
          </Box>
        </Box>
      ) : (
        <>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="subtitle1" sx={{ color: '#64748b', fontWeight: 500 }}>
              Showing {items.length} of {totalItems} items
            </Typography>
            <Typography variant="subtitle1" sx={{ color: '#f97316', fontWeight: 600 }}>
              Page {page} of {totalPages}
            </Typography>
          </Box>
          
          <Grid container spacing={3}>
            {items.map((item) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
                <EnhancedItemCard
                  item={item}
                  onViewDetails={() => navigate(`/items/${item.id}`)}
                  onSetAlert={() => navigate(`/alerts?item=${item.id}`)}
                  onShare={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/items/${item.id}`);
                    // You could add a toast notification here
                  }}
                  showUrgentBadge={item.urgent}
                />
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(e, value) => setPage(value)}
                color="primary"
                size="large"
                showFirstButton
                showLastButton
                sx={{
                  '& .MuiPaginationItem-root': {
                    borderRadius: '8px',
                    fontWeight: 600,
                  },
                  '& .Mui-selected': {
                    backgroundColor: '#f97316 !important',
                    color: 'white',
                  }
                }}
              />
            </Box>
          )}
        </>
      )}

      {/* Quick Actions Footer */}
      <Box sx={{ 
        mt: 4, 
        p: 3, 
        backgroundColor: 'white',
        borderRadius: '20px',
        border: '3px solid #e2e8f0'
      }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e1b4b', mb: 2 }}>
          💡 Can't Find Your Item?
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            {renderActionBox(
              <AutoAwesome />,
              'Smart Matching',
              'Our AI will notify you if a similar item is found',
              '#fef3c7',
              '#fde047',
              '#d97706',
              '#92400e'
            )}
          </Grid>
          <Grid item xs={12} sm={4}>
            {renderActionBox(
              <MapIcon />,
              'Campus Map',
              'Check lost & found hotspots on campus map',
              '#dbeafe',
              '#93c5fd',
              '#1d4ed8',
              '#1e3a8a'
            )}
          </Grid>
          <Grid item xs={12} sm={4}>
            {renderActionBox(
              <ChatIcon />,
              'Community Help',
              'Ask the campus community for help',
              '#dcfce7',
              '#86efac',
              '#16a34a',
              '#166534'
            )}
          </Grid>
        </Grid>
      </Box>

      {/* Add CSS for animations */}
      <style jsx="true">{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.02); }
          100% { transform: scale(1); }
        }
      `}</style>
    </PageContainer>
  );
};

export default LostItemsPage;