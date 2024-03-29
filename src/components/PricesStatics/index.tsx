import React from "react";
import { Box, HStack, Skeleton, Text } from "@chakra-ui/react";

import { NATIVE_TOKENS, networksColors } from "../../utils/constants";
import { formatAmount, priceStatus } from "../../utils/methods";
import Image from "next/image";
import useNetwork from "../../store/methods/useNetwork";
import useTokens from "../../store/methods/useTokens";

const PricesStatics = () => {
  const { network, chainID } = useNetwork();
  const { principalTokens } = useTokens();

  const symbol: string = NATIVE_TOKENS[chainID];

  const nativePrice: { USD: number; USD_24h: number } = principalTokens[symbol];
  const { USD, USD_24h } = nativePrice;
  const isLoadedPrice = USD > 0 ?? false;
  const bg: string = networksColors[chainID].bg;

  const { color_rate, symbol_rate } = priceStatus(USD_24h);
  const displayMode = { base: "none", md: "initial" };

  return (
    <HStack bg={bg} p={2} borderRadius="5px">
      <Skeleton isLoaded={isLoadedPrice}>
        <HStack align="center" justify="space-between">
          <Image
            alt={network.label}
            loading="eager"
            src={`/networks/${network.label}.png`}
            width={30}
            height={30}
          />
          <HStack>
            <Text display={displayMode} color="gray.200">
              {symbol}
            </Text>
            <Box as="span">{`$${formatAmount(USD, 2)}`}</Box>
          </HStack>

          <Text
            color={color_rate}
            fontSize="xs"
          >{`(${symbol_rate}${USD_24h.toFixed(2)}%)`}</Text>
        </HStack>
      </Skeleton>
      );
    </HStack>
  );
};

export default PricesStatics;
