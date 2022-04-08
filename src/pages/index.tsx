import { Stack, VStack } from "@chakra-ui/react";
import { FarmTable } from "../components/FarmTable";
import { TokenDashboard } from "../components/TokenDashboard";
import { TokenTable } from "../components/TokenTable";
import { TokensMethod } from "../store/methods/tokens";

const Home = () => {
  const { farmsPortfolio, portfolio } = TokensMethod();

  return (
    <VStack>
      <TokenDashboard />
      <Stack
        direction={{ base: "column", md: "row" }}
        spacing={{ base: 4, md: 20 }}
        w="full"
        justify="space-between"
      >
        <TokenTable type="assets" />
        {portfolio?.liquidity?.length && <TokenTable type="liquidity" />}
      </Stack>
      <Stack
        direction={{ base: "column", md: "row" }}
        spacing={{ base: 4, md: 20 }}
        w="full"
        justify="space-between"
      >
        {farmsPortfolio.length && <FarmTable />}
      </Stack>
    </VStack>
  );
};

export default Home;
