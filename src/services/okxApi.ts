import axios from 'axios';

const OKX_BASE_URL = 'https://www.okx.com/api/v5/dex/aggregator';

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
    const response = await axios.get(`${OKX_BASE_URL}/quote`, {
      params: {
        chainId: params.chainId,
        inTokenAddress: params.inTokenAddress,
        outTokenAddress: params.outTokenAddress,
        amount: params.amount,
        slippage: params.slippage || '0.5', // Default 0.5% slippage
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching quote:', error);
    throw new Error('Failed to fetch quote from OKX DEX API');
  }
};

export const getSwapData = async (params: SwapParams): Promise<SwapResponse> => {
  try {
    const response = await axios.get(`${OKX_BASE_URL}/swap`, {
      params: {
        chainId: params.chainId,
        inTokenAddress: params.inTokenAddress,
        outTokenAddress: params.outTokenAddress,
        amount: params.amount,
        slippage: params.slippage || '0.5',
        userWalletAddress: params.userWalletAddress,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching swap data:', error);
    throw new Error('Failed to fetch swap data from OKX DEX API');
  }
};

// Token addresses for Ethereum mainnet
export const TOKENS = {
  ETH: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
  USDC: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  USDT: '0xdac17f958d2ee523a2206206994597c13d831ec7',
  WETH: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  DAI: '0x6b175474e89094c44da98b954eedeac495271d0f',
};

export const TOKEN_DECIMALS = {
  ETH: 18,
  USDC: 6,
  USDT: 6,
  WETH: 18,
  DAI: 18,
};