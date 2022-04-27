import {
  Button,
  Divider,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import useLoading from "../../hooks/useLoading";
import useNotification from "../../hooks/useNotification";
import useNetwork from "../../store/methods/useNetwork";
import { useUserMethods } from "../../store/methods/user";
import { DONATE } from "../../utils/constants";
import { sendTransaction } from "../../utils/cryptoMethods";

const defaultSelection = { low: false, mid: false, top: false };

const DonateModal = ({ isOpen, onClose }) => {
  const { isLoading, loadOff, loadOn } = useLoading();
  const { wallet } = useUserMethods();
  const { network } = useNetwork();
  const [isSelected, setIsSelected] = useState(defaultSelection);
  const { symbol, chainID } = network;
  const { low, mid, top } = DONATE[chainID];
  const { cancelTx, pendingTx, donateSuccessTx } = useNotification();

  const sendDonate = async (amount) => {
    try {
      loadOn();
      const tx = await sendTransaction(wallet.account, amount);
      pendingTx();
      await tx.wait();
      donateSuccessTx();
      loadOff();
      setIsSelected(defaultSelection);
    } catch (error) {
      loadOff();
      cancelTx();
      setIsSelected(defaultSelection);
    }
  };

  return (
    <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bg="gray.700">
        <ModalHeader>Buy Me Something</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text fontWeight="bold" mb="1rem">
            This is a free project with the objetive of control your portfolio
            by adding the Protocols actions.
          </Text>
          <Text fontWeight="bold" mb="1rem">
            Here is some donate options to choose:
          </Text>
          <VStack>
            <HStack w="full" justify="space-between">
              <Text>Buy me a coffee</Text>
              <Button
                onClick={() => {
                  setIsSelected((prevState) => ({ ...prevState, low: true }));
                  sendDonate(low);
                }}
                bg="gray.600"
                w={100}
                _hover={{ color: "black", bg: "green.400" }}
                isLoading={isSelected.low && isLoading}
              >
                {`${low} ${symbol}`}
              </Button>
            </HStack>
            <HStack w="full" justify="space-between">
              <Text>Buy me a lunch</Text>
              <Button
                onClick={() => {
                  setIsSelected((prevState) => ({ ...prevState, mid: true }));
                  sendDonate(mid);
                }}
                bg="gray.600"
                w={100}
                _hover={{ color: "black", bg: "green.400" }}
                isLoading={isSelected.mid && isLoading}
              >
                {`${mid} ${symbol}`}
              </Button>
            </HStack>
            <HStack w="full" justify="space-between">
              <Text>Buy me a dinner</Text>
              <Button
                onClick={() => {
                  setIsSelected((prevState) => ({ ...prevState, top: true }));
                  sendDonate(top);
                }}
                bg="gray.600"
                w={100}
                _hover={{ color: "black", bg: "green.400" }}
                isLoading={isSelected.top && isLoading}
              >
                {`${top} ${symbol}`}
              </Button>
            </HStack>
          </VStack>
        </ModalBody>

        <Divider />
        <ModalFooter>
          <Text>
            Thanks to you I will pay the services an continue adding more
            features
          </Text>
          <Button w={100} colorScheme="facebook" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DonateModal;
