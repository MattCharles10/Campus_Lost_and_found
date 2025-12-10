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

// UPDATED StyledPaper with forced text colors
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.spacing(3),
  backgroundColor: '#ffffff',
  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
  
  // Force text colors to be visible
  '& *': {
    color: '#1e1b4b !important',
  },
  
  '& .MuiInputBase-input': {
    color: '#1e1b4b !important',
  },
  
  '& .MuiInputLabel-root': {
    color: '#64748b !important',
    '&.Mui-focused': {
      color: '#8b5cf6 !important',
    }
  },
  
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#ffffff !important',
    '& fieldset': {
      borderColor: '#cbd5e1 !important',
      borderWidth: '2px',
    },
    '&:hover fieldset': {
      borderColor: '#8b5cf6 !important',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#8b5cf6 !important',
      boxShadow: '0 0 0 3px rgba(139, 92, 246, 0.1)',
    }
  },
  
  '& .MuiSelect-select': {
    backgroundColor: '#ffffff !important',
  },
  
  '& .MuiMenuItem-root': {
    color: '#1e1b4b !important',
    backgroundColor: '#ffffff !important',
    '&:hover': {
      backgroundColor: '#f5f3ff !important',
    }
  },
  
  '& .MuiChip-root': {
    color: '#1e1b4b !important',
  },
  
  '& .MuiFormHelperText-root': {
    color: '#64748b !important',
  },
  
  '& .MuiTypography-root': {
    color: '#1e1b4b !important',
  },
  
  '& .MuiAlert-root': {
    backgroundColor: '#f8fafc !important',
    '& .MuiAlert-icon': {
      color: '#1e1b4b !important',
    }
  },
  
  '& .MuiDivider-root': {
    borderColor: '#e2e8f0 !important',
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
  
  // Force text colors inside upload area
  '& .MuiTypography-root': {
    color: '#1e1b4b !important',
  },
  '& .MuiSvgIcon-root': {
    color: '#8b5cf6 !important',
  }
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
    type: 'lost',
    images: [],
    contactNumber: '',
    contactEmail: user?.email || '',
  });

  const [tagInput, setTagInput] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  // Categories
  const categories = [
    { value: 'electronics', label: 'Electronics', icon: '📱' },
    { value: 'documents', label: 'Documents', icon: '📄' },
    { value: 'clothing', label: 'Clothing', icon: '👕' },
    { value: 'accessories', label: 'Accessories', icon: '👜' },
    { value: 'books', label: 'Books & Stationery', icon: '📚' },
    { value: 'valuables', label: 'Valuables', icon: '💎' },
    { value: 'keys', label: 'Keys', icon: '🔑' },
    { value: 'other', label: 'Other', icon: '📦' },
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
      // Prepare form data for submission
      const submissionData = new FormData();
      submissionData.append('title', formData.title);
      submissionData.append('description', formData.description);
      submissionData.append('category', formData.category);
      submissionData.append('tags', JSON.stringify(formData.tags));
      submissionData.append('location', formData.location);
      submissionData.append('date', formData.date);
      submissionData.append('type', formData.type);
      submissionData.append('contactNumber', formData.contactNumber);
      submissionData.append('contactEmail', formData.contactEmail);

      // Append images
      selectedFiles.forEach((file, index) => {
        submissionData.append(`images`, file);
      });

      // Call the API service
      const response = await itemService.createItem(submissionData);
      
      setSuccess('Item reported successfully! It will appear in listings shortly.');
      
      // Reset form after successful submission
      setTimeout(() => {
        onClose();
      }, 2000);

    } catch (err) {
      setError(err.message || 'Failed to submit item. Please try again.');
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
          {formData.type === 'lost' ? 'Report Lost Item' : 'Report Found Item'}
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Button
            variant={formData.type === 'lost' ? 'contained' : 'outlined'}
            onClick={() => setFormData(prev => ({ ...prev, type: 'lost' }))}
            sx={{ 
              mr: 2,
              borderRadius: 2,
              fontWeight: 600,
              backgroundColor: formData.type === 'lost' ? '#ef4444' : 'transparent',
              color: formData.type === 'lost' ? 'white' : '#ef4444',
              borderColor: '#ef4444',
              '&:hover': {
                backgroundColor: formData.type === 'lost' ? '#dc2626' : 'rgba(239, 68, 68, 0.1)',
              }
            }}
          >
            Lost Item
          </Button>
          <Button
            variant={formData.type === 'found' ? 'contained' : 'outlined'}
            onClick={() => setFormData(prev => ({ ...prev, type: 'found' }))}
            sx={{ 
              borderRadius: 2,
              fontWeight: 600,
              backgroundColor: formData.type === 'found' ? '#10b981' : 'transparent',
              color: formData.type === 'found' ? 'white' : '#10b981',
              borderColor: '#10b981',
              '&:hover': {
                backgroundColor: formData.type === 'found' ? '#059669' : 'rgba(16, 185, 129, 0.1)',
              }
            }}
          >
            Found Item
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3, backgroundColor: '#fef2f2', color: '#b91c1c !important' }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3, backgroundColor: '#f0fdf4', color: '#065f46 !important' }}>
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
                InputProps={{
                  sx: {
                    color: '#1e1b4b !important',
                  }
                }}
                InputLabelProps={{
                  sx: {
                    color: '#64748b !important',
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
                InputProps={{
                  sx: {
                    color: '#1e1b4b !important',
                  }
                }}
                InputLabelProps={{
                  sx: {
                    color: '#64748b !important',
                  }
                }}
              />

              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel sx={{ color: '#64748b !important' }}>Category *</InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  label="Category *"
                  required
                  sx={{
                    color: '#1e1b4b !important',
                    backgroundColor: '#ffffff !important',
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
                <FormHelperText sx={{ color: '#64748b !important' }}>Select the most appropriate category</FormHelperText>
              </FormControl>

              <Divider sx={{ my: 3, borderColor: '#e2e8f0 !important' }} />

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
                InputProps={{
                  sx: {
                    color: '#1e1b4b !important',
                  }
                }}
                InputLabelProps={{
                  sx: {
                    color: '#64748b !important',
                  }
                }}
              />

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom sx={{ color: '#64748b !important' }}>
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
                        color: '#1e1b4b !important',
                        backgroundColor: '#f1f5f9 !important',
                        '&:hover': {
                          backgroundColor: '#e2e8f0 !important',
                        }
                      }}
                    />
                  ))}
                </Box>
              </Box>

              {formData.tags.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom sx={{ color: '#64748b !important' }}>
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
                        sx={{ color: '#1e1b4b !important' }}
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

              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel sx={{ color: '#64748b !important' }}>Location *</InputLabel>
                <Select
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  label="Location *"
                  required
                  sx={{
                    color: '#1e1b4b !important',
                    backgroundColor: '#ffffff !important',
                  }}
                >
                  {locations.map((loc) => (
                    <MenuItem key={loc} value={loc} sx={{ color: '#1e1b4b !important' }}>
                      {loc}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText sx={{ color: '#64748b !important' }}>Where was the item lost/found?</FormHelperText>
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
                  sx: { color: '#64748b !important' }
                }}
                InputProps={{
                  sx: { color: '#1e1b4b !important' }
                }}
                required
              />

              <Divider sx={{ my: 3, borderColor: '#e2e8f0 !important' }} />

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
                  <Typography variant="body2" color="text.secondary" gutterBottom sx={{ color: '#64748b !important' }}>
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

              <Divider sx={{ my: 3, borderColor: '#e2e8f0 !important' }} />

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

              <TextField
                fullWidth
                label="Contact Email"
                name="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={handleInputChange}
                placeholder="Your email address"
                variant="outlined"
                sx={{ mb: 2 }}
                disabled
                InputProps={{
                  sx: {
                    color: '#64748b !important',
                  }
                }}
                InputLabelProps={{
                  sx: {
                    color: '#64748b !important',
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
                InputProps={{
                  sx: {
                    color: '#1e1b4b !important',
                  }
                }}
                InputLabelProps={{
                  sx: {
                    color: '#64748b !important',
                  }
                }}
              />

              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 3, color: '#64748b !important' }}>
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
                `Report ${formData.type === 'lost' ? 'Lost' : 'Found'} Item`
              )}
            </Button>
          </Box>
        </form>
      </StyledPaper>
    </FormContainer>
  );
};

export default ItemForm;