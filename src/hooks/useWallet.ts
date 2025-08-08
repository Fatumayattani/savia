import { useState, useEffect, useCallback } from 'react';
import { BrowserProvider, formatEther, parseEther } from 'ethers';

declare global {
  interface Window {
    ethereum: any;
  }
}

interface WalletState {
  account: string | null;
  provider: BrowserProvider | null;
  balance: string;
  chainId: number | null;
  isConnecting: boolean;
  isConnected: boolean;
}

export const useWallet = () => {
  const [walletState, setWalletState] = useState<WalletState>({
    account: null,
    provider: null,
    balance: '0',
    chainId: null,
    isConnecting: false,
    isConnected: false,
  });

  const updateBalance = useCallback(async (provider: BrowserProvider, account: string) => {
    try {
      const balance = await provider.getBalance(account);
      setWalletState(prev => ({ ...prev, balance: formatEther(balance) }));
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  }, []);

  const checkMetaMaskInstalled = () => {
    return typeof window !== 'undefined' && window.ethereum && window.ethereum.isMetaMask;
  };

  const connectWallet = async () => {
    if (!checkMetaMaskInstalled()) {
      throw new Error('MetaMask is not installed. Please install MetaMask to continue.');
    }

    setWalletState(prev => ({ ...prev, isConnecting: true }));

    try {
      // Request account access
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });

      if (accounts.length === 0) {
        throw new Error('No accounts found. Please unlock MetaMask.');
      }

      const web3Provider = new BrowserProvider(window.ethereum);
      const network = await web3Provider.getNetwork();
      const chainId = Number(network.chainId);

      setWalletState(prev => ({
        ...prev,
        account: accounts[0],
        provider: web3Provider,
        chainId,
        isConnected: true,
      }));

      // Update balance
      await updateBalance(web3Provider, accounts[0]);

      // Switch to Ethereum mainnet if not already
      if (chainId !== 1) {
        await switchToEthereum();
      }

      return accounts[0];
    } catch (error: any) {
      console.error('Error connecting to MetaMask:', error);
      if (error.code === 4001) {
        throw new Error('Connection rejected by user');
      } else if (error.code === -32002) {
        throw new Error('Connection request already pending. Please check MetaMask.');
      }
      throw error;
    } finally {
      setWalletState(prev => ({ ...prev, isConnecting: false }));
    }
  };

  const disconnectWallet = () => {
    setWalletState({
      account: null,
      provider: null,
      balance: '0',
      chainId: null,
      isConnecting: false,
      isConnected: false,
    });
  };

  const switchToEthereum = async () => {
    if (!checkMetaMaskInstalled()) {
      throw new Error('MetaMask is not installed');
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x1' }], // Ethereum mainnet
      });
    } catch (error: any) {
      console.error('Error switching to Ethereum:', error);
      if (error.code === 4902) {
        throw new Error('Ethereum mainnet is not added to MetaMask');
      } else if (error.code === 4001) {
        throw new Error('Network switch rejected by user');
      }
      throw error;
    }
  };

  const addTokenToWallet = async (tokenAddress: string, tokenSymbol: string, tokenDecimals: number) => {
    if (!checkMetaMaskInstalled()) {
      throw new Error('MetaMask is not installed');
    }

    try {
      await window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: tokenAddress,
            symbol: tokenSymbol,
            decimals: tokenDecimals,
          },
        },
      });
    } catch (error) {
      console.error('Error adding token to wallet:', error);
      throw error;
    }
  };

  const executeSwap = async (swapData: any) => {
    if (!walletState.provider || !walletState.account) {
      throw new Error('Wallet not connected');
    }

    if (walletState.chainId !== 1) {
      throw new Error('Please switch to Ethereum mainnet');
    }

    try {
      const signer = await walletState.provider.getSigner();
      
      const transaction = {
        to: swapData.to,
        data: swapData.data,
        value: swapData.value,
        gasLimit: swapData.gas,
        gasPrice: swapData.gasPrice,
      };

      const tx = await signer.sendTransaction(transaction);
      
      // Wait for transaction confirmation
      const receipt = await tx.wait();
      
      // Update balance after successful swap
      if (walletState.account) {
        await updateBalance(walletState.provider, walletState.account);
      }
      
      return { tx, receipt };
    } catch (error: any) {
      console.error('Error executing swap:', error);
      if (error.code === 4001) {
        throw new Error('Transaction rejected by user');
      } else if (error.code === 'INSUFFICIENT_FUNDS') {
        throw new Error('Insufficient funds for transaction');
      } else if (error.code === 'UNPREDICTABLE_GAS_LIMIT') {
        throw new Error('Cannot estimate gas. Transaction may fail.');
      }
      throw error;
    }
  };

  // Check for existing connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      if (!checkMetaMaskInstalled()) return;

      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        
        if (accounts.length > 0) {
          const web3Provider = new BrowserProvider(window.ethereum);
          const network = await web3Provider.getNetwork();
          const chainId = Number(network.chainId);

          setWalletState(prev => ({
            ...prev,
            account: accounts[0],
            provider: web3Provider,
            chainId,
            isConnected: true,
          }));

          await updateBalance(web3Provider, accounts[0]);
        }
      } catch (error) {
        console.error('Error checking connection:', error);
      }
    };

    checkConnection();
  }, [updateBalance]);

  // Listen for MetaMask events
  useEffect(() => {
    if (!checkMetaMaskInstalled()) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else if (accounts[0] !== walletState.account) {
        setWalletState(prev => ({ ...prev, account: accounts[0] }));
        if (walletState.provider) {
          updateBalance(walletState.provider, accounts[0]);
        }
      }
    };

    const handleChainChanged = (chainId: string) => {
      const newChainId = parseInt(chainId, 16);
      setWalletState(prev => ({ ...prev, chainId: newChainId }));
    };

    const handleConnect = (connectInfo: { chainId: string }) => {
      console.log('MetaMask connected:', connectInfo);
    };

    const handleDisconnect = () => {
      disconnectWallet();
    };

    // Add event listeners
    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);
    window.ethereum.on('connect', handleConnect);
    window.ethereum.on('disconnect', handleDisconnect);

    // Cleanup listeners
    return () => {
      if (window.ethereum && window.ethereum.removeListener) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
        window.ethereum.removeListener('connect', handleConnect);
        window.ethereum.removeListener('disconnect', handleDisconnect);
      }
    };
  }, [walletState.account, walletState.provider, updateBalance]);

  return {
    ...walletState,
    connectWallet,
    disconnectWallet,
    switchToEthereum,
    addTokenToWallet,
    executeSwap,
    checkMetaMaskInstalled,
  };
};