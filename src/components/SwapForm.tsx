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
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import { TOKENS, formatTokenAmount, parseTokenAmount } from '../services/okxApi';

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '16px',
    background: 'rgba(255, 255, 255, 0.8)',
    fontSize: '1.2rem',
    '&:hover': {
      background: 'rgba(255, 255, 255, 0.9)',
    },
    '&.Mui-focused': {
      background: 'rgba(255, 255, 255, 1)',
    },
  },
  '& .MuiOutlinedInput-input': {
    padding: '16px',
    textAlign: 'right',
  },
}));

const TokenSelect = styled(FormControl)(({ theme }) => ({
  minWidth: 140,
  '& .MuiOutlinedInput-root': {
    borderRadius: '16px',
    background: 'rgba(255, 255, 255, 0.9)',
  },
}));

const SwapButton = styled(Button)(({ theme }) => ({
  borderRadius: '16px',
  padding: '18px',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  fontSize: '1.1rem',
  fontWeight: 600,
  textTransform: 'none',
  boxShadow: '0 8px 30px rgba(102, 126, 234, 0.3)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 12px 40px rgba(102, 126, 234, 0.4)',
  },
  '&:disabled': {
    background: 'rgba(0, 0, 0, 0.12)',
    transform: 'none',
    boxShadow: 'none',
  },
}));

const SwapContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: '20px',
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  marginBottom: theme.spacing(2),
}));

const SwapDirectionButton = styled(IconButton)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.9)',
  border: '2px solid rgba(102, 126, 234, 0.2)',
  width: 48,
  height: 48,
  '&:hover': {
    background: 'rgba(255, 255, 255, 1)',
    transform: 'rotate(180deg)',
    borderColor: 'rgba(102, 126, 234, 0.4)',
  },
  transition: 'all 0.3s ease',
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

  const tokenList = Object.values(TOKENS);
  const fromTokenData = TOKENS[fromToken as keyof typeof TOKENS];
  const toTokenData = TOKENS[toToken as keyof typeof TOKENS];

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
    <Box component="form" onSubmit={handleSubmit}>
      {/* From Token */}
      <SwapContainer elevation={0}>
        <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary', fontWeight: 600 }}>
          From
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
          <TokenSelect>
            <Select
              value={fromToken}
              onChange={(e) => setFromToken(e.target.value)}
              renderValue={(value) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar 
                    src={TOKENS[value as keyof typeof TOKENS].logoURI} 
                    sx={{ width: 24, height: 24 }}
                  />
                  <Typography sx={{ fontWeight: 600 }}>
                    {value}
                  </Typography>
                </Box>
              )}
            >
              {getAvailableTokens(toToken).map((token) => (
                <MenuItem key={token.symbol} value={token.symbol}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar src={token.logoURI} sx={{ width: 24, height: 24 }} />
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
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: 'primary.main',
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
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Balance: {fromToken === 'ETH' ? parseFloat(balance).toFixed(4) : '0.0000'} {fromToken}
          </Typography>
          {amount && (
            <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 600 }}>
              ~${fromToken === 'ETH' ? (parseFloat(amount) * 2000).toFixed(2) : '0.00'}
            </Typography>
          )}
        </Box>
      </SwapContainer>

      {/* Swap Direction Button */}
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 1 }}>
        <SwapDirectionButton onClick={handleSwapTokens}>
          <SwapVertIcon sx={{ color: '#667eea' }} />
        </SwapDirectionButton>
      </Box>

      {/* To Token */}
      <SwapContainer elevation={0}>
        <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary', fontWeight: 600 }}>
          To (estimated)
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
          <TokenSelect>
            <Select
              value={toToken}
              onChange={(e) => setToToken(e.target.value)}
              renderValue={(value) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar 
                    src={TOKENS[value as keyof typeof TOKENS].logoURI} 
                    sx={{ width: 24, height: 24 }}
                  />
                  <Typography sx={{ fontWeight: 600 }}>
                    {value}
                  </Typography>
                </Box>
              )}
            >
              {getAvailableTokens(fromToken).map((token) => (
                <MenuItem key={token.symbol} value={token.symbol}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar src={token.logoURI} sx={{ width: 24, height: 24 }} />
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
              },
            }}
          />
        </Box>
        
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          Get a quote to see the estimated output amount
        </Typography>
      </SwapContainer>

      {/* Slippage Settings */}
      <Box sx={{ mt: 3, mb: 3 }}>
        <Typography variant="body2" sx={{ mb: 2, fontWeight: 600 }}>
          Slippage Tolerance: {slippage}%
        </Typography>
        <Box sx={{ px: 1 }}>
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
              },
              '& .MuiSlider-track': {
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              },
            }}
          />
        </Box>
        <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1, display: 'block' }}>
          Higher slippage increases success rate but may result in worse prices
        </Typography>
      </Box>

      {/* Get Quote Button */}
      <SwapButton
        type="submit"
        variant="contained"
        startIcon={<SwapHorizIcon />}
        disabled={loading || !isFormValid}
        fullWidth
        size="large"
      >
        {loading ? 'Getting Quote...' : 'Get Best Quote'}
      </SwapButton>

      {/* Connection Status */}
      {!account && (
        <Typography 
          variant="body2" 
          sx={{ 
            textAlign: 'center', 
            mt: 2, 
            color: 'text.secondary',
            fontStyle: 'italic',
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
            mt: 2, 
            color: 'warning.main',
            fontWeight: 600,
          }}
        >
          ⚠️ Switch to Ethereum mainnet to trade
        </Typography>
      )}
    </Box>
  );
};