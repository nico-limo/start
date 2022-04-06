import axios from "axios";

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
  try {
    const controller = new AbortController();
    const { data } = await axios.get(
      "https://bw1vnk7s5m.execute-api.us-east-1.amazonaws.com/dev/prices",
      {
        signal: controller.signal,
      }
    );
    controller.abort();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).send("Error getting Coingecko Data");
  }
};
