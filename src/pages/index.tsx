import { HStack, Stack, Text } from "@chakra-ui/react";
import { TokenTable } from "../components/TokenTable";

const Home = () => {
  return (
    <HStack spacing={4} align="center" justify="space-between">
      <TokenTable />
      <Stack bg="bisque">
        <Text>TEST DOS</Text>
      </Stack>
    </HStack>
  );
};

export default Home;
