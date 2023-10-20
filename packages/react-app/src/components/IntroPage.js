import React, { useState, useEffect, Fragment } from "react";
import { Button } from "antd";
import IntroNeolasticsComponent from "./IntroNeolasticsComponent";
import CurveComponent from "./CurveComponent";

import { gql, useLazyQuery } from '@apollo/client';

import { ethers } from 'ethers';

import { useAccount, useNetwork, useWaitForTransaction, useContractWrite  } from 'wagmi';
import { parseEther, formatEther } from 'viem';

import CurveJSON from "../contracts/Curve.json";

function MintNeolasticComponent(props) {
    console.log(props);
  
    const { data, write } = useContractWrite({
      address: props.curveAddress,
      abi: CurveJSON.abi,
      functionName: 'mint',
      value: parseEther(formatEther(props.mintPrice)) + parseEther('0.01')
    });
   
    const { isLoading, isSuccess } = useWaitForTransaction({
      hash: data?.hash,
      onSuccess(data) {
        console.log('tx succeeded, firing graphql refresh');
        props.refreshGraphQL(); 
      }
    });
  
    return (
        <div>
            <Button type="primary" onClick={write}>
            MINT
            </Button>
            {isLoading ? ' Transaction Pending...': ''}
            {isSuccess ? ' Completed!' : ''}
        </div>
    )
}

