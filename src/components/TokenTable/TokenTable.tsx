import { Box } from "@chakra-ui/react";
import TokenInfo from "./components/TokenInfo";
import Labels from "./components/Labels";
import { TokensMethod } from "../../store/methods/tokens";

const TokenTable = () => {
  const { portfolio } = TokensMethod();

  return (
    <Box>
      <Labels />
      <Box overflowY="auto" h={400}>
        {portfolio &&
          portfolio.map((token) => (
            <Box key={`table-${token.address}`}>
              <TokenInfo token={token} />
            </Box>
          ))}
      </Box>
    </Box>
  );
};

export default TokenTable;
