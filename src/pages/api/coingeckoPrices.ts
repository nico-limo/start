import axios from "axios";
import { PATH_COINGECKO } from "../../utils/constants/tokens/tokens";

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
  try {
    const params = {
      ids: PATH_COINGECKO,
      include_24hr_change: true,
      vs_currencies: "usd",
    };

    const { data } = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price",
      { params }
    );
    res.status(200).json(data);
  } catch (error) {
    res.status(500).send("Error getting Coingecko Data");
  }
};
