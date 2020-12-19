import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { Button } from "antd";
import CellsComponent from "./CellsComponent";
import { gql, useQuery } from '@apollo/client';

import ethers from 'ethers';
import moment from 'moment';

/*
Display a list of Neolastic pieces
*/
function Neolastics(props) {
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

    const { loading, error, data } = useQuery(NEOLASTICS_QUERY);


    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
    console.log('nls', data.neolastics);
    return data.neolastics.map(({ id, created, owner}) => (
        <div key={id} style={{textAlign: 'center'}}>
            <CellsComponent hash={ethers.BigNumber.from(id).toHexString()}/><br />
            Owner: {owner.id}. <br />
            Created: {moment.unix(created).format()}   <br />
            <br />
            <Link to={'/neolastic/'+id} > <Button type="primary">VIEW + INTERACT WITH PIECE</Button></Link> <br />
            <br />
        </div>
    ));
}

export default Neolastics
