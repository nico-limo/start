import { Grid, GridItem, HStack, Text, Flex } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { useUserMethods } from "../../../store/methods/user";
import useTokens from "../../../store/methods/useTokens";
import { getUSDBalance } from "../../../utils/cryptoMethods";
import {
  FarmsPortfolio,
  ProtocolProps,
} from "../../../utils/interfaces/index.";
import { formatAmount, getColumns } from "../../../utils/methods";
import TokenImage from "../../TokenImage";

// Dynamic
const FarmActions = dynamic(() => import("./FarmActions"));

interface FarmInfoProps {
  farm: FarmsPortfolio;
  protocol: ProtocolProps;
}

const FarmInfo = ({ farm, protocol }: FarmInfoProps) => {
  const { principalTokens, farmsPortfolio } = useTokens();
  const { isPremium } = useUserMethods();
  const [hasClaimed, setHasClaimed] = useState(false);
  const { earns, lpSymbol, staked, usd, actions, lpAddresses } = farm;
  const fontSize = { base: "xs", md: "md" };
  const [symbolA, symbolB] = lpSymbol;
  const earn_USD = useMemo(() => {
    if (
      principalTokens.SPIRIT &&
      principalTokens[protocol.earnToken].USD &&
      earns
    ) {
      return getUSDBalance(earns, principalTokens[protocol.earnToken].USD, 4);
    }
    return "0.00";
  }, [earns, principalTokens, protocol]);
  const columns = getColumns(true, isPremium);

  const handleClaim = () => {
    setHasClaimed(true);
  };

  useEffect(() => {
    setHasClaimed((prevStatus) => (prevStatus === false ? prevStatus : false));
  }, [farmsPortfolio]);

  return (
    <Grid templateColumns={columns} my={1} bg="gray.700">
      <GridItem p={2} display="flex" alignItems="center">
        <Flex direction="column">
          <HStack justify="center">
            <TokenImage symbol={symbolA} />
            <TokenImage symbol={symbolB} />
          </HStack>
          <Text fontSize={fontSize}>{`${symbolA}-${symbolB}`}</Text>
        </Flex>
      </GridItem>
      <GridItem
        p={2}
        display="flex"
        alignItems="center"
        justifyContent="flex-end"
      >
        <Flex direction="column" justify="end" align="flex-end">
          <Text fontSize={fontSize}>{formatAmount(staked, 5)}</Text>
          <Text color="teal.300" fontSize={fontSize}>
            {`$${formatAmount(usd, 2)}`}
          </Text>
        </Flex>
      </GridItem>
      <GridItem p={2}>
        <Flex direction="column" justify="end" align="flex-end">
          <Text fontSize={fontSize}>
            {hasClaimed ? "0" : formatAmount(earns, 5)}
          </Text>
          <Text color="teal.300" fontSize={fontSize}>
            {`$${hasClaimed ? "0.00" : formatAmount(earn_USD)}`}
          </Text>
        </Flex>
      </GridItem>
      {isPremium && (
        <FarmActions
          actions={actions}
          address={lpAddresses[250]}
          onClaim={handleClaim}
        />
      )}
    </Grid>
  );
};

export default FarmInfo;
