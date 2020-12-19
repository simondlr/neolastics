import React, { Fragment, useState, useEffect} from "react";
import PlasticComponent from "./PlasticComponent";

import BuyForm from "./BuyForm";
import ActionForms from "./ActionForms";



function BaseComponent(props) {
    //todo: check if ID is malformed or not

    //
    const [bodySection, setBodySection] = useState("");
    // const [actionsSection, setActionsSection] = useState("");

    const wrongNetworkHML = <Fragment>You are on the wrong network to interact with the artwork. Please switch to the correct network.</Fragment>;

    const offlineHTML = <Fragment>
    [In order to interact with this artwork, you need to  have a web3/Ethereum-enabled browser and connect it (see top right of the page). Please download
      the <a href="https://metamask.io">MetaMask Chrome extension</a> or open in an Ethereum-compatible browser.]
    </Fragment>;

    useEffect(() => {
      if(props.injectedChainId !== props.hardcodedChainId && props.injectedChainId !== null) {
        setBodySection(wrongNetworkHML);
      } else if(props.injectedChainId === props.hardcodedChainId) {
        setBodySection(<PlasticComponent />);
        /*
        setBuyArtSection(<Fragment>
        <p>You will pay {props.art.artPriceETH} ETH.<br /> Add your own sale price and amount you want to deposit for patronage: </p>
        <BuyForm
            v={props.art.v}
            BuyArt={props.BuyArt} 
           />
        </Fragment>);

        if(props.art.v !== null) {
          setActionsSection(<Fragment>
            <ActionForms 
              v={props.art.v}
              changePrice={props.changePrice}
              topupDeposit={props.topupDeposit}
              withdrawSomeDeposit={props.withdrawSomeDeposit}
              withdrawWholeDeposit={props.withdrawWholeDeposit}
            />
            </Fragment>);
        }*/
      } else if(props.injectedChainId == null) {
        setBodySection(offlineHTML);
      }
    }, [props.injectedChainId]); // TODO: re-add signer coming in


    return (
        <div className="App"> 
          {bodySection}
        </div>
    );
}

export default BaseComponent
