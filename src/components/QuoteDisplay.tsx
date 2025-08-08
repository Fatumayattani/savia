import React from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { styled } from '@mui/material/styles';

const PreformattedText = styled('pre')(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.default,
  borderRadius: theme.shape.borderRadius,
  overflowX: 'auto',
}));

interface QuoteDisplayProps {
  quote: any;
  loading: boolean;
  error: string | null;
}

export const QuoteDisplay: React.FC<QuoteDisplayProps> = ({ quote, loading, error }) => {
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Paper elevation={3} sx={{ p: 2, my: 2, backgroundColor: 'error.light' }}>
        <Typography color="error">{error}</Typography>
      </Paper>
    );
  }

  if (!quote) return null;

  return (
    <Paper elevation={3} sx={{ p: 2, my: 2 }}>
      <Typography variant="h6" gutterBottom>
        Swap Quote
      </Typography>
      <PreformattedText>{JSON.stringify(quote, null, 2)}</PreformattedText>
    </Paper>
  );
};