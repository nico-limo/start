import { Box, Text } from "@chakra-ui/react";
import TokenInfo from "./components/TokenInfo";
import Labels from "./components/Labels";
import { TokensMethod } from "../../store/methods/tokens";
import FarmInfo from "./components/FarmInfo";

interface TableProp {
  type: string;
}

const TokenTable = ({ type }: TableProp) => {
  const { portfolio, farmsPortfolio } = TokensMethod();
  const hasBalance = portfolio.every((token) => token.balance);
  const title = type === "tokens" ? "ASSETS WALLETS" : "FARMING REWARDS";

  return (
    <Box bg="gray.800" borderRadius={5} p={2} w="full">
      <Text>{title}</Text>
      <Labels showBalance={hasBalance} type={type} />
      <Box overflowY="auto" maxH={250}>
        {type === "tokens"
          ? portfolio &&
            portfolio.map((token) => (
              <Box key={`table-${token.address}`}>
                <TokenInfo token={token} showBalance={hasBalance} />
              </Box>
            ))
          : farmsPortfolio &&
            farmsPortfolio.map((farm) => (
              <Box key={`table-${farm.gaugeAddress}`}>
                <FarmInfo farm={farm} />
              </Box>
            ))}
      </Box>
    </Box>
  );
};

export default TokenTable;
