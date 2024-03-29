import { useRef } from "react";
import { HamburgerIcon } from "@chakra-ui/icons";
import {
  chakra,
  Flex,
  HStack,
  Button,
  IconButton,
  useDisclosure,
  Text,
} from "@chakra-ui/react";
import { PAGES } from "../utils/constants";
import PricesStatics from "../components/PricesStatics";
import Link from "next/link";
import { useUserMethods } from "../store/methods/user";
import Image from "next/image";
import dynamic from "next/dynamic";

// Dinamic Components
const WalletModal = dynamic(() => import("../components/WalletModal"));
const PurshaseModal = dynamic(() => import("../components/PurshaseModal"));
const MobileDrawer = dynamic(() => import("./MobileDrawer/MobileDrawer"));
const WalletRole = dynamic(() => import("../components/WalletRole"));
const WalletConnection = dynamic(
  () => import("../components/WalletConnection")
);

const Topbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isModalOpen,
    onOpen: onModalOpen,
    onClose: onModalClose,
  } = useDisclosure();
  const {
    isOpen: isPurchaseOpen,
    onOpen: onPurchaseOpen,
    onClose: onPurchaseClose,
  } = useDisclosure();
  const btnRef = useRef();
  const { wallet } = useUserMethods();
  return (
    <chakra.header
      id="header"
      bg="gray.600"
      position="sticky"
      top={0}
      w="full"
      zIndex={3}
      mb={2}
    >
      <Flex py={2} px={4} align="center" justify="space-between">
        <HStack>
          <Image
            width={30}
            height={30}
            src="/wallets/coinbase.png"
            alt="text"
            loading="eager"
          />
          <Text fontSize="large" fontWeight={500} color="teal.300">
            StartSwap
          </Text>
        </HStack>

        <HStack display={{ base: "none", md: "inherit" }} as="nav" spacing="5">
          {PAGES.map((page) => (
            <Link key={page.id} href={page.path} passHref>
              <Button variant="nav"> {page.label} </Button>
            </Link>
          ))}
        </HStack>
        <HStack display={{ base: "none", md: "inherit" }}>
          <PricesStatics />
          <WalletConnection onModalOpen={onModalOpen} />
          {wallet.isConnected && <WalletRole onPurchaseOpen={onPurchaseOpen} />}
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
      {isModalOpen && (
        <WalletModal isOpen={isModalOpen} onClose={onModalClose} />
      )}
      {isPurchaseOpen && (
        <PurshaseModal isOpen={isPurchaseOpen} onClose={onPurchaseClose} />
      )}
      <MobileDrawer
        isOpen={isOpen}
        onClose={onClose}
        onModalOpen={onModalOpen}
        onPurchaseOpen={onPurchaseOpen}
      />
    </chakra.header>
  );
};

export default Topbar;
