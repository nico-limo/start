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
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRef } from "react";
import PricesStatics from "../../components/PricesStatics";
import WalletConnection from "../../components/WalletConnection";
import { useUserMethods } from "../../store/methods/user";
import { PAGES } from "../../utils/constants";
import { MobileTopBarProps } from "../../utils/interfaces/components";

// Dynamic
const WalletRole = dynamic(() => import("../../components/WalletRole"));

const MobileDrawer = ({
  isOpen,
  onClose,
  onModalOpen,
  onPurchaseOpen,
}: MobileTopBarProps) => {
  const btnRef = useRef();
  const { wallet } = useUserMethods();
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
