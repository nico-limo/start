import { atom } from "recoil";
import { TokenPortfolio } from "../../utils/interfaces/index.";
import { getToken } from "../../utils/methods";

export const spiritState = atom({
  key: "spiritState",
  default: getToken(250, "SPIRIT") as TokenPortfolio,
});
