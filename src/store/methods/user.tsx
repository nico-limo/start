import { useToast } from "@chakra-ui/react";
import { useSetRecoilState, useResetRecoilState, useRecoilValue } from "recoil";
import { ROLE } from "../../utils/constants";
import { walletConnect } from "../../utils/cryptoMethods";
import { userState } from "../atoms/user";

export const UserMethods = () => {
  const toast = useToast();
  const setuser = useSetRecoilState(userState);
  const logOut = useResetRecoilState(userState);
  const wallet = useRecoilValue(userState);
  const logIn = async () => {
    try {
      if (window.ethereum) {
        const account = await walletConnect();
        setuser({
          isConnected: true,
          account,
          role: ROLE.standard,
        });
      } else {
        toast({
          title: "Provider not detected",
          description: "Please, install Metamask in your browser",
          position: "top-right",
          status: "error",
          isClosable: true,
        });
      }
    } catch (error) {
      console.log("error wallet login ", error);
    }
  };

  const upgradeRole = () => {
    setuser({ ...wallet, role: ROLE.premium });
  };

  const isPremium = wallet.role === ROLE.premium;

  return { logIn, logOut, wallet, upgradeRole, isPremium };
};
