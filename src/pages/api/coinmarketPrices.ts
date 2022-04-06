import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import { API_COINMARKET } from "../../utils/constants";
import Cors from "cors";

// Initializing the cors middleware
const cors = Cors({
  methods: ["GET", "HEAD"],
});

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req;
  const params = {
    symbol: query.tokens,
  };
  const headers = {
    "X-CMC_PRO_API_KEY": process.env.NEXT_PUBLIC_COINMARKET_KEY,
  };

  try {
    await runMiddleware(req, res, cors);
    const { data: coinmarketData } = await axios.get(`${API_COINMARKET}`, {
      params,
      headers,
    });
    res.status(200).json(coinmarketData);
  } catch (error) {
    res.status(500).send("Error getting coinmarket prices");
  }
};
