import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Link,
  VStack,
} from "@chakra-ui/react";
import { FC, useRef } from "react";
import { PricesStatics } from "../components/PricesStatics";
import { WalletConnection } from "../components/WalletConnection";
import { PAGES } from "../utils/constants";
import { MobileTopBar } from "../utils/interfaces";

const MobileDrawer: FC<MobileTopBar> = ({ isOpen, onClose, onModalOpen }) => {
  const btnRef = useRef();

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
              {PAGES.map((page) => (
                <Link key={page.id} href={page.path}>
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
