import { Box } from "@chakra-ui/react";
import TokenInfo from "./components/TokenInfo";
import Labels from "./components/Labels";
import { TokensMethod } from "../../store/methods/tokens";

const TokenTable = () => {
  const { portfolio } = TokensMethod();
  const hasBalance = portfolio.every((token) => token.balance);

  return (
    <Box>
      <Labels showBalance={hasBalance} />
      <Box overflowY="auto" maxH={400}>
        {portfolio &&
          portfolio.map((token) => (
            <Box key={`table-${token.address}`}>
              <TokenInfo token={token} showBalance={hasBalance} />
            </Box>
          ))}
      </Box>
    </Box>
  );
};

export default TokenTable;
