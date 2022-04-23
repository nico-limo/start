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
import React, { FC } from "react";
import { useUserMethods } from "../../store/methods/user";
import { WalletModalProps } from "../../utils/interfaces/components";

const PurshaseModal: FC<WalletModalProps> = ({ onClose, isOpen }) => {
  const { upgradeRole } = useUserMethods();

  const handleUpgrade = () => {
    upgradeRole();
    onClose();
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bg="gray.700">
        <ModalHeader>Upgrade your account</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={8}>
            <VStack>
              <Text>
                Upgrade your role to have access to all the features on the
                website. Be able to claim your rewards from differents farms on
                different protocol
              </Text>
            </VStack>
          </VStack>
        </ModalBody>

        <ModalFooter justifyContent="space-around">
          <Button colorScheme="facebook" onClick={handleUpgrade}>
            Upgrade
          </Button>
          <Button colorScheme="red" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PurshaseModal;
