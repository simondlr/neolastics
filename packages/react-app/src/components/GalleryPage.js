import React from "react";
import GalleryComponent from "./GalleryComponent";

function GalleryPage(props) {

    return (
        <div className="App" style={{textAlign:"justify"}}> 
        <h2 style={{textAlign:'center'}}>Gallery</h2>
        <GalleryComponent
        />
        <br />
        <hr />        

        </div>
    );
}

export default GalleryPage 
