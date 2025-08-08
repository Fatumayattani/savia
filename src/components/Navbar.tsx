import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Box, Button, Chip } from '@mui/material';
import { styled } from '@mui/material/styles';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { WalletConnection } from './WalletConnection';

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
  chainId: number | null;
  isConnecting: boolean;
  onConnect: () => Promise<void>;
  onSwitchNetwork: () => Promise<void>;
  onDisconnect: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  account, 
  chainId,
  isConnecting,
  onConnect,
  onSwitchNetwork,
  onDisconnect,
}) => {
  const [walletDialogOpen, setWalletDialogOpen] = useState(false);

  const handleWalletClick = () => {
    setWalletDialogOpen(true);
  };

  const handleWalletConnect = async () => {
    await onConnect();
  };

  const isWrongNetwork = chainId && chainId !== 1;

  return (
    <>
      <StyledAppBar position="fixed" elevation={0}>
        <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
          <Logo variant="h6">
            Savia
          </Logo>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Network Status */}
            {account && (
              <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 1 }}>
                <Chip
                  label={chainId === 1 ? 'Ethereum' : `Chain ${chainId}`}
                  color={chainId === 1 ? 'success' : 'warning'}
                  size="small"
                  sx={{ fontWeight: 600 }}
                />
              </Box>
            )}

            {/* Wallet Button */}
            <ConnectButton
              variant="contained"
              startIcon={<AccountBalanceWalletIcon />}
              onClick={handleWalletClick}
              disabled={isConnecting}
              size="small"
            >
              {account 
                ? `${account.substring(0, 6)}...${account.substring(38)}` 
                : isConnecting 
                  ? 'Connecting...'
                  : 'Connect Wallet'
              }
            </ConnectButton>
          </Box>
        </Toolbar>
      </StyledAppBar>

      {/* Wallet Connection Dialog */}
      <WalletConnection
        open={walletDialogOpen}
        onClose={() => setWalletDialogOpen(false)}
        onConnect={handleWalletConnect}
        isConnecting={isConnecting}
        account={account}
        chainId={chainId}
        onSwitchNetwork={onSwitchNetwork}
        onDisconnect={onDisconnect}
      />
    </>
  );
};