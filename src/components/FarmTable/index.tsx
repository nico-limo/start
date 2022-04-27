import { ChangeEvent, useState } from "react";
import { Box, HStack, Text, useDisclosure } from "@chakra-ui/react";
import Labels from "./components/Labels";
import FarmInfo from "./components/FarmInfo";
import SearchInput from "../SearchInput";
import useTokens from "../../store/methods/useTokens";

const FarmTable = ({ pool }: { pool: string }) => {
  const { farmsPortfolio } = useTokens();
  const { isOpen, onToggle } = useDisclosure();
  const [inputValue, setInputValue] = useState("");
  const farmsProtocol = pool === "SPIRIT" ? "spiritFarms" : "spookyFarms";
  const filterFarms = farmsPortfolio[farmsProtocol].filter(
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
        <Text>{`${pool} FARMING REWARDS `}</Text>
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
          <Box key={`table-${farm.lpAddresses[250]}`}>
            <FarmInfo farm={farm} pool={pool} />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default FarmTable;
