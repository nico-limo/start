import { atom } from "recoil";
import { ROLE } from "../../utils/constants";
import { FarmsPortfolio, TokenPortfolio } from "../../utils/interfaces/index.";
import { currentTokens } from "../../utils/methods";

export const userState = atom({
  key: "userState",
  default: {
    isConnected: false,
    account: "",
    role: ROLE.premium,
  },
});

export const portfolioState = atom({
  key: "portfolioState",
  default: currentTokens(250) as TokenPortfolio[],
});

export const farmsState = atom({
  key: "farmsState",
  default: [] as FarmsPortfolio[],
});
