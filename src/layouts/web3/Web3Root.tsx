import { ethers } from "ethers";
import { useEffect } from "react";
import { useUserMethods } from "../../store/methods/user";
import { hexToNumber } from "../../utils/constants/networks";
import useNetwork from "../../store/methods/useNetwork";
import useTokens from "../../store/methods/useTokens";

const Web3Root = ({ children }) => {
  const { logIn } = useUserMethods();
  const { connectNetwork, chainID } = useNetwork();
  const { cleanFarms } = useTokens();

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

          if (web3ChainId !== chainID) {
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
