import React, { Fragment, useState, useEffect} from "react";
import { useParams, Link } from "react-router-dom";
import { gql, useLazyQuery } from '@apollo/client';
import CellsComponent from "./CellsComponent";

import ethers from 'ethers';
import { Button } from "antd";
import moment from "moment";
/*
One piece + actions on one page
*/

function NeolasticPage(props) {
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
        }
    }
    `

    const [actionSection, setActionSection] = useState("");
    const [detailsSection, setDetailsSection] = useState("");

    const [savedData, setSavedData] = useState(null);

    const [ getNeolastic, { loading, error, data }] = useLazyQuery(NEOLASTIC_QUERY, { variables: { id }, fetchPolicy: 'network-only'});

    const wrongNetworkHTML = <Fragment>You are on the wrong network to interact with the Neolastic. Please switch to the correct network.</Fragment>;

    const offlineHTML = <Fragment>
    [In order to interact with this neolastic, you need to  have a web3/Ethereum-enabled browser and connect it (see top right of the page). Please download
      the <a href="https://metamask.io">MetaMask Chrome extension</a> or open in an Ethereum-compatible browser.]
    </Fragment>;

    function burnNeolastic() {
      props.burnNeolastic(id);
    }

    useEffect(() => {
      if(!!data) {
        if(savedData !== null) {
            setSavedData(data);
        } else { setSavedData(data); }
      }

    }, [data]);

    useEffect(() => {

      if(savedData !== null) {      
        // set details
        let detailsHTML = <Fragment>
          This neolastic does not exist.
        </Fragment>

        let actionsHTML = "";
        if(savedData.neolastic !== null && typeof savedData.neolastic !== 'undefined') {
          const created = moment.unix(savedData.neolastic.created).format();
          detailsHTML = <Fragment>
              Owner: <Link to={'/gallery/'+savedData.neolastic.owner.id}>{savedData.neolastic.owner.id}.</Link> <br />
              Created on: {created} <br />
            </Fragment>

          if(typeof props.address !== 'undefined') {
            if(props.address.toLowerCase() === savedData.neolastic.owner.id) {
              actionsHTML = <Fragment>
              <Button type="primary" onClick={burnNeolastic}>
                Burn
              </Button> <br />
              You will receive {ethers.utils.formatEther(savedData.curve.burnPrice)} ETH from the reserve. <br />
              </Fragment>
            }
          }
        }
      
        setDetailsSection(detailsHTML);
        setActionSection(actionsHTML);
      }
    }, [savedData, props.address, props.curveSigner]); 
    // address only comes in injectedId is online
    // update on signer is necessary if you log back in such that contract functions update their internal state variables

    // provider logic
    useEffect(() => {
      if(props.injectedChainId !== props.hardcodedChainId && props.injectedChainId !== null) {
        setActionSection(wrongNetworkHTML);
      } else if(props.injectedChainId === props.hardcodedChainId) {
        // todo: remove statement
      } else if(props.injectedChainId == null) {
        setActionSection(offlineHTML);
      }
    }, [props.hardcodedChainId]); // TODO: re-add signer coming in

    // update component if a user tx occurred
    useEffect(() => {
      if(savedData !== null) {
          setTimeout(function(){ 
              getNeolastic();
          }, 2000);
      } else { getNeolastic(); }
    }, [props.transactionsExecuted]);

    return (
        <div className="App" style={{textAlign:'center'}}> 
          <CellsComponent hash={ethers.BigNumber.from(id).toHexString()} />
          {detailsSection}
          {actionSection}
        </div>
    );
}

export default NeolasticPage
