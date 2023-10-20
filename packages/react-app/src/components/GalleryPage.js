import React from "react";
import GalleryComponent from "./GalleryComponent";

function GalleryPage(props) {

    return (
        <div className="App" style={{textAlign:"justify"}}> 
        <h1 style={{textAlign:'left'}}>Gallery</h1>
        <GalleryComponent
        />
        <br />
        <br />
        </div>
    );
}

export default GalleryPage 
