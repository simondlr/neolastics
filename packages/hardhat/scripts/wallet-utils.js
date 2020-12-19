// derived from: https://github.com/paxthemax/buidler-sandbox/blob/a3bad3653eae78348d608d3f172ab2fcf4b5c1ab/src/utils/wallet-utils.ts

const Wallet = require("ethers").Wallet;
// const Provider = require("ethers/providers").Provider;

/**
 * HD path used to sequentially derrive wallets and accounts.
 */
const ETHERS_WALLET_HDPATH = "m/44'/60'/0'/0/";

/**
 * Default mnemonic to use if none is present in the env.
 */
const DEFAULT_MNEMONIC = "couch hunt wisdom giant regret supreme issue sing enroll ankle type husband";

/**
 * Default ether balance (in wei) to use if none is present in the env.
 */
const DEFAULT_BALANCE_ETHER = "1000000000000000000000";

/**
 * Default number of accounts to generate if none is present in the env.
 */
const DEFAULT_ACCOUNT_CNT = 21;

/**
 * Get the default mnemonic. Reads mnemonic from the env (if present).
 * @returns Default mnemonic phrase.
 */
function getMnemonic() {
  return process.env.MNEMONIC ? String(process.env.MNEMONIC) : DEFAULT_MNEMONIC;
}

/**
 * Create a single wallet instance and connect it to a given ethers Provider.
 * @param mnemonic Mnemonic seed string to use.
 * @param provider Instance of an ethers Provider.
 * @returns A single wallet instance.
 */
function generateWallet(mnemonic, provider) {
  return Wallet.fromMnemonic(mnemonic).connect(provider);
}

/**
 * Create a single wallet instance and connect it to a given ethers Provider.
 * @param provider Instance of an ethers provider.
 * @returns Default wallet instance.
 */
function defaultWallet(provider) {
  return Wallet.fromMnemonic(getMnemonic()).connect(provider);
}

/**
 * Generate a given number of wallet instances, and connect each one to a given ethers Provider.
 * @param count Number of wallets to generate.
 * @param mnemonic Mnemonic seed phrase to use.
 * @param provider Instance of an ethers Provider.
 * @returns An array of wallet instances.
 */
function generateWallets(count, mnemonic, provider) {
  let ret = [];
  for (let i = 0; i < count; i++) {
    const wallet = Wallet.fromMnemonic(mnemonic, `${ETHERS_WALLET_HDPATH}${i}`);
    ret.push(wallet.connect(provider));
  }
  return ret;
}

/**
 * Generate default wallet instances, and connect each one to a given ethers Provider.
 * @param provider Instance of an ethers Provider.
 * @returns An array of wallet instances.
 */
function defaultWallets(provider) {
  return generateWallets(DEFAULT_ACCOUNT_CNT, getMnemonic(), provider);
}

/**
 * Generate a given number of accounts (private key and starting balance pair).
 * @param mnemonic Mnemonic seed phrase to use.
 * @param count Number of accounts to generate.
 * @param defaultBalance Starting balance of each account (in wei).
 * @returns An array of accounts.
 */
function generateAccounts(
  mnemonic,
  count,
  defaultBalance
) {
  let ret = [];
  for (let i = 0; i < count; i++) {
    const wallet = Wallet.fromMnemonic(mnemonic, `${ETHERS_WALLET_HDPATH}${i}`);
    ret.push({
      privateKey: wallet.privateKey,
      balance: defaultBalance
    });
  }
  return ret;
}

/**
 * Generate default accounts (private key and starting balance pair).
 * @returns An array of accounts.
 */
function defaultAccounts() {
  return generateAccounts(getMnemonic(), DEFAULT_ACCOUNT_CNT, DEFAULT_BALANCE_ETHER);
}

module.exports = defaultAccounts;