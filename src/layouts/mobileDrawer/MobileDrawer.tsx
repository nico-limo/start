import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  VStack,
} from "@chakra-ui/react";
import Link from "next/link";
import { FC, useRef } from "react";
import { PricesStatics } from "../../components/PricesStatics";
import { WalletConnection } from "../../components/WalletConnection";
import { WalletRole } from "../../components/WalletRole";
import { UserMethods } from "../../store/methods/user";
import { PAGES } from "../../utils/constants";
import { MobileTopBar } from "../../utils/interfaces/components";

const MobileDrawer: FC<MobileTopBar> = ({
  isOpen,
  onClose,
  onModalOpen,
  onPurchaseOpen,
}) => {
  const btnRef = useRef();
  const { wallet } = UserMethods();
  return (
    <>
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent bg="gray.700">
          <DrawerCloseButton />
          <DrawerHeader>Menu</DrawerHeader>
          <DrawerBody>
            <VStack>
              <WalletConnection onModalOpen={onModalOpen} />
              {wallet.isConnected && (
                <WalletRole onPurchaseOpen={onPurchaseOpen} />
              )}

              {PAGES.map((page) => (
                <Link key={page.id} href={page.path} passHref>
                  <Button variant="nav"> {page.label} </Button>
                </Link>
              ))}
            </VStack>
          </DrawerBody>

          <DrawerFooter justifyContent="space-between">
            <PricesStatics />
            <Button variant="solid" colorScheme="red" mr={3} onClick={onClose}>
              Cancel
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default MobileDrawer;
