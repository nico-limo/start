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
  const networkConfig: NetworkProps = NETWORKS[hexId];
  if (provider) {
    try {
      await provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `${networkConfig.hex}` }],
      });
    } catch (e: any) {
      if (e.code === 4902) {
        await provider.request({
          method: "wallet_addEthereumChain",
          params: [networkConfig],
        });
      } else {
        console.log("error setup network ", e);
      }
    }
  } else {
    console.log(
      `Can't setup the ${networkConfig.chainName} network because no wallet exists`
    );
  }
};
