import React, { useState, useEffect, Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import 'antd/dist/antd.css';
import "./App.css";
import { Account } from "./components"

import NeolasticPage from './components/NeolasticPage.js'; //look at and then burn a piece or not
import IntroPage from './components/IntroPage.js';
import GalleryPage from './components/GalleryPage.js';

import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react';
import { WagmiConfig } from 'wagmi';
import { mainnet, hardhat } from 'wagmi/chains';

import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';

// Artifacts

// wagmiconfig
const chains = [mainnet, hardhat];
const walletConnectID = process.env.REACT_APP_WALLETCONNECT_ID;
const projectId = walletConnectID;
const metadata = {
  name: 'Neolastics',
  description: 'Neolastics',
  url: 'https://neolastics.com'
}

const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata });
createWeb3Modal({ wagmiConfig, projectId, chains });

const chainID = 1; // prod == mainnet

function App() {
  /* Universal State*/
  // mainnet
  let curveAddress = "0x174150478891bdD4EAefaB50FB24B9126F289FA6";
  // artist: 0x0CaCC6104D8Cd9d7b2850b4f35c65C1eCDEECe03

  // mainnet
  const GRAPH_API_KEY = process.env.REACT_APP_GRAPH_API_KEY;
  const graphURI = 'https://gateway-arbitrum.network.thegraph.com/api/'+GRAPH_API_KEY+'/subgraphs/id/99P9iFUCyaiJouugpEjW6LozFrt8kDAcpZPqt7RFzhb7';

  const client = new ApolloClient({
      uri: graphURI,
      cache: new InMemoryCache(),
    });

  return (
    <>
    <WagmiConfig config={wagmiConfig}>
    <ApolloProvider client={client}>
      <div>
      <Account />
      <Switch>
      <Route exact path="/">
          <IntroPage chainID={chainID} curveAddress={curveAddress} />
        </Route>
        <Route path="/neolastic/:id">
          <NeolasticPage chainID={chainID} curveAddress={curveAddress} />
        </Route>
        <Route path="/gallery/:ownerId">
          <GalleryPage />
        </Route>
      </Switch>
      </div>
    </ApolloProvider>
    </WagmiConfig>
    </>
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
