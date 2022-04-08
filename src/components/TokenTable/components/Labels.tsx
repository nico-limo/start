import { Grid, GridItem } from "@chakra-ui/react";
import React from "react";
import { UserMethods } from "../../../store/methods/user";

const Labels = ({
  showBalance,
  type,
}: {
  showBalance: boolean;
  type: string;
}) => {
  const { isPremium } = UserMethods();
  const columns = showBalance
    ? isPremium && type === "liquidity"
      ? "1fr 1fr 1fr 80px"
      : "1fr 1fr 1fr"
    : "1fr 1fr";
  const fontSize = { base: "xs", md: "md" };
  const isToken = type === "assets";
  const labels = {
    asset: isToken ? "Token" : "Pool",
    market: "Price",
    user: "Balance",
    stake: "Stake",
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
      {isPremium && type === "liquidity" && (
        <GridItem
          p={2}
          display="flex"
          alignItems="center"
          justifyContent="flex-end"
          fontSize={fontSize}
        >
          {labels.stake}
        </GridItem>
      )}
    </Grid>
  );
};

export default Labels;
