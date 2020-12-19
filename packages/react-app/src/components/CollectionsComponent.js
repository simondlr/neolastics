import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { Button } from "antd";
import { gql, useQuery } from '@apollo/client';

import ethers from 'ethers';
import moment from 'moment';

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

    const { loading, error, data } = useQuery(NEOLASTICS_QUERY);



    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    props.setGlobalMintPrice(data.curve.mintPrice);
    return (
        <div>
        Currently, there are {data.curve.totalSupply} Neolastics in circulation. <br />
        The reserve pool is currently {ethers.utils.formatEther(data.curve.reserve)} ETH. <br />
        Current Minting Cost {ethers.utils.formatEther(data.curve.mintPrice)} ETH. <br />
        Current Burning Reward {ethers.utils.formatEther(data.curve.burnPrice)} ETH. <br />
        Total Ever Minted: {data.curve.totalEverMinted}. <br />
        Total Ever Paid: {ethers.utils.formatEther(data.curve.totalEverPaid)} ETH.<br />
        </div>
    );
}

export default CollectionsComponent 
