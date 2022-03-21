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
import WalletConnect from "../components/WalletConnect";
import { PAGES } from "../utils/constants";
import { MobileTopBar } from "../utils/interfaces";

const MobileDrawer: FC<MobileTopBar> = ({ isOpen, onClose }) => {
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
              <WalletConnect />
              {PAGES.map((page) => (
                <Link key={page.id} href={page.path}>
                  <Button variant="nav"> {page.label} </Button>
                </Link>
              ))}
            </VStack>
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue">Action</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default MobileDrawer;
