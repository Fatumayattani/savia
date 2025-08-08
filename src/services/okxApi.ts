import axios from 'axios';
import { formatEther, parseEther, formatUnits } from 'ethers';
import CryptoJS from 'crypto-js';

const OKX_BASE_URL = 'https://www.okx.com';

// Enhanced error handling
class OKXAPIError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'OKXAPIError';
  }
}

// Generate OKX API signature according to their documentation
const generateSignature = (timestamp: string, method: string, requestPath: string, body: string = '', secretKey: string) => {
  const message = timestamp + method + requestPath + body;
  return CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA256(message, secretKey));
};

// Create OKX request with proper authentication
const createOKXRequest = async (method: string, endpoint: string, params?: any) => {
  const apiKey = process.env.REACT_APP_OKX_API_KEY;
  const secretKey = process.env.REACT_APP_OKX_SECRET_KEY;
  const passphrase = process.env.REACT_APP_OKX_PASSPHRASE;
  
  if (!apiKey || !secretKey) {
    throw new Error('OKX API credentials not found in environment variables');
  }

  const timestamp = new Date().toISOString();
  const requestPath = '/api/v5/dex/aggregator' + endpoint;
  const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
  const fullPath = requestPath + queryString;
  
  const signature = generateSignature(timestamp, method.toUpperCase(), fullPath, '', secretKey);

  return axios({
    method,
    url: OKX_BASE_URL + fullPath,
    params,
    headers: {
      'OK-ACCESS-KEY': apiKey,
      'OK-ACCESS-SIGN': signature,
      'OK-ACCESS-TIMESTAMP': timestamp,
      'OK-ACCESS-PASSPHRASE': passphrase,
      'Content-Type': 'application/json',
    },
    timeout: 10000,
  });
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

export const getQuote = async (params: QuoteParams): Promise<QuoteResponse> => {
  try {
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
    console.error('Error fetching quote:', error);
    
    if (error instanceof OKXAPIError) {
      throw error;
    }
    
    if (error.code === 'ECONNABORTED') {
      throw new OKXAPIError('Request timeout. Please try again.');
    }
    
    if (error.response?.status === 401) {
      throw new OKXAPIError('API authentication failed. Please check your API credentials.');
    }
    
    if (error.response?.status === 429) {
      throw new OKXAPIError('Rate limit exceeded. Please wait a moment and try again.');
    }
    
    if (error.response?.status >= 500) {
      throw new OKXAPIError('OKX API is temporarily unavailable. Please try again later.');
    }
    
    throw new OKXAPIError('Failed to fetch quote. Please check your connection and try again.');
  }
};

export const getSwapData = async (params: SwapParams): Promise<SwapResponse> => {
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
    console.error('Error fetching swap data:', error);
    
    if (error instanceof OKXAPIError) {
      throw error;
    }
    
    if (error.code === 'ECONNABORTED') {
      throw new OKXAPIError('Request timeout. Please try again.');
    }
    
    throw new OKXAPIError('Failed to fetch swap data. Please try again.');
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