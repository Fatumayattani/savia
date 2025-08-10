import React, { useState, useEffect } from 'react';
import { 
  TextField, 
  Button, 
  Box, 
  Select, 
  MenuItem, 
  FormControl,
  Typography,
  Paper,
  Avatar,
  InputAdornment,
  IconButton,
  Card,
  CardContent,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import SettingsIcon from '@mui/icons-material/Settings';
import { TOKENS } from '../services/okxApi';

const SwapContainer = styled(Card)(({ theme }) => ({
  borderRadius: '24px',
  background: 'white',
  border: '2px solid #f1f5f9',
  marginBottom: theme.spacing(1),
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  '&:hover': {
    borderColor: '#10b981',
    boxShadow: '0 8px 30px rgba(16, 185, 129, 0.15)',
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    background: '#f8fafc',
    fontSize: '1.6rem',
    fontWeight: 600,
    border: '2px solid transparent',
    '&:hover': {
      background: '#f1f5f9',
    },
    '&.Mui-focused': {
      background: 'white',
      borderColor: '#10b981',
    },
  },
  '& .MuiOutlinedInput-input': {
    padding: '24px 20px',
    textAlign: 'right',
  },
}));

const TokenSelect = styled(FormControl)(({ theme }) => ({
  minWidth: 140,
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    background: '#f8fafc',
    border: '2px solid transparent',
    padding: '8px 12px',
    '&:hover': {
      background: '#f1f5f9',
    },
    '&.Mui-focused': {
      borderColor: '#10b981',
    },
  },
}));

const SwapButton = styled(Button)(({ theme }) => ({
  borderRadius: '16px',
  padding: '18px 32px',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  fontSize: '1.1rem',
  fontWeight: 700,
  textTransform: 'none',
  boxShadow: '0 8px 25px rgba(16, 185, 129, 0.3)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 12px 35px rgba(16, 185, 129, 0.4)',
  },
  '&:disabled': {
    background: 'rgba(0, 0, 0, 0.12)',
    transform: 'none',
    boxShadow: 'none',
  },
}));

const SwapDirectionButton = styled(IconButton)(({ theme }) => ({
  background: 'white',
  border: '2px solid #e2e8f0',
  width: 48,
  height: 48,
  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: '#f8fafc',
    transform: 'rotate(180deg)',
    borderColor: '#10b981',
    boxShadow: '0 6px 20px rgba(16, 185, 129, 0.2)',
  },
}));

const SlippageButton = styled(Button)(({ theme }) => ({
  minWidth: '60px',
  height: '36px',
  borderRadius: '8px',
  fontSize: '0.875rem',
  fontWeight: 600,
  textTransform: 'none',
  border: '2px solid #e2e8f0',
  color: '#64748b',
  '&.active': {
    background: 'linear-gradient(135deg, #10b981 0%, #f97316 100%)',
    color: 'white',
    borderColor: 'transparent',
  },
  '&:hover': {
    borderColor: '#10b981',
  },
}));

