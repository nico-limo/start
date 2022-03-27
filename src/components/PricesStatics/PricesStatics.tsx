import { Box, HStack, Image, Skeleton, Text, VStack } from "@chakra-ui/react";
import React, { FC, useMemo } from "react";
import { useRecoilValue } from "recoil";
import { priceLoaderState } from "../../store/atoms/loaders";
import { networkState } from "../../store/atoms/network";

import { ADDRESS_ZERO, networksColors } from "../../utils/constants";
import { formatAmount } from "../../utils/methods";

interface Props {
  display?: string;
}

const PricesStatics: FC<Props> = ({ display }) => {
  const isLoadingPrices = useRecoilValue(priceLoaderState);
  const { chainID } = useRecoilValue(networkState);

  const nativePrice = useMemo(() => {
    return null;
  }, []);

  const bg: string = networksColors[chainID].bg;

  if (!nativePrice) return null;
  const { symbol, usd, usd_24h_change } = nativePrice;
  const color_rate = usd_24h_change > 0 ? "green.300" : "red.300";
  const symbol_rate = usd_24h_change > 0 ? "+" : "";
  const displayMode = { base: "none", md: "initial" };
  return (
    <HStack
      bg={bg}
      p={2}
      display={{ base: display, md: "initial" }}
      borderRadius="5px"
    >
      <Skeleton isLoaded={!isLoadingPrices}>
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
          >{`(${symbol_rate}${usd_24h_change.toFixed(2)}%)`}</Text>
        </HStack>
      </Skeleton>
      );
    </HStack>
  );
};

export default PricesStatics;
