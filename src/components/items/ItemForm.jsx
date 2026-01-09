import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  Paper,
  Chip,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Alert,
  CircularProgress,
  Divider
} from '@mui/material';
import {
  Upload as UploadIcon,
  Close as CloseIcon,
  LocationOn,
  CalendarToday,
  Category,
  LocalOffer,
  Description,
  Title,
  Phone
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { itemService } from '../../services/itemService';
import { useAuth } from '../../context/AuthContext';

// FIXED StyledPaper - removed problematic global styles
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.spacing(3),
  backgroundColor: '#ffffff',
  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
  
  // Only style direct children, not everything
  '& .MuiInputBase-input': {
    color: '#1e1b4b',
  },
  
  '& .MuiInputLabel-root': {
    color: '#64748b',
    '&.Mui-focused': {
      color: '#8b5cf6',
    }
  },
  
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#ffffff',
    '& fieldset': {
      borderColor: '#cbd5e1',
      borderWidth: '2px',
    },
    '&:hover fieldset': {
      borderColor: '#8b5cf6',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#8b5cf6',
      boxShadow: '0 0 0 3px rgba(139, 92, 246, 0.1)',
    }
  },
  
  '& .MuiSelect-select': {
    backgroundColor: '#ffffff',
  },
  
  '& .MuiFormHelperText-root': {
    color: '#64748b',
  },
  
  '& .MuiTypography-root': {
    color: '#1e1b4b',
  },
  
  '& .MuiAlert-root': {
    backgroundColor: '#f8fafc',
    '& .MuiAlert-icon': {
      color: '#1e1b4b',
    }
  },
  
  '& .MuiDivider-root': {
    borderColor: '#e2e8f0',
  }
}));

const UploadArea = styled(Box)(({ theme }) => ({
  border: '3px dashed #8b5cf6',
  borderRadius: theme.spacing(2),
  padding: theme.spacing(6),
  textAlign: 'center',
  backgroundColor: 'rgba(139, 92, 246, 0.05)',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderColor: '#7c3aed',
  },
}));

const PreviewImage = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: 120,
  height: 120,
  borderRadius: theme.spacing(1.5),
  overflow: 'hidden',
  '& img': {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
}));

const FormContainer = styled(Box)(({ theme }) => ({
  // Additional wrapper styling if needed
}));

