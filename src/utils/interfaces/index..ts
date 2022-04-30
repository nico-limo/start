import { BigNumber } from "ethers";
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
  usd: number;
  usd_24h_change: number;
}

export interface TokenPortfolio extends Token {
  balance: string;
  balance_24h: string;
  usd: number;
  usd_24h: number;
  type: string;
  protocol?: string;
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
  investAddress: string;
}

export interface TransactionResponse {
  hash: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  wait: any;
}

export interface FarmActions {
  getRewards: () => Promise<TransactionResponse>;
  withdrawAll: () => Promise<TransactionResponse>;
  depositAll: () => Promise<TransactionResponse>;
}
export interface FarmsLiquidity extends Farm {
  hasBalance: boolean;
  depositAll: () => Promise<TransactionResponse>;
  allowance: BigNumber;
  approve: () => Promise<TransactionResponse>;
}

export interface FarmsPortfolio extends Farm {
  usd: string;
  staked: string;
  earns: string;
  totalSupply: string;
  actions: FarmActions;
}

export interface SearchInputProps {
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  value: string;
  onToggle: () => void;
  isVisible: boolean;
  type: string;
}

export interface PrincipalTokensProps {
  ETH: { USD: number; USD_24h: number };
  SPIRIT: { USD: number; USD_24h: number };
  BOO: { USD: number; USD_24h: number };
  BNB: { USD: number; USD_24h: number };
  FTM: { USD: number; USD_24h: number };
}

export interface OptionsActionsProps {
  header: string;
  options: optionProps[];
}

interface optionProps {
  label: string;
  id: string;
  icon: JSX.Element;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  action: () => any;
}

export interface ScanProps {
  scanName: string;
  scanPath: string;
}

export interface ProtocolProps {
  symbol: string;
  farm: string;
  earnToken: string;
}

export interface TokenInfoProps {
  title: string;
  placeholder: string;
  list: string;
  label_asset: string;
}

export interface LabelProps {
  token: TokenPortfolio;
  showBalance: boolean;
  type: TokenInfoProps;
}
