import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  Text,
} from "@chakra-ui/react";
import React, { FC, useState } from "react";
import { NetworksMethods } from "../../store/methods/network";
import { UserMethods } from "../../store/methods/user";
import {
  DEFAULT_NETWORK,
  DEFAULT_WALLET,
  NETWORKS_LIST,
  WALLETS_LIST,
} from "../../utils/constants";
import { networkConnection } from "../../utils/cryptoMethods";
import {
  ItemSelection,
  WalletModalProps,
} from "../../utils/interfaces/components";

import { ModalRow } from "../ModalRow";

const WalletModal: FC<WalletModalProps> = ({ onClose, isOpen }) => {
  const { logIn } = UserMethods();
  const { connectNetwork } = NetworksMethods();
  const [networkSelected, setNetworkSelected] =
    useState<ItemSelection>(DEFAULT_NETWORK);
  const [walletSelected, setWalletSelected] =
    useState<ItemSelection>(DEFAULT_WALLET);

  const handleNetwork = (value: ItemSelection) => setNetworkSelected(value);
  const handleWallet = (value: ItemSelection) => setWalletSelected(value);

  const handleConnection = () => {
    logIn();
    networkConnection(networkSelected.id);
    connectNetwork(networkSelected.id, walletSelected.id);
    onClose();
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bg="gray.700">
        <ModalHeader>Setup Your Connection</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={8}>
            <VStack>
              <Text>Choose the network</Text>
              <ModalRow
                type="networks"
                list={NETWORKS_LIST}
                onSelect={handleNetwork}
                selectedItem={networkSelected}
              />
            </VStack>
            <VStack>
              <Text>Choose your wallet</Text>
              <ModalRow
                type="wallets"
                list={WALLETS_LIST}
                onSelect={handleWallet}
                selectedItem={walletSelected}
              />
            </VStack>
          </VStack>
        </ModalBody>

        <ModalFooter justifyContent="space-around">
          <Button colorScheme="facebook" onClick={handleConnection}>
            Connect
          </Button>
          <Button colorScheme="facebook" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default WalletModal;
