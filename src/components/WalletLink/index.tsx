import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Button, HStack, Text } from "@chakra-ui/react";
import React from "react";
import useNetwork from "../../store/methods/useNetwork";
import { useUserMethods } from "../../store/methods/user";
import { SCANS } from "../../utils/constants";

const WalletLink = () => {
  const { wallet } = useUserMethods();
  const { chainID } = useNetwork();
  const { scanWallet } = SCANS[chainID];

  return (
    <Button
      as="a"
      w={{ base: 100, md: 130 }}
      fontSize={{ base: "xs", md: "md" }}
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
