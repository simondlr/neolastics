const defaultAccounts = require("./scripts/wallet-utils.js");
// const { usePlugin } = require('hardhat/config');
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-web3");

module.exports = {
  defaultNetwork: 'localhost',
  networks: {
    localhost: {
      url: 'http://localhost:8545',
    },
    hardhat: {
      accounts: defaultAccounts(),
      gas: 9500000,
    }
  },
  solc: {
    version : "0.6.6",
  }
}
