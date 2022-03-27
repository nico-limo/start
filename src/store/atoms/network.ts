import { atom } from "recoil";

export const networkState = atom({
  key: "networkState",
  default: {
    chainID: 250,
    name: "Fantom Opera",
    label: "Fantom",
    symbol: "FTM",
    hex: "0xfa",
  },
});
