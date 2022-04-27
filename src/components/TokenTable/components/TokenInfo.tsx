import {
  Grid,
  GridItem,
  HStack,
  Text,
  Skeleton,
  Flex,
  Stack,
} from "@chakra-ui/react";
import Image from "next/image";
import { useUserMethods } from "../../../store/methods/user";
import { getUSDBalance } from "../../../utils/cryptoMethods";
import { TokenPortfolio } from "../../../utils/interfaces/index.";
import { formatAmount, getColumns, priceStatus } from "../../../utils/methods";
import TokenActions from "./TokenActions";
import TokenImages from "./TokenImages";
interface TokenInfoProps {
  token: TokenPortfolio;
  showBalance: boolean;
  type: string;
}

const TokenInfo = ({ token, showBalance, type }: TokenInfoProps) => {
  const { isPremium } = useUserMethods();
  const { symbol, balance, usd, usd_24h } = token;

  const { color_rate, symbol_rate } = priceStatus(usd_24h);
  const diffPrice = usd_24h ? usd_24h.toFixed(2) : "00.00";
  const isPrice: boolean = usd > 0 ?? false;
  const balanceFormatted = formatAmount(balance, 5);
  const balanceUSD = getUSDBalance(balance, usd);
  const fontSize = { base: "xs", md: "md" };
  const isTokens = type === "assets";
  const columns = getColumns(showBalance, isPremium);
  const showActions = showBalance && isPremium;

  return (
    <Grid templateColumns={columns} my={1} bg="gray.700">
      <GridItem p={2} display="flex" alignItems="center">
        <Stack direction={isTokens ? "row" : "column"} spacing={1}>
          <TokenImages type={type} symbol={symbol} />

          <HStack>
            <Text fontSize={fontSize}>{symbol}</Text>
            {token.protocol && (
              <Image
                src={`/tokens/${token.protocol}.png`}
                width={12}
                height={12}
                alt={token.protocol}
              />
            )}
          </HStack>
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
      {showActions && <TokenActions token={token} isTokens={isTokens} />}
    </Grid>
  );
};

export default TokenInfo;
