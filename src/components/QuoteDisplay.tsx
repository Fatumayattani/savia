import React from 'react';
import { Paper, Typography, Box, CircularProgress, Chip } from '@mui/material';
import { styled } from '@mui/material/styles';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const QuoteCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: '20px',
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  marginTop: theme.spacing(3),
}));

interface QuoteDisplayProps {
  quote: any;
  loading: boolean;
  error: string | null;
}

export const QuoteDisplay: React.FC<QuoteDisplayProps> = ({ quote, loading, error }) => {
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" my={4} sx={{ py: 4 }}>
        <CircularProgress size={40} />
      </Box>
    );
  }

  if (error) {
    return (
      <QuoteCard elevation={0}>
        <Typography color="error" sx={{ textAlign: 'center' }}>
          {error}
        </Typography>
      </QuoteCard>
    );
  }

  if (!quote) return null;

  return (
    <QuoteCard elevation={0}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <TrendingUpIcon sx={{ mr: 1, color: 'success.main' }} />
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Best Quote Found
        </Typography>
      </Box>
      
      <Box sx={{ mb: 2 }}>
        <Chip 
          label="Optimized Route" 
          color="primary" 
          size="small"
          sx={{ mb: 2 }}
        />
      </Typography>
      
      <Typography variant="body2" sx={{ 
        fontFamily: 'monospace',
        background: 'rgba(0, 0, 0, 0.05)',
        padding: 2,
        borderRadius: 2,
        fontSize: '0.8rem',
        overflowX: 'auto',
      }}>
        {JSON.stringify(quote, null, 2)}
      </Typography>
    </QuoteCard>
  );
};