function IntroPage(props) {
    
    // fetch graphql here so that refresh can be used at this scope.
    const NEOLASTICS_QUERY = gql`
    {
        neolastics(orderBy: created, orderDirection: desc, first: 5) {
            id
            created
            pricePaid
            owner {
                id
            }
        },
        curve(id: "1") {
            totalSupply
            totalEverMinted
            totalEverPaid
            reserve
            mintPrice
            burnPrice
        }
    }
    `    
    
    const [savedData, setSavedData] = useState(null)
    const [getData, { loading, error, data }] = useLazyQuery(NEOLASTICS_QUERY, {fetchPolicy: 'network-only'});

    useEffect(() => {
        if(!!data) {
            if(savedData!==null) {
                if(typeof savedData.neolastics[0] !== 'undefined') { // don't need to check curve separately as both both would come in at the same time
                if (savedData.neolastics[0].id !== data.neolastics[0].id) {
                    console.log('setting data saved from graph query');
                    setSavedData(data);
                }}
            } else { setSavedData(data); console.log('setting data saved from graph query'); }
        }
    }, [data]);

    // only fires on init
    useEffect(() => {
        console.log('fetching graph data');
        getData();
    }, []);

    // manually refresh thegraph data if needed
    function refresh() {
        console.log('firing reload');
        getData();
    }

    const wrongNetworkHTML = <Fragment>You are on the wrong network. Please switch to the correct network.</Fragment>;

    const offlineHTML = <Fragment>
        [You are not connected to an Ethereum wallet. You need to  have a web3/Ethereum-enabled browser and connect it (see top right of the page). Please download
      the <a href="https://metamask.io">MetaMask Chrome extension</a> or open in any Ethereum-compatible browser.]<br /><br />
    </Fragment>;

    const { chain, chains } = useNetwork();
    const { isConnected } = useAccount();

    let mintPrice;
    savedData !== null ? mintPrice = savedData.curve.mintPrice : mintPrice = '0';
    console.log(savedData);

    return (
        <div className="App" style={{textAlign:"justify"}}> 
        Neolastics is a digital art project that can automatically mint and burn unique, psuedo-randomly generated neoplasticism inspired cubes of collectible digital art. 
        An automated liquidity system sets the prices for the cost of minting pieces, and the reward for burning pieces. <br />
        <br />
        First deployed in December 2020, it's one of the first ever onchain generative art projects (using no other scripts and only using SVG) and the first project employing a native bonding curve directly for minting NFTs.<br />
        <br />
        <h1 >Recently Minted</h1>
        <IntroNeolasticsComponent savedData={savedData} />
        <br />
        <div>
        <a href="https://opensea.io/collection/neolastics" target="_blank"><Button>View The Entire Collection on OpenSea</Button></a>
        <br />
        <br />
        </div>
        <hr />        
        {/* MINT SECTION */}
        <div className="section">
        <h1>Mint</h1>        
        <span style={{fontSize: "20px"}} >
        Current Cost: {ethers.utils.formatEther(mintPrice)} ETH. <br />
        Current Buffer: 0.01 ETH.</span>
        <br />
        <br />
        {isConnected ? chain.id === props.chainID ? <Fragment>
            <MintNeolasticComponent curveAddress={props.curveAddress} mintPrice={mintPrice} refreshGraphQL={refresh} />
        </Fragment> : wrongNetworkHTML : offlineHTML }
        <br />
        <br />
        NOTE: This code is *unaudited*, but has been running without hiccup since December 2020. Caution is still advised unless you want to take the risk. <br />
        <br />
        <h3>Buffer?</h3>
        <div style={{textAlign:"justify"}} >
        Above and beyond Ethereum computation and storage costs, it currently costs {ethers.utils.formatEther(mintPrice)} ETH to mint a new psuedo-randomly, on-chain generated Neolastic.<br /> 
        <br />
        However, a buffer of 0.01 ETH is added to the cost ensure that the transaction succeeds (because only one neolastic per price point can be minted).
        If there's high demand (more than one mint transaction per block), a part of the buffer will be used to pay the mint cost at the time of confirmation.
        If no one else buys during the same block, you are refunded the entire 0.01 ETH buffer. If more than 10 buys occur in one block, the minting transaction can fail (too much demand for the pricing curve based on the time the transaction is issued and when it is mined/confirmed), but you will still be refunded.
        <br />
        <br />
        <hr />
        {/* ECONOMY SECTION */}
        <div className="section">
        <h2>Collection Details:</h2>
        {savedData !== null ? <CurveComponent savedData={savedData}/> : <Fragment>Loading curve data...</Fragment> }
        </div>
        <br />
        <hr />
        <h2>Algorithmic Pricing Details</h2>
        Any collector can pay to mint a randomly generated neolastic piece based on the hardcoded price formula (using a bonding curve). If there are more neolastics in existence, it becomes more expensive to mint the next neolastic.
        The price that a neolastic collector will receive upon burning their piece is based on how many neolastics currently exist. If there are more neolastics in circulation, then the floor price of your piece will be higher.
        99.5% of each mint cost is stored in a communal reserve pool that acts as a buyer if any collector wants to burn their neolastic. <br />
        </div>
        </div>
        <br />
        <hr />
        {/* TECHNICALS SECTION */}
        <div className="section">
        <h2>Technicals</h2>
        - Code is available here: <a href="https://github.com/simondlr/neolastics">https://github.com/simondlr/neolastics</a>.<br />
        - The price curve is linear, starting at 0.001 ETH for a Neolastic piece. Each new piece increases the price by 0.001 ETH. <br />
        - 99.5% of the price is kept in the bonding curve reserve. 0.5% goes to the creator. <br />
        - There exists 6 colours, with white, black, red, blue, and yellow being equally likely (~20%). <br />
        - Green is rare (~1/256). <br />
        - The colours are chosen from the first 9 bytes of a psuedo-randomly generated 32 byte hash. <br />
        - A maximum of 10,077,696 (6^9) potential combinations can thus exist. <br />
        - Duplicates are possible with different hashes. <br />
        - Every neolastic is stored as its hash on Ethereum and can be auto-generated directly from the smart contract into an SVG blob. Thus, if this website goes away, you would always be able to own and view your neolastic. <br />
        - It uses the ERC721 NFT standard, and uses the 'image_data' field from OpenSea to enable the metadata to be more readily viewed by others (vs directly pulling it from Ethereum). <br />
        </div>
        <br />
        <hr />
        {/* ABOUT SECTION */}
        <div className="section">
        <h2>About The Project:</h2>
        <div style={{textAlign:"justify"}} >
        In November 2016, <a href="https://medium.com/@simondlr/a-software-agent-without-human-control-that-produces-owns-sells-its-own-art-2a232e053329">I proposed the idea of creating an autonomous artist that sells its own generative art</a> using an early version of what would become bonding curves. A year later, <a href="https://medium.com/@simondlr/lets-summon-an-autonomous-artist-a-bot-that-creates-owns-and-sells-its-own-art-ada1afad086a">I had a more concrete proposal in summoning an autonomous artist that tasked a crowd to curate a generator</a>. 
        In an attempt to compress these ideas into a simple MVP, <a href="https://blog.simondlr.com/maximising-blockchain-collectible-economies">I formulated a new version that directly tied newly minted pieces directly onto a bonding curve</a>. 
        Since then, NFTs, Generative Art, and Bonding Curves have increased in popularity and it's time push ahead in these ideas. Thus, Neolastics seek to create a simple art project whereupon generative art is backed by a bonding curve economy. 
        If successful, this could continue the aim of building a fully autonomous artist: <a href="https://abraham.ai/">eventually leading to one that even has its own 'mind'.</a>  
        I'm a huge fan of Mondrian's Neo-Plasticism art and it served as inspiration for the kind of generative art I wish to see. Hat tip to <a href="https://clovers.network/">Clovers.Network</a> for pushing the boundaries of a generative art + bonding curve economy.<br />
        <br />
        If you own a Neolastic, you can join the Discord to chat with other collectors: <a href="https://discord.gg/M5b2MrK2FG">https://discord.gg/M5b2MrK2FG</a>. Verified by Collab.land.
        </div>
        </div>
        <br />
        <hr />
        {/* ARTIST SECTION */}
        <div className="section">
        <h2>About The Artist:</h2>
        <div style={{textAlign:"justify"}} >
        I'm a creator at heart.
        I have created games, writing, music, code, companies, and new economics. Solving the problems of the creator 
        has always been important to me. In the past I co-founded Ujo Music,
        working with Grammy-winning artists such as Imogen Heap and RAC to launch the first music royalty projects using smart contracts. I've
        helped kickstart wholly new markets and economies. I helped to create the Ethereum ERC20 token standard and token bonding curves, technologies 
        that's currently facilitating economies worth several billion dollars of value.
        I enjoy creating new forms of art and experimenting with ways to empower the creative industry.
        <br />
        <br />
        See my other art projects here: <a href="https://blog.simondlr.com/art">https://blog.simondlr.com/art</a>.<br />
        Swing me a follow on Twitter! <a href="https://twitter.com/simondlr">@simondlr</a>.<br />
        <br />
        </div>
        </div>
        </div>
    );
}

export default IntroPage
