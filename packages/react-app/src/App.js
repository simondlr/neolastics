import React, { useState, useEffect, Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import 'antd/dist/antd.css';
import { ethers } from "ethers";
import "./App.css";
import { Account } from "./components"

import NeolasticPage from './components/NeolasticPage.js';
import IntroPage from './components/IntroPage.js';
import GalleryPage from './components/GalleryPage.js';

import { usePoller } from "./hooks";

import Transactor from "./helpers/Transactor.js"; 

import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';

// Artifacts
import CurveJSON from "./contracts/Curve.json";

function App() {
  /* Universal State*/
  const [address, setAddress] = useState();
  const [injectedProvider, setInjectedProvider] = useState();

  // chain ids (used as proxy for being connect to a provider)
  const [injectedChainId, setInjectedChainId] = useState(null);
  const [hardcodedChainId, setHardcodedChainId] = useState(null); // set it manually
  const [transactionsExecuted, setTransactionsExecuted] = useState(0);

  // mainnet
  let curveAddress = "0x174150478891bdD4EAefaB50FB24B9126F289FA6";
  // local curve address if deployed on clean yarn run node
  // let curveAddress = "0xab387f2826759bbe08ea102d0c067365187648c7";

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
              setInjectedChainId(id);

              // comment out line for local or prod
              setHardcodedChainId(1); // mainnet
              // setHardcodedChainId(id); // local (uses injectedProvider)
              
          }
      }
  } 
  
  // load signers if there's an injected provider
  useEffect(() => {
    async function loadSigners() {
      if(injectedChainId !== null) {
        const signer = await injectedProvider.getSigner();
        const curveSigner = new ethers.Contract(curveAddress, CurveJSON.abi, signer);
        setCurveSigner(curveSigner);
      }
    }
    loadSigners();
  }, [injectedChainId]);


  async function mintNeolastic(buyPrice) {
    const tx = Transactor(injectedProvider, gasPrice, transactionsExecuted, setTransactionsExecuted);
    tx(curveSigner.functions.mint({value: ethers.utils.parseEther(buyPrice)}));
  }
  
  async function burnNeolastic(id) {
    const tx = Transactor(injectedProvider, gasPrice, transactionsExecuted, setTransactionsExecuted);
    tx(curveSigner.functions.burn(id));
  }    

  // mainnet
  const graphURI = 'https://api.thegraph.com/subgraphs/name/simondlr/neolastics';
  // const graphURI = 'http://localhost:8000/subgraphs/name/simondlr/neolastics-subgraph';

  const client = new ApolloClient({
      uri: graphURI,
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
          <IntroPage
            address={address}
            curveSigner={curveSigner}
            injectedChainId={injectedChainId}
            hardcodedChainId={hardcodedChainId}
            mintNeolastic={mintNeolastic}
            transactionsExecuted={transactionsExecuted}
          />
        </Route>
        <Route path="/neolastic/:id">
          <NeolasticPage
            address={address}
            injectedChainId={injectedChainId}
            hardcodedChainId={hardcodedChainId}
            burnNeolastic={burnNeolastic}
            curveSigner={curveSigner}
            transactionsExecuted={transactionsExecuted}
            />
        </Route>
        <Route path="/gallery/:ownerId">
          <GalleryPage />
        </Route>
      </Switch>
      </div>
    </ApolloProvider>
  );
}

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
