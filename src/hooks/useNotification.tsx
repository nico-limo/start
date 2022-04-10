import { useToast } from "@chakra-ui/react";

const useNotification = () => {
  const toast = useToast();

  const pendingTx = () =>
    toast({
      title: "Transaction Proccessing",
      description: "Your Transaction is proccessing",
      position: "top-right",
      status: "info",
      isClosable: true,
    });
  const successTx = () =>
    toast({
      title: "Transaction Success",
      description: `Your transaction is completed`,
      position: "top-right",
      status: "success",
      isClosable: true,
    });
  const errorDB = (apiName: string) =>
    toast({
      title: "Error Fetch",
      description: `Failed to get information from ${apiName}`,
      position: "top-right",
      status: "error",
      isClosable: true,
    });

  const cancelTx = () =>
    toast({
      title: "Transaction cancelled",
      description: "Rejected from the user",
      position: "top-right",
      status: "error",
      isClosable: true,
    });
  const noBalanceTx = () =>
    toast({
      title: "Insufficient Balance",
      description: "Don't have enought Balance",
      position: "top-right",
      status: "warning",
      isClosable: true,
    });
  const noFarmExist = () =>
    toast({
      title: "Farm Not Exist",
      description: "This Farm not exist on SpiritSwap",
      position: "top-right",
      status: "warning",
      isClosable: true,
    });
  const needApproveTx = () =>
    toast({
      title: "Need Approve",
      description: "This Pool is not approved",
      position: "top-right",
      status: "warning",
      isClosable: true,
    });
  const successApproveTx = () =>
    toast({
      title: "Approved Success",
      description: "The Pool was approved",
      position: "top-right",
      status: "success",
      isClosable: true,
    });

  return {
    pendingTx,
    successTx,
    errorDB,
    cancelTx,
    noBalanceTx,
    noFarmExist,
    needApproveTx,
    successApproveTx,
  };
};

export default useNotification;
