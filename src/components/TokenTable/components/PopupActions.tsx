import { DragHandleIcon } from "@chakra-ui/icons";
import {
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  PopoverContent,
  IconButton,
  HStack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { PopupActionsProps } from "../../../utils/interfaces/components";

const PopupActions = ({
  isLoading,
  label,
  onAction,
  action,
}: PopupActionsProps) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { header, options } = label;
  return (
    <Popover
      placement="bottom-end"
      onOpen={onOpen}
      onClose={onClose}
      isOpen={isOpen}
    >
      <PopoverTrigger>
        <IconButton
          aria-label="options"
          colorScheme="blackAlpha"
          size="xs"
          icon={<DragHandleIcon />}
        />
      </PopoverTrigger>
      {isOpen && (
        <Portal>
          <PopoverContent bg="gray.800" borderColor="blue.800" w={210}>
            <PopoverArrow />
            <PopoverHeader>{header}</PopoverHeader>
            <PopoverCloseButton />
            <PopoverBody>
              {options.map((option) => (
                <HStack
                  justify="space-between"
                  key={`option-${option.id}`}
                  my={1}
                  borderBottom="1px white solid"
                  _hover={{
                    bg: "gray.600",
                    transition: "300ms ease",
                  }}
                >
                  <Text>{option.label}</Text>
                  <IconButton
                    aria-label={`${option.id}`}
                    isLoading={action === option.id && isLoading}
                    onClick={async () => {
                      onAction(option.id);
                      await option.action();
                      onClose();
                    }}
                    colorScheme="facebook"
                    size="xs"
                    icon={option.icon}
                  />
                </HStack>
              ))}
            </PopoverBody>
          </PopoverContent>
        </Portal>
      )}
    </Popover>
  );
};

export default PopupActions;
