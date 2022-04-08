import React, { useMemo } from "react";
import { Box, HStack, Skeleton, Text } from "@chakra-ui/react";
import { NetworksMethods } from "../../store/methods/network";
import { ADDRESS_ZERO, networksColors } from "../../utils/constants";
import { formatAmount, priceStatus } from "../../utils/methods";
import { TokensMethod } from "../../store/methods/tokens";
import Image from "next/image";

const PricesStatics = () => {
  const { network } = NetworksMethods();
  const { portfolio } = TokensMethod();
  const nativePrice = useMemo(() => {
    if (portfolio.assets.length) {
      return portfolio.assets.find((token) => token.address === ADDRESS_ZERO);
    }
    return null;
  }, [portfolio]);
  const isLoadedPrice = nativePrice ? nativePrice.usd > 0 : false;
  const bg: string = networksColors[network.chainID].bg;

  if (!nativePrice) return null;
  const { symbol, usd, usd_24h } = nativePrice;
  const { color_rate, symbol_rate } = priceStatus(usd_24h);
  const displayMode = { base: "none", md: "initial" };

  return (
    <HStack bg={bg} p={2} borderRadius="5px">
      <Skeleton isLoaded={isLoadedPrice}>
        <HStack align="center" justify="space-between">
          <Image
            alt={network.label}
            loading="lazy"
            src={`/networks/${network.label}.png`}
            width={30}
            height={30}
          />
          <HStack>
            <Text display={displayMode} color="gray.200">
              {symbol}
            </Text>
            <Box as="span">{`$${formatAmount(usd, 2)}`}</Box>
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
