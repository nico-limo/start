import { ChangeEvent, useState } from "react";
import { Box, HStack, Text, useDisclosure } from "@chakra-ui/react";
import Labels from "./components/Labels";
import { TokensMethod } from "../../store/methods/tokens";
import FarmInfo from "./components/FarmInfo";
import SearchInput from "../SearchInput";

const FarmTable = () => {
  const { farmsPortfolio } = TokensMethod();
  const { isOpen, onToggle } = useDisclosure();
  const [inputValue, setInputValue] = useState("");
  const filterFarms = farmsPortfolio.spiritFarms.filter(
    (farm) =>
      farm.lpSymbol[0].toLowerCase().includes(inputValue.toLowerCase()) ||
      farm.lpSymbol[1].toLowerCase().includes(inputValue.toLowerCase())
  );

  const onchangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (isOpen) setInputValue(e.target.value);
  };

  return (
    <Box bg="gray.800" borderRadius={5} p={2} w="full">
      <HStack w="full" justify="space-between" align="center">
        <Text>FARMING REWARDS</Text>
        <SearchInput
          value={inputValue}
          isVisible={isOpen}
          onToggle={onToggle}
          onChange={onchangeInput}
          type="farm"
        />
      </HStack>
      <Labels />
      <Box overflowY="auto" maxH={250}>
        {filterFarms.map((farm) => (
          <Box key={`table-${farm.gaugeAddress}`}>
            <FarmInfo farm={farm} />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default FarmTable;
