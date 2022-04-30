import PAIR_ABI from "../../utils/constants/abis/pair.json";
import SPOOKY_ABI from "../../utils/constants/abis/spookyMaster.json";
import SPIRIT_ABI from "../../utils/constants/abis/spiritMasterchef.json";
import { Contract } from "ethers-multicall";
import {
  BOO_MASTERCHEF,
  SPIRIT_MASTERCHEF,
} from "../../utils/constants/contracts";
import SPOOKYFARMS from "../../utils/constants/farms/spookyFarms";
import { ethers } from "ethers";
import { formatTokenAmount, getProviderRPC } from "../../utils/cryptoMethods";
import {
  FarmsLiquidity,
  FarmsPortfolio,
  TokenPortfolio,
} from "../../utils/interfaces/index.";
import { checkAddresses } from "../../utils/methods";
import { spiritFarms_v1 } from "../../utils/constants/farms/spiritFarms";

export const formatFarms = (calls, farms: TokenPortfolio[], type) => {
  const farmsData: FarmsPortfolio[] = [];
  const farmsLiquidity: FarmsLiquidity[] = [];
  const provider = getProviderRPC();
  const signer = provider.getSigner();
  const protocol_farms = {
    SPIRIT: {
      array: spiritFarms_v1,
      masterChef: SPIRIT_MASTERCHEF,
      ABI: SPIRIT_ABI,
    },
    BOO: {
      array: SPOOKYFARMS,
      masterChef: BOO_MASTERCHEF,
      ABI: SPOOKY_ABI,
    },
  };
  const { array, masterChef, ABI } = protocol_farms[type];

  for (let i = 0; i < array.length; i++) {
    const farm = array[i];
    const [staked, earns, balanceOfAccount, allowance] = calls.splice(0, 4);
    const covalent_farm = farms.find((covaFarm) =>
      checkAddresses(covaFarm.address, farm.lpAddresses[250])
    );
    const stakeFormat = formatTokenAmount(staked[0].toString(), 18);
    const earnFormat = formatTokenAmount(earns.toString(), 18);
    const balanceFormat = formatTokenAmount(balanceOfAccount.toString(), 18);

    const LPEtherContract = new ethers.Contract(
      farm.lpAddresses[250],
      PAIR_ABI,
      signer
    );

    const masterContract = new ethers.Contract(masterChef, ABI, signer);

    // SpookySwap actions
    const getRewards = async () => await masterContract.withdraw(farm.pid, "0");
    const withdrawAll = async () =>
      await masterContract.withdraw(farm.pid, staked[0].toString());
    const depositAll = async () =>
      await masterContract.deposit(farm.pid, balanceOfAccount.toString());

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
      farmsLiquidity.push(liquidityFarm);
    }

    if (stakeFormat !== "0.0" || earnFormat !== "0.0") {
      const getlpPrice = (): number => {
        if (covalent_farm && covalent_farm.usd > 0) return covalent_farm.usd;
        return 1;
      };
      const priceLP = Number(stakeFormat) * getlpPrice();
      const userFarm = {
        ...farm,
        staked: stakeFormat,
        earns: earnFormat,
        usd: priceLP.toString(),
        totalSupply: "100000",
        allowance,
        actions: {
          getRewards,
          depositAll,
          withdrawAll,
        },
      };

      farmsData.push(userFarm);
    }
  }
  return { farmsData, farmsLiquidity };
};

export const farmsCall = (account: string, type) => {
  const calls = [];
  const protocol_farms = {
    SPIRIT: {
      farms: spiritFarms_v1,
      masterChef: SPIRIT_MASTERCHEF,
      ABI: SPIRIT_ABI,
      pending: "pendingSpirit",
    },
    BOO: {
      farms: SPOOKYFARMS,
      masterChef: BOO_MASTERCHEF,
      ABI: SPOOKY_ABI,
      pending: "pendingBOO",
    },
  };
  const { farms, masterChef, ABI, pending } = protocol_farms[type];
  for (let i = 0; i < farms.length; i++) {
    const farm = farms[i];
    const lpAddress: string = farm.lpAddresses[250];

    const lpContract = new Contract(lpAddress, PAIR_ABI);
    const masterChefContract = new Contract(masterChef, ABI);
    const staked = masterChefContract.userInfo(farm.pid, account);
    const earn = masterChefContract[pending](farm.pid, account);
    const lpAccountBalance = lpContract.balanceOf(account);
    const lpAllowanceAccount = lpContract.allowance(account, masterChef);

    calls.push(staked);
    calls.push(earn);
    calls.push(lpAccountBalance);
    calls.push(lpAllowanceAccount);
  }
  return calls;
};
