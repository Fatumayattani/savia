import React, { useState } from 'react';
import { TextField, Button, Box, InputAdornment } from '@mui/material';
import { styled } from '@mui/material/styles';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '16px',
    background: 'rgba(255, 255, 255, 0.8)',
    '&:hover': {
      background: 'rgba(255, 255, 255, 0.9)',
    },
    '&.Mui-focused': {
      background: 'rgba(255, 255, 255, 1)',
    },
  },
}));

const SwapButton = styled(Button)(({ theme }) => ({
  borderRadius: '16px',
  padding: '16px',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  fontSize: '1.1rem',
  fontWeight: 600,
  textTransform: 'none',
  boxShadow: '0 8px 30px rgba(102, 126, 234, 0.3)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 12px 40px rgba(102, 126, 234, 0.4)',
  },
  '&:disabled': {
    background: 'rgba(0, 0, 0, 0.12)',
    transform: 'none',
    boxShadow: 'none',
  },
}));

interface SwapFormProps {
  onSubmit: (amount: string) => void;
  loading: boolean;
}

export const SwapForm: React.FC<SwapFormProps> = ({ onSubmit, loading }) => {
  const [amount, setAmount] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(amount);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <StyledTextField
        label="Amount (ETH)"
        variant="outlined"
        fullWidth
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        InputProps={{ 
          inputProps: { min: 0, step: 'any' },
          endAdornment: <InputAdornment position="end">ETH</InputAdornment>
        }}
        sx={{ mb: 3 }}
      />
      <SwapButton
        type="submit"
        variant="contained"
        startIcon={<SwapHorizIcon />}
        disabled={loading || !amount}
        fullWidth
        size="large"
      >
        {loading ? 'Getting Quote...' : 'Get Quote'}
      </SwapButton>
    </Box>
  );
};