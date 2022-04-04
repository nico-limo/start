import { Box, Text } from "@chakra-ui/react";
import TokenInfo from "./components/TokenInfo";
import Labels from "./components/Labels";
import { TokensMethod } from "../../store/methods/tokens";
import { UserMethods } from "../../store/methods/user";

interface TableProp {
  type: string;
}

const TokenTable = ({ type }: TableProp) => {
  const { portfolio } = TokensMethod();
  const { wallet } = UserMethods();
  const hasBalanceWallet =
    wallet.isConnected && portfolio.every((token) => token.balance);
  const isTokens = type === "tokens";
  const title = isTokens ? "ASSETS WALLETS" : "FARMING REWARDS";
  return (
    <Box bg="gray.800" borderRadius={5} p={2} w="full">
      <Text>{title}</Text>
      <Labels showBalance={hasBalanceWallet} />
      <Box overflowY="auto" maxH={250}>
        {portfolio.map((token) => (
          <Box key={`table-${token.address}`}>
            <TokenInfo token={token} showBalance={hasBalanceWallet} />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default TokenTable;
