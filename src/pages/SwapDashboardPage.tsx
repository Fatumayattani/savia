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
import { SwapForm } from '../components/SwapForm';
import { QuoteDisplay } from '../components/QuoteDisplay';
import { getQuote, getSwapData, TOKENS, parseTokenAmount } from '../services/okxApi';

const DashboardContainer = styled(Container)(({ theme }) => ({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
}));

interface SwapDashboardPageProps {
  account: string | null;
  provider: any;
  balance: string;
  chainId: number | null;
  executeSwap: (swapData: any) => Promise<any>;
  onBack: () => void;
}

export const SwapDashboardPage: React.FC<SwapDashboardPageProps> = ({ 
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
    <DashboardContainer maxWidth="xl">
      <Box sx={{ pt: 3, pb: 4 }}>
        <IconButton 
          onClick={onBack}
          sx={{ 
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(20px)',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            mb: 4,
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.3)',
            },
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom
          sx={{ 
            fontWeight: 800,
            textAlign: 'center',
            color: 'white',
            mb: 6,
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
          }}
        >
          Swap Dashboard
        </Typography>

        {chainId !== 1 && account && (
          <Alert severity="warning" sx={{ mb: 4, borderRadius: '12px', maxWidth: '600px', mx: 'auto' }}>
            Please switch to Ethereum mainnet to use the DEX aggregator
          </Alert>
        )}

        {!account && (
          <Alert severity="info" sx={{ mb: 4, borderRadius: '12px', maxWidth: '600px', mx: 'auto' }}>
            Connect your MetaMask wallet to start trading
          </Alert>
        )}

        <Grid container spacing={6} sx={{ minHeight: 'calc(100vh - 200px)' }}>
          {/* Left Side - Swap Form */}
          <Grid item xs={12} lg={6}>
            <Box sx={{ 
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
            }}>
              <Box sx={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                borderRadius: '24px',
                padding: '32px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
                position: 'relative',
                overflow: 'hidden',
              }}>
                {/* Artistic Background Element */}
                <Box sx={{
                  position: 'absolute',
                  top: '-50%',
                  right: '-50%',
                  width: '200%',
                  height: '200%',
                  background: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
                  animation: 'rotate 20s linear infinite',
                  '@keyframes rotate': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' },
                  },
                }} />
                
                <Box sx={{ position: 'relative', zIndex: 2 }}>
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      fontWeight: 800,
                      color: 'white',
                      mb: 3,
                      textAlign: 'center',
                      textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
                    }}
                  >
                    Get Best Rates
                  </Typography>
                  
                  <SwapForm 
                    onGetQuote={handleGetQuote} 
                    loading={loading} 
                    balance={balance}
                    account={account}
                    chainId={chainId}
                  />
                </Box>
              </Box>
            </Box>
          </Grid>
          
          {/* Right Side - Quote Display */}
          <Grid item xs={12} lg={6}>
            <Box sx={{ 
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
            }}>
              {/* Placeholder when no quote */}
              {!quote && !loading && !error && (
                <Box sx={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '24px',
                  padding: '48px 32px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  textAlign: 'center',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  minHeight: '400px',
                }}>
                  <Box
                    component="img"
                    src="https://images.pexels.com/photos/730547/pexels-photo-730547.jpeg"
                    alt="Trading visualization"
                    sx={{
                      width: '100%',
                      maxWidth: '300px',
                      height: 'auto',
                      borderRadius: '16px',
                      opacity: 0.8,
                      mb: 3,
                      filter: 'brightness(1.1) contrast(1.1)',
                    }}
                  />
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      color: 'white', 
                      fontWeight: 700,
                      mb: 2,
                      textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
                    }}
                  >
                    Ready to Find Best Rates?
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.8)',
                      maxWidth: '300px',
                      lineHeight: 1.6,
                    }}
                  >
                    Enter your swap details on the left to get real-time quotes from 150+ DEXs
                  </Typography>
                </Box>
              )}
              
              {/* Quote Display */}
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
      </Box>
        
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
    </DashboardContainer>
  );
};