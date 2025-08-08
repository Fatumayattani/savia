import axios from 'axios';
import { formatEther, parseEther, formatUnits } from 'ethers';
import CryptoJS from 'crypto-js';

const OKX_BASE_URL = 'https://www.okx.com/api/v5/dex/aggregator';

// OKX API Configuration
const OKX_CONFIG = {
  apiKey: process.env.REACT_APP_OKX_API_KEY || '',
  secretKey: process.env.REACT_APP_OKX_SECRET_KEY || '',
  passphrase: process.env.REACT_APP_OKX_PASSPHRASE || '',
};

// Check if API credentials are configured
const hasValidCredentials = () => {
  return OKX_CONFIG.apiKey && OKX_CONFIG.secretKey && OKX_CONFIG.passphrase;
};

// Generate OKX API signature
const generateSignature = (timestamp: string, method: string, requestPath: string, body: string = '') => {
  const message = timestamp + method + requestPath + body;
  return CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA256(message, OKX_CONFIG.secretKey));
};

// Enhanced error handling
class OKXAPIError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'OKXAPIError';
  }
}

// Create authenticated OKX request
const createOKXRequest = async (method: string, endpoint: string, params?: any) => {
  const timestamp = new Date().toISOString();
  const requestPath = endpoint + (params ? '?' + new URLSearchParams(params).toString() : '');
  const signature = generateSignature(timestamp, method.toUpperCase(), requestPath);

  try {
    const response = await axios({
      method,
      url: OKX_BASE_URL + endpoint,
      params,
      headers: {
        'OK-ACCESS-KEY': OKX_CONFIG.apiKey,
        'OK-ACCESS-SIGN': signature,
        'OK-ACCESS-TIMESTAMP': timestamp,
        'OK-ACCESS-PASSPHRASE': OKX_CONFIG.passphrase,
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });
    
    return response;
  } catch (error: any) {
    console.error('OKX API Error:', error.response?.data || error.message);
    
    if (error.response?.status === 401 || error.response?.status === 403) {
      throw new OKXAPIError('API authentication failed. Please check your credentials.');
    }
    if (error.response?.status === 429) {
      throw new OKXAPIError('Rate limit exceeded. Please try again in a moment.');
    }
    throw error;
  }
};

interface QuoteParams {
  chainId: number;
  inTokenAddress: string;
  outTokenAddress: string;
  amount: string;
  slippage?: string;
}

interface SwapParams extends QuoteParams {
  userWalletAddress: string;
}

interface QuoteResponse {
  code: string;
  msg: string;
  data: [{
    chainId: string;
    inTokenAddress: string;
    outTokenAddress: string;
    inTokenSymbol: string;
    outTokenSymbol: string;
    inAmount: string;
    outAmount: string;
    estimatedGas: string;
    minAmountOut: string;
    router: string;
    routerStr: string;
    subRouters: any[];
    feeAmount: string;
    earningAmount: string;
    priceImpactPercentage: string;
  }];
}

interface SwapResponse {
  code: string;
  msg: string;
  data: [{
    tx: {
      to: string;
      data: string;
      value: string;
      gas: string;
      gasPrice: string;
    };
  }];
}

// Fallback function to simulate quote when API is not available
const generateMockQuote = (params: QuoteParams): QuoteResponse => {
  const fromToken = Object.values(TOKENS).find(t => t.address.toLowerCase() === params.inTokenAddress.toLowerCase());
  const toToken = Object.values(TOKENS).find(t => t.address.toLowerCase() === params.outTokenAddress.toLowerCase());
  
  // Simple mock conversion rates (for demo purposes)
  const mockRates: { [key: string]: number } = {
    'ETH-USDC': 2000,
    'ETH-USDT': 2000,
    'ETH-DAI': 2000,
    'USDC-ETH': 0.0005,
    'USDT-ETH': 0.0005,
    'DAI-ETH': 0.0005,
    'USDC-USDT': 1,
    'USDT-USDC': 1,
  };
  
  const rateKey = `${fromToken?.symbol}-${toToken?.symbol}`;
  const rate = mockRates[rateKey] || 1;
  
  const inAmountFormatted = formatTokenAmount(params.amount, fromToken?.decimals || 18);
  const outAmountRaw = parseFloat(inAmountFormatted) * rate;
  const outAmount = parseTokenAmount(outAmountRaw.toString(), toToken?.decimals || 18);
  
  return {
    code: '0',
    msg: 'Success (Demo Mode)',
    data: [{
      chainId: params.chainId.toString(),
      inTokenAddress: params.inTokenAddress,
      outTokenAddress: params.outTokenAddress,
      inTokenSymbol: fromToken?.symbol || 'UNKNOWN',
      outTokenSymbol: toToken?.symbol || 'UNKNOWN',
      inAmount: params.amount,
      outAmount: outAmount,
      estimatedGas: parseEther('0.002').toString(), // Mock gas estimate
      minAmountOut: (parseFloat(outAmount) * 0.995).toString(),
      router: 'Demo Router',
      routerStr: 'Savia Demo',
      subRouters: [],
      feeAmount: '0',
      earningAmount: '0',
      priceImpactPercentage: '0.1',
    }]
  };
};

export const getQuote = async (params: QuoteParams): Promise<QuoteResponse> => {
  // If no valid credentials, use demo mode
  if (!hasValidCredentials()) {
    console.warn('OKX API credentials not configured, using demo mode');
    return generateMockQuote(params);
  }

  try {
    // First try the real OKX API
    const response = await createOKXRequest('GET', '/quote', {
      chainId: params.chainId,
      inTokenAddress: params.inTokenAddress,
      outTokenAddress: params.outTokenAddress,
      amount: params.amount,
      slippage: params.slippage || '0.5',
    });

    if (response.data.code !== '0') {
      throw new OKXAPIError(response.data.msg || 'Failed to get quote', response.data.code);
    }

    return response.data;
  } catch (error: any) {
    // Check if it's an authentication error
    if (error.response?.data?.code === '50114' || error.response?.status === 401 || error.response?.status === 403) {
      console.warn('OKX API authentication failed, using demo mode. Please check your API credentials.');
    } else {
      console.warn('OKX API not available, using demo mode:', error.message);
    }
    
    // Return mock quote for demo purposes
    return generateMockQuote(params);
  }
};

export const getSwapData = async (params: SwapParams): Promise<SwapResponse> => {
  // If no valid credentials, throw error for swap execution
  if (!hasValidCredentials()) {
    throw new OKXAPIError('API credentials not configured. Swap execution requires valid OKX API credentials.');
  }

  try {
    const response = await createOKXRequest('GET', '/swap', {
      chainId: params.chainId,
      inTokenAddress: params.inTokenAddress,
      outTokenAddress: params.outTokenAddress,
      amount: params.amount,
      slippage: params.slippage || '0.5',
      userWalletAddress: params.userWalletAddress,
    });

    if (response.data.code !== '0') {
      throw new OKXAPIError(response.data.msg || 'Failed to get swap data', response.data.code);
    }

    return response.data;
  } catch (error: any) {
    if (error.response?.data?.code === '50114' || error.response?.status === 401 || error.response?.status === 403) {
      throw new OKXAPIError('API authentication failed. Please check your OKX API credentials.');
    }
    
    console.error('Error getting swap data:', error);
    throw new OKXAPIError(error.response?.data?.msg || error.message || 'Failed to get swap transaction data');
  }
};

// Supported tokens on Ethereum mainnet
export const TOKENS = {
  ETH: {
    address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    symbol: 'ETH',
    name: 'Ethereum',
    decimals: 18,
    logoURI: 'https://tokens.1inch.io/0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.png',
  },
  USDC: {
    address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    logoURI: 'https://tokens.1inch.io/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png',
  },
  USDT: {
    address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    symbol: 'USDT',
    name: 'Tether USD',
    decimals: 6,
    logoURI: 'https://tokens.1inch.io/0xdac17f958d2ee523a2206206994597c13d831ec7.png',
  },
  DAI: {
    address: '0x6b175474e89094c44da98b954eedeac495271d0f',
    symbol: 'DAI',
    name: 'Dai Stablecoin',
    decimals: 18,
    logoURI: 'https://tokens.1inch.io/0x6b175474e89094c44da98b954eedeac495271d0f.png',
  },
  WETH: {
    address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    symbol: 'WETH',
    name: 'Wrapped Ether',
    decimals: 18,
    logoURI: 'https://tokens.1inch.io/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.png',
  },
};

export const SUPPORTED_CHAINS = {
  1: {
    name: 'Ethereum Mainnet',
    rpcUrl: 'https://mainnet.infura.io/v3/',
    blockExplorerUrl: 'https://etherscan.io',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
  },
};

export const formatTokenAmount = (amount: string, decimals: number): string => {
  try {
    if (decimals === 18) {
      return formatEther(amount);
    } else {
      // For tokens with different decimals (like USDC/USDT with 6 decimals)
      const divisor = Math.pow(10, decimals);
      return (parseFloat(amount) / divisor).toString();
    }
  } catch (error) {
    console.error('Error formatting token amount:', error);
    return '0';
  }
};

export const parseTokenAmount = (amount: string, decimals: number): string => {
  try {
    if (decimals === 18) {
      return parseEther(amount).toString();
    } else {
      // For tokens with different decimals
      const multiplier = Math.pow(10, decimals);
      return Math.floor(parseFloat(amount) * multiplier).toString();
    }
  } catch (error) {
    console.error('Error parsing token amount:', error);
    return '0';
  }
};