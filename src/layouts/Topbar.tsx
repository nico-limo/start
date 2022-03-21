import { HamburgerIcon } from "@chakra-ui/icons";
import {
  Image,
  chakra,
  Flex,
  HStack,
  Button,
  Link,
  IconButton,
  useDisclosure,
} from "@chakra-ui/react";
import { useRef } from "react";
import WalletConnect from "../components/WalletConnect";
import { PAGES } from "../utils/constants";
import MobileDrawer from "./MobileDrawer";

const Topbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();

  return (
    <chakra.header id="header" bg="gray.600" position="sticky" top={0} w="full">
      <Flex py={2} px={4} align="center" justify="space-between">
        <Image src="https://picsum.photos/id/237/40" alt="text" />
        <HStack display={{ base: "none", md: "initial" }} as="nav" spacing="5">
          {PAGES.map((page) => (
            <Link key={page.id} href={page.path}>
              <Button variant="nav"> {page.label} </Button>
            </Link>
          ))}
        </HStack>
        <WalletConnect display="none" />
        <IconButton
          display={{ base: "initial", md: "none" }}
          ref={btnRef}
          onClick={onOpen}
          colorScheme="facebook"
          aria-label="Open Drawer"
          icon={<HamburgerIcon />}
        ></IconButton>
      </Flex>
      <MobileDrawer isOpen={isOpen} onClose={onClose} />
    </chakra.header>
  );
};

export default Topbar;
