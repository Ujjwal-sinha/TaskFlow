/** @type import('hardhat/config').HardhatUserConfig */
require("@nomicfoundation/hardhat-ethers");
require("@nomicfoundation/hardhat-chai-matchers");
require("dotenv").config();

module.exports = {
  solidity: "0.8.28",
  networks: {
    apothem: {
      url: "https://rpc.apothem.network",
      accounts: process.env.DEPLOYER_PRIVATE_KEY  ? [process.env.DEPLOYER_PRIVATE_KEY ] : [],
      chainId: 51,
    },
  },
  paths: {
    sources: "./contracts",
    artifacts: "./artifacts",
  }
};
