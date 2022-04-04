import { Grid, GridItem } from "@chakra-ui/react";
import React from "react";
import { UserMethods } from "../../../store/methods/user";

const Labels = () => {
  const { isPremium } = UserMethods();
  const columns = isPremium ? "1fr 1fr 1fr 80px" : "1fr 1fr 1fr";
  const fontSize = { base: "xs", md: "md" };
  const labels = {
    asset: "Farm",
    market: "Staked",
    user: "Earns",
    action: "Claim",
  };
  return (
    <Grid templateColumns={columns} borderBottom="2px solid white">
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
      <GridItem
        p={2}
        display="flex"
        alignItems="center"
        justifyContent="flex-end"
        fontSize={fontSize}
      >
        {labels.user}
      </GridItem>
      {columns && (
        <GridItem
          p={2}
          display="flex"
          alignItems="center"
          justifyContent="flex-end"
          fontSize={fontSize}
        >
          {labels.action}
        </GridItem>
      )}
    </Grid>
  );
};

export default Labels;
