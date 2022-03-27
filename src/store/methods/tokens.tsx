import { useRecoilState } from "recoil";
import { TokenPortfolio } from "../../utils/interfaces/index.";
import { portfolioState } from "../atoms/user";

interface PortfolioProps {
  tokensPrices?: TokenPortfolio[];
  tokensBalances?: TokenPortfolio[];
}

export const TokensMethod = () => {
  const [portfolio, setPortfolio] = useRecoilState(portfolioState);

  const updatePortfolio = ({
    tokensPrices,
    tokensBalances,
  }: PortfolioProps) => {
    if (tokensBalances && tokensPrices) {
      const mixData = tokensBalances.map((tokensBalances) => {
        const tokenPrice = tokensPrices.find(
          (token) => token.address === tokensBalances.address
        );
        if (tokenPrice) {
          return {
            ...tokenPrice,
            balance: tokensBalances.balance,
            balance_24h: tokensBalances.balance_24h,
            logo_url: tokensBalances.logo_url,
            type: tokensBalances.type,
          };
        }
        return tokensBalances;
      });
      const filterTokens = mixData.filter(
        (token) =>
          token.usd &&
          token.type === "cryptocurrency" &&
          !token.symbol.includes("LP") &&
          token.usd_24h !== Infinity
      );
      setPortfolio(filterTokens);
    }
    if (tokensPrices && !tokensBalances) setPortfolio(tokensPrices);
    if (!tokensPrices && tokensBalances) setPortfolio(tokensBalances);
  };
  return { portfolio, updatePortfolio };
};
