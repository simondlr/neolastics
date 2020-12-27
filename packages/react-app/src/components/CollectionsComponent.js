import React, { useEffect, useState } from "react";
import { gql, useLazyQuery } from '@apollo/client';

import { ethers } from 'ethers';

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
    const defaultCollection = {
        curve: {
            totalSupply: '0',
            totalEverMinted: '0',
            totalEverPaid: '0',
            reserve: '0',
            mintPrice: '0',
            burnPrice: '0'
        }
    }
    const [savedData, setSavedData] = useState(defaultCollection);

    // todo: for some reason still the query fires too many times.
    const [ getCollection, { loading, error, data }] = useLazyQuery(NEOLASTICS_QUERY, {fetchPolicy: 'network-only'});

    useEffect(() => {
        if(savedData.curve.totalEverMinted !== '0') {
            setTimeout(function(){ 
                console.log('refired query');
                getCollection();
            }, 2000);
        } else { 
            getCollection(); 
        }
    }, [props.transactionsExecuted]);

    useEffect(() => {
        if(!!data) {
            if(data.curve !== null) { // is only triggered when nothing has happened in the contracts yet
                if(savedData!==null) {
                    if(data.curve.totalSupply !== savedData.curve.totalSupply) {
                        props.setGlobalMintPrice(data.curve.mintPrice); // todo: react is complaining about this?
                        setSavedData(data);
                    }
                } else {
                    props.setGlobalMintPrice(data.curve.mintPrice); // todo: react is complaining about this?
                    setSavedData(data);
                } 
            } else {
                props.setGlobalMintPrice('0');
            }
        }
    }, [data]);


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
}

export default CollectionsComponent 
