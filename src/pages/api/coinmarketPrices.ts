import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import { API_COINMARKET } from "../../utils/constants";

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req;
  const params = {
    symbol: query.tokens,
  };
  const headers = {
    "X-CMC_PRO_API_KEY": process.env.NEXT_PUBLIC_COINMARKET_KEY,
  };

  console.log("params ", params);
  console.log("headers ", headers);
  try {
    const { data: coinmarketData } = await axios.get(`${API_COINMARKET}`, {
      params,
      headers,
    });
    res.status(200).json(coinmarketData);
  } catch (error) {
    res.status(500).send("Error getting coinmarket prices");
  }
};
