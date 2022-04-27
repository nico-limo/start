import { ChangeEvent, useState } from "react";
import { Box, HStack, Text, useDisclosure } from "@chakra-ui/react";
import TokenInfo from "./components/TokenInfo";
import Labels from "./components/Labels";
import SearchInput from "../SearchInput";
import { TokenPortfolio } from "../../utils/interfaces/index.";
import { sortItems } from "../../utils/methods";
import useTokens from "../../store/methods/useTokens";

interface TableProp {
  type: string;
}

const TokenTable = ({ type }: TableProp) => {
  const { portfolio } = useTokens();
  const { isOpen, onToggle } = useDisclosure();
  const [inputValue, setInputValue] = useState("");

  const onchangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (isOpen) setInputValue(e.target.value);
  };

  const userPortfolio: TokenPortfolio[] = portfolio[type].filter(
    (token) =>
      token.symbol.toLowerCase().includes(inputValue.toLowerCase()) ||
      token.name.toLowerCase().includes(inputValue.toLowerCase())
  );

  const sortedUserPortfolio = sortItems(userPortfolio);
  const isTokens = type === "assets";
  const title = isTokens ? "ASSETS WALLETS" : "LIQUIDITY POOLS";
  return (
    <Box bg="gray.800" borderRadius={5} p={2} w="full">
      <HStack w="full" justify="space-between" align="center">
        <Text>{title}</Text>
        <SearchInput
          value={inputValue}
          isVisible={isOpen}
          onToggle={onToggle}
          onChange={onchangeInput}
          type={type}
        />
      </HStack>
      <Labels showBalance={portfolio.hasBalance} type={type} />
      <Box overflowY="auto" maxH={250}>
        {sortedUserPortfolio.map((token) => (
          <Box key={`table-${token.address}`}>
            <TokenInfo
              token={token}
              showBalance={portfolio.hasBalance}
              type={type}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default TokenTable;
