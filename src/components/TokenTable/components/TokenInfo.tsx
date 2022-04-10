import { AddIcon } from "@chakra-ui/icons";
import {
  Grid,
  GridItem,
  HStack,
  Text,
  Skeleton,
  Flex,
  Stack,
  IconButton,
} from "@chakra-ui/react";
import { parseUnits } from "ethers/lib/utils";
import useLoading from "../../../hooks/useLoading";
import useNotification from "../../../hooks/useNotification";
import { TokensMethod } from "../../../store/methods/tokens";
import { UserMethods } from "../../../store/methods/user";
import { getUSDBalance } from "../../../utils/cryptoMethods";
import { TokenPortfolio } from "../../../utils/interfaces/index.";
import {
  checkAddresses,
  formatAmount,
  priceStatus,
} from "../../../utils/methods";
import TokenImages from "./TokenImages";
interface TokenInfoProps {
  token: TokenPortfolio;
  showBalance: boolean;
  type: string;
}

const TokenInfo = ({ token, showBalance, type }: TokenInfoProps) => {
  const { isPremium, wallet } = UserMethods();
  const { farmsPortfolio } = TokensMethod();
  const { isLoading, loadOff, loadOn } = useLoading();
  const {
    cancelTx,
    pendingTx,
    successTx,
    noFarmExist,
    needApproveTx,
    successApproveTx,
  } = useNotification();
  const { symbol, balance, usd, usd_24h } = token;
  const { color_rate, symbol_rate } = priceStatus(usd_24h);
  const diffPrice = usd_24h ? usd_24h.toFixed(2) : "00.00";
  const isPrice: boolean = usd > 0 ?? false;
  const balanceFormatted = formatAmount(balance, 5);
  const balanceUSD = getUSDBalance(balance, usd);
  const fontSize = { base: "xs", md: "md" };
  const isTokens = type === "assets";
  const columns = showBalance
    ? isPremium && !isTokens
      ? "1fr 1fr 1fr 80px"
      : "1fr 1fr 1fr"
    : "1fr 1fr";

  const handleDeposit = async () => {
    try {
      const spiritFarm =
        farmsPortfolio.spiritLiquidity &&
        farmsPortfolio.spiritLiquidity.find((lpPool) =>
          checkAddresses(lpPool.lpAddresses[250], token.address)
        );

      if (spiritFarm) {
        const { gaugeDepositAll, allowance, approve } = spiritFarm;
        loadOn();
        const hasAllowance = await allowance(wallet.account);

        const parseBalance = parseUnits(balance, token.decimals);
        if (hasAllowance.lt(parseBalance)) {
          needApproveTx();
          const txApprove = await approve(parseBalance);
          await txApprove.wait();
          successApproveTx();
        }

        const tx = await gaugeDepositAll();
        pendingTx();
        await tx.wait();
        loadOff();
        successTx();
      } else {
        noFarmExist();
      }
    } catch (error) {
      loadOff();
      cancelTx();
    }
  };

  return (
    <Grid templateColumns={columns} my={1} bg="gray.700">
      <GridItem p={2} display="flex" alignItems="center">
        <Stack direction={isTokens ? "row" : "column"} spacing={1}>
          <TokenImages type={type} symbol={symbol} />
          <Text fontSize={fontSize}>{symbol}</Text>
        </Stack>
      </GridItem>
      <GridItem
        p={2}
        display="flex"
        alignItems="center"
        justifyContent="flex-end"
      >
        <Skeleton isLoaded={isPrice}>
          <HStack spacing={1}>
            <Text fontSize={fontSize}>{formatAmount(usd, 4)}</Text>
            {isTokens && (
              <HStack spacing={0}>
                <Text
                  color={color_rate}
                  fontSize={{ base: "xx-small", md: "xs" }}
                >{`(${symbol_rate}${diffPrice})`}</Text>
              </HStack>
            )}
          </HStack>
        </Skeleton>
      </GridItem>
      {showBalance && (
        <GridItem p={2}>
          <Flex direction="column" justify="end" align="flex-end">
            <Text fontSize={fontSize}>{balanceFormatted}</Text>
            <Text color="teal.300" fontSize={fontSize}>{`$${formatAmount(
              balanceUSD,
              2
            )}`}</Text>
          </Flex>
        </GridItem>
      )}
      {isPremium && !isTokens && (
        <GridItem
          p={2}
          display="flex"
          alignItems="center"
          justifyContent="flex-end"
        >
          <IconButton
            isLoading={isLoading}
            onClick={handleDeposit}
            aria-label="deposit"
            size="xs"
            colorScheme="blackAlpha"
            icon={<AddIcon />}
          />
        </GridItem>
      )}
    </Grid>
  );
};

export default TokenInfo;
