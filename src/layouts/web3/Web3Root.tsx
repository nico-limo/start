import { ethers } from "ethers";
import { useEffect } from "react";
import { useUserMethods } from "../../store/methods/user";
import { NetworksMethods } from "../../store/methods/network";
import { hexToNumber } from "../../utils/constants/networks";
import { TokensMethod } from "../../store/methods/tokens";

const Web3Root = ({ children }) => {
  const { logIn } = useUserMethods();
  const { connectNetwork, network } = NetworksMethods();
  const { cleanFarms } = TokensMethod();

  useEffect(() => {
    const fetchWeb3 = async () => {
      try {
        if (window.ethereum) {
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
        }
      } catch (error) {
        console.log("error ", error);
      }
    };
    fetchWeb3();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return children;
};

export default Web3Root;
