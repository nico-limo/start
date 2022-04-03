import { ethers } from "ethers";
import { useEffect } from "react";
import { UserMethods } from "../../store/methods/user";
import { NetworksMethods } from "../../store/methods/network";
import { hexToNumber } from "../../utils/constants/networks";
import { TokensMethod } from "../../store/methods/tokens";

const Web3Root = ({ children }) => {
  const { logIn } = UserMethods();
  const { connectNetwork, network } = NetworksMethods();
  const { cleanFarms } = TokensMethod();

  useEffect(() => {
    const fetchWeb3 = async () => {
      try {
      } catch (error) {}
      const provider = new ethers.providers.Web3Provider(
        window.ethereum,
        "any"
      );

      const isLogged = await provider.listAccounts();

      const { chainId: web3ChainId } = await provider.getNetwork();

      if (web3ChainId !== network.chainID) {
        const hexId: string = hexToNumber[web3ChainId];
        connectNetwork(hexId);
      }
      if (isLogged.length) logIn();

      // EVENT LISTENERS
      window.ethereum.on("accountsChanged", () => {
        logIn();
        cleanFarms();
      });

      window.ethereum.on("chainChanged", (hexId) => {
        connectNetwork(hexId);
      });
    };
    fetchWeb3();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return children;
};

export default Web3Root;
