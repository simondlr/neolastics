import React, { Fragment, useState, useEffect} from "react";
import { useParams, Link } from "react-router-dom";
import { gql, useLazyQuery } from '@apollo/client';
import CellsComponent from "./CellsComponent";

import { ethers } from 'ethers';
import { Button } from "antd";
import moment from "moment";

import { useAccount, useNetwork, useWaitForTransaction, useContractWrite  } from 'wagmi';

import CurveJSON from "../contracts/Curve.json";
/*
One piece + actions on one page
*/
function BurnNeolasticComponent(props) {
  console.log(props);

  const { data, write } = useContractWrite({
    address: props.curveAddress,
    abi: CurveJSON.abi,
    functionName: 'burn',
    args: [props.tokenId],
  });
 
  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess(data) {
      console.log('tx succeeded, firing graphql refresh');
      props.refreshGraphQL(); 
    }
  });

  return (
      <div>
        <Fragment>
          <Button type="primary" onClick={write}>
            BURN
          </Button> 
          {isLoading ? ' Transaction Pending...': ''}
          {isSuccess ? ' Completed!' : ''}
          <br />
          <br />
          You will receive {ethers.utils.formatEther(props.burnPrice)} ETH from the reserve. <br />
        </Fragment>
      </div>
  )
}

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

    const [detailsSection, setDetailsSection] = useState("");

    const [savedData, setSavedData] = useState(null);

    const [ getNeolastic, { loading, error, data }] = useLazyQuery(NEOLASTIC_QUERY, { variables: { id }, fetchPolicy: 'network-only'});

    // manually refresh thegraph data if needed
    function refresh() {
      console.log('firing reload');
      getNeolastic();
    }

    const wrongNetworkHTML = <Fragment>You are on the wrong network to interact with the Neolastic. Please switch to the correct network.</Fragment>;

    // note, there's no possibility to be "offline" this page because you have to be connected anyway to determine whether you can burn the piece or not

    useEffect(() => {
      if(!!data) {
        if(savedData !== null) {
            setSavedData(data);
        } else { setSavedData(data); }
      }

    }, [data]);

    // note:
    // this by only populating details after saveddata is kind of better than how it's done on the intro page.
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
              Mint Price: {ethers.utils.formatEther(savedData.neolastic.pricePaid)} <br />
            </Fragment>
        }
      
        setDetailsSection(detailsHTML);
      }
    }, [savedData]); 

    useEffect(() => {
      getNeolastic(); 
    }, []);

    const { chain, chains } = useNetwork();
    const { address, isConnected } = useAccount();

    let burnPrice = '0';
    let showBurn = false;

    if (savedData !== null && address !== undefined) {
      burnPrice = savedData.curve.burnPrice;
      if(address.toLowerCase() === savedData.neolastic.owner.id) {
        showBurn = true;
      }
    }

    return (
        <div className="App" style={{textAlign:'left'}}>
          <CellsComponent hash={ethers.BigNumber.from(id).toHexString()} />
          <br />
          {detailsSection}
          <br />
          {isConnected ? chain.id === props.chainID ? showBurn ? <Fragment>
            <BurnNeolasticComponent tokenId={id} curveAddress={props.curveAddress} burnPrice={burnPrice} refreshGraphQL={refresh} />
          </Fragment> : '' : wrongNetworkHTML : '' }
        </div>
    );
}

export default NeolasticPage
