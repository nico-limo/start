import React, { useState } from "react";
import { AddIcon, LinkIcon, MinusIcon, StarIcon } from "@chakra-ui/icons";
import { GridItem } from "@chakra-ui/react";
import useNotification from "../../../hooks/useNotification";
import { FarmActionProps } from "../../../utils/interfaces/components";
import useLoading from "../../../hooks/useLoading";
import { checkAddresses, openScan } from "../../../utils/methods";
import useTokens from "../../../store/methods/useTokens";
import {
  OptionsActionsProps,
  ScanProps,
} from "../../../utils/interfaces/index.";
import { SCANS } from "../../../utils/constants";
import useNetwork from "../../../store/methods/useNetwork";
import PopupActions from "../../TokenTable/components/PopupActions";

const FarmActions = ({ actions, address, onClaim }: FarmActionProps) => {
  const { portfolio } = useTokens();
  const { chainID } = useNetwork();
  const { isLoading, loadOff, loadOn } = useLoading();

  const { pendingTx, successTx, cancelTx, noBalanceTx } = useNotification();
  const { getRewards, withdrawAll, depositAll } = actions;
  const scanInfo: ScanProps = SCANS[chainID];

  const [actionSelected, setActionSelected] = useState("deposit");

  const handleAction = (action: string) => {
    setActionSelected(action);
  };

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
      loadOn();
      const tx = await withdrawAll();
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

  const handleDeposit = async () => {
    try {
      const farmPool =
        portfolio.hasBalance &&
        portfolio.liquidity.find((lpPool) =>
          checkAddresses(lpPool.address, address)
        );
      if (farmPool) {
        loadOn();
        const tx = await depositAll();
        pendingTx();
        await tx.wait();
        loadOff();
        successTx();
      } else {
        noBalanceTx();
      }
    } catch (error) {
      loadOff();
      cancelTx();
    }
  };

  const options: OptionsActionsProps = {
    header: "Farm Actions",
    options: [
      {
        label: "Deposit",
        action: handleDeposit,
        id: "deposit",
        icon: <AddIcon />,
      },
      {
        label: "Withdraw",
        action: handleWithdraw,
        id: "withdraw",
        icon: <MinusIcon />,
      },
      {
        label: "Claim",
        action: handleClaim,
        id: "claim",
        icon: <StarIcon />,
      },
      {
        label: `View on ${scanInfo.scanName}`,
        action: () => openScan(scanInfo.scanPath, address),
        id: "viewscan",
        icon: <LinkIcon />,
      },
    ],
  };

  return (
    <GridItem p={1} textAlign="end" alignSelf="center">
      <PopupActions
        isLoading={isLoading}
        label={options}
        onAction={handleAction}
        action={actionSelected}
      />
    </GridItem>
  );
};

export default FarmActions;
