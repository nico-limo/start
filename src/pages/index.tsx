import { Stack, VStack } from "@chakra-ui/react";
import { FarmTable } from "../components/FarmTable";
import { TokenDashboard } from "../components/TokenDashboard";
import { TokenTable } from "../components/TokenTable";
import { TokensMethod } from "../store/methods/tokens";

const Home = () => {
  const { farmsPortfolio } = TokensMethod();

  console.log("farmsPortfolio ", farmsPortfolio);
  return (
    <VStack>
      <TokenDashboard />
      <Stack
        direction={{ base: "column", md: "row" }}
        spacing={{ base: 4, md: 20 }}
        w="full"
        justify="space-between"
      >
        <TokenTable type="tokens" />
        {farmsPortfolio.length && <FarmTable />}
      </Stack>
    </VStack>
  );
};

export default Home;
