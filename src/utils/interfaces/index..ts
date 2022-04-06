import { ChangeEvent } from "react";

export interface Token {
  name: string;
  address: string;
  symbol: string;
  decimals: number;
  path: string;
  id_coinMarket: number;
}

export interface PricesApiDB {
  path: string;
  price: number;
  price24: number;
}

export interface TokenPortfolio extends Token {
  balance: string;
  balance_24h: string;
  usd: number;
  usd_24h: number;
  type: string;
}

export interface CovalentApi {
  account: string;
  chainID: number;
}

export interface CoinMarket {
  id: number;
  symbol: string;
  quote: {
    USD: {
      price: number;
      percent_change_24h: number;
    };
  };
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
export interface FarmsPortfolio extends Farm {
  usd: string;
  staked: string;
  earns: string;
  totalSupply: string;
}

export interface SearchInputProps {
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  value: string;
  onToggle: () => void;
  isVisible: boolean;
  type: string;
}
