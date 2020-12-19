const HDWalletProvider = require('@truffle/hdwallet-provider');
const mnemonic = process.env.MNEMONIC; // only used in development
const infuraID = process.env.REACT_APP_INFURA_ID; // same here, but needs to be transferred to production build too

module.exports = {
  networks: {
    development: {
      protocol: 'http',
      host: 'localhost',
      port: 8545,
      gas: 5000000,
      gasPrice: 5e9,
      networkId: '*',
    },
    mainnet: {
      provider: () => new HDWalletProvider(
        mnemonic, `https://mainnet.infura.io/v3/${infuraID}`, 3
      ),
      networkId: 1,
      gasPrice: 50e9,
    },
  },
};
