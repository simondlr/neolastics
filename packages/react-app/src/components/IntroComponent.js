import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "antd";
import CellsComponent from "./CellsComponent";
import Neolastics from "./NeolasticsComponent";
import CollectionsComponent from "./CollectionsComponent";
import { Fragment } from "ethers/lib/utils";

import { ApolloClient, ApolloProvider, InMemoryCache, gql, useQuery } from '@apollo/client';

import ethers from 'ethers';

function IntroComponent(props) {

    const [buyPrice, setBuyPrice] = useState('0');

    useEffect(() => {
        const bn = ethers.BigNumber.from(props.globalMintPrice);
        setBuyPrice(ethers.utils.formatEther(bn.add(ethers.utils.parseEther('0.01'))));
    }, [props.globalMintPrice]);

    return (
        <div className="App" style={{textAlign:"justify"}}> 
        Neolastics is a digital art project that automatically mints and destroys unique neoplasticism inspired cubes of collectible digital art.<br />
        <br />
        - Any collector can pay to mint a randomly generated neolastic piece based on a hardcoded price formula (using a bonding curve). If there are more neolastics in existence, it becomes more expensive to mint the next neolastic. <br />
        - 99.5% of each mint cost is stored in a communal reserve pool that acts as a buyer if any collector wants to destroy their neolastic. <br />
        - The price that a neolastic collector will receive upon destroying their piece is based on how many neolastics currently exist. If there are more neolastics in circulation, then the floor price of your piece will be higher. <br />
        - Normal buying, selling, and trading of neolastic pieces exist outside the automated liquidity that mints and destroys neolastics. <br />

        <hr />        


        <h2 style={{textAlign:'center'}}>Five Most Recently Minted</h2>
        <Neolastics />
        <hr />        
        {/* MINT SECTION */}
        <div className="section">
        <h2>Mint</h2>
        <Button type="primary" onClick={props.mintNeolastic}>
            Mint {buyPrice}
        </Button><br />
        <br />
        It currently costs: {ethers.utils.formatEther(props.globalMintPrice)} ETH to mint a new psuedo-randomly on-chain generated Neolastic.<br /> 
        <br />
        However, a buffer of 0.01 ETH is added to the cost ensure that the transaction succeeds (because only one neolastic per price point can be sold).
        If no one else buys during the same block, you are refunded the entire 0.01 ETH. If more than 10 buys occur in one block, the minting transaction can still fail (too much demand for the pricing curve based on the time the transaction is issued and when it is mined/confirmed).
        </div>
        <hr />
        {/* ECONOMY SECTION */}
        <div className="section">
        <h2>Collection Details:</h2>
        <CollectionsComponent 
            setGlobalMintPrice={props.setGlobalMintPrice}
        />
        </div>
        <hr />
        {/* TECHNICALS SECTION */}
        <div className="section">
        <h2>Technicals</h2>
        - The price curve is linear, starting at 0.001 ETH for a Neolastic piece. Each new piece increases the price by 0.001 ETH. <br />
        - 99.5% of the price is kept in the bonding curve reserve. 0.5% goes to the creator. <br />
        - There exists 6 colours, with white, black, red, blue, and yellow being equally likely (~20%). <br />
        - Green is rare (~1/256). <br />
        - The colours are chosen from the first 9 bytes of a psuedo-randomly generated 32 byte hash. <br />
        - A maximum of 10,077,696 (6^9) potential combinations can exist. <br />
        - Duplicates are possible with different hashes. <br />
        - Every neolastic is stored as its hash on Ethereum and can be auto-generated directly from the smart contract. Thus, if this website goes away, you would always be able to own and view your neolastic. <br />
        - It uses the ERC721 NFT standard, and uses the 'image_data' field from OpenSea to enable the metadata to be more readily viewed by others (vs directly pulling it from Ethereum). <br />
        </div>
        <hr />
        {/* ARTIST SECTION */}
        <div className="section">
        <h2>About The Artist:</h2>
        I'm a creator at heart.
        I have created games, writing, music, code, companies, and new economics. Solving the problems of the creator 
        has always been important to me. In the past I co-founded Ujo Music,
        working with Grammy-winning artists such as Imogen Heap and RAC to launch the first music royalty projects using smart contracts. I've
        helped kickstart wholly new markets and economies. I helped to create the Ethereum ERC20 token standard and token bonding curves, technologies 
        that's currently facilitating economies worth several billion dollars of value.
        I enjoy creating new forms of art and experimenting with ways to empower the creative industry.
        <br />
        <br />
        Swing me a follow on Twitter! <a href="https://twitter.com/simondlr">@simondlr</a>.<br />
        <br />
        </div>
        </div>
    );
}

export default IntroComponent
