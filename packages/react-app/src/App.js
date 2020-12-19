import React, { useState, useEffect, Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import 'antd/dist/antd.css';
import { ethers } from "ethers";
import "./App.css";
import { Account } from "./components"

// import BaseComponent from './components/BaseComponent.js';
import NeolasticComponent from './components/NeolasticComponent.js';
import IntroComponent from './components/IntroComponent.js';
// import PlasticComponent from './components/PlasticComponent.js';

// import { getUSDValueOfArtwork } from './hooks/Prices.js';
import { usePoller, useGasPrice } from "./hooks";

import Transactor from "./helpers/Transactor.js"; 

import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';

// Artifacts
import ERC721JSON from "./contracts/ERC721.json";
import CurveJSON from "./contracts/Curve.json";

import moment from "moment";

// const mainnetProvider = new ethers.providers.InfuraProvider("mainnet",process.env.REACT_APP_INFURA_ID);
// const localProvider = new ethers.providers.JsonRpcProvider(process.env.REACT_APP_PROVIDER?process.env.REACT_APP_PROVIDER:"http://localhost:8545")

// change to mainnet on prod
// const hardcodedProvider = mainnetProvider;
// const hardcodedProvider = localProvider;

/*async function getStewardData(steward) {
  // can be used for both versions.
  const currentArtPriceETH = ethers.utils.formatEther(await steward.functions.price());
  const currentDepositAbleToWithdraw = ethers.utils.formatEther(await steward.functions.depositAbleToWithdraw());
  // const currentDeposit = ethers.utils.formatEther(await steward.functions.deposit());
  const currentDeposit = null;
  const currentPatronageOwed = ethers.utils.formatEther(await steward.functions.patronageOwed());
  const currentTotalCollected = ethers.utils.formatEther(await steward.functions.totalCollected());

  return [currentArtPriceETH, currentDepositAbleToWithdraw, currentDeposit, currentPatronageOwed, currentTotalCollected];
}*/

/*
Note: Doing this a bit janky.
Redux Store would be much better.
*/
function App() {
  /* Universal State*/
  const [address, setAddress] = useState();
  const [injectedProvider, setInjectedProvider] = useState();
  // chain ids (used as proxy for being connect to a provider)
  const [injectedChainId, setInjectedChainId] = useState(null);
  const [hardcodedChainId, setHardcodedChainId] = useState(null); // set it manually
  const [globalMintPrice, setGlobalMintPrice] = useState('0');
  // const [hardcodedBlockNumber, setHardcodedBlockNumber] = useState(null);

  // local
  const curveAddress = "0xab387f2826759BbE08eA102d0C067365187648C7";

  // artist: 0x0CaCC6104D8Cd9d7b2850b4f35c65C1eCDEECe03

  const [curveSigner, setCurveSigner] = useState(null);


  // NOTE: Currently not being used in Transactor, but keeping it in the code in case I want to turn it back on.
  // Currently, it's expected that the web3 provider sets it (eg, MetaMask fills it in).
  // const gasPrice = useGasPrice("fast"); 
  const gasPrice = 0;

  usePoller(()=>{pollInjectedProvider()},1999);

  async function pollInjectedProvider() {
      if(!injectedChainId) {
          if(injectedProvider && injectedProvider.network) {
              const id = await injectedProvider.network.chainId;
              console.log('chainid', id);
              setInjectedChainId(id);
              setHardcodedChainId(id); // todo -> must manually set to mainnet in prod
          }
      }
  }  
  
  // load signers if there's an injected provider
  useEffect(() => {
    async function loadSigners() {
      if(injectedChainId !== null) {
        console.log('setting signer');
        const signer = await injectedProvider.getSigner();
        const curveSigner = new ethers.Contract(curveAddress, CurveJSON.abi, signer);
        //const signerStewardV2 = new ethers.Contract(ArtStewardJSON.networks[injectedChainId].address, ArtStewardJSON.abi, signer);

        /*const updatedValuesV1 = { signerSteward: signerStewardV1 };
        const updatedValuesV2 = { signerSteward: signerStewardV2 };

        setArtV1((prevState) => { return {...prevState, ...updatedValuesV1}});
        setArtV2((prevState) => { return {...prevState, ...updatedValuesV2}});*/
        setCurveSigner(curveSigner);
      }
    }
    loadSigners();
  }, [injectedChainId]);


  async function mintNeolastic() {
    // const  = values.v === 'v1' ? artV1.signerSteward : artV2.signerSteward;
    // newPrice
    // note: should negative numbers be disabled? For ease of use?
    // const newPrice = ethers.utils.parseEther(values.newPrice.toString());
    const tx = Transactor(injectedProvider, gasPrice);
    const result = await tx(curveSigner.functions.mint({value: ethers.utils.parseEther('0.01')}));
    console.log(result);
  }
  
  async function burnNeolastic(id) {
    console.log('burning signer', curveSigner);
    // const  = values.v === 'v1' ? artV1.signerSteward : artV2.signerSteward;
    // newPrice
    // note: should negative numbers be disabled? For ease of use?
    // const newPrice = ethers.utils.parseEther(values.newPrice.toString());
    const tx = Transactor(injectedProvider, gasPrice);
    tx(curveSigner.functions.burn(id));

    // todo await success? to refresh page?
    // callback?
  }    

  const client = new ApolloClient({
      // uri: process.env.REACT_APP_GRAPHQL_ENDPOINT,
      uri: 'http://localhost:8000/subgraphs/name/simondlr/neolastics-subgraph',
      cache: new InMemoryCache(),
    });

  return (
    <ApolloProvider client={client}>
      <div>
      
      <Account
        address={address}
        setAddress={setAddress}
        injectedProvider={injectedProvider}
        setInjectedProvider={setInjectedProvider}
      />
      <Switch>
      <Route exact path="/">
          <IntroComponent
            mintNeolastic={mintNeolastic}
            globalMintPrice={globalMintPrice}
            setGlobalMintPrice={setGlobalMintPrice}
          />
        </Route>
        <Route path="/neolastic/:id">
          <NeolasticComponent
            address={address}
            injectedChainId={injectedChainId}
            hardcodedChainId={hardcodedChainId}
            burnNeolastic={burnNeolastic}
            curveSigner={curveSigner}
            />
        </Route>
      </Switch>
      </div>
    </ApolloProvider>
  );
}

// what is this?
class AppRoutes extends Component {
  render() {
    return (
      <Router>
        <Switch>        
          <Route path='/:page'>
            <App />
          </Route>
          <Route exact path='/'>
            <App />
          </Route>
        </Switch>
      </Router>
    )
  }
}

export default AppRoutes;
