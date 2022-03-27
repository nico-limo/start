import { Grid, GridItem } from "@chakra-ui/react";
import React from "react";

const Labels = () => {
  return (
    <Grid templateColumns="repeat(3, 1fr)" w={{ base: 400, md: 700 }}>
      <GridItem
        p={3}
        w="100%"
        h="10"
        bg="teal.800"
        display="flex"
        alignItems="center"
        border="2px solid teal"
      >
        Token
      </GridItem>
      <GridItem
        p={3}
        w="100%"
        h="10"
        bg="teal.800"
        display="flex"
        alignItems="center"
        justifyContent="flex-end"
        border="2px solid teal"
      >
        Price
      </GridItem>
      <GridItem
        p={3}
        w="100%"
        h="10"
        bg="teal.800"
        display="flex"
        alignItems="center"
        justifyContent="flex-end"
        border="2px solid teal"
      >
        Balance
      </GridItem>
    </Grid>
  );
};

export default Labels;
