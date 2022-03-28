import React, { useMemo } from "react";
import { Box, HStack, Image, Skeleton, Text } from "@chakra-ui/react";
import { NetworksMethods } from "../../store/methods/network";
import { ADDRESS_ZERO, networksColors } from "../../utils/constants";
import { formatAmount, priceStatus } from "../../utils/methods";
import { TokensMethod } from "../../store/methods/tokens";

const PricesStatics = () => {
  const { network } = NetworksMethods();
  const { portfolio } = TokensMethod();
  const nativePrice = useMemo(() => {
    if (portfolio.length) {
      return portfolio.find((token) => token.address === ADDRESS_ZERO);
    }
    return null;
  }, [portfolio]);
  const isLoadedPrice = nativePrice.usd > 0;
  const bg: string = networksColors[network.chainID].bg;

  if (!nativePrice) return null;
  const { symbol, usd, usd_24h } = nativePrice;
  const { color_rate, symbol_rate } = priceStatus(usd_24h);
  const displayMode = { base: "none", md: "initial" };

  return (
    <HStack bg={bg} p={2} borderRadius="5px">
      <Skeleton isLoaded={isLoadedPrice}>
        <HStack align="center" justify="space-between">
          <Image loading="lazy" src={`/tokens/${symbol}.png`} w={6} />
          <HStack>
            <Text display={displayMode} color="gray.200">
              {symbol}
            </Text>
            <Box as="span">{`$${formatAmount(usd)}`}</Box>
          </HStack>

          <Text
            color={color_rate}
            fontSize="xs"
          >{`(${symbol_rate}${usd_24h.toFixed(2)}%)`}</Text>
        </HStack>
      </Skeleton>
      );
    </HStack>
  );
};

export default PricesStatics;
