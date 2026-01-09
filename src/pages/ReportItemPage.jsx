import React, { useState } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Chip,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  Alert,
  CircularProgress,
  Divider,
  Paper,
  Checkbox,
  Stack // Added Stack import
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  AddPhotoAlternate as AddPhotoIcon,
  LocationOn as LocationIcon,
  Category as CategoryIcon,
  Description as DescriptionIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  AutoAwesome
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { itemService } from '../services/itemService';
import { useAuth } from '../context/AuthContext';

const PageContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
}));

const StepContainer = styled(Box)(({ theme }) => ({
  backgroundColor: 'white',
  borderRadius: '20px',
  padding: theme.spacing(4),
  border: '3px solid #8b5cf6',
  boxShadow: '0 20px 50px rgba(139, 92, 246, 0.15)',
  position: 'relative', // Added for better z-index management
  zIndex: 1,
}));

// Enhanced form field styling for better visibility
const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: '#ffffff',
    '&:hover': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: '#8b5cf6',
        borderWidth: 2,
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
  '& .MuiInputLabel-root': {
    color: '#64748b',
    fontWeight: 500,
    '&.Mui-focused': {
      color: '#8b5cf6',
      fontWeight: 600,
    }
  },
  marginBottom: theme.spacing(3),
}));

// Enhanced FormControl with better visibility
const StyledFormControl = styled(FormControl)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  '& .MuiInputLabel-root': {
    color: '#64748b',
    backgroundColor: '#ffffff',
    padding: '0 8px',
    fontWeight: 500,
    '&.Mui-focused': {
      color: '#8b5cf6',
      fontWeight: 600,
    },
    '&.MuiFormLabel-filled': {
      color: '#1e1b4b',
    }
  },
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: '#ffffff',
    '&:hover': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: '#8b5cf6',
        borderWidth: 2,
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
  '& .MuiSelect-select': {
    color: '#1e1b4b',
    fontWeight: 500,
    padding: '16.5px 14px',
  }
}));

// Enhanced MenuProps for better visibility
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

const ReportItemPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    type: 'LOST',
    title: '',
    category: '',
    description: '',
    
    // Step 2: Details
    brand: '',
    color: '',
    model: '',
    serialNumber: '',
    value: '',
    condition: '',
    
    // Step 3: Location & Time
    location: '',
    campusZone: '',
    building: '',
    floor: '',
    specificArea: '',
    dateLostFound: new Date().toISOString().split('T')[0],
    timeLostFound: new Date().toTimeString().split(' ')[0].substring(0, 5),
    
    // Step 4: Contact & Preferences
    contactPhone: user?.phone || '',
    contactEmail: user?.email || '',
    allowChat: true,
    showContactInfo: false,
    urgent: false,
    
    // Additional
    images: []
  });

  const steps = ['Basic Information', 'Item Details', 'Location & Time', 'Review & Submit'];
  
  const categories = [
    'Electronics',
    'Documents',
    'Clothing',
    'Accessories',
    'Books',
    'Wallet/Purse',
    'Keys',
    'Jewelry',
    'Sports Equipment',
    'Other'
  ];
  
  const campusZones = [
    'ACADEMIC',
    'DINING',
    'RESIDENTIAL',
    'RECREATIONAL',
    'ADMINISTRATIVE',
    'PARKING',
    'LIBRARY',
    'OTHER'
  ];
  
  const buildings = [
    'Main Library',
    'Student Center',
    'Science Building',
    'Engineering Building',
    'Arts Building',
    'Cafeteria',
    'Dormitory A',
    'Dormitory B',
    'Sports Complex',
    'Administration Building'
  ];

  const conditions = ['NEW', 'LIKE_NEW', 'GOOD', 'FAIR', 'POOR'];

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await itemService.reportItem(formData);
      setSuccess(true);
      setTimeout(() => {
        navigate('/my-items');
      }, 3000);
    } catch (error) {
      alert('Failed to submit item. Please try again.');
      console.error('Error submitting item:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e1b4b', mb: 3, fontSize: '1.1rem' }}>
              1. What type of item is this?
            </Typography>
            
            <FormControl component="fieldset" sx={{ mb: 4, width: '100%' }}>
              <RadioGroup
                row
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                sx={{ justifyContent: 'center', gap: 3 }}
              >
                <FormControlLabel
                  value="LOST"
                  control={
                    <Radio 
                      sx={{ 
                        position: 'absolute',
                        opacity: 0,
                        '& + span': {
                          display: 'inline-block'
                        }
                      }}
                    />
                  }
                  label={
                    <Box sx={{ 
                      p: 3, 
                      border: formData.type === 'LOST' ? '3px solid #f97316' : '2px solid #e2e8f0',
                      borderRadius: '12px',
                      minWidth: 150,
                      textAlign: 'center',
                      backgroundColor: formData.type === 'LOST' ? '#fff7ed' : 'white',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      '&:hover': {
                        borderColor: formData.type === 'LOST' ? '#f97316' : '#cbd5e1',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)'
                      }
                    }}>
                      <Typography variant="h6" sx={{ fontWeight: 800, color: formData.type === 'LOST' ? '#f97316' : '#64748b', mb: 0.5 }}>
                        🎯 Lost Item
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block' }}>
                        I lost something
                      </Typography>
                    </Box>
                  }
                />
                <FormControlLabel
                  value="FOUND"
                  control={
                    <Radio 
                      sx={{ 
                        position: 'absolute',
                        opacity: 0,
                        '& + span': {
                          display: 'inline-block'
                        }
                      }}
                    />
                  }
                  label={
                    <Box sx={{ 
                      p: 3, 
                      border: formData.type === 'FOUND' ? '3px solid #10b981' : '2px solid #e2e8f0',
                      borderRadius: '12px',
                      minWidth: 150,
                      textAlign: 'center',
                      backgroundColor: formData.type === 'FOUND' ? '#f0fdf4' : 'white',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      '&:hover': {
                        borderColor: formData.type === 'FOUND' ? '#10b981' : '#cbd5e1',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)'
                      }
                    }}>
                      <Typography variant="h6" sx={{ fontWeight: 800, color: formData.type === 'FOUND' ? '#10b981' : '#64748b', mb: 0.5 }}>
                        ✅ Found Item
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block' }}>
                        I found something
                      </Typography>
                    </Box>
                  }
                />
              </RadioGroup>
            </FormControl>

            <StyledTextField
              fullWidth
              label="Item Title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="e.g., Black MacBook Pro, Blue Backpack, Student ID Card"
              required
              InputProps={{
                startAdornment: <DescriptionIcon sx={{ color: '#8b5cf6', mr: 1, opacity: 0.7 }} />
              }}
            />

            <StyledFormControl fullWidth variant="outlined">
              <InputLabel id="category-label" sx={{ 
                color: formData.category ? '#1e1b4b' : '#64748b', 
                fontWeight: formData.category ? 600 : 500,
                fontSize: '0.95rem'
              }}>
                Category *
              </InputLabel>
              <Select
                labelId="category-label"
                value={formData.category}
                label="Category *"
                onChange={(e) => handleInputChange('category', e.target.value)}
                MenuProps={MenuProps}
                required
                sx={{
                  '& .MuiSelect-select': {
                    display: 'flex',
                    alignItems: 'center',
                  }
                }}
              >
                <MenuItem value="" sx={{ color: '#94a3b8', fontStyle: 'italic' }}>
                  Select a category
                </MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                ))}
              </Select>
            </StyledFormControl>

            <StyledTextField
              fullWidth
              multiline
              rows={4}
              label="Description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe the item in detail. Include any unique features, marks, or contents..."
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  alignItems: 'flex-start',
                }
              }}
            />
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e1b4b', mb: 3, fontSize: '1.1rem' }}>
              2. Provide additional details
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  fullWidth
                  label="Brand (if applicable)"
                  value={formData.brand}
                  onChange={(e) => handleInputChange('brand', e.target.value)}
                  placeholder="e.g., Apple, Nike, Samsung"
                />
                <StyledTextField
                  fullWidth
                  label="Color"
                  value={formData.color}
                  onChange={(e) => handleInputChange('color', e.target.value)}
                  placeholder="e.g., Black, Blue, Red"
                />
                <StyledTextField
                  fullWidth
                  label="Model/Type"
                  value={formData.model}
                  onChange={(e) => handleInputChange('model', e.target.value)}
                  placeholder="e.g., iPhone 14, AirPods Pro"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  fullWidth
                  label="Serial Number (if known)"
                  value={formData.serialNumber}
                  onChange={(e) => handleInputChange('serialNumber', e.target.value)}
                  placeholder="e.g., C02ABCD12345"
                />
                <StyledTextField
                  fullWidth
                  label="Approximate Value"
                  value={formData.value}
                  onChange={(e) => handleInputChange('value', e.target.value)}
                  placeholder="e.g., $1000, €500"
                />
                <StyledFormControl fullWidth variant="outlined">
                  <InputLabel id="condition-label" sx={{ 
                    color: formData.condition ? '#1e1b4b' : '#64748b',
                    fontWeight: formData.condition ? 600 : 500
                  }}>
                    Condition
                  </InputLabel>
                  <Select
                    labelId="condition-label"
                    value={formData.condition}
                    label="Condition"
                    onChange={(e) => handleInputChange('condition', e.target.value)}
                    MenuProps={MenuProps}
                  >
                    <MenuItem value="" sx={{ color: '#94a3b8', fontStyle: 'italic' }}>
                      Select condition
                    </MenuItem>
                    {conditions.map((cond) => (
                      <MenuItem key={cond} value={cond}>{cond}</MenuItem>
                    ))}
                  </Select>
                </StyledFormControl>
              </Grid>
            </Grid>

            {/* Image Upload */}
            <Box sx={{ 
              mt: 4, 
              p: 3, 
              backgroundColor: '#f8fafc', 
              borderRadius: '12px', 
              border: '2px dashed #cbd5e1',
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: '#8b5cf6',
                backgroundColor: '#faf5ff'
              }
            }}>
              <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 2, fontWeight: 600 }}>
                Add Photos (Optional)
              </Typography>
              <Button
                variant="outlined"
                startIcon={<AddPhotoIcon />}
                fullWidth
                sx={{
                  py: 2,
                  borderColor: '#8b5cf6',
                  color: '#8b5cf6',
                  borderRadius: '12px',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  '&:hover': {
                    borderColor: '#7c3aed',
                    backgroundColor: 'rgba(139, 92, 246, 0.04)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                Upload Photos
              </Button>
              <Typography variant="caption" sx={{ color: '#94a3b8', mt: 1, display: 'block', textAlign: 'center' }}>
                Max 5 photos • 5MB each • PNG, JPG, JPEG
              </Typography>
            </Box>
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e1b4b', mb: 3, fontSize: '1.1rem' }}>
              3. Where and when was it {formData.type === 'LOST' ? 'lost' : 'found'}?
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <StyledFormControl fullWidth variant="outlined">
                  <InputLabel id="campuszone-label" sx={{ 
                    color: formData.campusZone ? '#1e1b4b' : '#64748b',
                    fontWeight: formData.campusZone ? 600 : 500
                  }}>
                    Campus Zone *
                  </InputLabel>
                  <Select
                    labelId="campuszone-label"
                    value={formData.campusZone}
                    label="Campus Zone *"
                    onChange={(e) => handleInputChange('campusZone', e.target.value)}
                    MenuProps={MenuProps}
                    required
                  >
                    <MenuItem value="" sx={{ color: '#94a3b8', fontStyle: 'italic' }}>
                      Select zone
                    </MenuItem>
                    {campusZones.map((zone) => (
                      <MenuItem key={zone} value={zone}>{zone}</MenuItem>
                    ))}
                  </Select>
                </StyledFormControl>
                
                <StyledFormControl fullWidth variant="outlined">
                  <InputLabel id="building-label" sx={{ 
                    color: formData.building ? '#1e1b4b' : '#64748b',
                    fontWeight: formData.building ? 600 : 500
                  }}>
                    Building/Area
                  </InputLabel>
                  <Select
                    labelId="building-label"
                    value={formData.building}
                    label="Building/Area"
                    onChange={(e) => handleInputChange('building', e.target.value)}
                    MenuProps={MenuProps}
                  >
                    <MenuItem value="" sx={{ color: '#94a3b8', fontStyle: 'italic' }}>
                      Select building
                    </MenuItem>
                    {buildings.map((building) => (
                      <MenuItem key={building} value={building}>{building}</MenuItem>
                    ))}
                  </Select>
                </StyledFormControl>
                
                <StyledTextField
                  fullWidth
                  label="Specific Location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="e.g., Library reading room, Cafeteria table near entrance"
                  required
                  InputProps={{
                    startAdornment: <LocationIcon sx={{ color: '#8b5cf6', mr: 1, opacity: 0.7 }} />
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  fullWidth
                  label="Floor/Room (Optional)"
                  value={formData.floor}
                  onChange={(e) => handleInputChange('floor', e.target.value)}
                  placeholder="e.g., 3rd floor, Room 301"
                />
                
                <StyledTextField
                  fullWidth
                  label={`Date ${formData.type === 'LOST' ? 'Lost' : 'Found'} *`}
                  type="date"
                  value={formData.dateLostFound}
                  onChange={(e) => handleInputChange('dateLostFound', e.target.value)}
                  required
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    '& input': {
                      color: '#1e1b4b',
                      fontWeight: 500,
                    }
                  }}
                />
                
                <StyledTextField
                  fullWidth
                  label={`Time ${formData.type === 'LOST' ? 'Lost' : 'Found'} (Approx.)`}
                  type="time"
                  value={formData.timeLostFound}
                  onChange={(e) => handleInputChange('timeLostFound', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    '& input': {
                      color: '#1e1b4b',
                      fontWeight: 500,
                    }
                  }}
                />
              </Grid>
            </Grid>

            <Alert severity="info" sx={{ 
              borderRadius: '12px', 
              mt: 4,
              backgroundColor: '#f0f9ff',
              border: '1px solid #bae6fd',
              '& .MuiAlert-icon': {
                color: '#0ea5e9'
              }
            }}>
              <Typography variant="body2" sx={{ color: '#0369a1' }}>
                💡 <strong>Location Tips:</strong> Be as specific as possible. Include landmarks, room numbers, 
                or any identifying features of the location.
              </Typography>
            </Alert>
          </Box>
        );

      case 3:
        return (
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e1b4b', mb: 3, fontSize: '1.1rem' }}>
              4. Review and submit
            </Typography>
            
            {success ? (
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <CheckCircleIcon sx={{ fontSize: 80, color: '#10b981', mb: 3 }} />
                <Typography variant="h4" sx={{ fontWeight: 900, color: '#1e1b4b', mb: 2 }}>
                  Item Reported Successfully!
                </Typography>
                <Typography variant="body1" sx={{ color: '#64748b', mb: 4, maxWidth: 500, mx: 'auto' }}>
                  Your {formData.type.toLowerCase()} item has been reported. 
                  Our smart matching system will now look for potential matches.
                </Typography>
                <CircularProgress size={40} sx={{ color: '#8b5cf6' }} />
                <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', mt: 2 }}>
                  Redirecting to your items...
                </Typography>
              </Box>
            ) : (
              <>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Paper sx={{ 
                      p: 3, 
                      backgroundColor: '#f8fafc', 
                      borderRadius: '12px',
                      border: '2px solid #e2e8f0'
                    }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1e1b4b', mb: 2 }}>
                        📋 Item Summary
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={6} sm={3}>
                          <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 0.5 }}>
                            Type
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 700, color: '#1e1b4b' }}>
                            {formData.type}
                          </Typography>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 0.5 }}>
                            Category
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 700, color: '#1e1b4b' }}>
                            {formData.category || 'Not specified'}
                          </Typography>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 0.5 }}>
                            Location
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 700, color: '#1e1b4b' }}>
                            {formData.location || 'Not specified'}
                          </Typography>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 0.5 }}>
                            Date
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 700, color: '#1e1b4b' }}>
                            {formData.dateLostFound}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ 
                      p: 3, 
                      backgroundColor: '#f8fafc', 
                      borderRadius: '12px', 
                      border: '2px solid #e2e8f0',
                      height: '100%'
                    }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1e1b4b', mb: 2 }}>
                        🔍 Smart Matching Features
                      </Typography>
                      <Stack spacing={1.5}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <AutoAwesome sx={{ color: '#8b5cf6', fontSize: 20 }} />
                          <Typography variant="body2" sx={{ color: '#475569' }}>
                            AI-powered matching with similar items
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <AutoAwesome sx={{ color: '#8b5cf6', fontSize: 20 }} />
                          <Typography variant="body2" sx={{ color: '#475569' }}>
                            Campus-wide notifications
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <AutoAwesome sx={{ color: '#8b5cf6', fontSize: 20 }} />
                          <Typography variant="body2" sx={{ color: '#475569' }}>
                            Secure in-app messaging
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <AutoAwesome sx={{ color: '#8b5cf6', fontSize: 20 }} />
                          <Typography variant="body2" sx={{ color: '#475569' }}>
                            Automatic status updates
                          </Typography>
                        </Box>
                      </Stack>
                    </Paper>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ 
                      p: 3, 
                      backgroundColor: '#f0fdf4', 
                      borderRadius: '12px', 
                      border: '2px solid #bbf7d0', 
                      height: '100%'
                    }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#065f46', mb: 2 }}>
                        🎯 Final Settings
                      </Typography>
                      <Stack spacing={2}>
                        <FormControlLabel
                          control={
                            <Checkbox 
                              checked={formData.allowChat}
                              onChange={(e) => handleInputChange('allowChat', e.target.checked)}
                              sx={{
                                color: '#cbd5e1',
                                '&.Mui-checked': {
                                  color: '#10b981',
                                }
                              }}
                            />
                          }
                          label={
                            <Typography variant="body2" sx={{ color: '#475569', fontWeight: 500 }}>
                              Enable secure messaging
                            </Typography>
                          }
                        />
                        <FormControlLabel
                          control={
                            <Checkbox 
                              checked={formData.showContactInfo}
                              onChange={(e) => handleInputChange('showContactInfo', e.target.checked)}
                              sx={{
                                color: '#cbd5e1',
                                '&.Mui-checked': {
                                  color: '#10b981',
                                }
                              }}
                            />
                          }
                          label={
                            <Typography variant="body2" sx={{ color: '#475569', fontWeight: 500 }}>
                              Show my contact info
                            </Typography>
                          }
                        />
                        <FormControlLabel
                          control={
                            <Checkbox 
                              checked={formData.urgent}
                              onChange={(e) => handleInputChange('urgent', e.target.checked)}
                              sx={{
                                color: '#cbd5e1',
                                '&.Mui-checked': {
                                  color: '#ef4444',
                                }
                              }}
                            />
                          }
                          label={
                            <Typography variant="body2" sx={{ 
                              color: '#475569', 
                              fontWeight: formData.urgent ? 700 : 500,
                              color: formData.urgent ? '#dc2626' : '#475569'
                            }}>
                              Mark as URGENT
                            </Typography>
                          }
                        />
                        {formData.urgent && (
                          <Alert severity="warning" sx={{ 
                            borderRadius: '8px', 
                            mt: 1,
                            backgroundColor: '#fef3c7',
                            border: '1px solid #f59e0b'
                          }}>
                            ⚠️ URGENT items receive higher priority and faster notifications
                          </Alert>
                        )}
                      </Stack>
                    </Paper>
                  </Grid>
                </Grid>

                <Alert severity="success" sx={{ 
                  borderRadius: '12px', 
                  mt: 3,
                  backgroundColor: '#f0fdf4',
                  border: '1px solid #bbf7d0'
                }}>
                  <Typography variant="body2" sx={{ color: '#065f46' }}>
                    ✅ Your item will be visible to the campus community immediately. 
                    You can edit or delete it anytime from "My Items".
                  </Typography>
                </Alert>
              </>
            )}
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <PageContainer maxWidth="lg">
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{
            color: '#64748b',
            mb: 3,
            borderRadius: '10px',
            fontWeight: 500,
            px: 2,
            py: 1,
            '&:hover': { 
              backgroundColor: '#f1f5f9',
              transform: 'translateY(-1px)'
            },
            transition: 'all 0.3s ease'
          }}
        >
          Back
        </Button>

        <Typography variant="h3" sx={{ fontWeight: 900, color: '#1e1b4b', mb: 1, fontSize: { xs: '2rem', md: '2.5rem' } }}>
          📝 Report {formData.type === 'LOST' ? 'Lost' : 'Found'} Item
        </Typography>
        <Typography variant="h6" sx={{ color: '#64748b', fontWeight: 500, mb: 4, fontSize: { xs: '1rem', md: '1.1rem' } }}>
          Help reunite items with their owners across campus
        </Typography>
      </Box>

      <StepContainer>
        {/* Stepper */}
        <Stepper activeStep={activeStep} sx={{ mb: 6 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel sx={{ 
                '& .MuiStepLabel-label': {
                  fontWeight: 600,
                  color: '#1e1b4b',
                  fontSize: '0.9rem'
                }
              }}>
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Step Content */}
        {renderStepContent(activeStep)}

        {/* Navigation Buttons */}
        {!success && (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            mt: 6, 
            pt: 4, 
            borderTop: '2px solid #e2e8f0',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 2, sm: 0 }
          }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{
                color: '#64748b',
                fontWeight: 700,
                borderRadius: '12px',
                px: 4,
                py: 1.5,
                minWidth: '120px',
                '&:hover': {
                  backgroundColor: '#f1f5f9',
                  transform: 'translateY(-2px)'
                },
                '&:disabled': {
                  color: '#cbd5e1'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Back
            </Button>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CheckCircleIcon />}
                  sx={{
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                    color: 'white',
                    fontWeight: 800,
                    borderRadius: '12px',
                    px: 5,
                    py: 1.5,
                    fontSize: '0.95rem',
                    minWidth: '180px',
                    boxShadow: '0 10px 30px rgba(139, 92, 246, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
                      transform: 'translateY(-3px)',
                      boxShadow: '0 15px 40px rgba(139, 92, 246, 0.4)'
                    },
                    '&:disabled': {
                      background: 'linear-gradient(135deg, #cbd5e1 0%, #94a3b8 100%)',
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  {loading ? 'Submitting...' : 'Submit Report'}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  sx={{
                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                    color: 'white',
                    fontWeight: 800,
                    borderRadius: '12px',
                    px: 5,
                    py: 1.5,
                    fontSize: '0.95rem',
                    minWidth: '150px',
                    boxShadow: '0 10px 30px rgba(59, 130, 246, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                      transform: 'translateY(-3px)',
                      boxShadow: '0 15px 40px rgba(59, 130, 246, 0.4)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Next Step
                </Button>
              )}
            </Box>
          </Box>
        )}
      </StepContainer>

      {/* Progress Info */}
      {!success && (
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.8rem' }}>
            Step {activeStep + 1} of {steps.length} • {Math.round(((activeStep + 1) / steps.length) * 100)}% complete
          </Typography>
        </Box>
      )}
    </PageContainer>
  );
};

export default ReportItemPage;