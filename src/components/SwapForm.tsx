import React, { useState, useEffect } from 'react';
import { 
  TextField, 
  Button, 
  Box, 
  Select, 
  MenuItem, 
  FormControl,
  Typography,
  Slider,
  Paper,
  Avatar,
  InputAdornment,
  IconButton,
  Fade,
  Zoom,
  Grow,
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { TOKENS } from '../services/okxApi';

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

const shimmer = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
`;

const SwapContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: '24px',
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  marginBottom: theme.spacing(2),
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 15px 50px rgba(0, 0, 0, 0.15)',
    background: 'rgba(255, 255, 255, 1)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-200px',
    width: '200px',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.1), transparent)',
    animation: `${shimmer} 2s infinite`,
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '16px',
    background: 'rgba(255, 255, 255, 0.9)',
    fontSize: '1.4rem',
    fontWeight: 600,
    transition: 'all 0.3s ease',
    '&:hover': {
      background: 'rgba(255, 255, 255, 1)',
      transform: 'scale(1.02)',
    },
    '&.Mui-focused': {
      background: 'rgba(255, 255, 255, 1)',
      transform: 'scale(1.02)',
      boxShadow: '0 0 20px rgba(102, 126, 234, 0.3)',
    },
  },
  '& .MuiOutlinedInput-input': {
    padding: '20px',
    textAlign: 'right',
  },
}));

const TokenSelect = styled(FormControl)(({ theme }) => ({
  minWidth: 160,
  '& .MuiOutlinedInput-root': {
    borderRadius: '16px',
    background: 'rgba(255, 255, 255, 0.9)',
    transition: 'all 0.3s ease',
    '&:hover': {
      background: 'rgba(255, 255, 255, 1)',
      transform: 'scale(1.02)',
    },
  },
}));

const SwapButton = styled(Button)(({ theme }) => ({
  borderRadius: '20px',
  padding: '20px',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  fontSize: '1.2rem',
  fontWeight: 700,
  textTransform: 'none',
  boxShadow: '0 10px 40px rgba(102, 126, 234, 0.4)',
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: '0 15px 50px rgba(102, 126, 234, 0.5)',
    animation: `${pulse} 1s ease-in-out`,
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

const SwapDirectionButton = styled(IconButton)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.95)',
  border: '3px solid rgba(102, 126, 234, 0.3)',
  width: 56,
  height: 56,
  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
  transition: 'all 0.4s ease',
  '&:hover': {
    background: 'rgba(255, 255, 255, 1)',
    transform: 'rotate(180deg) scale(1.1)',
    borderColor: 'rgba(102, 126, 234, 0.6)',
    boxShadow: '0 12px 35px rgba(0, 0, 0, 0.2)',
  },
}));

const AnimatedBox = styled(Box)(({ theme }) => ({
  animation: `${float} 3s ease-in-out infinite`,
}));

const GlowingChip = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  color: 'white',
  padding: '8px 16px',
  borderRadius: '20px',
  fontSize: '0.875rem',
  fontWeight: 600,
  boxShadow: '0 4px 20px rgba(16, 185, 129, 0.3)',
  animation: `${pulse} 2s ease-in-out infinite`,
}));

interface SwapFormProps {
  onGetQuote: (fromToken: string, toToken: string, amount: string, slippage: number) => void;
  loading: boolean;
  balance: string;
  account: string | null;
  chainId: number | null;
}

export const SwapForm: React.FC<SwapFormProps> = ({ 
  onGetQuote, 
  loading, 
  balance, 
  account,
  chainId 
}) => {
  const [fromToken, setFromToken] = useState('ETH');
  const [toToken, setToToken] = useState('USDC');
  const [amount, setAmount] = useState('');
  const [slippage, setSlippage] = useState(0.5);
  const [showForm, setShowForm] = useState(false);

  const tokenList = Object.values(TOKENS);
  const fromTokenData = TOKENS[fromToken as keyof typeof TOKENS];
  const toTokenData = TOKENS[toToken as keyof typeof TOKENS];

  useEffect(() => {
    setShowForm(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!account) {
      alert('Please connect your wallet first');
      return;
    }
    if (chainId !== 1) {
      alert('Please switch to Ethereum mainnet');
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    onGetQuote(fromTokenData.address, toTokenData.address, amount, slippage);
  };

  const handleSwapTokens = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
  };

  const handleMaxAmount = () => {
    if (fromToken === 'ETH') {
      // Leave some ETH for gas fees (0.01 ETH)
      const maxAmount = Math.max(0, parseFloat(balance) - 0.01);
      setAmount(maxAmount.toFixed(6));
    }
  };

  const getAvailableTokens = (excludeToken: string) => {
    return tokenList.filter(token => token.symbol !== excludeToken);
  };

  const isFormValid = account && chainId === 1 && amount && parseFloat(amount) > 0 && fromToken !== toToken;

  return (
    <Fade in={showForm} timeout={800}>
      <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: '480px', mx: 'auto' }}>
        {/* Header with animated icon */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <AnimatedBox>
            <TrendingUpIcon sx={{ 
              fontSize: 60, 
              color: 'white', 
              filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))',
              mb: 2,
            }} />
          </AnimatedBox>
          <GlowingChip>
            Best rates guaranteed
          </GlowingChip>
        </Box>

        {/* From Token */}
        <Grow in={showForm} timeout={1000}>
          <SwapContainer elevation={0}>
            <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary', fontWeight: 700, fontSize: '1rem' }}>
              From
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 3 }}>
              <TokenSelect>
                <Select
                  value={fromToken}
                  onChange={(e) => setFromToken(e.target.value)}
                  renderValue={(value) => (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar 
                        src={TOKENS[value as keyof typeof TOKENS].logoURI} 
                        sx={{ width: 32, height: 32 }}
                      />
                      <Typography sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
                        {value}
                      </Typography>
                    </Box>
                  )}
                >
                  {getAvailableTokens(toToken).map((token) => (
                    <MenuItem key={token.symbol} value={token.symbol}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar src={token.logoURI} sx={{ width: 28, height: 28 }} />
                        <Box>
                          <Typography sx={{ fontWeight: 600 }}>{token.symbol}</Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            {token.name}
                          </Typography>
                        </Box>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </TokenSelect>
              
              <StyledTextField
                variant="outlined"
                fullWidth
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.0"
                InputProps={{ 
                  inputProps: { min: 0, step: 'any' },
                  endAdornment: fromToken === 'ETH' && (
                    <InputAdornment position="end">
                      <Button 
                        size="small" 
                        onClick={handleMaxAmount}
                        sx={{ 
                          minWidth: 'auto', 
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          color: 'primary.main',
                          background: 'rgba(102, 126, 234, 0.1)',
                          borderRadius: '8px',
                          px: 2,
                          '&:hover': {
                            background: 'rgba(102, 126, 234, 0.2)',
                            transform: 'scale(1.05)',
                          },
                        }}
                      >
                        MAX
                      </Button>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                Balance: {fromToken === 'ETH' ? parseFloat(balance).toFixed(4) : '0.0000'} {fromToken}
              </Typography>
              {amount && (
                <Zoom in={!!amount} timeout={300}>
                  <Typography variant="body2" sx={{ 
                    color: 'primary.main', 
                    fontWeight: 700,
                    background: 'rgba(102, 126, 234, 0.1)',
                    padding: '4px 12px',
                    borderRadius: '12px',
                  }}>
                    ~${fromToken === 'ETH' ? (parseFloat(amount) * 2000).toFixed(2) : '0.00'}
                  </Typography>
                </Zoom>
              )}
            </Box>
          </SwapContainer>
        </Grow>

        {/* Swap Direction Button */}
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
          <Zoom in={showForm} timeout={1200}>
            <SwapDirectionButton onClick={handleSwapTokens}>
              <SwapVertIcon sx={{ color: '#667eea', fontSize: 28 }} />
            </SwapDirectionButton>
          </Zoom>
        </Box>

        {/* To Token */}
        <Grow in={showForm} timeout={1400}>
          <SwapContainer elevation={0}>
            <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary', fontWeight: 700, fontSize: '1rem' }}>
              To (estimated)
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 3 }}>
              <TokenSelect>
                <Select
                  value={toToken}
                  onChange={(e) => setToToken(e.target.value)}
                  renderValue={(value) => (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar 
                        src={TOKENS[value as keyof typeof TOKENS].logoURI} 
                        sx={{ width: 32, height: 32 }}
                      />
                      <Typography sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
                        {value}
                      </Typography>
                    </Box>
                  )}
                >
                  {getAvailableTokens(fromToken).map((token) => (
                    <MenuItem key={token.symbol} value={token.symbol}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar src={token.logoURI} sx={{ width: 28, height: 28 }} />
                        <Box>
                          <Typography sx={{ fontWeight: 600 }}>{token.symbol}</Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            {token.name}
                          </Typography>
                        </Box>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </TokenSelect>
              
              <StyledTextField
                variant="outlined"
                fullWidth
                placeholder="0.0"
                disabled
                value=""
                sx={{
                  '& .MuiOutlinedInput-root.Mui-disabled': {
                    background: 'rgba(0, 0, 0, 0.04)',
                    '&:hover': {
                      transform: 'none',
                    },
                  },
                }}
              />
            </Box>
            
            <Typography variant="body2" sx={{ 
              color: 'text.secondary', 
              fontStyle: 'italic',
              textAlign: 'center',
              background: 'rgba(102, 126, 234, 0.05)',
              padding: '8px 16px',
              borderRadius: '12px',
            }}>
              💡 Get a quote to see the estimated output amount
            </Typography>
          </SwapContainer>
        </Grow>

        {/* Slippage Settings */}
        <Fade in={showForm} timeout={1600}>
          <Box sx={{ mt: 4, mb: 4 }}>
            <SwapContainer elevation={0}>
              <Typography variant="body1" sx={{ mb: 3, fontWeight: 700, fontSize: '1rem' }}>
                Slippage Tolerance: {slippage}%
              </Typography>
              <Box sx={{ px: 2 }}>
                <Slider
                  value={slippage}
                  onChange={(_, value) => setSlippage(value as number)}
                  min={0.1}
                  max={5}
                  step={0.1}
                  marks={[
                    { value: 0.5, label: '0.5%' },
                    { value: 1, label: '1%' },
                    { value: 3, label: '3%' },
                  ]}
                  sx={{
                    '& .MuiSlider-thumb': {
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      width: 24,
                      height: 24,
                      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                      '&:hover': {
                        boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
                        transform: 'scale(1.2)',
                      },
                    },
                    '& .MuiSlider-track': {
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      height: 6,
                    },
                    '& .MuiSlider-rail': {
                      height: 6,
                      background: 'rgba(0, 0, 0, 0.1)',
                    },
                    '& .MuiSlider-mark': {
                      background: 'rgba(102, 126, 234, 0.5)',
                      width: 3,
                      height: 3,
                    },
                    '& .MuiSlider-markLabel': {
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: 'text.secondary',
                    },
                  }}
                />
              </Box>
              <Typography variant="caption" sx={{ 
                color: 'text.secondary', 
                mt: 2, 
                display: 'block',
                textAlign: 'center',
                background: 'rgba(245, 158, 11, 0.1)',
                padding: '8px 16px',
                borderRadius: '8px',
                border: '1px solid rgba(245, 158, 11, 0.2)',
              }}>
                ⚡ Higher slippage increases success rate but may result in worse prices
              </Typography>
            </SwapContainer>
          </Box>
        </Fade>

        {/* Get Quote Button */}
        <Zoom in={showForm} timeout={1800}>
          <SwapButton
            type="submit"
            variant="contained"
            startIcon={loading ? null : <SwapHorizIcon sx={{ fontSize: 28 }} />}
            disabled={loading || !isFormValid}
            fullWidth
            size="large"
          >
            {loading ? (
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
                Finding Best Rates...
              </Box>
            ) : (
              'Get Best Quote'
            )}
          </SwapButton>
        </Zoom>

        {/* Connection Status */}
        {!account && (
          <Fade in={!account} timeout={2000}>
            <Typography 
              variant="body1" 
              sx={{ 
                textAlign: 'center', 
                mt: 3, 
                color: 'rgba(255, 255, 255, 0.9)',
                fontStyle: 'italic',
                background: 'rgba(255, 255, 255, 0.1)',
                padding: '12px 24px',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
              }}
            >
              🔗 Connect your wallet to start trading
            </Typography>
          </Fade>
        )}

        {account && chainId !== 1 && (
          <Fade in={account && chainId !== 1} timeout={2000}>
            <Typography 
              variant="body1" 
              sx={{ 
                textAlign: 'center', 
                mt: 3, 
                color: 'white',
                fontWeight: 700,
                background: 'rgba(245, 158, 11, 0.2)',
                padding: '12px 24px',
                borderRadius: '16px',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                backdropFilter: 'blur(10px)',
              }}
            >
              ⚠️ Switch to Ethereum mainnet to trade
            </Typography>
          </Fade>
        )}
      </Box>
    </Fade>
  );
};