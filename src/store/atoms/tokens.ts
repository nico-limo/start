import { atom } from "recoil";
import { PRINCIPAL_DEFAULT } from "../../utils/constants";
import { PrincipalTokensProps } from "../../utils/interfaces/index.";

export const principalTokensState = atom({
  key: "principalTokensState",
  default: PRINCIPAL_DEFAULT as PrincipalTokensProps,
});
