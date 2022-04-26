import dynamic from "next/dynamic";
import { Stack, VStack } from "@chakra-ui/react";
import TokenDashboard from "../components/TokenDashboard";
import { TokenTable } from "../components/TokenTable";
import { TokensMethod } from "../store/methods/tokens";
import { useUserMethods } from "../store/methods/user";

// Dinamic Components
const FarmTable = dynamic(() => import("../components/FarmTable"));

const Home = () => {
  const { farmsPortfolio, portfolio } = TokensMethod();
  const { wallet } = useUserMethods();

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
      {wallet.isConnected && (
        <Stack
          direction={{ base: "column", md: "row" }}
          spacing={{ base: 4, md: 20 }}
          w="full"
          justify="space-between"
        >
          {farmsPortfolio.spiritFarms.length && <FarmTable pool="SPIRIT" />}
          {farmsPortfolio.spookyFarms.length && <FarmTable pool="SPOOKY" />}
        </Stack>
      )}
    </VStack>
  );
};

export default Home;
