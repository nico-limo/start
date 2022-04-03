import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import { API_COVALENT } from "../../utils/constants";
import { CovalentData, CovalentPool } from "../../utils/interfaces/index.";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const params = {
    key: process.env.NEXT_PUBLIC_COVALENT_KEY,
  };
  const { query } = req;

  try {
    const { data } = await axios.get(
      `https://api.covalenthq.com/v1/${query.chainID}/xy=k/spiritswap/pools/?quote-currency=USD&&key=${params.key}`
    );
    const covalentPools = data.data.items;
    res.status(200).json(covalentPools);
  } catch (error) {
    res.status(500).send("Error getting Covalent Data");
  }
};
