import { Button } from "@chakra-ui/react";
import React, { FC } from "react";
import { useRecoilValue } from "recoil";
import { userState } from "../store/atoms/user";
import { UserMethods } from "../store/methods/user";

interface Props {
  display?: string;
}

const WalletConnect: FC<Props> = ({ display = "initial" }) => {
  const { logIn, logOut } = UserMethods();
  const { account, isConnected } = useRecoilValue(userState);

  const handleConnection = () => {
    if (isConnected) return logOut();
    return logIn();
  };
  return (
    <Button
      w={40}
      display={{ base: display, md: "initial" }}
      colorScheme="facebook"
      onClick={handleConnection}
    >
      {isConnected ? account : "Connect Wallet"}
    </Button>
  );
};

export default WalletConnect;
