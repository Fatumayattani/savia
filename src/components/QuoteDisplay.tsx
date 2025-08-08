import React from 'react';
import { 
  Paper, 
  Typography, 
  Box, 
  CircularProgress, 
  Button,
  Divider,
  Chip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import TimerIcon from '@mui/icons-material/Timer';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import { formatEther, formatUnits } from 'ethers';
import { formatEther, formatUnits } from 'ethers';

const QuoteCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: '20px',
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  marginTop: theme.spacing(3),
}));

const SwapButton = styled(Button)(({ theme }) => ({
  borderRadius: '16px',
  padding: '16px',
  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  fontSize: '1.1rem',
  fontWeight: 600,
  textTransform: 'none',
  boxShadow: '0 8px 30px rgba(16, 185, 129, 0.3)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 12px 40px rgba(16, 185, 129, 0.4)',
  },
  '&:disabled': {
    background: 'rgba(0, 0, 0, 0.12)',
    transform: 'none',
    boxShadow: 'none',
  },
}));

interface QuoteDisplayProps {
  quote: any;
  loading: boolean;
  error: string | null;
  onExecuteSwap: () => void;
  swapLoading: boolean;
  fromToken: string;
  toToken: string;
}

export const QuoteDisplay: React.FC<QuoteDisplayProps> = ({ 
  quote, 
  loading, 
  error, 
  onExecuteSwap, 
  swapLoading,
  fromToken,
  toToken 
}) => {
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" my={4} sx={{ py: 4 }}>
        <CircularProgress size={40} />
        <Typography sx={{ ml: 2 }}>Finding best rates...</Typography>
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

  if (!quote || !quote.data || quote.data.length === 0) return null;

  const quoteData = quote.data[0];
  const inAmount = formatEther(quoteData.inAmount);
  const outAmount = quoteData.outTokenSymbol === 'USDC' || quoteData.outTokenSymbol === 'USDT' 
    ? formatUnits(quoteData.outAmount, 6) 
    : formatEther(quoteData.outAmount);
  const estimatedGas = formatEther(quoteData.estimatedGas);
  const priceImpact = parseFloat(quoteData.priceImpactPercentage);

  return (
    <QuoteCard elevation={0}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <TrendingUpIcon sx={{ mr: 1, color: 'success.main' }} />
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Best Quote Found
        </Typography>
        <Chip 
          label={`${quoteData.routerStr}`} 
          size="small" 
          sx={{ ml: 'auto', background: 'rgba(102, 126, 234, 0.1)' }}
        />
      </Box>
      
      {/* Quote Details */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            You Pay
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            {parseFloat(inAmount).toFixed(6)} {quoteData.inTokenSymbol}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            You Receive
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 600, color: 'success.main' }}>
            {parseFloat(outAmount).toFixed(6)} {quoteData.outTokenSymbol}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <LocalGasStationIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Est. Gas
            </Typography>
          </Box>
          <Typography variant="body2">
            {parseFloat(estimatedGas).toFixed(6)} ETH
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Price Impact
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: priceImpact > 3 ? 'error.main' : priceImpact > 1 ? 'warning.main' : 'success.main' 
            }}
          >
            {priceImpact.toFixed(2)}%
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Min. Received
          </Typography>
          <Typography variant="body2">
            {(parseFloat(outAmount) * 0.995).toFixed(6)} {quoteData.outTokenSymbol}
          </Typography>
        </Box>
      </Box>

      <SwapButton
        variant="contained"
        fullWidth
        size="large"
        onClick={onExecuteSwap}
        disabled={swapLoading}
        startIcon={swapLoading ? <CircularProgress size={20} color="inherit" /> : <SwapHorizIcon />}
      >
        {swapLoading ? 'Executing Swap...' : `Swap ${fromToken} for ${toToken}`}
      </SwapButton>

      {priceImpact > 3 && (
        <Typography 
          variant="caption" 
          sx={{ 
            display: 'block', 
            textAlign: 'center', 
            mt: 2, 
            color: 'error.main',
            fontWeight: 600 
          }}
        >
          ⚠️ High price impact! Consider reducing swap amount.
        </Typography>
      )}
    </QuoteCard>
  );
};