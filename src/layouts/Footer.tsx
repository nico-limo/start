import { HStack, Text, VStack, chakra, Link } from "@chakra-ui/react";

const Footer = () => {
  return (
    <chakra.footer bg="gray.600" mt={2}>
      <HStack w="full" justify="space-around" p={2}>
        <VStack>
          <Text>SOCIAL MEDIA</Text>
          <Text>Comming Soon</Text>
        </VStack>
        <VStack spacing={0}>
          <Text>POWERED BY</Text>
          <Link href="https://www.coingecko.com/" target="_blank">
            Coingecko
          </Link>
          <Link href="https://www.covalenthq.com/" target="_blank">
            Covalent
          </Link>
          <Link href="https://coinmarketcap.com/" target="_blank">
            CoinMarket
          </Link>
        </VStack>
      </HStack>
      <HStack w="full" justify="space-around">
        <Text>© 2022 StartSwap</Text>
      </HStack>
    </chakra.footer>
  );
};

export default Footer;
