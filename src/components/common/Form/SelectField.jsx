// D:\Campus_Lost_and_found-main\Campus_Lost_and_found-main\src\components\common\Form\SelectField.jsx
import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Box,
  Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';

// Styled components
const StyledFormControl = styled(FormControl)(({ theme, fullWidth }) => ({
  width: fullWidth ? '100%' : 'auto',
  marginBottom: theme.spacing(2),
  '& .MuiOutlinedInput-root': {
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    transition: 'all 0.3s ease',
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: 'rgba(139, 92, 246, 0.5)',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#8b5cf6',
      borderWidth: 2,
      boxShadow: '0 0 0 3px rgba(139, 92, 246, 0.1)',
    },
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '0.95rem',
    '&.Mui-focused': {
      color: '#a78bfa',
      fontWeight: 600,
    },
  },
  '& .MuiSelect-icon': {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 2,
  },
}));

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  color: '#ffffff',
  backgroundColor: '#1e1b4b',
  padding: '10px 16px',
  margin: '2px 8px',
  borderRadius: 8,
  '&:hover': {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
  },
  '&.Mui-selected': {
    backgroundColor: 'rgba(139, 92, 246, 0.3)',
    fontWeight: 600,
    '&:hover': {
      backgroundColor: 'rgba(139, 92, 246, 0.4)',
    },
  },
}));

const SelectField = ({
  // Basic props
  label,
  value,
  onChange,
  options = [],
  
  // Validation & state
  error = false,
  helperText,
  disabled = false,
  required = false,
  
  // Styling
  fullWidth = true,
  size = 'medium',
  variant = 'outlined',
  placeholder,
  startAdornment,
  endAdornment,
  sx = {},
  
  // Additional props
  ...props
}) => {
  // Handle empty value for placeholder
  const displayValue = value === '' || value === undefined || value === null ? '' : value;

  return (
    <StyledFormControl
      fullWidth={fullWidth}
      error={!!error}
      disabled={disabled}
      required={required}
      size={size}
      variant={variant}
      sx={sx}
    >
      {label && (
        <InputLabel 
          id={`${String(label).toLowerCase().replace(/\s+/g, '-')}-label`}
          shrink={!!value || value === 0}
        >
          {label}{required && ' *'}
        </InputLabel>
      )}
      
      <Select
        labelId={label ? `${String(label).toLowerCase().replace(/\s+/g, '-')}-label` : undefined}
        value={displayValue}
        onChange={onChange}
        label={label}
        displayEmpty={!!placeholder}
        startAdornment={startAdornment}
        endAdornment={endAdornment}
        renderValue={(selected) => {
          if (selected === '' && placeholder) {
            return (
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.5)', fontStyle: 'italic' }}>
                {placeholder}
              </Typography>
            );
          }
          
          const selectedOption = options.find(opt => opt.value === selected);
          return selectedOption ? selectedOption.label : selected;
        }}
        MenuProps={{
          PaperProps: {
            sx: {
              backgroundColor: '#1e1b4b',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              borderRadius: '12px',
              marginTop: '8px',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
              '& .MuiMenu-list': {
                padding: '8px',
              }
            }
          }
        }}
        {...props}
      >
        {placeholder && (
          <StyledMenuItem value="" disabled>
            <Typography sx={{ color: 'rgba(255, 255, 255, 0.5)', fontStyle: 'italic' }}>
              {placeholder}
            </Typography>
          </StyledMenuItem>
        )}
        
        {options.length === 0 ? (
          <StyledMenuItem disabled>
            <Typography sx={{ color: 'rgba(255, 255, 255, 0.5)', fontStyle: 'italic' }}>
              No options available
            </Typography>
          </StyledMenuItem>
        ) : (
          options.map((option) => (
            <StyledMenuItem 
              key={option.value} 
              value={option.value}
              sx={{
                ...(option.sx || {})
              }}
            >
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1.5,
                width: '100%'
              }}>
                {option.icon && (
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    color: option.color || 'inherit'
                  }}>
                    {option.icon}
                  </Box>
                )}
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body1">
                    {option.label}
                  </Typography>
                  {option.description && (
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: 'rgba(255, 255, 255, 0.6)',
                        display: 'block',
                        mt: 0.5
                      }}
                    >
                      {option.description}
                    </Typography>
                  )}
                </Box>
              </Box>
            </StyledMenuItem>
          ))
        )}
      </Select>
      
      {(error || helperText) && (
        <FormHelperText 
          error={!!error}
          sx={{ 
            marginLeft: 0,
            fontSize: '0.8rem',
            color: error ? '#ef4444' : 'rgba(255, 255, 255, 0.6)'
          }}
        >
          {error || helperText}
        </FormHelperText>
      )}
    </StyledFormControl>
  );
};

// PropTypes (optional, for better development experience)
SelectField.defaultProps = {
  options: [],
  disabled: false,
  required: false,
  fullWidth: true,
  size: 'medium',
  variant: 'outlined'
};

export default SelectField;