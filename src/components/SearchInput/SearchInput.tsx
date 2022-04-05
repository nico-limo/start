import { SearchIcon } from "@chakra-ui/icons";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import React from "react";
import { SearchInputProps } from "../../utils/interfaces/index.";

const SearchInput = ({
  isVisible,
  onToggle,
  onChange,
  value,
}: SearchInputProps) => {
  return (
    <InputGroup
      w={{ base: "250", md: "200px" }}
      transition="3s ease-in"
      h="40px"
    >
      <Input
        value={value}
        opacity={isVisible ? 1 : 0}
        cursor={isVisible ? "text" : "default"}
        placeholder="Find a farm"
        transition={" opacity 0.4s ease-in-out 0s"}
        onChange={onChange}
      />

      <InputRightElement
        bg="ButtonShadow"
        cursor="pointer"
        borderRadius="5px"
        onClick={onToggle}
      >
        <SearchIcon />
      </InputRightElement>
    </InputGroup>
  );
};

export default SearchInput;
