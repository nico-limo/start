import { Flex } from "@chakra-ui/react";
import React from "react";
import TokenImage from "../../TokenImage";

interface TokenImageProps {
  type: string;
  symbol: string;
}

const TokenImages = ({ type, symbol }: TokenImageProps) => {
  const [symbolA, symbolB] =
    type === "assets" ? [symbol, symbol] : symbol.split("-");
  return type === "assets" ? (
    <TokenImage symbol={symbol} />
  ) : (
    <Flex>
      <TokenImage symbol={symbolA} />
      <TokenImage symbol={symbolB} />
    </Flex>
  );
};

export default TokenImages;
