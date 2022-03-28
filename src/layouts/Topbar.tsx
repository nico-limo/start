import { useRef } from "react";
import { HamburgerIcon } from "@chakra-ui/icons";
import {
  chakra,
  Flex,
  HStack,
  Button,
  IconButton,
  useDisclosure,
  Image,
  Text,
} from "@chakra-ui/react";
import { PAGES } from "../utils/constants";
import MobileDrawer from "./MobileDrawer";
import { PricesStatics } from "../components/PricesStatics";
import WalletModal from "../components/WalletModal/WalletModal";
import { WalletConnection } from "../components/WalletConnection";
import { NetworksMethods } from "../store/methods/network";
import Link from "next/link";

const Topbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isModalOpen,
    onOpen: onModalOpen,
    onClose: onModalClose,
  } = useDisclosure();
  const btnRef = useRef();
  const { network } = NetworksMethods();

  return (
    <chakra.header id="header" bg="gray.600" position="sticky" top={0} w="full">
      <Flex py={2} px={4} align="center" justify="space-between">
        <HStack>
          <Image src="https://picsum.photos/id/237/40" alt="text" />
          <Text fontSize="large" fontWeight={500} color="teal.300">
            StartSwap
          </Text>
        </HStack>

        <HStack display={{ base: "none", md: "inherit" }} as="nav" spacing="5">
          {PAGES.map((page) => (
            <Link key={page.id} href={page.path}>
              <Button variant="nav"> {page.label} </Button>
            </Link>
          ))}
        </HStack>
        <HStack display={{ base: "none", md: "inherit" }}>
          <PricesStatics />
          <WalletConnection onModalOpen={onModalOpen} />
          <Image src={`/networks/${network.label}.png`} w={8} />
        </HStack>
        <IconButton
          display={{ base: "inherit", md: "none" }}
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
