import React from "react";
import { generateStringSVGFromHash } from "../helpers/generator.js";

function CellsComponent(props) {
    const hash = props.hash;
    const svg = generateStringSVGFromHash(hash);

    return (
        <div style={{display:"flex", justifyContent:"left"}} 
            dangerouslySetInnerHTML={{ __html: svg}}    
        >
        </div>
    );
}

export default CellsComponent
