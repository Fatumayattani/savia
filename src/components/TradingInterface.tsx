import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  IconButton,
  Alert,
  Snackbar,
  Grid
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
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(20px)',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.3)',
            },
          }}
        >
          <ArrowBackIcon />
        </IconButton>
      </Box>
      
      <Grid container spacing={4} sx={{ height: 'calc(100vh - 200px)' }}>
        {/* Left Side - Artistic Image */}
        <Grid item xs={12} lg={6}>
          <Box sx={{ 
            height: '100%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            position: 'relative',
          }}>
            <Box
              component="img"
              src="https://images.pexels.com/photos/730547/pexels-photo-730547.jpeg"
              alt="Trading Art"
              sx={{
                width: '100%',
                maxWidth: '500px',
                height: 'auto',
                borderRadius: '24px',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                filter: 'brightness(1.1) contrast(1.1)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.02)',
                  boxShadow: '0 30px 80px rgba(0, 0, 0, 0.4)',
                },
              }}
            />
            
            {/* Floating Text Overlay */}
            <Box sx={{
              position: 'absolute',
              bottom: 20,
              left: 20,
              right: 20,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              borderRadius: '16px',
              padding: '20px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
            }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                Smart Trading Made Simple
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Get the best rates across 150+ DEXs with just one click
              </Typography>
            </Box>
          </Box>
        </Grid>
        
        {/* Right Side - Swap Form */}
        <Grid item xs={12} lg={6}>
          <Box sx={{ 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column',
            justifyContent: 'center',
          }}>
            <Typography 
              variant="h3" 
              component="h1" 
              gutterBottom
              sx={{ 
                fontWeight: 800,
                textAlign: 'center',
                color: 'white',
                mb: 4,
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
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
          </Box>
        </Grid>
      </Grid>
        
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