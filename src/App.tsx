import React, { useState } from 'react';
import { useWallet } from './hooks/useWallet';
import { LandingPage } from './components/LandingPage';
import { TradingInterface } from './components/TradingInterface';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Alert, Snackbar } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#667eea',
    },
    secondary: {
      main: '#764ba2',
    },
    success: {
      main: '#10b981',
    },
    warning: {
      main: '#f59e0b',
    },
    error: {
      main: '#ef4444',
    },
    background: {
      default: '#f8fafc',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 800,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 700,
    },
  },
  shape: {
    borderRadius: 16,
  },
});

const App: React.FC = () => {
  const { 
    account, 
    provider, 
    balance, 
    chainId, 
    isConnecting,
    walletError,
    connectWallet, 
    disconnectWallet,
    switchToEthereum,
    executeSwap,
    checkMetaMaskInstalled,
    clearWalletError,
  } = useWallet();
  
  const [showTrading, setShowTrading] = useState(false);

  const handleConnect = async () => {
    try {
      if (!checkMetaMaskInstalled()) {
        return;
      }
      await connectWallet();
    } catch (error: any) {
      // Error is already handled in useWallet hook
    }
  };

  const handleSwitchNetwork = async () => {
    try {
      await switchToEthereum();
    } catch (error: any) {
      // Error is already handled in useWallet hook
    }
  };

  const handleGetStarted = () => {
    if (account) {
      if (chainId === 1) {
        setShowTrading(true);
      } else {
        // This will be handled by the network check in the component
      }
    } else {
      handleConnect();
    }
  };

  const handleBackToLanding = () => {
    setShowTrading(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {showTrading ? (
        <TradingInterface 
          account={account} 
          provider={provider} 
          balance={balance}
          chainId={chainId}
          executeSwap={executeSwap}
          onBack={handleBackToLanding}
        />
      ) : (
        <LandingPage 
          account={account}
          chainId={chainId}
          isConnecting={isConnecting}
          onConnect={handleConnect}
          onSwitchNetwork={handleSwitchNetwork}
          onDisconnect={disconnectWallet}
          onGetStarted={handleGetStarted}
        />
      )}

      {/* Global Error Notification */}
      <Snackbar 
        open={!!walletError} 
        autoHideDuration={6000} 
        onClose={clearWalletError}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={clearWalletError} 
          severity="error" 
          sx={{ borderRadius: '12px', maxWidth: '400px' }}
        >
          {walletError}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
};

export default App;