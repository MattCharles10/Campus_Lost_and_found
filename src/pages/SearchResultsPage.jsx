import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
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
  Pagination,
  Stack,
  Divider,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Checkbox,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
  Refresh as RefreshIcon,
  Clear as ClearIcon,
  ExpandMore as ExpandMoreIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Category as CategoryIcon,
  TrendingUp,
  TrendingDown,
  AutoAwesome,
  Map as MapIcon,
  Tune as TuneIcon,
  ArrowBack as ArrowBackIcon
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

const SearchHeader = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
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

const StyledSelect = styled(Select)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: '#ffffff',
    '&:hover': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: '#8b5cf6',
      }
    },
    '&.Mui-focused': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: '#8b5cf6',
        borderWidth: 2,
      }
    },
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: '#e2e8f0',
    borderWidth: 2,
  },
}));

const MenuProps = {
  PaperProps: {
    sx: {
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.25)',
      border: '2px solid #8b5cf6',
      marginTop: '8px',
      maxHeight: 300,
      zIndex: 9999,
      '& .MuiMenuItem-root': {
        color: '#1e1b4b',
        fontWeight: 500,
        padding: '14px 20px',
        fontSize: '0.95rem',
        '&:hover': {
          backgroundColor: '#faf5ff',
          color: '#8b5cf6',
        },
        '&.Mui-selected': {
          backgroundColor: '#f3e8ff',
          color: '#8b5cf6',
          fontWeight: 600,
          '&:hover': {
            backgroundColor: '#f3e8ff',
          }
        }
      }
    }
  },
  MenuListProps: {
    sx: {
      padding: '8px 0',
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

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [filters, setFilters] = useState({
    type: searchParams.get('type') || '',
    category: searchParams.get('category') || '',
    location: searchParams.get('location') || '',
    campusZone: '',
    dateRange: 'all',
    status: 'ACTIVE',
    minValue: 0,
    maxValue: 10000,
    urgentOnly: false,
    withImages: false
  });
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  // Initialize from URL params on component mount
  useEffect(() => {
    const initialSearchQuery = searchParams.get('q') || '';
    const initialType = searchParams.get('type') || '';
    const initialCategory = searchParams.get('category') || '';
    const initialLocation = searchParams.get('location') || '';
    
    setSearchQuery(initialSearchQuery);
    setFilters(prev => ({
      ...prev,
      type: initialType,
      category: initialCategory,
      location: initialLocation
    }));
    
    // Perform initial search
    performSearch();
  }, []);

  // Perform search when filters or page changes
  useEffect(() => {
    if (page !== 1) {
      performSearch();
    }
  }, [page]);

  const performSearch = async () => {
    try {
      setLoading(true);
      const searchParams = {
        query: searchQuery,
        page,
        sortBy,
        ...filters
      };
      
      // Clean up empty values
      Object.keys(searchParams).forEach(key => {
        if (searchParams[key] === '' || searchParams[key] === false) {
          delete searchParams[key];
        }
      });

      const response = await itemService.searchItems(searchParams);
      setItems(response.items || []);
      setTotalPages(response.totalPages || 1);
      setTotalResults(response.totalResults || 0);
    } catch (error) {
      console.error('Error searching items:', error);
      setItems([]);
      setTotalPages(1);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(1);
    performSearch();
    
    // Update URL with search parameters
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (filters.type) params.set('type', filters.type);
    if (filters.category) params.set('category', filters.category);
    if (filters.location) params.set('location', filters.location);
    
    const newUrl = `/search${params.toString() ? `?${params.toString()}` : ''}`;
    navigate(newUrl, { replace: true });
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setFilters({
      type: '',
      category: '',
      location: '',
      campusZone: '',
      dateRange: 'all',
      status: 'ACTIVE',
      minValue: 0,
      maxValue: 10000,
      urgentOnly: false,
      withImages: false
    });
    setSortBy('newest');
    setPage(1);
    navigate('/search', { replace: true });
  };

  const handleApplyFilters = () => {
    setPage(1);
    performSearch();
  };

  const categories = [
    'Electronics', 'Documents', 'Clothing', 'Accessories', 'Books',
    'Wallet/Purse', 'Keys', 'Jewelry', 'Sports Equipment', 'Other'
  ];

  const campusZones = [
    'ACADEMIC', 'DINING', 'RESIDENTIAL', 'RECREATIONAL',
    'ADMINISTRATIVE', 'PARKING', 'LIBRARY', 'OTHER'
  ];

  if (loading && items.length === 0) {
    return <LoadingSpinner fullScreen text="Searching items..." />;
  }

  return (
    <PageContainer maxWidth="xl">
      {/* Search Header */}
      <SearchHeader>
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            sx={{
              color: 'white',
              backgroundColor: 'rgba(255,255,255,0.2)',
              mb: 3,
              borderRadius: '12px',
              px: 2,
              py: 1,
              '&:hover': { 
                backgroundColor: 'rgba(255,255,255,0.3)',
                transform: 'translateY(-1px)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            Back
          </Button>
          
          <Typography variant="h3" sx={{ fontWeight: 900, mb: 2, color: 'white', fontSize: { xs: '2rem', md: '2.5rem' } }}>
            🔍 Search Results
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <TextField
              fullWidth
              placeholder="Search lost & found items across campus..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  '&:hover fieldset': {
                    borderColor: '#8b5cf6',
                    borderWidth: 2,
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#8b5cf6',
                    borderWidth: 2,
                  }
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#8b5cf6' }} />
                  </InputAdornment>
                ),
                endAdornment: searchQuery && (
                  <InputAdornment position="end">
                    <IconButton 
                      onClick={() => setSearchQuery('')}
                      size="small"
                    >
                      <ClearIcon sx={{ color: '#64748b' }} />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <Button
              variant="contained"
              onClick={handleSearch}
              sx={{
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                color: '#8b5cf6',
                fontWeight: 800,
                borderRadius: '12px',
                minWidth: '120px',
                boxShadow: '0 10px 30px rgba(139, 92, 246, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 15px 40px rgba(139, 92, 246, 0.4)'
                }
              }}
            >
              Search
            </Button>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>
              {totalResults} results found
            </Typography>
            <Button
              variant="contained"
              startIcon={<FilterIcon />}
              onClick={() => setShowFilters(!showFilters)}
              sx={{
                backgroundColor: 'white',
                color: '#8b5cf6',
                fontWeight: 700,
                borderRadius: '12px',
                px: 3,
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  transform: 'translateY(-2px)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
          </Box>
        </Box>
      </SearchHeader>

      {/* Filters Panel */}
      {showFilters && (
        <Card sx={{ 
          borderRadius: '16px', 
          border: '3px solid #e2e8f0',
          mb: 3,
          backgroundColor: 'white',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.1)'
        }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e1b4b' }}>
                <TuneIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Advanced Filters
              </Typography>
              <Button
                startIcon={<ClearIcon />}
                onClick={handleClearFilters}
                sx={{
                  color: '#ef4444',
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: '#fef2f2'
                  }
                }}
              >
                Clear All
              </Button>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={4} lg={2}>
                <FormControl fullWidth variant="outlined" size="small">
                  <InputLabel sx={{ 
                    color: filters.type ? '#1e1b4b' : '#64748b',
                    fontWeight: filters.type ? 600 : 500
                  }}>
                    Item Type
                  </InputLabel>
                  <StyledSelect
                    value={filters.type}
                    label="Item Type"
                    onChange={(e) => setFilters({...filters, type: e.target.value})}
                    MenuProps={MenuProps}
                  >
                    <MenuItem value="">All Types</MenuItem>
                    <MenuItem value="LOST">Lost Items</MenuItem>
                    <MenuItem value="FOUND">Found Items</MenuItem>
                  </StyledSelect>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={4} lg={2}>
                <FormControl fullWidth variant="outlined" size="small">
                  <InputLabel sx={{ 
                    color: filters.category ? '#1e1b4b' : '#64748b',
                    fontWeight: filters.category ? 600 : 500
                  }}>
                    Category
                  </InputLabel>
                  <StyledSelect
                    value={filters.category}
                    label="Category"
                    onChange={(e) => setFilters({...filters, category: e.target.value})}
                    MenuProps={MenuProps}
                  >
                    <MenuItem value="">All Categories</MenuItem>
                    {categories.map(cat => (
                      <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                    ))}
                  </StyledSelect>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={4} lg={2}>
                <FormControl fullWidth variant="outlined" size="small">
                  <InputLabel sx={{ 
                    color: filters.campusZone ? '#1e1b4b' : '#64748b',
                    fontWeight: filters.campusZone ? 600 : 500
                  }}>
                    Campus Zone
                  </InputLabel>
                  <StyledSelect
                    value={filters.campusZone}
                    label="Campus Zone"
                    onChange={(e) => setFilters({...filters, campusZone: e.target.value})}
                    MenuProps={MenuProps}
                  >
                    <MenuItem value="">All Zones</MenuItem>
                    {campusZones.map(zone => (
                      <MenuItem key={zone} value={zone}>{zone}</MenuItem>
                    ))}
                  </StyledSelect>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={4} lg={2}>
                <FormControl fullWidth variant="outlined" size="small">
                  <InputLabel sx={{ 
                    color: filters.dateRange && filters.dateRange !== 'all' ? '#1e1b4b' : '#64748b',
                    fontWeight: filters.dateRange && filters.dateRange !== 'all' ? 600 : 500
                  }}>
                    Date Range
                  </InputLabel>
                  <StyledSelect
                    value={filters.dateRange}
                    label="Date Range"
                    onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
                    MenuProps={MenuProps}
                  >
                    <MenuItem value="all">All Time</MenuItem>
                    <MenuItem value="24h">Last 24 Hours</MenuItem>
                    <MenuItem value="week">Last Week</MenuItem>
                    <MenuItem value="month">Last Month</MenuItem>
                    <MenuItem value="year">Last Year</MenuItem>
                  </StyledSelect>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={4} lg={2}>
                <FormControl fullWidth variant="outlined" size="small">
                  <InputLabel sx={{ 
                    color: sortBy !== 'newest' ? '#1e1b4b' : '#64748b',
                    fontWeight: sortBy !== 'newest' ? 600 : 500
                  }}>
                    Sort By
                  </InputLabel>
                  <StyledSelect
                    value={sortBy}
                    label="Sort By"
                    onChange={(e) => {
                      setSortBy(e.target.value);
                      handleApplyFilters();
                    }}
                    MenuProps={MenuProps}
                  >
                    <MenuItem value="relevance">Relevance</MenuItem>
                    <MenuItem value="newest">Newest First</MenuItem>
                    <MenuItem value="oldest">Oldest First</MenuItem>
                    <MenuItem value="value_high">Value (High to Low)</MenuItem>
                    <MenuItem value="value_low">Value (Low to High)</MenuItem>
                  </StyledSelect>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={4} lg={2}>
                <Button
                  variant="contained"
                  onClick={handleApplyFilters}
                  fullWidth
                  sx={{
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                    color: 'white',
                    fontWeight: 700,
                    borderRadius: '12px',
                    height: 40,
                    boxShadow: '0 10px 30px rgba(139, 92, 246, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 15px 40px rgba(139, 92, 246, 0.4)'
                    }
                  }}
                >
                  Apply Filters
                </Button>
              </Grid>
            </Grid>

            {/* Additional Filters */}
            <Accordion sx={{ 
              mt: 3, 
              boxShadow: 'none', 
              border: '2px solid #e2e8f0',
              borderRadius: '12px !important',
              '&:before': {
                display: 'none'
              }
            }}>
              <AccordionSummary 
                expandIcon={<ExpandMoreIcon />}
                sx={{
                  backgroundColor: '#f8fafc',
                  borderRadius: '12px 12px 0 0',
                  '&.Mui-expanded': {
                    minHeight: '48px',
                    borderBottom: '2px solid #e2e8f0'
                  }
                }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1e1b4b' }}>
                  More Filters
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ backgroundColor: '#f8fafc', borderRadius: '0 0 12px 12px' }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ px: 2 }}>
                      <Typography variant="subtitle2" sx={{ color: '#475569', mb: 2, fontWeight: 600 }}>
                        Value Range: ${filters.minValue.toLocaleString()} - ${filters.maxValue.toLocaleString()}
                      </Typography>
                      <Slider
                        value={[filters.minValue, filters.maxValue]}
                        onChange={(e, newValue) => setFilters({
                          ...filters,
                          minValue: newValue[0],
                          maxValue: newValue[1]
                        })}
                        onChangeCommitted={(e, newValue) => {
                          if (newValue[0] !== 0 || newValue[1] !== 10000) {
                            handleApplyFilters();
                          }
                        }}
                        valueLabelDisplay="auto"
                        valueLabelFormat={(value) => `$${value.toLocaleString()}`}
                        min={0}
                        max={10000}
                        step={100}
                        sx={{ 
                          color: '#8b5cf6',
                          '& .MuiSlider-thumb': {
                            boxShadow: '0 0 10px rgba(139, 92, 246, 0.5)'
                          }
                        }}
                      />
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Stack spacing={2} sx={{ px: 2 }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={filters.urgentOnly}
                            onChange={(e) => {
                              setFilters({...filters, urgentOnly: e.target.checked});
                              handleApplyFilters();
                            }}
                            sx={{
                              color: '#8b5cf6',
                              '&.Mui-checked': {
                                color: '#8b5cf6',
                              }
                            }}
                          />
                        }
                        label={
                          <Typography variant="body2" sx={{ color: '#475569', fontWeight: 500 }}>
                            Urgent Items Only
                          </Typography>
                        }
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={filters.withImages}
                            onChange={(e) => {
                              setFilters({...filters, withImages: e.target.checked});
                              handleApplyFilters();
                            }}
                            sx={{
                              color: '#8b5cf6',
                              '&.Mui-checked': {
                                color: '#8b5cf6',
                              }
                            }}
                          />
                        }
                        label={
                          <Typography variant="body2" sx={{ color: '#475569', fontWeight: 500 }}>
                            Items with Photos
                          </Typography>
                        }
                      />
                    </Stack>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>

            {/* Active Filters */}
            <Box sx={{ mt: 3, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {filters.type && (
                <Chip
                  label={`Type: ${filters.type === 'LOST' ? 'Lost' : 'Found'}`}
                  onDelete={() => setFilters({...filters, type: ''})}
                  sx={{ backgroundColor: '#fef3c7', color: '#92400e', fontWeight: 600 }}
                />
              )}
              {filters.category && (
                <Chip
                  label={`Category: ${filters.category}`}
                  onDelete={() => setFilters({...filters, category: ''})}
                  sx={{ backgroundColor: '#dbeafe', color: '#1e40af', fontWeight: 600 }}
                />
              )}
              {filters.campusZone && (
                <Chip
                  label={`Zone: ${filters.campusZone}`}
                  onDelete={() => setFilters({...filters, campusZone: ''})}
                  sx={{ backgroundColor: '#dcfce7', color: '#166534', fontWeight: 600 }}
                />
              )}
              {filters.urgentOnly && (
                <Chip
                  label="Urgent Only"
                  onDelete={() => setFilters({...filters, urgentOnly: false})}
                  sx={{ backgroundColor: '#fee2e2', color: '#991b1b', fontWeight: 600 }}
                />
              )}
              {filters.withImages && (
                <Chip
                  label="With Photos"
                  onDelete={() => setFilters({...filters, withImages: false})}
                  sx={{ backgroundColor: '#f3e8ff', color: '#7c3aed', fontWeight: 600 }}
                />
              )}
              {sortBy !== 'newest' && (
                <Chip
                  label={`Sorted: ${sortBy.replace('_', ' ')}`}
                  onDelete={() => setSortBy('newest')}
                  sx={{ backgroundColor: '#f0f9ff', color: '#0c4a6e', fontWeight: 600 }}
                />
              )}
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress sx={{ color: '#8b5cf6' }} />
        </Box>
      ) : items.length === 0 ? (
        <Box sx={{ 
          textAlign: 'center', 
          py: 8, 
          backgroundColor: 'white',
          borderRadius: '20px',
          border: '3px solid #e2e8f0',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.1)'
        }}>
          <SearchIcon sx={{ fontSize: 80, color: '#cbd5e1', mb: 2 }} />
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#475569', mb: 1 }}>
            No items found
          </Typography>
          <Typography variant="body2" sx={{ color: '#94a3b8', mb: 3, maxWidth: 500, mx: 'auto' }}>
            Try adjusting your search terms or filters to find what you're looking for.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              onClick={() => navigate('/report-item')}
              sx={{
                background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                color: 'white',
                fontWeight: 700,
                borderRadius: '12px',
                px: 3,
                py: 1.5,
                minWidth: '160px'
              }}
            >
              Report Item
            </Button>
            <Button
              variant="outlined"
              onClick={handleClearFilters}
              sx={{
                borderColor: '#64748b',
                borderWidth: 2,
                color: '#64748b',
                fontWeight: 600,
                borderRadius: '12px',
                px: 3,
                py: 1.5,
                minWidth: '160px',
                '&:hover': {
                  borderColor: '#475569',
                  backgroundColor: '#f1f5f9'
                }
              }}
            >
              Clear Search
            </Button>
          </Box>
        </Box>
      ) : (
        <>
          {/* Results Summary */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 3,
            p: 3,
            backgroundColor: 'white',
            borderRadius: '16px',
            border: '3px solid #e2e8f0',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)'
          }}>
            <Typography variant="body1" sx={{ color: '#475569', fontWeight: 700, fontSize: '1.1rem' }}>
              Showing {items.length} of {totalResults} items
            </Typography>
            <Chip
              icon={<TrendingUp sx={{ fontSize: 18 }} />}
              label={`Page ${page} of ${totalPages}`}
              sx={{
                backgroundColor: 'rgba(139, 92, 246, 0.1)',
                color: '#7c3aed',
                fontWeight: 700,
                fontSize: '0.9rem',
                border: '2px solid rgba(139, 92, 246, 0.2)'
              }}
            />
          </Box>

          {/* Items Grid */}
          <Grid container spacing={3}>
            {items.map((item) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
                <EnhancedItemCard
                  item={item}
                  onViewDetails={() => navigate(`/items/${item.id}`)}
                  onClaim={() => itemService.claimItem(item.id)}
                  onShare={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/items/${item.id}`);
                    // Show toast notification here if you have one
                    alert('Link copied to clipboard!');
                  }}
                />
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              mt: 4,
              p: 3,
              backgroundColor: 'white',
              borderRadius: '16px',
              border: '3px solid #e2e8f0'
            }}>
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
                    fontWeight: 600,
                    borderRadius: '8px',
                    margin: '0 4px',
                    fontSize: '0.95rem',
                    '&.Mui-selected': {
                      backgroundColor: '#8b5cf6',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: '#7c3aed'
                      }
                    }
                  }
                }}
              />
            </Box>
          )}
        </>
      )}

      {/* Search Tips */}
      <Box sx={{ 
        mt: 6, 
        p: 4, 
        backgroundColor: '#f8fafc', 
        borderRadius: '20px', 
        border: '3px solid #e2e8f0',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.05)'
      }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e1b4b', mb: 3, fontSize: '1.2rem' }}>
          💡 Search Tips
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2,
              p: 2,
              backgroundColor: 'white',
              borderRadius: '12px',
              border: '2px solid #e2e8f0'
            }}>
              <Box sx={{ 
                backgroundColor: 'rgba(139, 92, 246, 0.1)',
                borderRadius: '10px',
                p: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <AutoAwesome sx={{ color: '#8b5cf6', fontSize: 24 }} />
              </Box>
              <Typography variant="body2" sx={{ color: '#475569', fontWeight: 500 }}>
                Use specific keywords like "black wallet" or "iphone 14"
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2,
              p: 2,
              backgroundColor: 'white',
              borderRadius: '12px',
              border: '2px solid #e2e8f0'
            }}>
              <Box sx={{ 
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderRadius: '10px',
                p: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <LocationIcon sx={{ color: '#3b82f6', fontSize: 24 }} />
              </Box>
              <Typography variant="body2" sx={{ color: '#475569', fontWeight: 500 }}>
                Include location details for better results
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2,
              p: 2,
              backgroundColor: 'white',
              borderRadius: '12px',
              border: '2px solid #e2e8f0'
            }}>
              <Box sx={{ 
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                borderRadius: '10px',
                p: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <CalendarIcon sx={{ color: '#10b981', fontSize: 24 }} />
              </Box>
              <Typography variant="body2" sx={{ color: '#475569', fontWeight: 500 }}>
                Filter by date to find recent items
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2,
              p: 2,
              backgroundColor: 'white',
              borderRadius: '12px',
              border: '2px solid #e2e8f0'
            }}>
              <Box sx={{ 
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                borderRadius: '10px',
                p: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <MapIcon sx={{ color: '#ef4444', fontSize: 24 }} />
              </Box>
              <Typography variant="body2" sx={{ color: '#475569', fontWeight: 500 }}>
                Try campus zone filters for location-based searches
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default SearchResultsPage;