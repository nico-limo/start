import { Grid, GridItem, HStack, Text, Flex } from "@chakra-ui/react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { TokensMethod } from "../../../store/methods/tokens";
import { UserMethods } from "../../../store/methods/user";
import { getUSDBalance } from "../../../utils/cryptoMethods";
import { FarmsPortfolio } from "../../../utils/interfaces/index.";
import { formatAmount } from "../../../utils/methods";

// Dynamic
const FarmActions = dynamic(() => import("./FarmActions"));

interface FarmInfoProps {
  farm: FarmsPortfolio;
  pool: string;
}

const FarmInfo = ({ farm, pool }: FarmInfoProps) => {
  const { principalTokens, farmsPortfolio } = TokensMethod();
  const { isPremium } = UserMethods();
  const [hasClaimed, setHasClaimed] = useState(false);
  const { earns, lpSymbol, staked, usd, actions, lpAddresses } = farm;
  const fontSize = { base: "xs", md: "md" };
  const [symbolA, symbolB] = lpSymbol;
  const earn_USD = useMemo(() => {
    const earnToken = pool === "SPIRIT" ? pool : "BOO";
    if (principalTokens.SPIRIT && principalTokens[earnToken].USD && earns) {
      return getUSDBalance(earns, principalTokens[earnToken].USD, 4);
    }
    return "0.00";
  }, [earns, principalTokens, pool]);

  const columns = isPremium ? "1fr 1fr 1fr 80px" : "1fr 1fr 1fr";
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
            <Image
              src={`/tokens/${symbolA}.png`}
              alt={symbolA}
              width={25}
              height={25}
              loading="lazy"
            />
            <Image
              src={`/tokens/${symbolB}.png`}
              alt={symbolB}
              width={25}
              height={25}
              loading="lazy"
            />
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
