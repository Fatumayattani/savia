import React from 'react';
import Button from '@mui/material/Button';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

interface ConnectWalletButtonProps {
  account: string | null;
  onConnect: () => void;
}

export const ConnectWalletButton: React.FC<ConnectWalletButtonProps> = ({ account, onConnect }) => {
  return (
    <Button
      variant="contained"
      color={account ? 'success' : 'primary'}
      startIcon={<AccountBalanceWalletIcon />}
      onClick={onConnect}
    >
      {account ? `Connected: ${account.substring(0, 6)}...${account.substring(38)}` : 'Connect Wallet'}
    </Button>
  );
};