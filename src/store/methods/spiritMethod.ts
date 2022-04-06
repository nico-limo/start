import { FixedNumber } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import { spiritFarms } from "../../utils/constants/farms/spiritFarms";
import { formatTokenAmount } from "../../utils/cryptoMethods";
import { FarmsPortfolio, TokenPortfolio } from "../../utils/interfaces/index.";

export const formatSpiritFarms = (
  calls,
  prices: TokenPortfolio[]
): FarmsPortfolio[] => {
  const spiritData: FarmsPortfolio[] = [];
  for (let i = 0; i < spiritFarms.length; i++) {
    const farm = spiritFarms[i];
    const [balanceOfLP, lpSupply, gaugeSupply, staked, earned] = calls.splice(
      0,
      5
    );
    const stakeFormat = formatTokenAmount(staked.toString(), 18);
    const earnFormat = formatTokenAmount(earned.toString(), 18);

    if (stakeFormat !== "0.0" || earnFormat !== "0.0") {
      const { usd, decimals } = prices.find(
        (tokenPrice) => tokenPrice.symbol === farm.lpSymbol[1]
      );

      const formatQuote = formatUnits(balanceOfLP, decimals);
      const formatGauge = formatUnits(gaugeSupply, 18);

      const FixedLPSupply = FixedNumber.from(lpSupply);
      const FixedGaugeSupply = FixedNumber.from(gaugeSupply);

      const FixedQuote = FixedNumber.fromString(formatQuote);
      const lpTokenRatio = FixedGaugeSupply.divUnsafe(FixedLPSupply);

      const lpTotalInQuoteToken = FixedQuote.mulUnsafe(
        FixedNumber.fromString("2")
      ).mulUnsafe(lpTokenRatio);

      const totalValue = lpTotalInQuoteToken.mulUnsafe(
        FixedNumber.fromString(usd.toString())
      );

      const FixedGauge2 = FixedNumber.fromString(formatGauge);
      const lpPrice = totalValue.divUnsafe(FixedGauge2);

      const staked_usd = FixedNumber.fromString(stakeFormat)
        .mulUnsafe(lpPrice)
        .toString();

      const userFarm = {
        ...farm,
        staked: stakeFormat,
        earns: earnFormat,
        usd: staked_usd,
        totalSupply: "100000",
      };
      spiritData.push(userFarm);
    }
  }

  return spiritData;
};
