import { AddIcon, LinkIcon } from "@chakra-ui/icons";
import { GridItem } from "@chakra-ui/react";
import { parseUnits } from "ethers/lib/utils";
import React from "react";
import useLoading from "../../../hooks/useLoading";
import useNotification from "../../../hooks/useNotification";
import useNetwork from "../../../store/methods/useNetwork";
import useTokens from "../../../store/methods/useTokens";
import { SCANS } from "../../../utils/constants";
import { addToken } from "../../../utils/cryptoMethods";
import { TokenActionsProps } from "../../../utils/interfaces/components";
import {
  OptionsActionsProps,
  ScanProps,
} from "../../../utils/interfaces/index.";
import { checkAddresses } from "../../../utils/methods";
import PopupActions from "./PopupActions";

const TokenActions = ({ token, isTokens }: TokenActionsProps) => {
  const { farmsPortfolio } = useTokens();
  const { chainID } = useNetwork();
  const { balance } = token;
  const { isLoading, loadOff, loadOn } = useLoading();
  const {
    cancelTx,
    pendingTx,
    successTx,
    noFarmExist,
    needApproveTx,
    successApproveTx,
  } = useNotification();

  const scanInfo: ScanProps = SCANS[chainID];

  const openScan = () => {
    window.open(`${scanInfo.scanPath}${token.address}`);
  };

  const handleStake = async () => {
    try {
      const tokenPool =
        farmsPortfolio.liquidity &&
        farmsPortfolio.liquidity.find((lpPool) =>
          checkAddresses(lpPool.lpAddresses[250], token.address)
        );

      if (tokenPool) {
        const { depositAll, allowance, approve } = tokenPool;
        loadOn();

        const parseBalance = parseUnits(balance, token.decimals);
        if (allowance.lt(parseBalance)) {
          needApproveTx();
          const txApprove = await approve();
          await txApprove.wait();
          successApproveTx();
        }

        const tx = await depositAll();
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

  const options: OptionsActionsProps = !isTokens
    ? {
        header: "Farm Actions",
        options: [
          {
            label: "Stake",
            action: handleStake,
            id: "stake",
            icon: <AddIcon />,
          },
        ],
      }
    : {
        header: "Token Actions",
        options: [
          {
            label: "Add Token",
            action: () => addToken(token),
            id: "register",
            icon: <AddIcon />,
          },
          {
            label: `View on ${scanInfo.scanName}`,
            action: () => openScan(),
            id: "viewscan",
            icon: <LinkIcon />,
          },
        ],
      };

  return (
    <GridItem
      p={2}
      display="flex"
      alignItems="center"
      justifyContent="flex-end"
    >
      <PopupActions token={token} isLoading={isLoading} label={options} />
    </GridItem>
  );
};

export default TokenActions;
