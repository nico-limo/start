import { HamburgerIcon } from "@chakra-ui/icons";
import {
  chakra,
  Flex,
  HStack,
  Button,
  Link,
  IconButton,
  useDisclosure,
  Image,
  Box,
} from "@chakra-ui/react";
import { useRef } from "react";
import { PAGES } from "../utils/constants";
import MobileDrawer from "./MobileDrawer";
import { PricesStatics } from "../components/PricesStatics";
import WalletModal from "../components/WalletModal/WalletModal";
import { WalletConnection } from "../components/WalletConnection";
import { useRecoilValue } from "recoil";
import { networkState } from "../store/atoms/network";

const Topbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isModalOpen,
    onOpen: onModalOpen,
    onClose: onModalClose,
  } = useDisclosure();
  const btnRef = useRef();
  const { label } = useRecoilValue(networkState);

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
        <HStack>
          <PricesStatics display="none" />
          <WalletConnection onModalOpen={onModalOpen} />
          <Image src={`/networks/${label}.png`} w={8} />
        </HStack>
        <IconButton
          display={{ base: "initial", md: "none" }}
          ref={btnRef}
          onClick={onOpen}
          colorScheme="facebook"
          aria-label="Open Drawer"
          icon={<HamburgerIcon />}
        ></IconButton>
      </Flex>
      <WalletModal isOpen={isModalOpen} onClose={onModalClose} />
      <MobileDrawer
        isOpen={isOpen}
        onClose={onClose}
        onModalOpen={onModalOpen}
      />
    </chakra.header>
  );
};

export default Topbar;
