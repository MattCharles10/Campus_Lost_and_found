import React from 'react';
import { Button, Box } from '@mui/material';

const SubmitButton = ({ loading, children, ...props }) => {
  return (
    <Button
      type="submit"
      fullWidth
      variant="contained"
      size="large"
      disabled={loading}
      {...props}
      sx={{
        mt: 2,
        mb: 2,
        background: 'linear-gradient(135deg, #29164dff 0%, #764ba2 100%)',
        border: 'none',
        borderRadius: 2,
        padding: '12px 24px',
        fontSize: '1rem',
        fontWeight: 'bold',
        textTransform: 'none',
        boxShadow: '0 4px 15px 0 rgba(116, 75, 162, 0.3)',
        transition: 'all 0.3s ease',
        '&:hover': {
          background: 'linear-gradient(135deg, #764ba2 0%, #29164dff 100%)',
          boxShadow: '0 6px 20px 0 rgba(116, 75, 162, 0.4)',
          transform: 'translateY(-2px)',
        },
        '&:disabled': {
          background: 'rgba(255, 255, 255, 0.2)',
          color: 'rgba(255, 255, 255, 0.5)',
        },
        ...props.sx,
      }}
    >
      {loading ? (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box
            sx={{
              width: 20,
              height: 20,
              border: '2px solid transparent',
              borderTop: '2px solid white',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              mr: 1,
            }}
          />
          Loading...
        </Box>
      ) : (
        children
      )}
    </Button>
  );
};

export default SubmitButton;