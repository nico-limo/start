import { QuestionIcon } from "@chakra-ui/icons";
import {
  Grid,
  GridItem,
  HStack,
  Image,
  Text,
  Skeleton,
  Flex,
} from "@chakra-ui/react";
import { formatTokenAmount, getUSDBalance } from "../../../utils/cryptoMethods";
import { TokenPortfolio } from "../../../utils/interfaces/index.";
import { formatAmount, priceStatus } from "../../../utils/methods";
interface TokenInfoProps {
  token: TokenPortfolio;
  showBalance: boolean;
}

const TokenInfo = ({ token, showBalance }: TokenInfoProps) => {
  const { symbol, balance, usd, usd_24h, decimals, address } = token;
  const { color_rate, symbol_rate } = priceStatus(usd_24h);
  const diffPrice = usd_24h ? usd_24h.toFixed(2) : "00.00";
  const isPrice: boolean = usd > 0 ?? false;
  const balanceNotFormatted = formatTokenAmount(balance, decimals, 4);
  const balanceFormatted = formatAmount(balanceNotFormatted);
  const balanceUSD = getUSDBalance(balanceNotFormatted, usd);
  const columns = showBalance ? 3 : 2;
  const fontSize = { base: "xs", md: "md" };

  return (
    <Grid templateColumns={`repeat(${columns}, 1fr)`} my={1} bg="gray.700">
      <GridItem p={2} display="flex" alignItems="center">
        <HStack>
          <Image
            src={`/tokens/${symbol}.png`}
            fallback={<QuestionIcon w={6} />}
            w={6}
          />
          <Text fontSize={fontSize}>{symbol}</Text>
        </HStack>
      </GridItem>
      <GridItem
        p={2}
        display="flex"
        alignItems="center"
        justifyContent="flex-end"
      >
        <Skeleton isLoaded={isPrice}>
          <HStack>
            <Text fontSize={fontSize}>{formatAmount(usd)}</Text>
            <HStack spacing={1}>
              <Text
                color={color_rate}
                fontSize={{ base: "xx-small", md: "xs" }}
              >{`(${symbol_rate}${diffPrice})`}</Text>
            </HStack>
          </HStack>
        </Skeleton>
      </GridItem>
      {showBalance && (
        <GridItem p={2}>
          <Flex direction="column" justify="end" align="flex-end">
            <Text fontSize={fontSize}>{balanceFormatted}</Text>
            <Text color="teal.300" fontSize={fontSize}>{`$${formatAmount(
              balanceUSD
            )}`}</Text>
          </Flex>
        </GridItem>
      )}
    </Grid>
  );
};

export default TokenInfo;
