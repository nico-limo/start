import React from "react";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import { Button, GridItem, HStack, IconButton } from "@chakra-ui/react";
import useNotification from "../../../hooks/useNotification";
import { FarmActionProps } from "../../../utils/interfaces/components";
import useLoading from "../../../hooks/useLoading";
import { checkAddresses } from "../../../utils/methods";
import useTokens from "../../../store/methods/useTokens";

const FarmActions = ({ actions, address, onClaim }: FarmActionProps) => {
  const { portfolio } = useTokens();
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
  const { getRewards, withdrawAll, depositAll } = actions;

  const handleClaim = async () => {
    try {
      loadOn();
      const tx = await getRewards();
      pendingTx();
      await tx.wait();
      loadOff();
      successTx();
      onClaim();
    } catch (error) {
      loadOff();
      cancelTx();
    }
  };

  const handleWithdraw = async () => {
    try {
      loadOnWithdraw();
      const tx = await withdrawAll();
      pendingTx();
      await tx.wait();
      loadOffWithdraw();
      successTx();
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
        const tx = await depositAll();
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
