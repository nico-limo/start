import {
  Box,
  List,
  ListIcon,
  ListItem,
  Skeleton,
  Stack,
  Text,
} from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";
import { TokensMethod } from "../../store/methods/tokens";
import { useMemo } from "react";
import { formatTokenAmount, getUSDBalance } from "../../utils/cryptoMethods";
import { formatAmount } from "../../utils/methods";
const TokenDashboard = () => {
  const { portfolio } = TokensMethod();

  const totalBalance = useMemo(() => {
    if (portfolio.length) {
      let initialValue = 0;
      const sum = portfolio.reduce((accumulator, curValue) => {
        const balance = formatTokenAmount(curValue.balance, curValue.decimals);
        const balanceUSD = getUSDBalance(balance, curValue.usd);
        return accumulator + Number(balanceUSD);
      }, initialValue);
      if (isNaN(sum)) return "0.00";
      const amount = formatAmount(sum);
      return amount;
    }
    return "0.00";
  }, [portfolio]);
  const isLoadedBalance: boolean = totalBalance !== "0.00" ?? false;
  return (
    <Stack h={300} bg="gray.600" w="full" p={4}>
      <Text fontSize="large" fontWeight={500}>
        Portafolio Dashboard
      </Text>
      <List spacing={3}>
        <ListItem display="flex" alignItems="center">
          <ListIcon as={StarIcon} color="green.500" />
          <Text as="span">{`TOTAL USD BALANCE: $`}</Text>
          <Skeleton as="span" isLoaded={isLoadedBalance}>
            <Box as="span">{totalBalance}</Box>
          </Skeleton>
        </ListItem>
      </List>
    </Stack>
  );
};

export default TokenDashboard;
