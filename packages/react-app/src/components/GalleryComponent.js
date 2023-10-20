import React, { useEffect, useState, Fragment } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "antd";
import CellsComponent from "./CellsComponent";
import { gql, useLazyQuery } from '@apollo/client';

import { ethers } from 'ethers';
import moment from 'moment';

/*
Display a list of Neolastic pieces
*/
function GalleryComponent(props) {
    let { ownerId } = useParams();
    ownerId = ownerId.toString().toLowerCase();

    const NEOLASTICS_QUERY = gql`
    query Neolastic($ownerId: String!){
        collector(id: $ownerId) {
            id
            neolastics(orderBy: created, orderDirection: desc) {
                id
                created
            }
        }
    }
    `    
    const defaultGallery = {
        collector: {
            id: '0',
            neolastics: []
        }
    }

    const [savedData, setSavedData] = useState(defaultGallery);
    const [getNeolastics, { loading, error, data }] = useLazyQuery(NEOLASTICS_QUERY, { variables: { ownerId }, fetchPolicy: 'network-only'});

    useEffect(() => {
        if(!!data) {
            setSavedData(data);
        }
    }, [data]);

    useEffect(() => {
        getNeolastics();
    }, []);

    if(savedData.collector !== null) {
        return savedData.collector.neolastics.map(({ id, created}) => (
            <div key={id} style={{textAlign: 'left'}}>
                <CellsComponent hash={ethers.BigNumber.from(id).toHexString()}/><br />
                Owner: {ownerId}. <br />
                Created: {moment.unix(created).format()}   <br />
                <br />
                <Link to={'/neolastic/'+id} > <Button type="primary">VIEW + INTERACT WITH PIECE</Button></Link> <br />
                <br />
            </div>
        ));
   } else { return (<Fragment>There's nothing here.</Fragment>); }
}

export default GalleryComponent 
