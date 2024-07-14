import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    hardhat: {
      chainId: 31337,
      forking: {
        url: "https://base-mainnet.g.alchemy.com/v2/3LysSMOLSvQ_8o4-WNexp8SydfO9Mm07",
        blockNumber: 17070831
      }
    }
  },
};

export default config;
