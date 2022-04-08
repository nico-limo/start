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
      width={25}
      height={25}
      loading="lazy"
    />
  ) : (
    <Flex>
      <Image
        src={`/tokens/${symbolA}.png`}
        alt={symbolA}
        width={25}
        height={25}
        loading="lazy"
      />
      <Image
        src={`/tokens/${symbolB}.png`}
        alt={symbolB}
        width={25}
        height={25}
        loading="lazy"
      />
    </Flex>
  );
};

export default TokenImages;
