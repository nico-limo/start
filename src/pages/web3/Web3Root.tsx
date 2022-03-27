import { ethers } from "ethers";
import { useEffect } from "react";
import { UserMethods } from "../../store/methods/user";
import { NetworksMethods } from "../../store/methods/network";
import { hexToNumber } from "../../utils/constants/networks";

const Web3Root = ({ children }) => {
  const { logIn } = UserMethods();
  const { connectNetwork, network } = NetworksMethods();

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
      });

      window.ethereum.on("chainChanged", (hexId) => {
        connectNetwork(hexId);
      });
    };
    fetchWeb3();
  }, []);

  return children;
};

export default Web3Root;
