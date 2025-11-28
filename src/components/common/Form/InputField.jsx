import React from 'react';
import { TextField } from '@mui/material';

const InputField = React.forwardRef(({
  label,
  type = 'text',
  error,
  helperText,
  ...props
}, ref) => {
  return (
    <TextField
      fullWidth
      variant="outlined"
      label={label}
      type={type}
      error={!!error}
      helperText={error || helperText}
      inputRef={ref}
      {...props}
      sx={{ mb: 2 }}
    />
  );
});

export default InputField;