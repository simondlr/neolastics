import React from 'react';
import { Link } from 'react-router-dom';
import { useAccount } from 'wagmi';

export default function Account(props) {

  const { isConnected, address } = useAccount();

  let galleryLink;
  if(isConnected) {
    galleryLink = <Link to={"/gallery/"+address}> MY GALLERY </Link>;
  }

  return (
    <div className="account" style={{fontFamily:"SFNewRepublic"}} >
      <span className="accountLink">
        <Link to="/">HOME</Link> - {galleryLink}
      </span> 
      <w3m-button balance="hide" size="sm" style={{float:'right'}}/>      
      <br />
      <br />
      <h1 style={{textAlign:"justify"}}>NEOLASTICS: Liquid On-Chain Generative Neo-Plastic Art</h1> 
    </div>
  );
  
}
