import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Button, HStack, Text } from "@chakra-ui/react";
import React from "react";
import { NetworksMethods } from "../../store/methods/network";
import { useUserMethods } from "../../store/methods/user";
import { SCANS } from "../../utils/constants";

const WalletLink = () => {
  const { wallet } = useUserMethods();
  const { network } = NetworksMethods();
  const { scanWallet } = SCANS[network.chainID];

  return (
    <Button
      as="a"
      w={130}
      href={`${scanWallet}${wallet.account}`}
      target="_blank"
      bg="gray.600"
      _hover={{ color: "black" }}
    >
      <HStack>
        <Text>ACCOUNT</Text>
        <ExternalLinkIcon />
      </HStack>
    </Button>
  );
};

export default WalletLink;
