import { useRecoilState } from "recoil";
import { WALLETS_ID } from "../../utils/constants";
import { NETWORKS } from "../../utils/constants/networks";
import { NetworkProps } from "../../utils/interfaces/index.";
import { networkState } from "../atoms/network";

const useNetwork = () => {
  const [network, setNetwork] = useRecoilState(networkState);

  const connectNetwork = (
    hexID: string,
    walletId: string = WALLETS_ID.metamask.id
  ) => {
    try {
      const { chainId, chainName, nativeCurrency, hex, label }: NetworkProps =
        NETWORKS[hexID];
      setNetwork({
        chainID: chainId,
        label,
        name: chainName,
        symbol: nativeCurrency.symbol,
        hex: hex,
      });
    } catch (error) {
      console.log("error network", error);
    }
  };

  return { connectNetwork, network, chainID: network.chainID };
};

export default useNetwork;
