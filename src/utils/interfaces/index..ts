export interface Token {
  name: string;
  address: string;
  symbol: string;
  decimals: number;
  pathCoingecko: string;
}

export interface TokenPortfolio extends Token {
  balance: string;
  balance_24h: string;
  logo_url: string;
  usd: number;
  usd_24h: number;
  type: string;
}

export interface CovalentApi {
  account: string;
  chainID: number;
}

export interface CovalentData {
  balance: string;
  balance_24h: string;
  contract_address: string;
  contract_decimals: number;
  contract_name: string;
  contract_ticker_symbol: string;
  last_transferred_at: string;
  logo_url: string;
  quote: number;
  quote_24h: number;
  quote_rate: number;
  quote_rate_24h: number;
  type: string;
}
export interface NetworkProps {
  chainId: number;
  chainName: string;
  hex: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: 18;
  };
  rpcUrls: string[];
  blockExplorerUrls?: string[];
  label: string;
  iconUrls?: string[];
}

export interface Farm {
  pid: number;
  lpSymbol: string[];
  lpAddresses: {
    250: string;
  };
  gaugeAddress: string;
}

export interface FarmContract extends Farm {
  staked: string;
  earns: string;
}
export interface FarmsPortfolio extends FarmContract {
  usd: number;
  totalSupply: string;
  liquidity_rate: number;
}

export interface CovalentPool {
  chain_id: string;
  exchange: string;
  fee_24h_quote: number;
  quote_rate: number;
  token_0: CovalentData;
  token_1: CovalentData;
  swap_count_24h: number;
  total_liquidity_quote: number;
  total_supply: string;
  volume_7d_quote: number;
  volume_24h_quote: number;
}
