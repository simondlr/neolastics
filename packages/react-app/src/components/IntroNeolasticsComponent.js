import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "antd";
import CellsComponent from "./CellsComponent";
import { gql, useLazyQuery } from '@apollo/client';

import ethers from 'ethers';
import moment from 'moment';

/*
Display a list of Neolastic pieces
*/
function IntroNeolasticsComponent(props) {
    const NEOLASTICS_QUERY = gql`
    {
        neolastics(orderBy: created, orderDirection: desc, first: 5) {
            id
            created
            pricePaid
            owner {
                id
            }
        }
    }
    `    
    
    const [savedData, setSavedData] = useState(null)
    const [getNeolastics, { loading, error, data }] = useLazyQuery(NEOLASTICS_QUERY, {fetchPolicy: 'network-only'});

    useEffect(() => {
        if(!!data) {
            if(savedData!==null) {
                console.log(data);
                if (savedData.neolastics[0].id !== data.neolastics[0].id) {
                    setSavedData(data);
                }
            } else { setSavedData(data); }
        }
    }, [data]);

    useEffect(() => {
        if(savedData !== null) {
            setTimeout(function(){ 
                getNeolastics();
            }, 2000);
        } else { getNeolastics(); }
    }, [props.transactionsExecuted]);

    if(!!savedData) {
        return savedData.neolastics.map(({ id, created, owner}) => (
            <div key={id} style={{textAlign: 'center'}}>
                <CellsComponent hash={ethers.BigNumber.from(id).toHexString()}/><br />
                Owner: <Link to={'/gallery/'+owner.id}>{owner.id}.</Link> <br />
                Created: {moment.unix(created).format()}   <br />
                <br />
                <Link to={'/neolastic/'+id} > <Button type="primary">VIEW + INTERACT WITH PIECE</Button></Link> <br />
                <br />
            </div>
        ));
    } else { return null; }
}

export default IntroNeolasticsComponent
