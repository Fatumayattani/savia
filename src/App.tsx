import React, { useState } from 'react';
import { useWallet } from './hooks/useWallet';
import { LandingPage } from './components/LandingPage';
import { TradingInterface } from './components/TradingInterface';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
  palette: {
    primary: {
      main: '#667eea',
    },
    secondary: {
      main: '#764ba2',
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
  const { account, provider, balance, chainId, connectWallet, executeSwap } = useWallet();
  const [showTrading, setShowTrading] = useState(false);

  const handleGetStarted = () => {
    if (account) {
      setShowTrading(true);
    } else {
      connectWallet();
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
          onConnect={connectWallet}
          onGetStarted={handleGetStarted}
        />
      )}
    </ThemeProvider>
  );
};

export default App;