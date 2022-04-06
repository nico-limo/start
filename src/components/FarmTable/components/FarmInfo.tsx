import { QuestionIcon } from "@chakra-ui/icons";
import {
  Grid,
  GridItem,
  HStack,
  Image,
  Text,
  Flex,
  Button,
} from "@chakra-ui/react";
import { useMemo } from "react";
import { TokensMethod } from "../../../store/methods/tokens";
import { UserMethods } from "../../../store/methods/user";
import { getUSDBalance } from "../../../utils/cryptoMethods";
import { FarmsPortfolio } from "../../../utils/interfaces/index.";
import { formatAmount } from "../../../utils/methods";
interface FarmInfoProps {
  farm: FarmsPortfolio;
}

const FarmInfo = ({ farm }: FarmInfoProps) => {
  const { spiritToken } = TokensMethod();
  const { isPremium } = UserMethods();

  const { earns, lpSymbol, staked, usd } = farm;
  const [symbolA, symbolB] = lpSymbol;
  const fontSize = { base: "xs", md: "md" };

  const earn_USD = useMemo(() => {
    if (spiritToken.usd && earns)
      return getUSDBalance(earns, spiritToken.usd, 4);
    return "0.00";
  }, [earns, spiritToken]);

  const columns = isPremium ? "1fr 1fr 1fr 80px" : "1fr 1fr 1fr";
  return (
    <Grid templateColumns={columns} my={1} bg="gray.700">
      <GridItem p={2} display="flex" alignItems="center">
        <Flex direction="column">
          <HStack justify="center">
            <Image
              src={`/tokens/${symbolA}.png`}
              alt={symbolA}
              fallback={<QuestionIcon w={6} h={6} />}
              w={6}
            />
            <Image
              src={`/tokens/${symbolB}.png`}
              alt={symbolB}
              fallback={<QuestionIcon w={6} />}
              w={6}
            />
          </HStack>
          <Text fontSize={fontSize}>{`${symbolA}-${symbolB}`}</Text>
        </Flex>
      </GridItem>
      <GridItem
        p={2}
        display="flex"
        alignItems="center"
        justifyContent="flex-end"
      >
        <Flex direction="column" justify="end" align="flex-end">
          <Text fontSize={fontSize}>{formatAmount(staked, 5)}</Text>
          <Text color="teal.300" fontSize={fontSize}>
            {`$${formatAmount(usd, 2)}`}
          </Text>
        </Flex>
      </GridItem>
      <GridItem p={2}>
        <Flex direction="column" justify="end" align="flex-end">
          <Text fontSize={fontSize}>{formatAmount(earns, 5)}</Text>
          <Text color="teal.300" fontSize={fontSize}>
            {`$${formatAmount(earn_USD)}`}
          </Text>
        </Flex>
      </GridItem>
      {isPremium && (
        <GridItem p={1} textAlign="end" alignSelf="center">
          <Button colorScheme="yellow" fontSize="xs" size="xs">
            CLAIM
          </Button>
        </GridItem>
      )}
    </Grid>
  );
};

export default FarmInfo;
