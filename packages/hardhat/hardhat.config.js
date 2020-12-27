const defaultAccounts = require("./scripts/wallet-utils.js");
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-web3");

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
    }
  },
  solc: {
    version : "0.7.6",
  }
}

/*
    mainnet: {
      provider: () => new HDWalletProvider(
        mnemonic, `https://mainnet.infura.io/v3/${infuraID}`, 3
      ),
      networkId: 1,
      gasPrice: 50e9,
    }
    */
