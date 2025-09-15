require("@matterlabs/hardhat-zksync-verify");
require("@matterlabs/hardhat-zksync-solc");
require("@matterlabs/hardhat-zksync-deploy");

module.exports = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: { enabled: true }, // matches your build-info
    },
  },
  zksolc: {
    version: "1.5.4",
    compilerSource: "binary",
    settings: {
      optimizer: { enabled: true },
    },
  },
  defaultNetwork: "zkSyncSepolia",
  networks: {
    zkSyncSepolia: {
      url: "https://sepolia.era.zksync.dev",
      ethNetwork: "sepolia",
      zksync: true,
      enableVerifyURL: true,
    },
    zkSyncMainnet: {
      url: "https://mainnet.era.zksync.io",
      ethNetwork: "mainnet",
      zksync: true,
    },
  },
  etherscan: {
    apiKey: {
      zksyncsepolia: process.env.ZKSYNC_EXPLORER_API_KEY,
    },
  },
};
