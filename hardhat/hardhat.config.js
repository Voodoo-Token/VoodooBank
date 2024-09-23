require("@nomicfoundation/hardhat-toolbox");

// require("@nomiclabs/hardhat-waffle");
// require("@nomiclabs/hardhat-ethers");
require("dotenv").config();


module.exports = {
  
  solidity: {
    version: "0.8.24",

  },
  networks: {
    pulse_mainnet: {
      url: "https://rpc.pulsechain.com",
      accounts: [process.env.DEPLOYER_PRIVATE_KEY_MAINNET].filter(Boolean),
    },
    pulse_testnet: {
      url: "https://pulsechain-testnet.publicnode.com",
      accounts: [process.env.DEPLOYER_PRIVATE_KEY_TESTNET].filter(Boolean),
    },
    mumbai: {
      url: "https://polygon-mumbai.g.alchemy.com/v2/dd9EpJa39E2QqmbtgwgXl4MHY0DHkGg3",
      accounts: [process.env.PRIVATEKEY_MUMBAI].filter(Boolean),
    },
  },
  // etherscan: {
  //   apiKey: {
  //     testnet: "3354a13dae024f44ad260cefe4c71e31"
  //   },
  //   customChains: [
  //     {
  //       network: "testnet",
  //       chainId: 942,
  //       urls: {
  //         apiURL: "https://scan.v3.testnet.pulsechain.com/api",
  //         browserURL: "https://scan.v3.testnet.pulsechain.com",
  //       },
  //     }
  //   ],
  // }
};