const SettingsButton = styled(IconButton)(({ theme }) => ({
  background: '#f8fafc',
  border: '2px solid #e2e8f0',
  width: 40,
  height: 40,
  '&:hover': {
    background: '#f1f5f9',
    borderColor: '#10b981',
  },
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
  const [showSlippageSettings, setShowSlippageSettings] = useState(false);

  const tokenList = Object.values(TOKENS);
  const fromTokenData = TOKENS[fromToken as keyof typeof TOKENS];
  const toTokenData = TOKENS[toToken as keyof typeof TOKENS];

  const slippageOptions = [0.1, 0.5, 1.0];

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
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: '420px', mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ 
          fontWeight: 700, 
          color: 'white', 
          mb: 1,
          textAlign: 'center',
        }}>
          Swap Tokens
        </Typography>
        <Typography variant="body2" sx={{ 
          color: 'rgba(255, 255, 255, 0.8)', 
          textAlign: 'center',
        }}>
          Trade at the best available rates
        </Typography>
      </Box>

      {/* From Token */}
      <SwapContainer>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600, fontSize: '0.9rem' }}>
              You pay
            </Typography>
            {fromToken === 'ETH' && (
              <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.85rem' }}>
                Balance: {parseFloat(balance).toFixed(4)} ETH
              </Typography>
            )}
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <TokenSelect>
              <Select
                value={fromToken}
                onChange={(e) => setFromToken(e.target.value)}
                renderValue={(value) => (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar 
                      src={TOKENS[value as keyof typeof TOKENS].logoURI} 
                      sx={{ width: 28, height: 28 }}
                    />
                    <Typography sx={{ fontWeight: 700, fontSize: '1rem' }}>
                      {value}
                    </Typography>
                  </Box>
                )}
              >
                {getAvailableTokens(toToken).map((token) => (
                  <MenuItem key={token.symbol} value={token.symbol}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar src={token.logoURI} sx={{ width: 24, height: 24 }} />
                      <Box>
                        <Typography sx={{ fontWeight: 600, fontSize: '0.9rem' }}>{token.symbol}</Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
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
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: '#10b981',
                        background: 'rgba(16, 185, 129, 0.1)',
                        borderRadius: '6px',
                        px: 1.5,
                        py: 0.5,
                        '&:hover': {
                          background: 'rgba(16, 185, 129, 0.2)',
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
          
          {amount && (
            <Box sx={{ mt: 2, textAlign: 'right' }}>
              <Typography variant="body2" sx={{ 
                color: '#64748b', 
                fontSize: '0.85rem',
              }}>
                ≈ ${fromToken === 'ETH' ? (parseFloat(amount) * 2000).toFixed(2) : '0.00'}
              </Typography>
            </Box>
          )}
        </CardContent>
      </SwapContainer>

      {/* Swap Direction Button */}
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 1.5 }}>
        <SwapDirectionButton onClick={handleSwapTokens}>
          <SwapVertIcon sx={{ color: '#10b981', fontSize: 24 }} />
        </SwapDirectionButton>
      </Box>

      {/* To Token */}
      <SwapContainer>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600, fontSize: '0.9rem', mb: 2 }}>
            You receive (estimated)
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <TokenSelect>
              <Select
                value={toToken}
                onChange={(e) => setToToken(e.target.value)}
                renderValue={(value) => (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar 
                      src={TOKENS[value as keyof typeof TOKENS].logoURI} 
                      sx={{ width: 28, height: 28 }}
                    />
                    <Typography sx={{ fontWeight: 700, fontSize: '1rem' }}>
                      {value}
                    </Typography>
                  </Box>
                )}
              >
                {getAvailableTokens(fromToken).map((token) => (
                  <MenuItem key={token.symbol} value={token.symbol}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar src={token.logoURI} sx={{ width: 24, height: 24 }} />
                      <Box>
                        <Typography sx={{ fontWeight: 600, fontSize: '0.9rem' }}>{token.symbol}</Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
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
                  background: '#f1f5f9',
                  color: '#94a3b8',
                },
              }}
            />
          </Box>
          
          <Typography variant="body2" sx={{ 
            color: '#64748b', 
            textAlign: 'center',
            mt: 2,
            fontSize: '0.85rem',
          }}>
            Get a quote to see estimated output
          </Typography>
        </CardContent>
      </SwapContainer>

      {/* Slippage Settings */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 600 }}>
            Slippage: {slippage}%
          </Typography>
          <SettingsButton 
            size="small"
            onClick={() => setShowSlippageSettings(!showSlippageSettings)}
          >
            <SettingsIcon sx={{ fontSize: 18, color: '#64748b' }} />
          </SettingsButton>
        </Box>
        
        {showSlippageSettings && (
          <SwapContainer>
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                {slippageOptions.map((option) => (
                  <SlippageButton
                    key={option}
                    className={slippage === option ? 'active' : ''}
                    onClick={() => setSlippage(option)}
                  >
                    {option}%
                  </SlippageButton>
                ))}
              </Box>
              <Typography variant="caption" sx={{ 
                color: '#64748b', 
                fontSize: '0.75rem',
                display: 'block',
              }}>
                Higher slippage increases success rate but may result in worse prices
              </Typography>
            </CardContent>
          </SwapContainer>
        )}
      </Box>

      {/* Get Quote Button */}
      <SwapButton
        type="submit"
        variant="contained"
        startIcon={loading ? null : <SwapHorizIcon />}
        disabled={loading || !isFormValid}
        fullWidth
        size="large"
      >
        {loading ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{
              width: 20,
              height: 20,
              border: '2px solid rgba(255, 255, 255, 0.3)',
              borderTop: '2px solid white',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              '@keyframes spin': {
                '0%': { transform: 'rotate(0deg)' },
                '100%': { transform: 'rotate(360deg)' },
              },
            }} />
            Getting Quote...
          </Box>
        ) : (
          'Get Quote'
        )}
      </SwapButton>

      {/* Status Messages */}
      {!account && (
        <Typography 
          variant="body2" 
          sx={{ 
            textAlign: 'center', 
            mt: 3, 
            color: 'rgba(255, 255, 255, 0.8)',
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '12px 20px',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            fontSize: '0.9rem',
          }}
        >
          Connect your wallet to start trading
        </Typography>
      )}

      {account && chainId !== 1 && (
        <Typography 
          variant="body2" 
          sx={{ 
            textAlign: 'center', 
            mt: 3, 
            color: 'white',
            fontWeight: 600,
            background: 'rgba(249, 115, 22, 0.2)',
            padding: '12px 20px',
            borderRadius: '12px',
            border: '1px solid rgba(249, 115, 22, 0.3)',
            fontSize: '0.9rem',
          }}
        >
          Switch to Ethereum mainnet to trade
        </Typography>
      )}
    </Box>
  );
};