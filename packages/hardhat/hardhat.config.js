const defaultAccounts = require("./scripts/wallet-utils.js");
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-web3");
// require("@nomiclabs/hardhat-etherscan");

let infuraID = process.env.REACT_APP_INFURA_ID; 

const deployAccounts = defaultAccounts();

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
      accounts: [deployAccounts[0].privateKey],
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