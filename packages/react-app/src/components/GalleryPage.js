import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "antd";
import GalleryComponent from "./GalleryComponent";
import { Fragment } from "ethers/lib/utils";

import ethers from 'ethers';

function GalleryPage(props) {

    return (
        <div className="App" style={{textAlign:"justify"}}> 
        <hr />        
        <h2 style={{textAlign:'center'}}>Summary</h2>
        INFORMATION
        <h2 style={{textAlign:'center'}}>Gallery</h2>
        <GalleryComponent
        />
        <br />
        <hr />        

        </div>
    );
}

export default GalleryPage 
