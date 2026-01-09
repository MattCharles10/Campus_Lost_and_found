import React, { useState, useEffect } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Chat as ChatIcon,
  ArrowBack as ArrowBackIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
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
  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
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

const EmptyStateBox = styled(Box)(({ theme }) => ({
  textAlign: 'center', 
  padding: theme.spacing(8), 
  backgroundColor: 'white',
  borderRadius: '20px',
  border: '3px solid #e2e8f0',
  marginTop: theme.spacing(2)
}));

const StatsBox = styled(Box)(({ theme }) => ({
  backgroundColor: 'rgba(255,255,255,0.15)',
  borderRadius: '12px',
  padding: theme.spacing(2),
  backdropFilter: 'blur(10px)',
  height: '100%'
}));

const FilterContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  marginBottom: theme.spacing(2),
}));

// Search Bar Styling (Light Blue Theme)
const SearchTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: '#f0f9ff', // Light blue background
    border: '2px solid #bae6fd', // Light blue border
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: '#e0f2fe', // Slightly darker blue on hover
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: '#38bdf8', // Blue border on hover
        borderWidth: '2px',
      }
    },
    '&.Mui-focused': {
      backgroundColor: '#e0f2fe',
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: '#0ea5e9', // Bright blue when focused
        borderWidth: '2px',
      }
    },
  },
  '& .MuiInputBase-input': {
    color: '#0369a1', // Dark blue text
    fontWeight: 500,
  },
  '& .MuiInputLabel-root': {
    color: '#0284c7', // Blue label
  }
}));

// Filter Dropdown Styling (Light Green Theme)
const FilterSelect = styled(Select)(({ theme }) => ({
  backgroundColor: '#f0fdf4', // Light green background
  borderRadius: '12px !important',
  border: '2px solid #bbf7d0', // Light green border
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: 'transparent !important', // Hide default outline
  },
  '&:hover': {
    backgroundColor: '#dcfce7', // Slightly darker green on hover
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#22c55e !important', // Green border on hover
    }
  },
  '&.Mui-focused': {
    backgroundColor: '#dcfce7',
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#16a34a !important', // Darker green when focused
      borderWidth: '2px !important',
    }
  },
  '& .MuiSelect-select': {
    color: '#065f46', // Dark green text
    fontWeight: 500,
  }
}));

// Filter Label Styling (Green Theme)
const FilterLabel = styled(InputLabel)(({ theme }) => ({
  color: '#059669 !important', // Green color
  fontWeight: '600 !important',
  fontSize: '0.9rem !important',
  backgroundColor: 'transparent',
  paddingLeft: '4px',
  '&.Mui-focused': {
    color: '#047857 !important', // Darker green when focused
  },
}));

// Form Control Container Styling
const StyledFormControl = styled(FormControl)(({ theme }) => ({
  '& .MuiFormLabel-filled': {
    color: '#059669 !important',
  }
}));

// Styled Menu Props for dropdown
const MenuProps = {
  PaperProps: {
    sx: {
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
      border: '2px solid #bbf7d0',
      marginTop: '8px',
      maxHeight: 300,
      '& .MuiMenuItem-root': {
        color: '#065f46',
        fontWeight: 500,
        padding: '10px 16px',
        '&:hover': {
          backgroundColor: '#f0fdf4',
        },
        '&.Mui-selected': {
          backgroundColor: '#dcfce7',
          color: '#065f46',
          '&:hover': {
            backgroundColor: '#bbf7d0',
          }
        }
      }
    }
  },
  MenuListProps: {
    sx: {
      padding: '4px 0',
    }
  },
  anchorOrigin: {
    vertical: 'bottom',
    horizontal: 'left',
  },
  transformOrigin: {
    vertical: 'top',
    horizontal: 'left',
  },
};

