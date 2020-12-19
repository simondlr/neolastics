import React, { Fragment, useState, useEffect} from "react";
// import PlasticComponent from "./PlasticComponent";
import { useParams } from "react-router-dom";
import { gql, useQuery } from '@apollo/client';
import CellsComponent from "./CellsComponent";

import ethers from 'ethers';
import { Button } from "antd";
import moment from "moment";
/*
One piece + actions on one page
*/

function NeolasticComponent(props) {
    let { id } = useParams();

    const NEOLASTIC_QUERY = gql`
    query Neolastic($id: String!) {
        neolastic(id: $id) {
            id
            created
            pricePaid
            owner {
                id
            }
        }
        curve(id: "1") {
          burnPrice
          reserve
          totalSupply
        }
    }
    `

    //graphql -> get it
    //this refires is the component receives new props. seems a bit extra? todo
    const { loading, error, data } = useQuery(NEOLASTIC_QUERY, { variables: { id }});

    const [actionSection, setActionSection] = useState("");
    const [detailsSection, setDetailsSection] = useState("");
    const [owner, setOwner] = useState("0x42");
    const [burnPrice, setBurnPrice] = useState('0');

    const wrongNetworkHTML = <Fragment>You are on the wrong network to interact with the Neolastic. Please switch to the correct network.</Fragment>;

    const offlineHTML = <Fragment>
    [In order to interact with this neolastic, you need to  have a web3/Ethereum-enabled browser and connect it (see top right of the page). Please download
      the <a href="https://metamask.io">MetaMask Chrome extension</a> or open in an Ethereum-compatible browser.]
    </Fragment>;

    function burnNeolastic() {
      props.burnNeolastic(id);
    }

    useEffect(() => {
      let detailsHTML = "";
      console.log('l', loading);
      if(!loading) {
        console.log('loaded');
        if(data.curve !== null) { // not likely to ever happen unless init of site
          setBurnPrice(data.curve.burnPrice);
          console.log(ethers.utils.formatEther(data.curve.reserve));
          console.log(data.curve.totalSupply);
        }

        if(data.neolastic !== null) {
          const iowner = data.neolastic.owner.id;
          const created = moment.unix(data.neolastic.created).format();
          setOwner(iowner);
          detailsHTML = <Fragment>
            Owner: {data.neolastic.owner.id} <br />
            Created on: {created} <br />
          </Fragment>
        } else {
          detailsHTML = <Fragment>
            This neolastic does not exist.
          </Fragment>
        }
      } else {
        detailsHTML = <Fragment>Loading . . .</Fragment>
      }
      
      setDetailsSection(detailsHTML);
    }, [loading]);

    useEffect(() => {
      // if address == owner, show actions, but otherwise, just details 
      console.log('effect triggered');
      if(typeof props.address !== 'undefined') {
        if(props.address.toLowerCase() === owner) {
          const iactionsHTML = <Fragment>
          <Button type="primary" onClick={burnNeolastic}>
            Burn
          </Button> <br />
          You will receive {ethers.utils.formatEther(burnPrice)} ETH from the reserve. <br />
          </Fragment>
          setActionSection(iactionsHTML);
        }
      }
    }, [owner, props.address, props.curveSigner]); // address only comes in injectedId is online
    // update on signer is necessary if you log back in such that contract functions update their internal state variables

    useEffect(() => {
      if(props.injectedChainId !== props.hardcodedChainId && props.injectedChainId !== null) {
        setActionSection(wrongNetworkHTML);
      } else if(props.injectedChainId === props.hardcodedChainId) {

        // todo: remove statement
      } else if(props.injectedChainId == null) {
        setActionSection(offlineHTML);
      }
    }, [props.hardcodedChainId]); // TODO: re-add signer coming in


    return (
        <div className="App" style={{textAlign:'center'}}> 
          <CellsComponent hash={ethers.BigNumber.from(id).toHexString()} />
          {detailsSection}
          {actionSection}
        </div>
    );
}

export default NeolasticComponent
