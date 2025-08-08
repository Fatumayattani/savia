import React, { useState } from 'react';
import { 
  Container, 
  Paper, 
  Typography, 
  Box, 
  Button,
  IconButton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { SwapForm } from './SwapForm';
import { QuoteDisplay } from './QuoteDisplay';
import { getQuote } from '../services/okxApi';
import { ethers } from 'ethers';

const TradingContainer = styled(Container)(({ theme }) => ({
  minHeight: '100vh',
  paddingTop: theme.spacing(12),
  paddingBottom: theme.spacing(4),
  background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
}));

const TradingCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: '24px',
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
}));

const ETH_ADDRESS = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';
const USDC_ADDRESS = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';

interface TradingInterfaceProps {
  account: string | null;
  provider: any;
  onBack: () => void;
}

export const TradingInterface: React.FC<TradingInterfaceProps> = ({ 
  account, 
  provider, 
  onBack 
}) => {
  const [quote, setQuote] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetQuote = async (amount: string) => {
    if (!account || !provider) {
      setError('Please connect your wallet first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const amountInWei = ethers.parseEther(amount).toString();
      const quoteResponse = await getQuote({
        chainId: 1,
        inTokenAddress: ETH_ADDRESS,
        outTokenAddress: USDC_ADDRESS,
        amount: amountInWei,
      });
      setQuote(quoteResponse);
    } catch (err) {
      console.error('Error fetching quote:', err);
      setError('Failed to fetch quote. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <TradingContainer maxWidth="sm">
      <Box sx={{ mb: 3 }}>
        <IconButton 
          onClick={onBack}
          sx={{ 
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(20px)',
            '&:hover': {
              background: 'rgba(255, 255, 255, 1)',
            },
          }}
        >
          <ArrowBackIcon />
        </IconButton>
      </Box>
      
      <TradingCard elevation={0}>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom
          sx={{ 
            fontWeight: 800,
            textAlign: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 4,
          }}
        >
          Swap Tokens
        </Typography>
        
        <SwapForm onSubmit={handleGetQuote} loading={loading} />
        <QuoteDisplay quote={quote} loading={loading} error={error} />
      </TradingCard>
    </TradingContainer>
  );
};