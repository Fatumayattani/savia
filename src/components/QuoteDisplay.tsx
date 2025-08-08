import React from 'react';
import { 
  Paper, 
  Typography, 
  Box, 
  CircularProgress, 
  Button,
  Divider,
  Chip,
  Fade,
  Zoom,
  Grow
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import TimerIcon from '@mui/icons-material/Timer';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import { formatEther, formatUnits } from 'ethers';

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const glow = keyframes`
  0%, 100% { box-shadow: 0 8px 30px rgba(16, 185, 129, 0.3); }
  50% { box-shadow: 0 8px 30px rgba(16, 185, 129, 0.6); }
`;

const QuoteCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: '24px',
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  marginTop: theme.spacing(4),
  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
  animation: `${slideIn} 0.6s ease-out`,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 25px 70px rgba(0, 0, 0, 0.2)',
  },
}));

const SwapButton = styled(Button)(({ theme }) => ({
  borderRadius: '20px',
  padding: '20px',
  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  fontSize: '1.2rem',
  fontWeight: 700,
  textTransform: 'none',
  boxShadow: '0 10px 40px rgba(16, 185, 129, 0.4)',
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-3px)',
    animation: `${glow} 1.5s ease-in-out infinite`,
  },
  '&:disabled': {
    background: 'rgba(0, 0, 0, 0.12)',
    transform: 'none',
    boxShadow: 'none',
    animation: 'none',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
    transition: 'left 0.5s',
  },
  '&:hover::before': {
    left: '100%',
  },
}));

const LoadingContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(6),
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(20px)',
  borderRadius: '24px',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  marginTop: theme.spacing(4),
}));

const PulsingDot = styled(Box)(({ theme }) => ({
  width: 12,
  height: 12,
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  animation: `${glow} 1s ease-in-out infinite`,
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
      <Fade in={loading} timeout={300}>
        <LoadingContainer>
          <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
            <PulsingDot sx={{ animationDelay: '0s' }} />
            <PulsingDot sx={{ animationDelay: '0.2s' }} />
            <PulsingDot sx={{ animationDelay: '0.4s' }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main', mb: 1 }}>
            Finding Best Rates
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center' }}>
            Scanning 150+ DEXs for optimal pricing...
          </Typography>
        </LoadingContainer>
      </Fade>
    );
  }

  if (error) {
    return (
      <Fade in={!!error} timeout={300}>
        <QuoteCard elevation={0}>
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Typography variant="h6" color="error" sx={{ fontWeight: 600, mb: 2 }}>
              ⚠️ Quote Error
            </Typography>
            <Typography color="error" sx={{ 
              background: 'rgba(239, 68, 68, 0.1)',
              padding: '12px 20px',
              borderRadius: '12px',
              border: '1px solid rgba(239, 68, 68, 0.2)',
            }}>
              {error}
            </Typography>
          </Box>
        </QuoteCard>
      </Fade>
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
    <Grow in={!!quote} timeout={600}>
      <QuoteCard elevation={0}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Box sx={{
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            borderRadius: '12px',
            p: 1,
            mr: 2,
            boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
          }}>
            <TrendingUpIcon sx={{ color: 'white', fontSize: 24 }} />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 800, flex: 1 }}>
            Best Quote Found
          </Typography>
          <Chip 
            label={`${quoteData.routerStr}`} 
            sx={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              fontWeight: 600,
              fontSize: '0.8rem',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
            }}
          />
        </Box>
        
        {/* Quote Details */}
        <Box sx={{ mb: 4 }}>
          <Fade in={!!quote} timeout={800}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              mb: 3,
              p: 3,
              background: 'rgba(102, 126, 234, 0.05)',
              borderRadius: '16px',
              border: '1px solid rgba(102, 126, 234, 0.1)',
            }}>
              <Box>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                  You Pay
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {parseFloat(inAmount).toFixed(6)} {quoteData.inTokenSymbol}
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                  You Receive
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'success.main' }}>
                  {parseFloat(outAmount).toFixed(6)} {quoteData.outTokenSymbol}
                </Typography>
              </Box>
            </Box>
          </Fade>

          <Divider sx={{ my: 3, background: 'rgba(0, 0, 0, 0.1)' }} />

          <Fade in={!!quote} timeout={1000}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LocalGasStationIcon sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
                <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                  Est. Gas
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                {parseFloat(estimatedGas).toFixed(6)} ETH
              </Typography>
            </Box>
          </Fade>

          <Fade in={!!quote} timeout={1200}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                Price Impact
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  fontWeight: 700,
                  color: priceImpact > 3 ? 'error.main' : priceImpact > 1 ? 'warning.main' : 'success.main',
                  background: priceImpact > 3 ? 'rgba(239, 68, 68, 0.1)' : priceImpact > 1 ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                  padding: '4px 12px',
                  borderRadius: '8px',
                }}
              >
                {priceImpact.toFixed(2)}%
              </Typography>
            </Box>
          </Fade>

          <Fade in={!!quote} timeout={1400}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                Min. Received
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                {(parseFloat(outAmount) * 0.995).toFixed(6)} {quoteData.outTokenSymbol}
              </Typography>
            </Box>
          </Fade>
        </Box>

        <Zoom in={!!quote} timeout={800}>
          <SwapButton
            variant="contained"
            fullWidth
            size="large"
            onClick={onExecuteSwap}
            disabled={swapLoading}
            startIcon={swapLoading ? null : <SwapHorizIcon sx={{ fontSize: 28 }} />}
          >
            {swapLoading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{
                  width: 24,
                  height: 24,
                  border: '3px solid rgba(255, 255, 255, 0.3)',
                  borderTop: '3px solid white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  '@keyframes spin': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' },
                  },
                }} />
                Executing Swap...
              </Box>
            ) : (
              `Swap ${fromToken} for ${toToken}`
            )}
          </SwapButton>
        </Zoom>

        {priceImpact > 3 && (
          <Fade in={priceImpact > 3} timeout={1000}>
            <Typography 
              variant="body2" 
              sx={{ 
                display: 'block', 
                textAlign: 'center', 
                mt: 3, 
                color: 'error.main',
                fontWeight: 700,
                background: 'rgba(239, 68, 68, 0.1)',
                padding: '12px 20px',
                borderRadius: '12px',
                border: '1px solid rgba(239, 68, 68, 0.2)',
              }}
            >
              ⚠️ High price impact! Consider reducing swap amount.
            </Typography>
          </Fade>
        )}
      </QuoteCard>
    </Zoom>
  );
};

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