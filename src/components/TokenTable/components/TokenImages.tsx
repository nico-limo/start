import { Flex } from "@chakra-ui/react";
import Image from "next/image";
import React from "react";

interface TokenImageProps {
  type: string;
  symbol: string;
}

const TokenImages = ({ type, symbol }: TokenImageProps) => {
  const [symbolA, symbolB] =
    type === "assets" ? [symbol, symbol] : symbol.split("-");
  return type === "assets" ? (
    <Image
      src={`/tokens/${symbol}.png`}
      alt={symbol}
      width="25px"
      height="25px"
      loading="lazy"
    />
  ) : (
    <Flex>
      <Image
        src={`/tokens/${symbolA}.png`}
        alt={symbolA}
        width="25px"
        height="25px"
        loading="lazy"
      />
      <Image
        src={`/tokens/${symbolB}.png`}
        alt={symbolB}
        width="25px"
        height="25px"
        loading="lazy"
      />
    </Flex>
  );
};

export default TokenImages;