const FoundItemsPage = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    location: '',
    campusZone: '',
    dateRange: 'all',
    status: 'ACTIVE'
  });
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({
    totalFound: 0,
    claimed: 0,
    unclaimed: 0,
    recent24h: 0
  });
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    fetchFoundItems();
    fetchStats();
  }, [page, filters, sortBy]);

  const fetchFoundItems = async () => {
    try {
      setLoading(true);
      const response = await itemService.getFoundItems({
        page,
        search: searchQuery,
        ...filters,
        sortBy
      });
      setItems(response.items || []);
      setTotalPages(response.totalPages || 1);
    } catch (error) {
      console.error('Error fetching found items:', error);
    } finally {
      setLoading(false);
      setSearchLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const statsData = await itemService.getFoundItemsStats();
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleSearch = () => {
    setSearchLoading(true);
    setPage(1);
    fetchFoundItems();
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setPage(1);
  };

  const handleViewDetails = (item) => {
    setSelectedItem(item);
    setShowDetailsDialog(true);
  };

  const handleClaimItem = async (itemId) => {
    try {
      await itemService.claimItem(itemId);
      alert('Claim request sent successfully! The finder will contact you.');
      fetchFoundItems();
      fetchStats();
    } catch (error) {
      alert('Failed to claim item. Please try again.');
    }
  };

  const handleShareItem = (item) => {
    const shareUrl = `${window.location.origin}/items/${item.id}`;
    navigator.clipboard.writeText(shareUrl);
    alert('Link copied to clipboard!');
  };

  const categories = ['Electronics', 'Documents', 'Clothing', 'Accessories', 'Books', 'Other'];
  const campusZones = ['ACADEMIC', 'DINING', 'RESIDENTIAL', 'RECREATIONAL', 'ADMINISTRATIVE'];

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  if (loading && items.length === 0) {
    return <LoadingSpinner fullScreen text="Loading found items..." />;
  }

  return (
    <PageContainer maxWidth="xl">
      {/* Header Section */}
      <HeaderBox>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
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
            <Typography variant="h3" sx={{ fontWeight: 900, mb: 1, color: 'white' }}>
              🎁 Found Items
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 500, color: 'white' }}>
              Browse items found across campus. Claim if something belongs to you!
            </Typography>
          </Box>
          
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography variant="h2" sx={{ fontWeight: 900, color: 'white', textAlign: 'right' }}>
              {stats.totalFound}
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9, color: 'white' }}>
              Total Items Found
            </Typography>
          </Box>
        </Box>

        {/* Quick Stats */}
        <Grid container spacing={3} sx={{ mt: 4, position: 'relative', zIndex: 1 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatsBox>
              <Typography variant="h4" sx={{ fontWeight: 800, color: 'white' }}>
                {stats.claimed}
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                ✅ Claimed Items
              </Typography>
            </StatsBox>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsBox>
              <Typography variant="h4" sx={{ fontWeight: 800, color: 'white' }}>
                {stats.unclaimed}
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                🔍 Awaiting Claim
              </Typography>
            </StatsBox>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsBox>
              <Typography variant="h4" sx={{ fontWeight: 800, color: 'white' }}>
                {stats.recent24h}
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                ⏰ Last 24 Hours
              </Typography>
            </StatsBox>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsBox>
              <Typography variant="h4" sx={{ fontWeight: 800, color: 'white' }}>
                {Math.round((stats.claimed / (stats.totalFound || 1)) * 100) || 0}%
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                🎯 Recovery Rate
              </Typography>
            </StatsBox>
          </Grid>
        </Grid>
      </HeaderBox>

      {/* Search and Filters */}
      <FilterCard>
        <CardContent sx={{ p: '16px !important', position: 'relative', zIndex: 1000 }}>
          <Grid container spacing={3}>
            {/* Search Bar (Light Blue Theme) */}
            <Grid item xs={12}>
              <SearchTextField
                fullWidth
                placeholder="Search found items by title, description, location..."
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
                        sx={{ color: '#0ea5e9' }}
                      >
                        {searchLoading ? <RefreshIcon sx={{ animation: 'spin 1s linear infinite' }} /> : <SearchIcon />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>

            {/* Category Filter (Light Green Theme) */}
            <Grid item xs={12} sm={6} md={3}>
              <FilterContainer>
                <StyledFormControl fullWidth variant="outlined" size="small">
                  <FilterLabel shrink>Category</FilterLabel>
                  <FilterSelect
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    displayEmpty
                    inputProps={{ 'aria-label': 'Category' }}
                    MenuProps={MenuProps}
                  >
                    <MenuItem value="">All Categories</MenuItem>
                    {categories.map(cat => (
                      <MenuItem key={cat} value={cat} sx={{ color: '#065f46' }}>{cat}</MenuItem>
                    ))}
                  </FilterSelect>
                </StyledFormControl>
              </FilterContainer>
            </Grid>

            {/* Campus Zone Filter (Light Green Theme) */}
            <Grid item xs={12} sm={6} md={3}>
              <FilterContainer>
                <StyledFormControl fullWidth variant="outlined" size="small">
                  <FilterLabel shrink>Campus Zone</FilterLabel>
                  <FilterSelect
                    value={filters.campusZone}
                    onChange={(e) => handleFilterChange('campusZone', e.target.value)}
                    displayEmpty
                    inputProps={{ 'aria-label': 'Campus Zone' }}
                    MenuProps={MenuProps}
                  >
                    <MenuItem value="">All Zones</MenuItem>
                    {campusZones.map(zone => (
                      <MenuItem key={zone} value={zone} sx={{ color: '#065f46' }}>{zone}</MenuItem>
                    ))}
                  </FilterSelect>
                </StyledFormControl>
              </FilterContainer>
            </Grid>

            {/* Date Range Filter (Light Green Theme) */}
            <Grid item xs={12} sm={6} md={3}>
              <FilterContainer>
                <StyledFormControl fullWidth variant="outlined" size="small">
                  <FilterLabel shrink>Date Range</FilterLabel>
                  <FilterSelect
                    value={filters.dateRange}
                    onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                    displayEmpty
                    inputProps={{ 'aria-label': 'Date Range' }}
                    MenuProps={MenuProps}
                  >
                    <MenuItem value="all">All Time</MenuItem>
                    <MenuItem value="24h">Last 24 Hours</MenuItem>
                    <MenuItem value="week">Last Week</MenuItem>
                    <MenuItem value="month">Last Month</MenuItem>
                  </FilterSelect>
                </StyledFormControl>
              </FilterContainer>
            </Grid>

            {/* Sort By Filter (Light Green Theme) */}
            <Grid item xs={12} sm={6} md={3}>
              <FilterContainer>
                <StyledFormControl fullWidth variant="outlined" size="small">
                  <FilterLabel shrink>Sort By</FilterLabel>
                  <FilterSelect
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    displayEmpty
                    inputProps={{ 'aria-label': 'Sort By' }}
                    MenuProps={MenuProps}
                  >
                    <MenuItem value="newest">Newest First</MenuItem>
                    <MenuItem value="oldest">Oldest First</MenuItem>
                    <MenuItem value="location">Location</MenuItem>
                    <MenuItem value="category">Category</MenuItem>
                  </FilterSelect>
                </StyledFormControl>
              </FilterContainer>
            </Grid>
          </Grid>
        </CardContent>
      </FilterCard>

      {/* Items Grid */}
      {items.length === 0 ? (
        <EmptyStateBox>
          <CheckCircleIcon sx={{ fontSize: 80, color: '#cbd5e1', mb: 2 }} />
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#475569', mb: 1 }}>
            No found items available
          </Typography>
          <Typography variant="body2" sx={{ color: '#94a3b8', mb: 3 }}>
            Check back later or report a found item if you found something.
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/report-item')}
            sx={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              fontWeight: 700,
              borderRadius: '12px',
              px: 3
            }}
          >
            Report Found Item
          </Button>
        </EmptyStateBox>
      ) : (
        <>
          <Grid container spacing={3}>
            {items.map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item.id}>
                <EnhancedItemCard
                  item={item}
                  onViewDetails={() => handleViewDetails(item)}
                  onClaim={() => handleClaimItem(item.id)}
                  onShare={() => handleShareItem(item)}
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
              />
            </Box>
          )}
        </>
      )}

      {/* Item Details Dialog */}
      <Dialog
        open={showDetailsDialog}
        onClose={() => setShowDetailsDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '24px',
            border: '3px solid #10b981',
          }
        }}
      >
        {selectedItem && (
          <>
            <DialogTitle sx={{ 
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              borderTopLeftRadius: '20px',
              borderTopRightRadius: '20px',
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h5" sx={{ fontWeight: 900 }}>
                  {selectedItem.title}
                </Typography>
                <Chip 
                  label="FOUND"
                  sx={{ 
                    backgroundColor: 'white',
                    color: '#10b981',
                    fontWeight: 800
                  }}
                />
              </Box>
            </DialogTitle>
            
            <DialogContent sx={{ py: 4 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" sx={{ color: '#64748b', fontWeight: 600, mb: 1 }}>
                      📍 LOCATION FOUND
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e1b4b' }}>
                      {selectedItem.location}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                      {selectedItem.campusZone} • {selectedItem.building || 'Unknown Building'}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" sx={{ color: '#64748b', fontWeight: 600, mb: 1 }}>
                      📅 DATE FOUND
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: '#1e1b4b' }}>
                      {new Date(selectedItem.createdAt).toLocaleDateString()} at{' '}
                      {new Date(selectedItem.createdAt).toLocaleTimeString()}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" sx={{ color: '#64748b', fontWeight: 600, mb: 1 }}>
                      🏷️ CATEGORY
                    </Typography>
                    <Chip 
                      label={selectedItem.category}
                      sx={{ 
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        color: '#065f46',
                        fontWeight: 700
                      }}
                    />
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box sx={{ 
                    backgroundColor: '#f0fdf4',
                    borderRadius: '12px',
                    p: 3,
                    border: '2px solid #bbf7d0'
                  }}>
                    <Typography variant="subtitle2" sx={{ color: '#065f46', fontWeight: 700, mb: 2 }}>
                      🎯 HOW TO CLAIM
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#475569', mb: 2 }}>
                      1. Verify this item belongs to you<br/>
                      2. Click "Claim This Item" button<br/>
                      3. Provide proof of ownership<br/>
                      4. Arrange pickup with finder
                    </Typography>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<CheckCircleIcon />}
                      onClick={() => {
                        handleClaimItem(selectedItem.id);
                        setShowDetailsDialog(false);
                      }}
                      sx={{
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        color: 'white',
                        fontWeight: 800,
                        borderRadius: '12px',
                        py: 1.5,
                        mt: 1
                      }}
                    >
                      Claim This Item
                    </Button>
                  </Box>
                </Grid>

                {selectedItem.description && (
                  <Grid item xs={12}>
                    <Box sx={{ 
                      backgroundColor: '#f8fafc',
                      borderRadius: '12px',
                      p: 3,
                      border: '2px solid #e2e8f0'
                    }}>
                      <Typography variant="subtitle2" sx={{ color: '#64748b', fontWeight: 600, mb: 1 }}>
                        📝 DESCRIPTION
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#475569' }}>
                        {selectedItem.description}
                      </Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </DialogContent>

            <DialogActions sx={{ p: 3, borderTop: '2px solid #e2e8f0' }}>
              <Button
                onClick={() => setShowDetailsDialog(false)}
                sx={{ 
                  color: '#64748b',
                  fontWeight: 600,
                  borderRadius: '10px'
                }}
              >
                Close
              </Button>
              <Button
                variant="contained"
                startIcon={<ChatIcon />}
                onClick={() => navigate(`/chat?item=${selectedItem.id}`)}
                sx={{
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  color: 'white',
                  fontWeight: 700,
                  borderRadius: '12px',
                  px: 3
                }}
              >
                Contact Finder
              </Button>
            </DialogActions>
          </>
        )}
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

export default FoundItemsPage;