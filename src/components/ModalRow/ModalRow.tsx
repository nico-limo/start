import { Box, HStack } from "@chakra-ui/react";
import Image from "next/image";
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
        <Box
          key={`modal-${type}-${item.id}`}
          bg={selectedItem?.id === item.id ? "gray.900" : "none"}
          cursor="pointer"
          _hover={{ bg: "gray.900", transition: "500ms ease" }}
          onClick={() => onSelect(item)}
        >
          <Image
            alt={item.label}
            src={`/${type}/${item.label}.png`}
            width={65}
            height={65}
            loading="lazy"
          />
        </Box>
      ))}
    </HStack>
  );
};

export default ModalRow;
