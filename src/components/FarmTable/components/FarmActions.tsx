import React from "react";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import { Button, GridItem, HStack, IconButton } from "@chakra-ui/react";
import useLoading from "../../../hooks/useLoading";
import useNotification from "../../../hooks/useNotification";
import { FarmActionProps } from "../../../utils/interfaces/components";

const FarmActions = ({ actions }: FarmActionProps) => {
  const { isLoading, loadOff, loadOn } = useLoading();
  const {
    isLoading: isLoadingWithdraw,
    loadOff: loadOffWithdraw,
    loadOn: loadOnWithdraw,
  } = useLoading();
  const { pendingTx, successTx, cancelTx } = useNotification();
  const { gaugeReward, gaugeExit } = actions;

  const handleClaim = async () => {
    try {
      loadOn();
      const tx = await gaugeReward();
      pendingTx();
      await tx.wait();
      loadOff();
      successTx();
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
    } catch (error) {
      loadOffWithdraw();
      cancelTx();
    }
  };

  return (
    <GridItem p={1} textAlign="end" alignSelf="center">
      <HStack justify="end">
        <IconButton
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
