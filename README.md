
## Neolastics


- This repo is forked from https://github.com/austintgriffith/scaffold-eth & extensively modified.
- hardhat + waffle + openzeppelin for testing + smart contract development.
- ethers.js.
- OpenZeppelin for deployment (optionally can use this to deploy ugpradeable versions of this project).
- Uses modified ERC721.
- The Graph for reading chain state.
- Blocknative for monitoring transactions.
- web3modal for connecting to wallets.
  
### Curve.sol

### Development & Testing

Running Locally:

yarn install

yarn run node
yarn run init_contracts
yarn run add_contracts
yarn run deploy_contracts
yarn run publish_contracts

The Graph
In Neolastics Subgraph
docker-compose up
yarn run install
yarn run codegen
yarn create-local
yarn deploy-local

Back here:
yarn run start

In root folder:
- Install modules:  
  ```yarn install```
- If you have a separate mnemonic, add to it to env.  
  ```export MNEMONIC="<insert_your_own_mnemonic_here>```  
  ```yarn run node```  
- In a separate window, init openzeppelin & deploy contracts. Initialization is simple. Choose a name + project version.  
  ```yarn run init_contracts```
- Add contracts to the OpenZeppelin configuration. This is necessary to get a proper networks object in the build file (due to a temp bug).  
  ```yarn run add_contracts```
- The first artwork will always point to the mainnet one (it's hardcoded). The V2 artwork will be deployed locally (development network).
- Going through the first prompt: deploy a regular ERC721.   
  ```yarn run deploy_contracts```
- Take note of the address. Then, run the command again and deploy the regular ArtSteward.sol, inputting ERC721 address + address of the artist (beneficiary). The latter, you must choose. This can't be changed once initialized.  
  ```yarn run deploy_contracts```
- Next step is to publish the contract information/artifacts to the react app. For some reason, it's not properly exiting, so once it's published, just manually exit the process.  
  ```yarn run publish_contracts```
- Run the server.  
  ```yarn run start```

- To deploy to a testnet or mainnet, just add or use the existing network in the openzeppelin networks.js. It uses Infura to deploy and thus you also need to export your own Infura ID (like your mnemonic for deployment).  
  ```export REACT_APP_INFURA_ID="<INFURA_ID_HERE>"```

### New Markets In The Arts

This is inspired by the book & idea, called Radical Markets by Glen Weyl & Eric Posner. Some references to work detailing some of these ideas for implementation in the arts:

https://medium.com/radicalxchange/radical-markets-in-the-arts-13c27d3b7283  
https://blog.simondlr.com/posts/patronage-as-an-asset-class  
https://blog.simondlr.com/posts/exploring-harberger-tax-in-patronage-markets  
https://blog.simondlr.com/posts/new-markets-in-the-arts-property-rights  

Feel free to fork this code and create your own artwork in this manner.

### Other Work

Since this project was first published in March 2019, several teams have continued experimentation. Most notably is the Wildcards team: using patronage collectibles for conservation. Please support!

https://wildcards.world/

### Thanks

The initial ArtSteward.sol code was inspired by code from Billy Rennekamp: https://github.com/okwme/harberger-ads-contracts & Todd Proebsting: https://programtheblockchain.com/posts/2018/09/19/implementing-harberger-tax-deeds/.

### License

Code License:
MIT

