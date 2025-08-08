import React, { useState } from 'react';
import { useWallet } from './hooks/useWallet';
import { ConnectWalletButton } from './components/ConnectWalletButton';
import { SwapForm } from './components/SwapForm';
import { QuoteDisplay } from './components/QuoteDisplay';
import { getQuote } from './services/okxApi';
import { ethers } from 'ethers';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const ETH_ADDRESS = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';
const USDC_ADDRESS = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'; // Mainnet USDC

const App: React.FC = () => {
  const { account, provider, connectWallet } = useWallet();
  const [quote, setQuote] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetQuote = async (amount: string) => {
    if (!account || !provider) {
      setError('Please connect your wallet first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const amountInWei = ethers.utils.parseEther(amount).toString();
      const quoteResponse = await getQuote({
        chainId: 1, // Ethereum mainnet
        inTokenAddress: ETH_ADDRESS,
        outTokenAddress: USDC_ADDRESS,
        amount: amountInWei,
      });
      setQuote(quoteResponse);
    } catch (err) {
      console.error('Error fetching quote:', err);
      setError('Failed to fetch quote. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Smart DEX Wallet
        </Typography>
        <ConnectWalletButton account={account} onConnect={connectWallet} />
      </Box>

      {account && (
        <>
          <SwapForm onSubmit={handleGetQuote} loading={loading} />
          <QuoteDisplay quote={quote} loading={loading} error={error} />
        </>
      )}
    </Container>
  );
};

export default App;