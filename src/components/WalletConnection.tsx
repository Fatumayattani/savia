import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress,
  IconButton,
  Chip,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import LaunchIcon from '@mui/icons-material/Launch';

const WalletButton = styled(Button)(({ theme }) => ({
  padding: '16px 24px',
  borderRadius: '16px',
  border: '2px solid rgba(102, 126, 234, 0.2)',
  background: 'rgba(255, 255, 255, 0.9)',
  color: '#1e293b',
  textTransform: 'none',
  fontWeight: 600,
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'rgba(102, 126, 234, 0.1)',
    borderColor: 'rgba(102, 126, 234, 0.4)',
    transform: 'translateY(-2px)',
  },
  '&:disabled': {
    opacity: 0.6,
    transform: 'none',
  },
}));

const MetaMaskLogo = () => (
  <Box
    component="img"
    src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg"
    alt="MetaMask"
    sx={{ width: 32, height: 32 }}
  />
);

interface WalletConnectionProps {
  open: boolean;
  onClose: () => void;
  onConnect: () => Promise<void>;
  isConnecting: boolean;
  account: string | null;
  chainId: number | null;
  onSwitchNetwork: () => Promise<void>;
  onDisconnect: () => void;
}

export const WalletConnection: React.FC<WalletConnectionProps> = ({
  open,
  onClose,
  onConnect,
  isConnecting,
  account,
  chainId,
  onSwitchNetwork,
  onDisconnect,
}) => {
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async () => {
    try {
      setError(null);
      await onConnect();
      if (!account) {
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet');
    }
  };

  const handleSwitchNetwork = async () => {
    try {
      setError(null);
      await onSwitchNetwork();
    } catch (err: any) {
      setError(err.message || 'Failed to switch network');
    }
  };

  const handleDisconnect = () => {
    onDisconnect();
    onClose();
  };

  const isWrongNetwork = chainId && chainId !== 1;

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '20px',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
        }
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {account ? 'Wallet Connected' : 'Connect Wallet'}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pb: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>
            {error}
          </Alert>
        )}

        {account ? (
          <Box>
            {/* Connected Wallet Info */}
            <Box sx={{ 
              p: 3, 
              border: '2px solid rgba(16, 185, 129, 0.2)',
              borderRadius: '16px',
              background: 'rgba(16, 185, 129, 0.05)',
              mb: 3,
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <MetaMaskLogo />
                <Typography variant="h6" sx={{ ml: 2, fontWeight: 600 }}>
                  MetaMask
                </Typography>
                <Chip 
                  label="Connected" 
                  color="success" 
                  size="small" 
                  sx={{ ml: 'auto' }}
                />
              </Box>
              
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                Account
              </Typography>
              <Typography variant="body1" sx={{ fontFamily: 'monospace', mb: 2 }}>
                {account}
              </Typography>

              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                Network
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body1">
                  {chainId === 1 ? 'Ethereum Mainnet' : `Chain ID: ${chainId}`}
                </Typography>
                {isWrongNetwork && (
                  <Chip label="Wrong Network" color="warning" size="small" />
                )}
              </Box>
            </Box>

            {/* Network Warning */}
            {isWrongNetwork && (
              <Alert severity="warning" sx={{ mb: 3, borderRadius: '12px' }}>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Savia requires Ethereum Mainnet to function properly.
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleSwitchNetwork}
                  sx={{ borderRadius: '8px' }}
                >
                  Switch to Ethereum
                </Button>
              </Alert>
            )}

            {/* Actions */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={handleDisconnect}
                sx={{ borderRadius: '12px', flex: 1 }}
              >
                Disconnect
              </Button>
              <Button
                variant="contained"
                onClick={onClose}
                disabled={isWrongNetwork}
                sx={{ 
                  borderRadius: '12px', 
                  flex: 1,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                }}
              >
                Start Trading
              </Button>
            </Box>
          </Box>
        ) : (
          <Box>
            {/* MetaMask Connection */}
            <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
              Connect your wallet to start trading on Savia DEX aggregator
            </Typography>

            <WalletButton
              fullWidth
              onClick={handleConnect}
              disabled={isConnecting}
              startIcon={
                isConnecting ? (
                  <CircularProgress size={20} />
                ) : (
                  <MetaMaskLogo />
                )
              }
              endIcon={<AccountBalanceWalletIcon />}
            >
              {isConnecting ? 'Connecting...' : 'Connect MetaMask'}
            </WalletButton>

            {/* Install MetaMask Link */}
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                Don't have MetaMask?
              </Typography>
              <Button
                variant="text"
                size="small"
                endIcon={<LaunchIcon />}
                href="https://metamask.io/download/"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ textTransform: 'none' }}
              >
                Install MetaMask
              </Button>
            </Box>

            {/* Security Notice */}
            <Alert severity="info" sx={{ mt: 3, borderRadius: '12px' }}>
              <Typography variant="body2">
                Savia never stores your private keys. Your wallet remains fully under your control.
              </Typography>
            </Alert>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};