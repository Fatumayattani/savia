import axios from 'axios';
import { formatEther, parseEther } from 'ethers';

const OKX_BASE_URL = 'https://www.okx.com/api/v5/dex/aggregator';
const OKX_API_KEY = 'eaa7947d-104b-4033-9b86-a0253676338a';
const OKX_SECRET_KEY = '3CDA42067406E59D6FE13A2DCABBB456';

// Create axios instance with authentication headers
const okxApi = axios.create({
  baseURL: OKX_BASE_URL,
  headers: {
    'OK-ACCESS-KEY': OKX_API_KEY,
    'OK-ACCESS-SIGN': OKX_SECRET_KEY,
    'OK-ACCESS-TIMESTAMP': () => Date.now().toString(),
    'OK-ACCESS-PASSPHRASE': 'your-passphrase', // You may need to provide this
    'Content-Type': 'application/json',
  },
});

// Enhanced error handling
class OKXAPIError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'OKXAPIError';
  }
}

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
    const response = await okxApi.get('/quote', {
      params: {
        chainId: params.chainId,
        inTokenAddress: params.inTokenAddress,
        outTokenAddress: params.outTokenAddress,
        amount: params.amount,
        slippage: params.slippage || '0.5',
      },
      timeout: 10000, // 10 second timeout
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
    const response = await okxApi.get('/swap', {
      params: {
        chainId: params.chainId,
        inTokenAddress: params.inTokenAddress,
        outTokenAddress: params.outTokenAddress,
        amount: params.amount,
        slippage: params.slippage || '0.5',
        userWalletAddress: params.userWalletAddress,
      },
      timeout: 15000, // 15 second timeout for swap data
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