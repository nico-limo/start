import { Stack } from "@chakra-ui/react";
import { TokenDashboard } from "../components/TokenDashboard";
import { TokenTable } from "../components/TokenTable";

const Home = () => {
  return (
    <Stack direction={{ base: "column", md: "row" }} spacing={4}>
      <TokenTable />
      <TokenDashboard />
    </Stack>
  );
};

export default Home;
