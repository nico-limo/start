import { Box, Text } from "@chakra-ui/react";
import Labels from "./components/Labels";
import { TokensMethod } from "../../store/methods/tokens";
import FarmInfo from "./components/FarmInfo";

const FarmTable = () => {
  const { farmsPortfolio } = TokensMethod();

  const title = "FARMING REWARDS";

  return (
    <Box bg="gray.800" borderRadius={5} p={2} w="full">
      <Text>{title}</Text>
      <Labels />
      <Box overflowY="auto" maxH={250}>
        {farmsPortfolio.map((farm) => (
          <Box key={`table-${farm.gaugeAddress}`}>
            <FarmInfo farm={farm} />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default FarmTable;
