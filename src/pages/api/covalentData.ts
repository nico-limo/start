import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import { API_COVALENT } from "../../utils/constants";
import { CovalentData } from "../../utils/interfaces/index.";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const params = {
    key: process.env.NEXT_PUBLIC_COVALENT_KEY,
  };
  const { query } = req;

  try {
    const { data: covalentData } = await axios.get(
      `${API_COVALENT}/${query.chainID}/address/${query.account}/balances_v2/`,
      {
        params,
      }
    );
    res.status(200).json(covalentData);
  } catch (error) {
    res.status(500).send("Error getting Covalent Data");
  }
};
