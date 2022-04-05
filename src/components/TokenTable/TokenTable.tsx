import { ChangeEvent, useState } from "react";
import { Box, HStack, Text, useDisclosure } from "@chakra-ui/react";
import TokenInfo from "./components/TokenInfo";
import Labels from "./components/Labels";
import { TokensMethod } from "../../store/methods/tokens";
import { UserMethods } from "../../store/methods/user";
import { SearchInput } from "../SearchInput";

interface TableProp {
  type: string;
}

const TokenTable = ({ type }: TableProp) => {
  const { portfolio } = TokensMethod();
  const { wallet } = UserMethods();
  const { isOpen, onToggle } = useDisclosure();
  const [inputValue, setInputValue] = useState("");

  const userBalance = wallet.isConnected
    ? portfolio.filter((token) => token.balance)
    : [];

  const { userPortfolio, hasBalance } = userBalance.length
    ? { userPortfolio: userBalance, hasBalance: true }
    : { userPortfolio: portfolio, hasBalance: false };

  const onchangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (isOpen) setInputValue(e.target.value);
  };

  const filterTokens = userPortfolio.filter(
    (token) =>
      token.symbol.toLowerCase().includes(inputValue.toLowerCase()) ||
      token.name.toLowerCase().includes(inputValue.toLowerCase())
  );

  const isTokens = type === "tokens";
  const title = isTokens ? "ASSETS WALLETS" : "FARMING REWARDS";
  return (
    <Box bg="gray.800" borderRadius={5} p={2} w="full">
      <HStack w="full" justify="space-between" align="center">
        <Text>{title}</Text>
        <SearchInput
          value={inputValue}
          isVisible={isOpen}
          onToggle={onToggle}
          onChange={onchangeInput}
        />
      </HStack>
      <Labels showBalance={hasBalance} />
      <Box overflowY="auto" maxH={250}>
        {filterTokens.map((token) => (
          <Box key={`table-${token.address}`}>
            <TokenInfo token={token} showBalance={hasBalance} />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default TokenTable;
