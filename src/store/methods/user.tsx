import { useSetRecoilState, useResetRecoilState, useRecoilValue } from "recoil";
import { walletConnect } from "../../utils/cryptoMethods";
import { userState } from "../atoms/user";

export const UserMethods = () => {
  const setuser = useSetRecoilState(userState);
  const logOut = useResetRecoilState(userState);
  const wallet = useRecoilValue(userState);
  const logIn = async () => {
    try {
      const account = await walletConnect();
      setuser({
        isConnected: true,
        account: account,
      });
    } catch (error) {
      console.log("error ", error);
    }
  };

  return { logIn, logOut, wallet };
};
