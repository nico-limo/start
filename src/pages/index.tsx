import { Stack, VStack } from "@chakra-ui/react";
import { TokenDashboard } from "../components/TokenDashboard";
import { TokenTable } from "../components/TokenTable";
import { TokensMethod } from "../store/methods/tokens";

const Home = () => {
  const { farmsPortfolio } = TokensMethod();

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
        {farmsPortfolio.length && <TokenTable type="farms" />}
      </Stack>
    </VStack>
  );
};

export default Home;
