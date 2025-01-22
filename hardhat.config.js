require("@nomicfoundation/hardhat-toolbox");
require("hardhat-gas-reporter");
require("dotenv").config();

const INFURA_PROJECT_ID = process.env.INFURA_PROJECT_ID;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const ETHERSCAN_APIKEY = process.env.ETHERSCAN_APIKEY;

module.exports = {
  solidity: "0.8.28",
  settings: {
    optimizer: {
      enabled: true,
      runs: 200,
    },
  },
  gasReporter: {
    enabled: true,
    currency: "USD",
  },
  defaultNetwork: "hardhat", // Default network
  networks: {
    hardhat: {}, // Local Hardhat network
    sepolia: {
      url: `https://sepolia.infura.io/v3/${INFURA_PROJECT_ID}`,
      accounts: [`0x${PRIVATE_KEY}`],
      chainId: 11155111,
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_APIKEY,
  },
};
