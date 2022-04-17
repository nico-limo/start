import { atom } from "recoil";
import { ROLE } from "../../utils/constants";
import {
  FarmsLiquidity,
  FarmsPortfolio,
  TokenPortfolio,
} from "../../utils/interfaces/index.";
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
  default: { assets: currentTokens(250), hasBalance: false, liquidity: [] } as {
    assets: TokenPortfolio[];
    liquidity: TokenPortfolio[];
    hasBalance: boolean;
  },
});

export const farmsState = atom({
  key: "farmsState",
  default: { spiritFarms: [], liquidity: [], spookyFarms: [] } as {
    spiritFarms: FarmsPortfolio[];
    spookyFarms: FarmsPortfolio[];
    liquidity: FarmsLiquidity[];
  },
});
