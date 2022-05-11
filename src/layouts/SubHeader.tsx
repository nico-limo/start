import { HStack, Skeleton, Text } from "@chakra-ui/react";
import React from "react";
import TokenImage from "../components/TokenImage";
import useTokens from "../store/methods/useTokens";
import { formatAmountV2, priceStatus } from "../utils/methods";

const SubHeader = () => {
  const { principalTokens } = useTokens();
  const { BNB, ETH, FTM } = principalTokens;
  const formatBNB = formatAmountV2(BNB.USD, 4);
  const { color_rate: color_BNB } = priceStatus(BNB.USD_24h);
  const { color_rate: color_ETH } = priceStatus(ETH.USD_24h);
  const { color_rate: color_FTM } = priceStatus(FTM.USD_24h);

  const formatETH = formatAmountV2(ETH.USD, 4);
  const formatFTM = formatAmountV2(FTM.USD, 4);
  return (
    <HStack justify="space-around" align="center" bg="gray.600" p={1}>
      <HStack w="full" justify="center">
        <TokenImage symbol={BNB.symbol} />
        <Skeleton isLoaded={BNB.USD > 0}>
          <Text color={color_BNB}>{`${BNB.symbol} $${formatBNB}`}</Text>
        </Skeleton>
      </HStack>
      <HStack w="full" justify="center" borderX="1px solid white">
        <TokenImage symbol={ETH.symbol} />
        <Text color={color_ETH}>{`${ETH.symbol} $${formatETH}`}</Text>
      </HStack>

      <HStack w="full" justify="center">
        <TokenImage symbol={FTM.symbol} />
        <Text color={color_FTM}>{`${FTM.symbol} $${formatFTM}`}</Text>
      </HStack>
    </HStack>
  );
};

export default SubHeader;
