import { Grid, GridItem } from "@chakra-ui/react";
import React from "react";

const Labels = ({ showBalance }: { showBalance: boolean }) => {
  const columns = showBalance ? 4 : 2;
  const fontSize = { base: "xs", md: "md" };
  return (
    <Grid
      templateColumns={`repeat(${columns}, 1fr)`}
      w={{ base: "full", md: 700 }}
    >
      <GridItem
        p={3}
        h="10"
        bg="teal.800"
        display="flex"
        alignItems="center"
        border="2px solid teal"
        fontSize={fontSize}
      >
        Token
      </GridItem>
      <GridItem
        p={3}
        h="10"
        bg="teal.800"
        display="flex"
        alignItems="center"
        justifyContent="flex-end"
        border="2px solid teal"
        fontSize={fontSize}
      >
        Price
      </GridItem>
      {showBalance && (
        <>
          <GridItem
            p={3}
            h="10"
            bg="teal.800"
            display="flex"
            alignItems="center"
            justifyContent="flex-end"
            border="2px solid teal"
            fontSize={fontSize}
          >
            Balance
          </GridItem>
          <GridItem
            p={3}
            h="10"
            bg="teal.800"
            display="flex"
            alignItems="center"
            justifyContent="flex-end"
            border="2px solid teal"
            fontSize={fontSize}
          >
            Balance USD
          </GridItem>
        </>
      )}
    </Grid>
  );
};

export default Labels;
