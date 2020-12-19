import React, { Fragment } from "react";
import { generateStringSVGFromHash } from "../helpers/generator.js";


function CellsComponent(props) {
    const hash = props.hash;
    const svg = generateStringSVGFromHash(hash);

    return (
        <div style={{display:"flex", justifyContent:"center"}} 
            dangerouslySetInnerHTML={{ __html: svg}}    
        >
        </div>
    );
}

export default CellsComponent
