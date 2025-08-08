import React from 'react';
import { AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(20px)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
}));

const Logo = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  fontSize: '1.8rem',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  letterSpacing: '-0.02em',
}));

const ConnectButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  borderRadius: '12px',
  padding: '10px 24px',
  textTransform: 'none',
  fontWeight: 600,
  boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 30px rgba(102, 126, 234, 0.4)',
  },
}));

interface NavbarProps {
  account: string | null;
  onConnect: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ account, onConnect }) => {
  return (
    <StyledAppBar position="fixed" elevation={0}>
      <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
        <Logo variant="h6">
          Savia
        </Logo>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'text.secondary',
              display: { xs: 'none', sm: 'block' },
              fontWeight: 500
            }}
          >
            Smart DEX Aggregator
          </Typography>
          
          <ConnectButton
            variant="contained"
            startIcon={<AccountBalanceWalletIcon />}
            onClick={onConnect}
            size="small"
          >
            {account 
              ? `${account.substring(0, 6)}...${account.substring(38)}` 
              : 'Connect Wallet'
            }
          </ConnectButton>
        </Box>
      </Toolbar>
    </StyledAppBar>
  );
};