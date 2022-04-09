import { Button, Text } from "@chakra-ui/react";
import React, { FC } from "react";
import { useRecoilValue } from "recoil";
import { userState } from "../../store/atoms/user";
import { ROLE } from "../../utils/constants";

interface Props {
  onPurchaseOpen: () => void;
}

const WalletRole: FC<Props> = ({ onPurchaseOpen }) => {
  const { role } = useRecoilValue(userState);

  return role === ROLE.premium ? (
    <Text borderRadius="5px" bg="facebook.700" p={2}>
      PRO
    </Text>
  ) : (
    <Button colorScheme="twitter" onClick={onPurchaseOpen}>
      Upgrade
    </Button>
  );
};

export default WalletRole;
