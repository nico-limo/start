import { QuestionIcon } from "@chakra-ui/icons";
import { Flex, Image } from "@chakra-ui/react";
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
      fallback={<QuestionIcon w={6} h={6} />}
      w={6}
      h={6}
    />
  ) : (
    <Flex>
      <Image
        src={`/tokens/${symbolA}.png`}
        alt={symbolA}
        fallback={<QuestionIcon w={6} h={6} />}
        w={6}
        h={6}
      />
      <Image
        src={`/tokens/${symbolB}.png`}
        alt={symbolB}
        fallback={<QuestionIcon w={6} h={6} />}
        w={6}
        h={6}
      />
    </Flex>
  );
};

export default TokenImages;
