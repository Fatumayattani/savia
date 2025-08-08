import React, { useState } from 'react';
import { 
  Container, 
  Paper, 
  Typography, 
  Box, 
  IconButton,
  Alert,
  Snackbar
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { SwapForm } from './SwapForm';
import { QuoteDisplay } from './QuoteDisplay';
import { getQuote, getSwapData, TOKENS, parseTokenAmount } from '../services/okxApi';

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
  maxWidth: '480px',
  margin: '0 auto',
}));

interface TradingInterfaceProps {
  account: string | null;
  provider: any;
  balance: string;
  chainId: number | null;
  executeSwap: (swapData: any) => Promise<any>;
  onBack: () => void;
}

export const TradingInterface: React.FC<TradingInterfaceProps> = ({ 
  account, 
  provider, 
  balance,
  chainId,
  executeSwap,
  onBack 
}) => {
  const [quote, setQuote] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [swapLoading, setSwapLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [currentSwapParams, setCurrentSwapParams] = useState<any>(null);

  const handleGetQuote = async (fromToken: string, toToken: string, amount: string, slippage: number) => {
    if (!account || !provider) {
      setError('Please connect your wallet first');
      return;
    }

    if (chainId !== 1) {
      setError('Please switch to Ethereum mainnet');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setLoading(true);
    setError(null);
    setQuote(null);

    try {
      // Get token decimals for proper amount parsing
      const fromTokenInfo = Object.values(TOKENS).find(t => t.address === fromToken);
      const amountInWei = parseTokenAmount(amount, fromTokenInfo?.decimals || 18);

      const quoteResponse = await getQuote({
        chainId: 1,
        inTokenAddress: fromToken,
        outTokenAddress: toToken,
        amount: amountInWei,
        slippage: slippage.toString(),
      });

      if (quoteResponse.code === '0' && quoteResponse.data.length > 0) {
        setQuote(quoteResponse);
        setCurrentSwapParams({
          fromToken,
          toToken,
          amount: amountInWei,
          slippage: slippage.toString(),
          originalAmount: amount,
        });
      } else {
        setError(quoteResponse.msg || 'No quote available for this swap');
      }
    } catch (err: any) {
      console.error('Error fetching quote:', err);
      setError(err.message || 'Failed to fetch quote. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleExecuteSwap = async () => {
    if (!quote || !currentSwapParams || !account) {
      setError('No quote available or wallet not connected');
      return;
    }

    setSwapLoading(true);
    setError(null);

    try {
      // Get swap transaction data
      const swapResponse = await getSwapData({
        chainId: 1,
        inTokenAddress: currentSwapParams.fromToken,
        outTokenAddress: currentSwapParams.toToken,
        amount: currentSwapParams.amount,
        slippage: currentSwapParams.slippage,
        userWalletAddress: account,
      });

      if (swapResponse.code === '0' && swapResponse.data.length > 0) {
        const swapData = swapResponse.data[0].tx;
        
        // Execute the swap
        const result = await executeSwap({
          to: swapData.to,
          data: swapData.data,
          value: swapData.value,
          gas: swapData.gas,
          gasPrice: swapData.gasPrice,
        });

        setSuccessMessage(`Swap executed successfully! Transaction: ${result.tx.hash}`);
        
        // Clear quote after successful swap
        setQuote(null);
        setCurrentSwapParams(null);
      } else {
        setError(swapResponse.msg || 'Failed to get swap transaction data');
      }
    } catch (err: any) {
      console.error('Error executing swap:', err);
      setError(err.message || 'Failed to execute swap. Please try again.');
    } finally {
      setSwapLoading(false);
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

        {chainId !== 1 && account && (
          <Alert severity="warning" sx={{ mb: 3, borderRadius: '12px' }}>
            Please switch to Ethereum mainnet to use the DEX aggregator
          </Alert>
        )}

        {!account && (
          <Alert severity="info" sx={{ mb: 3, borderRadius: '12px' }}>
            Connect your MetaMask wallet to start trading
          </Alert>
        )}
        
        <SwapForm 
          onGetQuote={handleGetQuote} 
          loading={loading} 
          balance={balance}
          account={account}
          chainId={chainId}
        />
        
        <QuoteDisplay 
          quote={quote} 
          loading={loading} 
          error={error}
          onExecuteSwap={handleExecuteSwap}
          swapLoading={swapLoading}
          fromToken={currentSwapParams?.fromToken || ''}
          toToken={currentSwapParams?.toToken || ''}
        />
      </TradingCard>

      {/* Success Notification */}
      <Snackbar 
        open={!!successMessage} 
        autoHideDuration={8000} 
        onClose={() => setSuccessMessage(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSuccessMessage(null)} 
          severity="success" 
          sx={{ borderRadius: '12px', maxWidth: '400px' }}
        >
          {successMessage}
        </Alert>
      </Snackbar>

      {/* Error Notification */}
      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setError(null)} 
          severity="error" 
          sx={{ borderRadius: '12px', maxWidth: '400px' }}
        >
          {error}
        </Alert>
      </Snackbar>
    </TradingContainer>
  );
};