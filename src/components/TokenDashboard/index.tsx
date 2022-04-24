import {
  Button,
  HStack,
  Skeleton,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { TokensMethod } from "../../store/methods/tokens";
import { useMemo } from "react";
import {
  amountIsNegative,
  formatTokenAmount,
  getUSDBalance,
  subAmounts,
  sumAmounts,
} from "../../utils/cryptoMethods";
import { formatAmount } from "../../utils/methods";
import { useUserMethods } from "../../store/methods/user";
import { AMOUNT_ZERO } from "../../utils/constants";
import DonateModal from "../DonateModal";
import WalletLink from "../WalletLink";

const TokenDashboard = () => {
  const { portfolio, farmsPortfolio, principalTokens } = TokensMethod();
  const { wallet } = useUserMethods();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { tokensBalance, tokensBalance_24h } = useMemo(() => {
    let tokensBalance = AMOUNT_ZERO;
    let tokensBalance_24h = AMOUNT_ZERO;
    if (portfolio.assets.length) {
      for (let i = 0; i < portfolio.assets.length; i++) {
        const { balance, balance_24h, decimals, usd, usd_24h } =
          portfolio.assets[i];
        const formatBalance_24h = formatTokenAmount(balance_24h, decimals);
        const balanceUSD = getUSDBalance(balance, usd);
        const lastUSD = usd - (usd * usd_24h) / 100;
        const balance_24USD = getUSDBalance(formatBalance_24h, lastUSD);

        tokensBalance = sumAmounts(tokensBalance, balanceUSD);
        tokensBalance_24h = sumAmounts(tokensBalance_24h, balance_24USD);
      }
    }
    return { tokensBalance, tokensBalance_24h };
  }, [portfolio]);

  const farmsBalance = useMemo(() => {
    let farmBalance = AMOUNT_ZERO;
    if (
      farmsPortfolio.spiritFarms.length &&
      principalTokens.SPIRIT &&
      principalTokens.SPIRIT.USD
    ) {
      for (let i = 0; i < farmsPortfolio.spiritFarms.length; i++) {
        const { earns, usd } = farmsPortfolio.spiritFarms[i];
        const earnBalance = getUSDBalance(earns, principalTokens.SPIRIT.USD);
        const totalFarmBalance = sumAmounts(earnBalance, usd);
        farmBalance = sumAmounts(farmBalance, totalFarmBalance);
      }
    }
    return farmBalance;
  }, [farmsPortfolio, principalTokens]);

  const balance = sumAmounts(tokensBalance, farmsBalance);
  const totalBalance_24h = sumAmounts(tokensBalance_24h, farmsBalance);
  const status_balance_24 = amountIsNegative(
    subAmounts(balance, totalBalance_24h)
  );

  return wallet.account && balance ? (
    <VStack w="full" bg="gray.800" p={4}>
      <Text fontSize="large" fontWeight={500}>
        Portafolio Dashboard
      </Text>
      <HStack h={100} w="full" justify="space-around">
        <VStack
          w={200}
          h={100}
          bg="gray.600"
          justify="center"
          borderRadius="5px"
        >
          <Text>Balance</Text>
          <Skeleton isLoaded={portfolio.hasBalance}>
            <Text
              color={status_balance_24 ? "red.300" : "green.300"}
              fontSize="lg"
              fontWeight={500}
            >{`$${formatAmount(balance, 2)}`}</Text>
          </Skeleton>
        </VStack>

        <VStack>
          <Button
            w={130}
            onClick={onOpen}
            bg="gray.600"
            _hover={{ color: "black" }}
          >
            DONATE
          </Button>
          <WalletLink />
        </VStack>

        <VStack
          w={200}
          h={100}
          bg="gray.600"
          justify="center"
          borderRadius="5px"
        >
          <Text>Balance 24 Hs</Text>
          <Skeleton isLoaded={portfolio.hasBalance}>
            <Text
              color="teal.300"
              fontSize="lg"
              fontWeight={500}
            >{`$${formatAmount(totalBalance_24h, 2)}`}</Text>
          </Skeleton>
        </VStack>
      </HStack>
      <DonateModal isOpen={isOpen} onClose={onClose} />
    </VStack>
  ) : null;
};

export default TokenDashboard;
