import { PagesLabel } from "../interfaces/components";

export const WALLETS_ID = {
  metamask: {
    id: "1xmeta",
    label: "metamask",
  },
  trustWallet: {
    id: "1xtrust",
    label: "trustWallet",
  },
  coinbase: {
    id: "1xcoin",
    label: "coinbase",
  },
};

export const CONTRACT_SPIRIT = "0x5Cc61A78F164885776AA610fb0FE1257df78E59B";

export const NETWORKS_ID = {
  ethereum: {
    id: "0x1",
    label: "Ethereum",
  },
  fantom: {
    id: "0xfa",
    label: "Fantom",
  },
  binance: {
    id: "0x38",
    label: "Binance",
  },
};

export const NATIVES_TOKENS = {
  1: "ETH",
  56: "BNB",
  250: "FTM",
};

export const PAGES: PagesLabel[] = [
  {
    id: "1-home",
    label: "Home",
    path: "/",
  },
  {
    id: "2-swap",
    label: "Swap",
    path: "/Swap",
  },
  {
    id: "3-limit",
    label: "Limit",
    path: "/Limit",
  },
];

export const NETWORKS_LIST = [
  NETWORKS_ID.ethereum,
  NETWORKS_ID.fantom,
  NETWORKS_ID.binance,
];
export const WALLETS_LIST = [
  WALLETS_ID.metamask,
  WALLETS_ID.trustWallet,
  WALLETS_ID.coinbase,
];

export const DEFAULT_NETWORK = NETWORKS_ID.fantom;
export const DEFAULT_WALLET = WALLETS_ID.metamask;

export const API_COVALENT = "https://api.covalenthq.com/v1";
export const API_COINMARKET =
  "https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest";
export const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";
export const AMOUNT_ZERO = "0";
export const networksColors = {
  1: {
    // ETH
    font: "rgba(57, 57, 57, 1)",
    bg: "rgba(57, 57, 57, 0.25)",
  },
  10: {
    // OPTIMISTIC
    font: "rgba(255, 4, 32, 1)",
    bg: "rgba(255, 4, 32, 0.25)",
  },
  56: {
    // BSC
    font: "rgba(243, 186, 47, 1)",
    bg: "rgba(243, 186, 47, 0.25)",
  },
  100: {
    // GNOSIS
    font: "rgba(0, 166, 196, 1)",
    bg: "rgba(0, 166, 196, 0.25)",
  },
  137: {
    // POLYGON
    font: "rgba(130, 71, 230, 1)",
    bg: "rgba(130, 71, 230, 0.25)",
  },
  250: {
    // FANTOM
    font: "rgba(19, 181, 236, 1)",
    bg: "rgba(19, 181, 236, 0.25)",
  },
  42161: {
    // ARB
    font: "rgba(40, 160, 240, 1)",
    bg: "rgba(40, 160, 240, 0.25)",
  },
  43114: {
    // AVL
    font: "rgba(232, 65, 66, 1)",
    bg: "rgba(232, 65, 66, 0.25)",
  },
};

export enum ROLE {
  standard,
  premium,
}

export const PRINCIPAL_TOKENS = ["SPIRIT", "BOO", "ETH", "BNB", "FTM"];
export const PRINCIPAL_DEFAULT = {
  ETH: { USD: 0, USD_24h: 0 },
  SPIRIT: { USD: 0, USD_24h: 0 },
  BOO: { USD: 0, USD_24h: 0 },
  BNB: { USD: 0, USD_24h: 0 },
  FTM: { USD: 0, USD_24h: 0 },
};
export const NATIVE_TOKENS = {
  1: "ETH",
  56: "BNB",
  250: "FTM",
};
