import { useState, useEffect } from 'react';
import { BrowserProvider, formatEther, parseEther } from 'ethers';

declare global {
  interface Window {
    ethereum: any;
  }
}

export const useWallet = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [balance, setBalance] = useState<string>('0');
  const [chainId, setChainId] = useState<number | null>(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        const web3Provider = new BrowserProvider(window.ethereum);
        setProvider(web3Provider);
        
        // Get balance
        const balance = await web3Provider.getBalance(accounts[0]);
        setBalance(formatEther(balance));
        
        // Get chain ID
        const network = await web3Provider.getNetwork();
        setChainId(Number(network.chainId));
        
        // Switch to Ethereum mainnet if not already
        if (Number(network.chainId) !== 1) {
          await switchToEthereum();
        }
      } catch (error) {
        console.error("Error connecting to MetaMask:", error);
      }
    } else {
      alert('Please install MetaMask to use this wallet!');
    }
  };

  const switchToEthereum = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x1' }], // Ethereum mainnet
      });
    } catch (error: any) {
      console.error('Error switching to Ethereum:', error);
    }
  };

  const executeSwap = async (swapData: any) => {
    if (!provider || !account) {
      throw new Error('Wallet not connected');
    }

    try {
      const signer = await provider.getSigner();
      
      const transaction = {
        to: swapData.to,
        data: swapData.data,
        value: swapData.value,
        gasLimit: swapData.gasLimit,
        gasPrice: swapData.gasPrice,
      };

      const tx = await signer.sendTransaction(transaction);
      return tx;
    } catch (error) {
      console.error('Error executing swap:', error);
      throw error;
    }
  };

  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          const web3Provider = new BrowserProvider(window.ethereum);
          setProvider(web3Provider);
          
          const balance = await web3Provider.getBalance(accounts[0]);
          setBalance(formatEther(balance));
          
          const network = await web3Provider.getNetwork();
          setChainId(Number(network.chainId));
        }
      }
    };
    checkConnection();

    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          setAccount(null);
          setProvider(null);
          setBalance('0');
          setChainId(null);
        } else {
          setAccount(accounts[0]);
        }
      });

      window.ethereum.on('chainChanged', (chainId: string) => {
        setChainId(parseInt(chainId, 16));
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');
      }
    };
  }, []);

  return { 
    account, 
    provider, 
    balance, 
    chainId, 
    connectWallet, 
    executeSwap,
    switchToEthereum 
  };
};