const ItemForm = ({ onClose, initialData }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    tags: [],
    location: '',
    date: new Date().toISOString().split('T')[0],
    type: 'LOST',
    images: [],
    contactNumber: '',
    contactEmail: user?.email || '',
    // Additional fields for backend
    campusZone: '',
    building: '',
    color: '',
    brand: '',
    model: '',
    serialNumber: '',
    status: 'ACTIVE'
  });

  const [tagInput, setTagInput] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  // Categories - uppercase for backend
  const categories = [
    { value: 'ELECTRONICS', label: 'Electronics', icon: '📱' },
    { value: 'DOCUMENTS', label: 'Documents', icon: '📄' },
    { value: 'CLOTHING', label: 'Clothing', icon: '👕' },
    { value: 'ACCESSORIES', label: 'Accessories', icon: '👜' },
    { value: 'BOOKS', label: 'Books & Stationery', icon: '📚' },
    { value: 'VALUABLES', label: 'Valuables', icon: '💎' },
    { value: 'KEYS', label: 'Keys', icon: '🔑' },
    { value: 'OTHER', label: 'Other', icon: '📦' },
  ];

  // Common tags
  const commonTags = [
    'laptop', 'phone', 'wallet', 'keys', 'waterbottle',
    'headphones', 'watch', 'glasses', 'umbrella', 'bag',
    'notebook', 'calculator', 'charger', 'id card', 'credit card'
  ];

  // Campus locations
  const locations = [
    'Main Library',
    'Student Center',
    'Science Building',
    'Engineering Building',
    'Arts Building',
    'Cafeteria',
    'Sports Complex',
    'Gymnasium',
    'Dormitory A',
    'Dormitory B',
    'Parking Lot',
    'Auditorium',
    'Computer Lab',
    'Study Room',
    'Administration Building'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + selectedFiles.length > 5) {
      setError('Maximum 5 images allowed');
      return;
    }

    const newFiles = [...selectedFiles, ...files];
    setSelectedFiles(newFiles);

    // Create preview URLs
    const newPreviews = files.map(file => ({
      url: URL.createObjectURL(file),
      name: file.name,
      size: file.size
    }));
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    const newFiles = [...selectedFiles];
    const newPreviews = [...imagePreviews];
    
    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);
    
    setSelectedFiles(newFiles);
    setImagePreviews(newPreviews);
  };

  const handleTagAdd = (tag) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
    setTagInput('');
  };

  const handleTagRemove = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      handleTagAdd(tagInput.trim());
    }
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Item name is required');
      return false;
    }
    if (!formData.description.trim()) {
      setError('Description is required');
      return false;
    }
    if (!formData.category) {
      setError('Please select a category');
      return false;
    }
    if (!formData.location) {
      setError('Please select a location');
      return false;
    }
    if (!formData.date) {
      setError('Please select a date');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) return;

    setLoading(true);

    try {
      console.log('📦 Creating item with data:', formData);
      console.log('👤 Current user:', user);
      
      // Prepare JSON data for Spring Boot backend
      // FIXED: Send ONLY the fields that match your Item entity
      const submissionData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        type: formData.type,
        location: formData.location,
        lostFoundDate: formData.date + 'T00:00:00.000Z',
        campusZone: 'ACADEMIC',
        building: formData.building || formData.location,
        color: formData.color || null,
        brand: formData.brand || null,
        model: formData.model || null,
        serialNumber: formData.serialNumber || null,
        status: 'ACTIVE',
        // FIXED: Send user as an object with ONLY the ID (Spring Boot will fetch the full User entity)
        user: {
          id: user?.id || 8 // Use the actual user ID from your data (8)
        }
      };
      
      console.log('📤 Sending item data to backend:', JSON.stringify(submissionData, null, 2));
      console.log('ℹ️ Note: Backend needs to handle user lookup by ID');

      // Call the API service with JSON data
      const createdItem = await itemService.createItem(submissionData);
      
      console.log('✅ Item created successfully:', createdItem);
      
      setSuccess(`${formData.type === 'LOST' ? 'Lost' : 'Found'} item reported successfully!`);
      
      // Reset form after successful submission
      setTimeout(() => {
        onClose();
      }, 2000);

    } catch (err) {
      console.error('❌ Error creating item:', err);
      
      // Provide more helpful error messages
      if (err.message.includes('user_id')) {
        setError(`
          User ID Error: The backend needs to know which user is creating the item.
          
          Solutions:
          1. Make sure you are logged in (check if token exists)
          2. Backend needs to extract user from JWT token
          3. Or backend needs to accept user in request body
          
          Current user ID from your data: ${user?.id || 'Not found'}
          Trying to send user: { id: ${user?.id || 8} }
        `);
      } else if (err.message.includes('500')) {
        setError('Server error: Check Spring Boot console for detailed error. The backend might need a different user object format.');
      } else {
        setError(err.message || 'Failed to submit item. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormContainer>
      <StyledPaper>
        <Typography variant="h4" gutterBottom sx={{ 
          fontWeight: 800,
          color: '#1e1b4b',
          mb: 3
        }}>
          {formData.type === 'LOST' ? 'Report Lost Item' : 'Report Found Item'}
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Button
            variant={formData.type === 'LOST' ? 'contained' : 'outlined'}
            onClick={() => setFormData(prev => ({ ...prev, type: 'LOST' }))}
            sx={{ 
              mr: 2,
              borderRadius: 2,
              fontWeight: 600,
              backgroundColor: formData.type === 'LOST' ? '#ef4444' : 'transparent',
              color: formData.type === 'LOST' ? 'white' : '#ef4444',
              borderColor: '#ef4444',
              '&:hover': {
                backgroundColor: formData.type === 'LOST' ? '#dc2626' : 'rgba(239, 68, 68, 0.1)',
              }
            }}
          >
            Lost Item
          </Button>
          <Button
            variant={formData.type === 'FOUND' ? 'contained' : 'outlined'}
            onClick={() => setFormData(prev => ({ ...prev, type: 'FOUND' }))}
            sx={{ 
              borderRadius: 2,
              fontWeight: 600,
              backgroundColor: formData.type === 'FOUND' ? '#10b981' : 'transparent',
              color: formData.type === 'FOUND' ? 'white' : '#10b981',
              borderColor: '#10b981',
              '&:hover': {
                backgroundColor: formData.type === 'FOUND' ? '#059669' : 'rgba(16, 185, 129, 0.1)',
              }
            }}
          >
            Found Item
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3, backgroundColor: '#fef2f2', color: '#b91c1c' }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3, backgroundColor: '#f0fdf4', color: '#065f46' }}>
            {success}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Left Column - Basic Information */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom sx={{ 
                fontWeight: 700,
                color: '#1e1b4b',
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <Title fontSize="small" />
                Basic Information
              </Typography>

              <TextField
                fullWidth
                label="Item Name *"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., MacBook Pro 14-inch, Black Wallet"
                variant="outlined"
                sx={{ mb: 3 }}
                required
                InputLabelProps={{
                  sx: {
                    color: '#64748b',
                  }
                }}
              />

              <TextField
                fullWidth
                label="Description *"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Provide detailed description including brand, model, color, unique features, contents..."
                multiline
                rows={4}
                variant="outlined"
                sx={{ mb: 3 }}
                required
                InputLabelProps={{
                  sx: {
                    color: '#64748b',
                  }
                }}
              />

              {/* Category Field */}
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel 
                  sx={{ 
                    color: '#1e1b4b',
                  }}
                >
                  Category *
                </InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  label="Category *"
                  required
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        backgroundColor: '#ffffff',
                        '& .MuiMenuItem-root': {
                          color: '#1e1b4b',
                          '&:hover': {
                            backgroundColor: '#f5f3ff',
                          }
                        }
                      }
                    }
                  }}
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat.value} value={cat.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <span>{cat.icon}</span>
                        {cat.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText sx={{ color: '#64748b' }}>Select the most appropriate category</FormHelperText>
              </FormControl>

              {/* Additional Details */}
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Color"
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    placeholder="e.g., Black, Silver"
                    variant="outlined"
                    InputLabelProps={{
                      sx: {
                        color: '#64748b',
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Brand"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    placeholder="e.g., Apple, Samsung"
                    variant="outlined"
                    InputLabelProps={{
                      sx: {
                        color: '#64748b',
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Model"
                    name="model"
                    value={formData.model}
                    onChange={handleInputChange}
                    placeholder="e.g., iPhone 14"
                    variant="outlined"
                    InputLabelProps={{
                      sx: {
                        color: '#64748b',
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Building"
                    name="building"
                    value={formData.building}
                    onChange={handleInputChange}
                    placeholder="Building name"
                    variant="outlined"
                    InputLabelProps={{
                      sx: {
                        color: '#64748b',
                      }
                    }}
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 3, borderColor: '#e2e8f0' }} />

              <Typography variant="h6" gutterBottom sx={{ 
                fontWeight: 700,
                color: '#1e1b4b',
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <LocalOffer fontSize="small" />
                Tags
              </Typography>

              <TextField
                fullWidth
                label="Add Tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type and press Enter to add tags"
                variant="outlined"
                sx={{ mb: 2 }}
                InputLabelProps={{
                  sx: {
                    color: '#64748b',
                  }
                }}
              />

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom sx={{ color: '#64748b' }}>
                  Common tags:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {commonTags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      size="small"
                      onClick={() => handleTagAdd(tag)}
                      sx={{ 
                        cursor: 'pointer',
                        color: '#1e1b4b',
                        backgroundColor: '#f1f5f9',
                        '&:hover': {
                          backgroundColor: '#e2e8f0',
                        }
                      }}
                    />
                  ))}
                </Box>
              </Box>

              {formData.tags.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom sx={{ color: '#64748b' }}>
                    Selected tags:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {formData.tags.map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        size="small"
                        onDelete={() => handleTagRemove(tag)}
                        color="primary"
                        variant="outlined"
                        sx={{ color: '#1e1b4b' }}
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </Grid>

            {/* Right Column - Location, Date & Images */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom sx={{ 
                fontWeight: 700,
                color: '#1e1b4b',
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <LocationOn fontSize="small" />
                Location & Date
              </Typography>

              {/* Location Field */}
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel sx={{ color: '#64748b' }}>Location *</InputLabel>
                <Select
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  label="Location *"
                  required
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        backgroundColor: '#ffffff',
                        '& .MuiMenuItem-root': {
                          color: '#1e1b4b',
                          '&:hover': {
                            backgroundColor: '#f5f3ff',
                          }
                        }
                      }
                    }
                  }}
                >
                  {locations.map((loc) => (
                    <MenuItem key={loc} value={loc}>
                      {loc}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText sx={{ color: '#64748b' }}>Where was the item lost/found?</FormHelperText>
              </FormControl>

              <TextField
                fullWidth
                label="Date *"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleInputChange}
                variant="outlined"
                sx={{ mb: 3 }}
                InputLabelProps={{
                  shrink: true,
                  sx: { color: '#64748b' }
                }}
                required
              />

              <TextField
                fullWidth
                label="Serial Number (Optional)"
                name="serialNumber"
                value={formData.serialNumber}
                onChange={handleInputChange}
                placeholder="Unique identification number"
                variant="outlined"
                sx={{ mb: 3 }}
                InputLabelProps={{
                  sx: {
                    color: '#64748b',
                  }
                }}
              />

              <Divider sx={{ my: 3, borderColor: '#e2e8f0' }} />

              <Typography variant="h6" gutterBottom sx={{ 
                fontWeight: 700,
                color: '#1e1b4b',
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <UploadIcon fontSize="small" />
                Upload Images
              </Typography>

              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
                style={{ display: 'none' }}
                id="image-upload"
              />

              <label htmlFor="image-upload">
                <UploadArea>
                  <UploadIcon sx={{ fontSize: 48, color: '#8b5cf6', mb: 2 }} />
                  <Typography variant="body1" gutterBottom sx={{ color: '#1e1b4b', fontWeight: 600 }}>
                    Click to upload images
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Maximum 5 images, 5MB each
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                    Supported formats: JPG, PNG, JPEG
                  </Typography>
                </UploadArea>
              </label>

              {imagePreviews.length > 0 && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom sx={{ color: '#64748b' }}>
                    Selected images ({imagePreviews.length}/5):
                  </Typography>
                  <Grid container spacing={2}>
                    {imagePreviews.map((preview, index) => (
                      <Grid item key={index}>
                        <PreviewImage>
                          <img src={preview.url} alt={`Preview ${index}`} />
                          <IconButton
                            size="small"
                            onClick={() => removeImage(index)}
                            sx={{
                              position: 'absolute',
                              top: 4,
                              right: 4,
                              backgroundColor: 'rgba(0, 0, 0, 0.5)',
                              color: 'white',
                              '&:hover': {
                                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                              }
                            }}
                          >
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        </PreviewImage>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}

              <Divider sx={{ my: 3, borderColor: '#e2e8f0' }} />

              <Typography variant="h6" gutterBottom sx={{ 
                fontWeight: 700,
                color: '#1e1b4b',
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <Phone fontSize="small" />
                Contact Information
              </Typography>

              {/* Contact Email Field */}
              <TextField
                fullWidth
                label="Contact Email"
                name="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={handleInputChange}
                placeholder="Your email address"
                variant="outlined"
                sx={{ 
                  mb: 2,
                  '& .Mui-disabled': {
                    color: '#1e1b4b !important',
                    WebkitTextFillColor: '#1e1b4b !important',
                  }
                }}
                InputLabelProps={{
                  sx: {
                    color: '#1e1b4b',
                  }
                }}
                InputProps={{
                  readOnly: true,
                  sx: {
                    color: '#1e1b4b',
                    backgroundColor: '#f8fafc',
                  }
                }}
              />

              <TextField
                fullWidth
                label="Contact Number (Optional)"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleInputChange}
                placeholder="Phone number for contact"
                variant="outlined"
                sx={{ mb: 3 }}
                InputLabelProps={{
                  sx: {
                    color: '#64748b',
                  }
                }}
              />

              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 3, color: '#64748b' }}>
                Your contact information will be visible only to verified users who want to claim the item.
              </Typography>
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={onClose}
              sx={{
                borderRadius: 2,
                fontWeight: 600,
                px: 4,
                py: 1.5,
                color: '#1e1b4b',
                borderColor: '#cbd5e1',
                '&:hover': {
                  borderColor: '#94a3b8',
                  backgroundColor: 'rgba(148, 163, 184, 0.1)',
                }
              }}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                background: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
                color: 'white',
                borderRadius: 2,
                fontWeight: 700,
                px: 4,
                py: 1.5,
                '&:hover': {
                  background: 'linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(139, 92, 246, 0.4)',
                },
                '&.Mui-disabled': {
                  background: 'linear-gradient(135deg, #cbd5e1 0%, #94a3b8 100%)',
                  color: 'white',
                }
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                `Report ${formData.type === 'LOST' ? 'Lost' : 'Found'} Item`
              )}
            </Button>
          </Box>
        </form>
      </StyledPaper>
    </FormContainer>
  );
};

export default ItemForm;