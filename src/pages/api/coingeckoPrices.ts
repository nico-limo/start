import axios from "axios";

export default async (req, res) => {
  try {
    const { data } = await axios.get(
      "https://bw1vnk7s5m.execute-api.us-east-1.amazonaws.com/dev/prices"
    );
    res.status(200).json(data);
  } catch (error) {
    res.status(500).send("Error getting Coingecko Data");
  }
};
