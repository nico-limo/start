import { Button } from "@chakra-ui/react";
import React, { FC } from "react";
import { useRecoilValue } from "recoil";
import { userState } from "../../store/atoms/user";
import { useUserMethods } from "../../store/methods/user";
import useTokens from "../../store/methods/useTokens";

interface Props {
  onModalOpen: () => void;
}

const WalletConnection: FC<Props> = ({ onModalOpen }) => {
  const { logOut } = useUserMethods();
  const { cleanFarms } = useTokens();

  const handleLogOut = () => {
    cleanFarms();
    logOut();
  };
  const { account } = useRecoilValue(userState);
  const startAccount = account.slice(0, 4);
  const endAccount = account.slice(-4);
  return account ? (
    <Button colorScheme="facebook" onClick={handleLogOut}>
      {`${startAccount}...${endAccount}`}
    </Button>
  ) : (
    <Button colorScheme="facebook" onClick={onModalOpen}>
      Connect Wallet
    </Button>
  );
};

export default WalletConnection;
