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
import { getUSDBalanceV2 } from "../../../utils/cryptoMethods";
import { LabelProps } from "../../../utils/interfaces/index.";
import {
  getColumns,
  priceStatus,
  formatAmountV2,
} from "../../../utils/methods";
import TokenActions from "./TokenActions";
import TokenImages from "./TokenImages";

const TokenInfo = ({ token, showBalance, type }: LabelProps) => {
  const { isPremium } = useUserMethods();
  const { symbol, balance, usd, usd_24h } = token;

  const { color_rate, symbol_rate } = priceStatus(usd_24h);
  const diffPrice = usd_24h ? usd_24h.toFixed(2) : "00.00";
  const isPrice: boolean = usd > 0 ?? false;
  const balanceFormatted = formatAmountV2(balance, 4);
  const balanceUSD = getUSDBalanceV2(balance, usd, 2);
  const fontSize = { base: "xs", md: "md" };
  const columns = getColumns(showBalance, isPremium);
  const showActions = showBalance && isPremium;
  const isTokens = type.list === "assets";
  return (
    <Grid templateColumns={columns} my={1} bg="gray.700">
      <GridItem p={2} display="flex" alignItems="center">
        <Stack direction={isTokens ? "row" : "column"} spacing={1}>
          <TokenImages type={type.list} symbol={symbol} />

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
            <Text fontSize={fontSize}>{formatAmountV2(usd, 4)}</Text>
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
            <Text
              color="teal.300"
              fontSize={fontSize}
            >{`$ ${balanceUSD}`}</Text>
          </Flex>
        </GridItem>
      )}
      {showActions && <TokenActions token={token} isTokens={isTokens} />}
    </Grid>
  );
};

export default TokenInfo;
