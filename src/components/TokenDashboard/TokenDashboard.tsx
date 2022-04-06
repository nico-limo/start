import { HStack, Skeleton, Text, VStack } from "@chakra-ui/react";
import { TokensMethod } from "../../store/methods/tokens";
import { useMemo } from "react";
import { formatTokenAmount, getUSDBalance } from "../../utils/cryptoMethods";
import { formatAmount } from "../../utils/methods";
import { UserMethods } from "../../store/methods/user";

const TokenDashboard = () => {
  const { portfolio, farmsPortfolio, spiritToken } = TokensMethod();
  const { wallet } = UserMethods();

  const { balance, balance_24h } = useMemo(() => {
    if (portfolio.length) {
      const initialBalance = 0;
      const sumBalance = portfolio.reduce((accumulator, curValue) => {
        const balance = formatTokenAmount(curValue.balance, curValue.decimals);
        const balanceUSD = getUSDBalance(balance, curValue.usd);
        return accumulator + Number(balanceUSD);
      }, initialBalance);
      const sumBalance_24h = portfolio.reduce((accumulator, curValue) => {
        const balance_24h = formatTokenAmount(
          curValue.balance_24h,
          curValue.decimals
        );
        const lastUSD = curValue.usd - (curValue.usd * curValue.usd_24h) / 100;
        const balanceUSD = getUSDBalance(balance_24h, lastUSD);
        return accumulator + Number(balanceUSD);
      }, initialBalance);
      if (isNaN(sumBalance) || isNaN(sumBalance_24h))
        return { balance: 0, balance_24h: 0 };

      return { balance: sumBalance, balance_24h: sumBalance_24h };
    }
    return { balance: 0, balance_24h: 0 };
  }, [portfolio]);

  const balanceFarm = useMemo(() => {
    if (farmsPortfolio.length && spiritToken.usd) {
      for (let i = 0; i < farmsPortfolio.length; i++) {
        const farm = farmsPortfolio[i];
        const earnBalance = getUSDBalance(farm.earns, spiritToken.usd);
        return Number(earnBalance) + Number(farm.usd);
      }
    }
    return 0;
  }, [farmsPortfolio, spiritToken]);

  const totalBalance = balance + balanceFarm;
  const totalBalance_24h = balance_24h + balanceFarm;
  const status_balance_24 = totalBalance - totalBalance_24h > 0;
  const isLoadedBalance: boolean = balance !== 0 ?? false;
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
          <Skeleton isLoaded={isLoadedBalance}>
            <Text
              color={status_balance_24 ? "green.300" : "red.300"}
              fontSize="lg"
              fontWeight={500}
            >{`$${formatAmount(totalBalance, 2)}`}</Text>
          </Skeleton>
        </VStack>

        <VStack
          w={200}
          h={100}
          bg="gray.600"
          justify="center"
          borderRadius="5px"
        >
          <Text>Balance 24 Hs</Text>
          <Skeleton isLoaded={isLoadedBalance}>
            <Text
              color="teal.300"
              fontSize="lg"
              fontWeight={500}
            >{`$${formatAmount(totalBalance_24h, 2)}`}</Text>
          </Skeleton>
        </VStack>
      </HStack>
    </VStack>
  ) : null;
};

export default TokenDashboard;
