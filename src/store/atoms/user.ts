import { atom } from "recoil";
import { TokenPortfolio } from "../../utils/interfaces/index.";
import { currentTokens } from "../../utils/methods";

export const userState = atom({
  key: "userState",
  default: {
    isConnected: false,
    account: "",
  },
});

export const portfolioState = atom({
  key: "portfolioState",
  default: currentTokens(250) as TokenPortfolio[],
});
