import { Grid, GridItem } from "@chakra-ui/react";
import React from "react";
import { useUserMethods } from "../../../store/methods/user";
import { TokenInfoProps } from "../../../utils/interfaces/index.";
import { getColumns } from "../../../utils/methods";

const Labels = ({
  showBalance,
  type,
}: {
  showBalance: boolean;
  type: TokenInfoProps;
}) => {
  const { isPremium } = useUserMethods();
  const columns = getColumns(showBalance, isPremium);

  const fontSize = { base: "xs", md: "md" };
  const labels = {
    asset: type.label_asset,
    market: "Price",
    user: "Balance",
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
