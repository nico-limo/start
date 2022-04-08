import { AddIcon } from "@chakra-ui/icons";
import {
  Grid,
  GridItem,
  HStack,
  Text,
  Skeleton,
  Flex,
  Stack,
  IconButton,
} from "@chakra-ui/react";
import { UserMethods } from "../../../store/methods/user";
import { formatTokenAmount, getUSDBalance } from "../../../utils/cryptoMethods";
import { TokenPortfolio } from "../../../utils/interfaces/index.";
import { formatAmount, priceStatus } from "../../../utils/methods";
import TokenImages from "./TokenImages";
interface TokenInfoProps {
  token: TokenPortfolio;
  showBalance: boolean;
  type: string;
}

const TokenInfo = ({ token, showBalance, type }: TokenInfoProps) => {
  const { isPremium } = UserMethods();
  const { symbol, balance, usd, usd_24h, decimals } = token;
  const { color_rate, symbol_rate } = priceStatus(usd_24h);
  const diffPrice = usd_24h ? usd_24h.toFixed(2) : "00.00";
  const isPrice: boolean = usd > 0 ?? false;
  const balanceNotFormatted = formatTokenAmount(balance, decimals, 4);
  const balanceFormatted = formatAmount(balanceNotFormatted, 4);
  const balanceUSD = getUSDBalance(balanceNotFormatted, usd);
  const fontSize = { base: "xs", md: "md" };
  const isTokens = type === "assets";
  const columns = showBalance
    ? isPremium && type === "liquidity"
      ? "1fr 1fr 1fr 80px"
      : "1fr 1fr 1fr"
    : "1fr 1fr";

  return (
    <Grid templateColumns={columns} my={1} bg="gray.700">
      <GridItem p={2} display="flex" alignItems="center">
        <Stack direction={isTokens ? "row" : "column"} spacing={1}>
          <TokenImages type={type} symbol={symbol} />
          <Text fontSize={fontSize}>{symbol}</Text>
        </Stack>
      </GridItem>
      <GridItem
        p={2}
        display="flex"
        alignItems="center"
        justifyContent="flex-end"
      >
        <Skeleton isLoaded={isPrice}>
          <HStack spacing={1}>
            <Text fontSize={fontSize}>{formatAmount(usd, 4)}</Text>
            {isTokens && (
              <HStack spacing={0}>
                <Text
                  color={color_rate}
                  fontSize={{ base: "xx-small", md: "xs" }}
                >{`(${symbol_rate}${diffPrice})`}</Text>
              </HStack>
            )}
          </HStack>
        </Skeleton>
      </GridItem>
      {showBalance && (
        <GridItem p={2}>
          <Flex direction="column" justify="end" align="flex-end">
            <Text fontSize={fontSize}>{balanceFormatted}</Text>
            <Text color="teal.300" fontSize={fontSize}>{`$${formatAmount(
              balanceUSD,
              2
            )}`}</Text>
          </Flex>
        </GridItem>
      )}
      {isPremium && !isTokens && (
        <GridItem
          p={2}
          display="flex"
          alignItems="center"
          justifyContent="flex-end"
        >
          <IconButton
            aria-label="deposit"
            size="xs"
            colorScheme="blackAlpha"
            icon={<AddIcon />}
          />
        </GridItem>
      )}
    </Grid>
  );
};

export default TokenInfo;
