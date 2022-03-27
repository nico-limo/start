import { Button } from "@chakra-ui/react";
import React, { FC } from "react";
import { useRecoilValue } from "recoil";
import { userState } from "../../store/atoms/user";
import { UserMethods } from "../../store/methods/user";

interface Props {
  onModalOpen: () => void;
}

const WalletConnection: FC<Props> = ({ onModalOpen }) => {
  const { logOut } = UserMethods();
  const { account } = useRecoilValue(userState);
  const startAccount = account.slice(0, 4);
  const endAccount = account.slice(-4);
  return account ? (
    <Button colorScheme="facebook" onClick={logOut}>
      {`${startAccount}...${endAccount}`}
    </Button>
  ) : (
    <Button colorScheme="facebook" onClick={onModalOpen}>
      Connect Wallet
    </Button>
  );
};

export default WalletConnection;
