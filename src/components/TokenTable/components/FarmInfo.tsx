import { QuestionIcon } from "@chakra-ui/icons";
import { Grid, GridItem, HStack, Image, Text, Flex } from "@chakra-ui/react";
import { useMemo } from "react";
import { TokensMethod } from "../../../store/methods/tokens";
import { getUSDBalance } from "../../../utils/cryptoMethods";

import { FarmsPortfolio } from "../../../utils/interfaces/index.";
import { formatAmount } from "../../../utils/methods";
interface FarmInfoProps {
  farm: FarmsPortfolio;
}

const FarmInfo = ({ farm }: FarmInfoProps) => {
  const { spiritToken } = TokensMethod();
  const { earns, lpSymbol, staked, usd } = farm;
  const [symbolA, symbolB] = lpSymbol;
  const fontSize = { base: "xs", md: "md" };

  const earn_USD = useMemo(() => {
    if (spiritToken.usd && earns) return getUSDBalance(earns, spiritToken.usd);
    return "0.00";
  }, [earns, spiritToken]);

  const staked_USD = useMemo(() => {
    if (usd && staked) return getUSDBalance(staked, usd);
    return "0.00";
  }, [earns, spiritToken]);

  return (
    <Grid templateColumns={`repeat(3, 1fr)`} my={1} bg="gray.700">
      <GridItem p={2} display="flex" alignItems="center">
        <HStack>
          <Image
            src={`/tokens/${symbolA}.png`}
            fallback={<QuestionIcon w={6} />}
            w={6}
          />
          <Image
            src={`/tokens/${symbolB}.png`}
            fallback={<QuestionIcon w={6} />}
            w={6}
          />
          <Text fontSize={fontSize}>{`${symbolA}-${symbolB}`}</Text>
        </HStack>
      </GridItem>
      <GridItem
        p={2}
        display="flex"
        alignItems="center"
        justifyContent="flex-end"
      >
        <Flex direction="column" justify="end" align="flex-end">
          <Text fontSize={fontSize}>{formatAmount(staked, -4)}</Text>
          <Text color="teal.300" fontSize={fontSize}>
            {`$${formatAmount(staked_USD)}`}
          </Text>
        </Flex>
      </GridItem>
      <GridItem p={2}>
        <Flex direction="column" justify="end" align="flex-end">
          <Text fontSize={fontSize}>{formatAmount(earns, -4)}</Text>
          <Text color="teal.300" fontSize={fontSize}>
            {`$${formatAmount(earn_USD)}`}
          </Text>
        </Flex>
      </GridItem>
    </Grid>
  );
};

export default FarmInfo;
