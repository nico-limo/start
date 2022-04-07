import { useToast } from "@chakra-ui/react";

const useNotification = () => {
  const toast = useToast();

  const pendingTx = (symbol: string) =>
    toast({
      title: "Claiming Proccessing",
      description: `Claiming SPIRIT from ${symbol}`,
      position: "top-right",
      status: "info",
      isClosable: true,
    });
  const successTx = () =>
    toast({
      title: "Claim Success",
      description: `Claimed rewards`,
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

  return { pendingTx, successTx, errorDB, cancelTx };
};

export default useNotification;
