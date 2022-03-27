import { QuestionIcon } from "@chakra-ui/icons";
import {
  Grid,
  GridItem,
  HStack,
  Image,
  Text,
  Skeleton,
} from "@chakra-ui/react";
import { formatTokenAmount } from "../../../utils/cryptoMethods";
import { TokenPortfolio } from "../../../utils/interfaces/index.";
import { formatAmount } from "../../../utils/methods";

const TokenInfo = ({ token }: { token: TokenPortfolio }) => {
  const { symbol, balance, usd, usd_24h, decimals, logo_url } = token;
  const diffPrice = usd_24h ? usd_24h.toFixed(2) : "00.00";
  const isPrice: boolean = usd > 0 ?? false;
  const isBalance: boolean = formatTokenAmount(balance, decimals) === "loading";
  return (
    <Grid templateColumns="repeat(3, 1fr)" w={{ base: 400, md: 700 }}>
      <GridItem
        p={3}
        w="100%"
        h="10"
        bg="teal.800"
        display="flex"
        alignItems="center"
        border="2px solid teal"
      >
        <HStack>
          <Image
            src={`/tokens/${symbol}.png`}
            w={4}
            fallback={<QuestionIcon />}
          />
          <Text>{symbol}</Text>
        </HStack>
      </GridItem>
      <GridItem
        p={3}
        w="100%"
        h="10"
        bg="teal.800"
        display="flex"
        alignItems="center"
        justifyContent="flex-end"
        border="2px solid teal"
      >
        <Skeleton isLoaded={isPrice}>
          <HStack>
            <Text>{formatAmount(usd)}</Text>
            <HStack spacing={1}>
              <Text fontSize="xx-small">{`(${diffPrice})`}</Text>
            </HStack>
          </HStack>
        </Skeleton>
      </GridItem>
      <GridItem
        p={3}
        w="100%"
        h="10"
        bg="teal.800"
        display="flex"
        alignItems="center"
        justifyContent="flex-end"
        border="2px solid teal"
      >
        <Skeleton isLoaded={!isBalance}>
          <Text>{formatTokenAmount(balance, decimals)}</Text>
        </Skeleton>
      </GridItem>
    </Grid>
  );
};

export default TokenInfo;
