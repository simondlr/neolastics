import React from "react";

import { ethers } from 'ethers';

function CurveComponent(props) {

    return (
        <div>
        Currently, there are {props.savedData.curve.totalSupply} Neolastics in circulation. <br />
        The reserve pool is currently {ethers.utils.formatEther(props.savedData.curve.reserve)} ETH. <br />
        Current Minting Cost {ethers.utils.formatEther(props.savedData.curve.mintPrice)} ETH. <br />
        Current Burning Reward {ethers.utils.formatEther(props.savedData.curve.burnPrice)} ETH. <br />
        Total Ever Minted: {props.savedData.curve.totalEverMinted}. <br />
        Total Ever Paid: {ethers.utils.formatEther(props.savedData.curve.totalEverPaid)} ETH.<br />
        </div>
    );
}

export default CurveComponent; 
