export const NETWORKS = {
  "0x1": {
    chainId: 1,
    chainName: "Ethereum",
    hex: "0x1",
    rpcUrls: ["https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"],
    name: "Ethereum",
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
    blockExplorerUrls: ["https://etherscan.io/"],
    label: "Ethereum",
  },

  "0x38": {
    chainId: 56,
    chainName: "Binance Smart Chain Mainnet",
    hex: "0x38",
    rpcUrls: ["https://bsc-dataseed.binance.org/"],
    nativeCurrency: {
      name: "BSC",
      symbol: "BNB",
      decimals: 18,
    },
    blockExplorerUrls: ["https://bscscan.com"],
    label: "Binance",
  },
  "0xfa": {
    chainId: 250,
    chainName: "Fantom Opera",
    hex: "0xfa",
    rpcUrls: ["https://rpc.ankr.com/fantom/"],
    nativeCurrency: {
      name: "Fantom",
      symbol: "FTM",
      decimals: 18,
    },
    blockExplorerUrls: ["https://ftmscan.com/"],
    label: "Fantom",
  },
};

export const hexToNumber = {
  1: "0x1",
  56: "0x38",
  250: "0xfa",
};
