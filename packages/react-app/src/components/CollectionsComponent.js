import React, { useEffect, useState } from "react";
import { gql, useLazyQuery } from '@apollo/client';

import ethers from 'ethers';

/*
Display a list of Neolastic pieces
*/
function CollectionsComponent(props) {
    const NEOLASTICS_QUERY = gql`
    {
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
    const [savedData, setSavedData] = useState(null);

    // todo: for some reason still the query fires too many times.
    const [ getCollection, { loading, error, data }] = useLazyQuery(NEOLASTICS_QUERY, {fetchPolicy: 'network-only'});

    useEffect(() => {
        if(savedData !== null) {
            setTimeout(function(){ 
                getCollection();
            }, 2000);
        } else { getCollection(); }
    }, [props.transactionsExecuted]);

    useEffect(() => {
        console.log('new data came into collections', data);
        // if(!!data) { setSkip(true); }
        if(!!data) {
            if(savedData!==null) {
                if(data.curve.totalSupply !== savedData.curve.totalSupply) {
                    console.log('setting collections', data);
                    props.setGlobalMintPrice(data.curve.mintPrice); // todo: react is complaining about this?
                    setSavedData(data);
                }
            } else {
                props.setGlobalMintPrice(data.curve.mintPrice); // todo: react is complaining about this?
                setSavedData(data);
            }
        }
    }, [data]);

    if(!!savedData) {
        return (
            <div>
            Currently, there are {savedData.curve.totalSupply} Neolastics in circulation. <br />
            The reserve pool is currently {ethers.utils.formatEther(savedData.curve.reserve)} ETH. <br />
            Current Minting Cost {ethers.utils.formatEther(savedData.curve.mintPrice)} ETH. <br />
            Current Burning Reward {ethers.utils.formatEther(savedData.curve.burnPrice)} ETH. <br />
            Total Ever Minted: {savedData.curve.totalEverMinted}. <br />
            Total Ever Paid: {ethers.utils.formatEther(savedData.curve.totalEverPaid)} ETH.<br />
            </div>
        );
    } else { return null; }
}

export default CollectionsComponent 
