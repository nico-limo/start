import { ethers, FixedNumber } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import { NETWORKS_ID } from "./constants";
import { hexToNumber, NETWORKS } from "./constants/networks";
import { NetworkProps } from "./interfaces/index.";

export const formatTokenAmount = (
  amount: string,
  decimals: number,
  trunc: number = decimals
) => {
  try {
    if (amount === "Not Connected" || amount === "") return "loading";
    const amountFormatted = formatUnits(amount, decimals);
    return FixedNumber.fromString(amountFormatted).round(trunc).toString();
  } catch (error) {
    console.log("ether format ", error);
  }
};

export const getUSDBalance = (balance: string, price: number, round = 2) => {
  try {
    if (balance === "loading") return "0.00";
    const fixedBalance = FixedNumber.fromString(balance);
    const fixedPrice = FixedNumber.fromString(price.toString());
    const balacneUSD = fixedBalance
      .mulUnsafe(fixedPrice)
      .round(round)
      .toString();
    return balacneUSD;
  } catch (error) {
    console.log("error format USD amount ", error);
    return "0.00";
  }
};

export const walletConnect = async () => {
  if (window.ethereum) {
    const [account] = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    return account;
  }
};

export const networkConnection = async (
  hexId: string = NETWORKS_ID.fantom.id
) => {
  if (window.ethereum) {
    const provider = await new ethers.providers.Web3Provider(
      window.ethereum,
      "any"
    );
    const { chainId } = await provider.getNetwork();
    const currentChainId: number = hexToNumber[hexId];
    if (chainId === currentChainId) return;
    await setupNetwork(hexId);
    return null;
  }
};

export const setupNetwork = async (hexId = NETWORKS_ID.fantom.id) => {
  const provider = window.ethereum;
  const {
    chainName,
    hex,
    rpcUrls,
    nativeCurrency,
    blockExplorerUrls,
  }: NetworkProps = NETWORKS[hexId];
  const params = {
    chainId: hex,
    chainName,
    rpcUrls,
    nativeCurrency,
    blockExplorerUrls,
  };
  if (provider) {
    try {
      await provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `${params.chainId}` }],
      });
    } catch (e) {
      if (e.code === 4902) {
        await provider.request({
          method: "wallet_addEthereumChain",
          params: [params],
        });
      } else {
        console.log("error setup network ", e);
      }
    }
  } else {
    console.log(
      `Can't setup the ${params.chainName} network because no wallet exists`
    );
  }
};

export const getProvider = (chainId = 250) => {
  const hexId: string = hexToNumber[chainId];
  const { rpcUrls }: NetworkProps = NETWORKS[hexId];
  const provider = new ethers.providers.JsonRpcProvider(rpcUrls[0], chainId);
  return provider;
};
