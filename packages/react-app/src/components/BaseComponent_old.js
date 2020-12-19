import React, { Fragment, useState, useEffect} from "react";
import artImageV1 from "./TAIAOS4.png";
import artImageV2 from "./TAIAOS_2.png"
import BuyForm from "./BuyForm";
import ActionForms from "./ActionForms";



function BaseComponent(props) {

    const [buyArtSection, setBuyArtSection] = useState("");
    const [actionsSection, setActionsSection] = useState("");

    const artwork = props.art.v === 'v1' ? <img src={artImageV1} style={{maxWidth: "100%", maxHeight: "100%"}} alt="A R T" />
    : props.art.v === 'v2' ? <img src={artImageV2} style={{maxWidth: "100%", maxHeight: "100%"}} alt="A R T" />
    : <Fragment>Loading A R T . . .</Fragment>;

    const wrongNetworkHML = <Fragment>You are on the wrong network to interact with the artwork. Please switch to the correct network.</Fragment>;

    const bugSection = props.art.v === 'v1' ? 
      <Fragment>
        <h2>PROCEED WITH EXTREME CAUTION</h2>
        The original version contains a few medium-severity bugs that could affect buying and selling of this artwork.<br />
        <br />
        <h3>Front-running: </h3>
        - If you choose to buy, a malicious user could front-run the buy, and steal part of your deposit, by raising the price, before your buy is executed. 
        To protect against this, initially submit a small deposit. That being said: topping up deposit is also vulnerable.<br />
        - In the same manner, if you choose to top-up your deposit, a malicious user can buy the artwork before it is executed, and the deposit would still go through afterwards (effectively stealing the deposit).<br />
        Thus: extreme caution needs to be undertaken to ensure you won't be front-run when buying or topping up the deposit. Buying this artwork is NOT recommended for casual users. <br />
       <h3>Blocking Buying: </h3>
        - If a user buys this artwork from a contract that reverts on ETH sends, it can hold the artwork forever (until their deposit runs out), effectively blocking sale of the artwork.<br />
        - Due to this: the artwork could have a price of 1 wei, and effectively never be sold again in our lifetimes.<br />
        <br />
        Due to these edge-cases, this artwork should only be bought/sold with extreme caution. To continue this being an experiment, it remains on sale.<br />
        <a href="https://github.com/simondlr/thisartworkisalwaysonsale/issues/18">More details on Github.</a><br />
      </Fragment> : <Fragment></Fragment>

    const offlineHTML = <Fragment>
    [In order to interact with this artwork, you need to  have a web3/Ethereum-enabled browser and connect it (see top right of the page). Please download
      the <a href="https://metamask.io">MetaMask Chrome extension</a> or open in an Ethereum-compatible browser.]
    </Fragment>;

    useEffect(() => {
      if(props.injectedChainId !== props.hardcodedChainId && props.injectedChainId !== null) {
        setBuyArtSection(wrongNetworkHML);
        setActionsSection(wrongNetworkHML);
      } else if(props.injectedChainId === props.hardcodedChainId && props.art.v !== null) {
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
        }
      } else if(props.injectedChainId == null) {
        setBuyArtSection(offlineHTML);
        setActionsSection(offlineHTML);
      }
    }, [props.art.artPriceETH, props.injectedChainId, props.art.signerSteward]);


    return (
        <div className="App"> 
        {artwork} 
        <h2>Valued at:  {props.art.artPriceETH} ETH (~${props.art.artPriceUSD} USD) </h2>
        Current Patron: {props.art.patron} <br />
        Time Held By Patron: {props.art.timeHeldHumanized} <br />
        <hr />
        <p>
          The digital artwork above is always on sale.<br />
          In order to own this artwork, you always have to specify a sale price. <br />
          Anyone can buy it from the current patron at any time for the specified sale price. <br />
          Whilst held, a fee (based on the patronage rate) is constantly levied, per second, as patronage towards the artist. <br />
        </p>
        {/* V1 BUG SECTION */}
        {bugSection}
        {/* BUYING ART SECTION */}
        <h2>Buy Artwork</h2>
        <div className="section">
        {buyArtSection}
        </div>
        {/* STATS & ACTIONS SECTION */}
        <div className="section">
        <h2>Current Patron Details:</h2>
        <p>Address: {props.art.patron}</p>
        <p>Available Deposit: {props.art.depositAbleToWithdraw} ETH</p>
        <p>Foreclosure Time: {props.art.foreclosureTime}</p>
        <p>The current deposit will cover the patronage until the time above. At this time, the smart contract steward takes ownership of the artwork and sets its price back to zero.</p>
        <p>Once it crosses this time period, the patron can't top up their deposit anymore and is effectively foreclosed.</p>
      <h2>Actions:</h2>
        {actionsSection}
      <h2>Other Artwork Stats:</h2>
        <p>Total Patronage Collected: {props.art.combinedCollected} ETH</p>
    </div>

        </div>
    );
}

export default BaseComponent
