import { HStack, Image } from "@chakra-ui/react";
import React, { FC } from "react";
import { ModalRowProps } from "../../utils/interfaces/components";

const ModalRow: FC<ModalRowProps> = ({
  type,
  list,
  onSelect,
  selectedItem,
}) => {
  return (
    <HStack spacing={6}>
      {list.map((item) => (
        <Image
          key={`modal-${type}-${item.id}`}
          alt={item.label}
          bg={selectedItem?.id === item.id ? "gray.900" : "none"}
          src={`/${type}/${item.label}.png`}
          onClick={() => onSelect(item)}
          cursor="pointer"
          _hover={{ bg: "gray.900", transition: "500ms ease" }}
          w={20}
          h={20}
        />
      ))}
    </HStack>
  );
};

export default ModalRow;
