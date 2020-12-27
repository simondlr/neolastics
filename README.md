
## Neolastics

Liquid on-chain generative neoplastic art. Generative NFTs backed by a bonding curve economy.

https://neolastics.com.

### Technicals

- This repo is forked from https://github.com/austintgriffith/scaffold-eth & extensively modified.
- hardhat + waffle + openzeppelin for testing + smart contract development.
- ethers.js.
- Custom deploy function.
- Uses modified ERC721.
- The Graph for reading chain state.
- Blocknative for monitoring transactions.
- web3modal for connecting to wallets.
- [The metadata API](https://github.com/simondlr/neolastics_metadata) is hosted separately through Netlify Functions. 
  
### Development & Testing

Running Locally:

### 1. Start Node + Deploy Contracts 
```yarn install```  
```yarn run node```   
It will use the default mnemonic in ```./scripts/wallet-utils.js``` and start a local EVM.   
If you need a custom mnemonic, just:   
```export MNEMONIC="<insert_your_own_mnemonic_here>```   
```yarn run deploy_contracts_local```    
Save the curve address manually and copy-paste it to curveAddress in react-app/src/App.js.   
```yarn run publish_contracts```  
This copies the build files to the react-app.

### 2. Start a local Graph Node.
Follow [these instructions](https://thegraph.com/docs/quick-start#local-development) to start a local Graph Node. Note: It's not necessary to the ganache steps as hardhat is the chosen EVM. Only, the parts about the Graph Node.  
```docker-compose up```  
When you cycle it (in between running the EVM or not), you might have to delete the data. NOT necessary for initial setup.  
```rm -rf data``` 

### 3. Clone and Deploy Neolastics Subgraph
In a new folder, git clone [neolastics-subgraph](https://github.com/simondlr/neolastics-subgraph).    
```yarn run install```  
If the address differs, you must copy it from hardhat and put into the   
```yarn run codegen```  
```yarn run create-local```  
```yarn run deploy-local```  

### 4. Start Server
Back in this repo:   
```yarn run start```

### License

Code License:
MIT

