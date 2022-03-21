import { useSetRecoilState, useResetRecoilState } from "recoil";
import { userState } from "../atoms/user";

export const UserMethods = () => {
  const setuser = useSetRecoilState(userState);
  const logOut = useResetRecoilState(userState);
  const logIn = () => {
    try {
      setuser({ isConnected: true, account: "0x0000000" });
    } catch (error) {
      console.log("error ", error);
    }
  };

  return { logIn, logOut };
};
