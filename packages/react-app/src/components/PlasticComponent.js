import React, { Fragment } from "react";
import { useParams } from "react-router-dom";
import CellsComponent from "./CellsComponent";


function PlasticComponent(props) {
    let { id } = useParams();
    return (
        <div className="App"> 
            <CellsComponent id={id}/>
            <br />
            Owned By: 0x42 (it's you!) <br />
            Sell (0.23 ETH) <br />
        </div>
    );
}

export default PlasticComponent
