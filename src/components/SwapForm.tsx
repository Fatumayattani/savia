import React, { useState } from 'react';
import { 
  TextField, 
  Button, 
  Box, 
  InputAdornment, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  Typography,
  Slider,
  Paper
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import SwapVertIcon from '@mui/icons-material/SwapVert';

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '16px',
    background: 'rgba(255, 255, 255, 0.8)',
    '&:hover': {
      background: 'rgba(255, 255, 255, 0.9)',
    },
    '&.Mui-focused': {
      background: 'rgba(255, 255, 255, 1)',
    },
  },
}));

const SwapButton = styled(Button)(({ theme }) => ({
  borderRadius: '16px',
  padding: '16px',
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

const tokens = [
  { symbol: 'ETH', name: 'Ethereum', address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee' },
  { symbol: 'USDC', name: 'USD Coin', address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48' },
  { symbol: 'USDT', name: 'Tether', address: '0xdac17f958d2ee523a2206206994597c13d831ec7' },
  { symbol: 'DAI', name: 'Dai Stablecoin', address: '0x6b175474e89094c44da98b954eedeac495271d0f' },
];

interface SwapFormProps {
  onGetQuote: (fromToken: string, toToken: string, amount: string, slippage: number) => void;
  loading: boolean;
  balance: string;
}

export const SwapForm: React.FC<SwapFormProps> = ({ onGetQuote, loading, balance }) => {
  const [fromToken, setFromToken] = useState('ETH');
  const [toToken, setToToken] = useState('USDC');
  const [amount, setAmount] = useState('');
  const [slippage, setSlippage] = useState(0.5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fromTokenAddress = tokens.find(t => t.symbol === fromToken)?.address || '';
    const toTokenAddress = tokens.find(t => t.symbol === toToken)?.address || '';
    onGetQuote(fromTokenAddress, toTokenAddress, amount, slippage);
  };

  const handleSwapTokens = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
  };

  const handleMaxAmount = () => {
    if (fromToken === 'ETH') {
      // Leave some ETH for gas fees
      const maxAmount = Math.max(0, parseFloat(balance) - 0.01);
      setAmount(maxAmount.toString());
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      {/* From Token */}
      <SwapContainer elevation={0}>
        <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary', fontWeight: 600 }}>
          From
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <FormControl sx={{ minWidth: 120 }}>
            <Select
              value={fromToken}
              onChange={(e) => setFromToken(e.target.value)}
              variant="outlined"
              sx={{ borderRadius: '12px' }}
            >
              {tokens.map((token) => (
                <MenuItem key={token.symbol} value={token.symbol}>
                  {token.symbol}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <StyledTextField
            variant="outlined"
            fullWidth
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.0"
            InputProps={{ 
              inputProps: { min: 0, step: 'any' },
            }}
          />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Balance: {fromToken === 'ETH' ? parseFloat(balance).toFixed(4) : '0.0000'} {fromToken}
          </Typography>
          {fromToken === 'ETH' && (
            <Button 
              size="small" 
              onClick={handleMaxAmount}
              sx={{ minWidth: 'auto', p: 0.5, fontSize: '0.75rem' }}
            >
              MAX
            </Button>
          )}
        </Box>
      </SwapContainer>

      {/* Swap Direction Button */}
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 1 }}>
        <Button
          onClick={handleSwapTokens}
          sx={{
            minWidth: 'auto',
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.9)',
            border: '2px solid rgba(102, 126, 234, 0.2)',
            '&:hover': {
              background: 'rgba(255, 255, 255, 1)',
              transform: 'rotate(180deg)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          <SwapVertIcon sx={{ color: '#667eea' }} />
        </Button>
      </Box>

      {/* To Token */}
      <SwapContainer elevation={0}>
        <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary', fontWeight: 600 }}>
          To
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <FormControl sx={{ minWidth: 120 }}>
            <Select
              value={toToken}
              onChange={(e) => setToToken(e.target.value)}
              variant="outlined"
              sx={{ borderRadius: '12px' }}
            >
              {tokens.filter(token => token.symbol !== fromToken).map((token) => (
                <MenuItem key={token.symbol} value={token.symbol}>
                  {token.symbol}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <StyledTextField
            variant="outlined"
            fullWidth
            placeholder="0.0"
            disabled
            value="~"
          />
        </Box>
      </SwapContainer>

      {/* Slippage Settings */}
      <Box sx={{ mt: 3, mb: 3 }}>
        <Typography variant="body2" sx={{ mb: 2, fontWeight: 600 }}>
          Slippage Tolerance: {slippage}%
        </Typography>
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

      <SwapButton
        type="submit"
        variant="contained"
        startIcon={<SwapHorizIcon />}
        disabled={loading || !amount || fromToken === toToken}
        fullWidth
        size="large"
      >
        {loading ? 'Getting Quote...' : 'Get Quote'}
      </SwapButton>
    </Box>
  );
};