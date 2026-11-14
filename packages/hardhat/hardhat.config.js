const defaultAccounts = require("./scripts/wallet-utils.js");
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-web3");
// require("@nomiclabs/hardhat-etherscan");

let infuraID = process.env.REACT_APP_INFURA_ID; 

const deployAccounts = defaultAccounts();

// Without MNEMONIC, wallet-utils falls back to a mnemonic that is public in this repo. That's fine for local
// chains, but never for mainnet: anyone could take funds from (or act as) that deploy account.
const targetsMainnet =
  process.env.HARDHAT_NETWORK === "mainnet" ||
  process.argv.some((arg, i) => arg === "--network" && process.argv[i + 1] === "mainnet") ||
  process.argv.includes("--network=mainnet");
if (targetsMainnet && !process.env.MNEMONIC) {
  throw new Error("Refusing to use the mainnet network without MNEMONIC set (the default mnemonic is public).");
}

module.exports = {
  defaultNetwork: 'localhost',
  networks: {
    localhost: {
      url: 'http://localhost:8545',
    },
    hardhat: {
      accounts: defaultAccounts(),
      gas: 9500000,
    },
    mainnet: {
      url: `https://mainnet.infura.io/v3/${infuraID}`,
      accounts: process.env.MNEMONIC ? [deployAccounts[0].privateKey] : [],
      gasPrice: 80e9
    },
  },
  etherscan: {
    apiKey: ''
  },
  solc: {
    version : "0.7.6",
  }
}