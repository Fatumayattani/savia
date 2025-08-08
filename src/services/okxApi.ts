import axios from 'axios';

const OKX_BASE_URL = 'https://www.okx.com/api/v5/dex/aggregator';

interface QuoteParams {
  chainId: number;
  inTokenAddress: string;
  outTokenAddress: string;
  amount: string;
}

interface QuoteResponse {
  data: {
    price: string;
    minAmountOut: string;
    route: any[];
    // Add other fields as needed
  };
}

export const getQuote = async (params: QuoteParams): Promise<QuoteResponse> => {
  const response = await axios.get(`${OKX_BASE_URL}/quote`, {
    params: {
      chainId: params.chainId,
      inTokenAddress: params.inTokenAddress,
      outTokenAddress: params.outTokenAddress,
      amount: params.amount,
    },
  });
  return response.data;
};