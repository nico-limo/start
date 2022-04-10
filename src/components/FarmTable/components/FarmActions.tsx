import React from "react";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import { Button, GridItem, HStack, IconButton } from "@chakra-ui/react";
import useNotification from "../../../hooks/useNotification";
import { FarmActionProps } from "../../../utils/interfaces/components";
import useLoading from "../../../hooks/useLoading";
import { TokensMethod } from "../../../store/methods/tokens";
import { checkAddresses } from "../../../utils/methods";
import { UserMethods } from "../../../store/methods/user";

const FarmActions = ({ actions, address, onClaim }: FarmActionProps) => {
  const { portfolio, updateToken } = TokensMethod();
  const { wallet } = UserMethods();
  const { isLoading, loadOff, loadOn } = useLoading();
  const {
    isLoading: isLoadingWithdraw,
    loadOff: loadOffWithdraw,
    loadOn: loadOnWithdraw,
  } = useLoading();
  const {
    isLoading: isLoadingDeposit,
    loadOff: loadOfDeposit,
    loadOn: loadOnDeposit,
  } = useLoading();
  const { pendingTx, successTx, cancelTx, noBalanceTx } = useNotification();
  const { gaugeReward, gaugeExit, gaugeDepositAll } = actions;

  const handleClaim = async () => {
    try {
      loadOn();
      const tx = await gaugeReward();
      pendingTx();
      await tx.wait();
      loadOff();
      successTx();
      await updateToken(wallet.account);
      onClaim();
    } catch (error) {
      loadOff();
      cancelTx();
    }
  };

  const handleWithdraw = async () => {
    try {
      loadOnWithdraw();
      const tx = await gaugeExit();
      pendingTx();
      await tx.wait();
      loadOffWithdraw();
      successTx();
      await updateToken(wallet.account);
      onClaim();
    } catch (error) {
      loadOffWithdraw();
      cancelTx();
    }
  };

  const handleDeposit = async () => {
    try {
      const farmPool =
        portfolio.hasBalance &&
        portfolio.liquidity.find((lpPool) =>
          checkAddresses(lpPool.address, address)
        );

      const hasBalance = farmPool ? true : false;
      if (hasBalance) {
        loadOnDeposit();
        const tx = await gaugeDepositAll();
        pendingTx();
        await tx.wait();
        loadOfDeposit();
        successTx();
      } else {
        noBalanceTx();
      }
    } catch (error) {
      loadOfDeposit();
      cancelTx();
    }
  };

  return (
    <GridItem p={1} textAlign="end" alignSelf="center">
      <HStack justify="end">
        <IconButton
          isLoading={isLoadingDeposit}
          onClick={handleDeposit}
          aria-label="deposit"
          size="xs"
          colorScheme="blackAlpha"
          icon={<AddIcon />}
        />
        <IconButton
          isLoading={isLoadingWithdraw}
          onClick={handleWithdraw}
          aria-label="withdraw"
          size="xs"
          colorScheme="blackAlpha"
          icon={<MinusIcon />}
        />
      </HStack>
      <Button
        onClick={handleClaim}
        isLoading={isLoading}
        colorScheme="yellow"
        fontSize="xs"
        size="xs"
      >
        CLAIM
      </Button>
    </GridItem>
  );
};

export default FarmActions;
