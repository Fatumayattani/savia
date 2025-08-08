import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

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
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <TextField
        label="Amount (ETH)"
        variant="outlined"
        fullWidth
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        InputProps={{ inputProps: { min: 0, step: 'any' } }}
        sx={{ mb: 2 }}
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={loading || !amount}
        fullWidth
      >
        {loading ? 'Getting Quote...' : 'Get Quote'}
      </Button>
    </Box>
  );
};