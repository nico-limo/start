import { Grid, GridItem } from "@chakra-ui/react";
import React from "react";
import { useUserMethods } from "../../../store/methods/user";
import { getColumns } from "../../../utils/methods";

const Labels = () => {
  const { isPremium } = useUserMethods();
  const columns = getColumns(true, isPremium);
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
      {isPremium && (
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
