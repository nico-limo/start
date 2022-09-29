import dynamic from "next/dynamic";
import { Stack, VStack } from "@chakra-ui/react";
import TokenDashboard from "../components/TokenDashboard";
import { TokenTable } from "../components/TokenTable";
import { useUserMethods } from "../store/methods/user";
import useTokens from "../store/methods/useTokens";
import { PROTOCOL, TOKEN_INFO } from "../utils/constants/protocols";
import { LayerModal } from "@nicolimo/kyc-package";

// Dinamic Components
const FarmTable = dynamic(() => import("../components/FarmTable"));

const Home = () => {
  const { farmsPortfolio, portfolio } = useTokens();

  const { wallet } = useUserMethods();
  const { SPIRIT, SPOOKY } = PROTOCOL;
  const { ASSETS, LIQUIDITY } = TOKEN_INFO;
  return (
    <VStack>
      <LayerModal account={wallet.account} kycType={["a"]} projectId="a" />
      <TokenDashboard />
      <Stack
        direction={{ base: "column", md: "row" }}
        spacing={{ base: 4, md: 20 }}
        w="full"
        justify="space-between"
      >
        <TokenTable type={ASSETS} />
        {portfolio.liquidity?.length && <TokenTable type={LIQUIDITY} />}
      </Stack>
      {wallet.isConnected && (
        <Stack
          direction={{ base: "column", md: "row" }}
          spacing={{ base: 4, md: 20 }}
          w="full"
          justify="space-between"
        >
          {farmsPortfolio.spiritFarms.length && <FarmTable protocol={SPIRIT} />}
          {farmsPortfolio.spookyFarms.length && <FarmTable protocol={SPOOKY} />}
        </Stack>
      )}
    </VStack>
  );
};

export default Home;
