import PAIR_ABI from "../../utils/constants/abis/pair.json";
import ERC_ABI from "../../utils/constants/abis/erc20.json";
import SPOOKY_ABI from "../../utils/constants/abis/spookyMaster.json";
import { Contract } from "ethers-multicall";
import { QUOTES } from "../../utils/constants/tokens/quoteFarms";
import { BOO_MASTERCHEF } from "../../utils/constants/contracts";
import SPOOKYFARMS from "../../utils/constants/farms/spookyFarms";
import { ethers } from "ethers";
import { formatTokenAmount, getProvider } from "../../utils/cryptoMethods";
import {
  FarmsLiquidity,
  FarmsPortfolio,
  TokenPortfolio,
} from "../../utils/interfaces/index.";

export const formatSpookyFarms = (calls, prices: TokenPortfolio[]) => {
  const spookyData: FarmsPortfolio[] = [];
  const spookyLiquidity: FarmsLiquidity[] = [];
  const { signer } = getProvider();

  for (let i = 0; i < SPOOKYFARMS.length; i++) {
    const farm = SPOOKYFARMS[i];
    const [balanceOfLP, lpSupply, staked, earns, balanceOfAccount, allowance] =
      calls.splice(0, 6);

    const stakeFormat = formatTokenAmount(staked[0].toString(), 18);
    const earnFormat = formatTokenAmount(earns.toString(), 18);
    const balanceFormat = formatTokenAmount(balanceOfAccount.toString(), 18);

    const LPEtherContract = new ethers.Contract(
      farm.lpAddresses[250],
      PAIR_ABI,
      signer
    );

    const spookyContract = new ethers.Contract(
      BOO_MASTERCHEF,
      SPOOKY_ABI,
      signer
    );

    // SpookySwap actions
    const getRewards = async () => await spookyContract.withdraw(farm.pid, "0");
    const withdrawAll = async () =>
      await spookyContract.withdraw(farm.pid, staked[0].toString());
    const depositAll = async () =>
      await spookyContract.deposit(farm.pid, balanceOfAccount.toString());

    const approve = async () =>
      await LPEtherContract.approve(
        BOO_MASTERCHEF,
        ethers.constants.MaxUint256.toString()
      );

    if (balanceFormat !== "0.0") {
      const liquidityFarm = {
        ...farm,
        hasBalance: true,
        depositAll,
        allowance,
        approve,
      };
      spookyLiquidity.push(liquidityFarm);
    }

    if (stakeFormat !== "0.0" || earnFormat !== "0.0") {
      const userFarm = {
        ...farm,
        staked: stakeFormat,
        earns: earnFormat,
        usd: "1",
        totalSupply: "100000",
        allowance,
        actions: {
          getRewards,
          depositAll,
          withdrawAll,
        },
      };

      spookyData.push(userFarm);
    }
  }
  return { spookyData, spookyLiquidity };
};

export const spookyCalls = (account: string) => {
  const calls = [];

  for (let i = 0; i < SPOOKYFARMS.length; i++) {
    const farm = SPOOKYFARMS[i];
    const tokenAddress: string = QUOTES[farm.lpSymbol[1]]?.address;
    const lpAddress: string = farm.lpAddresses[250];

    const tokenContract = new Contract(tokenAddress, ERC_ABI);
    const lpContract = new Contract(lpAddress, PAIR_ABI);
    const masterChef = new Contract(BOO_MASTERCHEF, SPOOKY_ABI);

    const staked = masterChef.userInfo(farm.pid, account);
    const earn = masterChef.pendingBOO(farm.pid, account);
    const balanceOfLP = tokenContract.balanceOf(lpAddress);
    const lpAccountBalance = lpContract.balanceOf(account);
    const lpAllowanceAccount = lpContract.allowance(account, BOO_MASTERCHEF);
    const lpSupply = lpContract.totalSupply();

    calls.push(balanceOfLP);
    calls.push(lpSupply);
    calls.push(staked);
    calls.push(earn);
    calls.push(lpAccountBalance);
    calls.push(lpAllowanceAccount);
  }
  return calls;
};
