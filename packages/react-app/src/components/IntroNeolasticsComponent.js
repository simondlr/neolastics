import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "antd";
import CellsComponent from "./CellsComponent";

import { ethers } from 'ethers';
import moment from 'moment';

/*
Display a list of 5 recent Neolastic pieces
*/
function IntroNeolasticsComponent(props) {
    if(!!props.savedData) {
        return props.savedData.neolastics.map(({ id, created, owner}) => (
            <div key={id} style={{textAlign: 'left'}}>
                <CellsComponent hash={ethers.BigNumber.from(id).toHexString()}/><br />
                Owner: <Link to={'/gallery/'+owner.id}>{owner.id}</Link> <br />
                Created: {moment.unix(created).format()}   <br />
                <br />
                <Link to={'/neolastic/'+id} > <Button type="primary">VIEW + INTERACT WITH PIECE</Button></Link> <br />
                <br />
            </div>
        ));
    } else { return null; }
}

export default IntroNeolasticsComponent
