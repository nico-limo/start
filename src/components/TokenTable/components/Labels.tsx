import { Grid, GridItem } from "@chakra-ui/react";
import React from "react";

const Labels = ({
  showBalance,
  type,
}: {
  showBalance: boolean;
  type: string;
}) => {
  const columns = showBalance ? 3 : 2;
  const fontSize = { base: "xs", md: "md" };
  const labels = {
    asset: type === "tokens" ? "Token" : "Farm",
    market: type === "tokens" ? "Price" : "Staked",
    user: type === "tokens" ? "Balance" : "Earns",
  };
  return (
    <Grid
      templateColumns={`repeat(${columns}, 1fr)`}
      borderBottom="2px solid white"
    >
      <GridItem p={2} display="flex" alignItems="center" fontSize={fontSize}>
        {labels.asset}
      </GridItem>
      <GridItem
        p={2}
        display="flex"
        alignItems="center"
        justifyContent="flex-end"
        fontSize={fontSize}
      >
        {labels.market}
      </GridItem>
      {showBalance && (
        <GridItem
          p={2}
          display="flex"
          alignItems="center"
          justifyContent="flex-end"
          fontSize={fontSize}
        >
          {labels.user}
        </GridItem>
      )}
    </Grid>
  );
};

export default Labels;
