import React, { useEffect, useState } from "react";

import "./InformationSourceDisplay.scss"

import InformationSource from "./InformationSource";

export default function InformationSourceDisplay(props) {

    const [isInputShown, setIsInputShown] = useState(false)

    const renderInfoInput = (shouldInputBeShown) => {
        if(shouldInputBeShown) {
            return <div id = "InfoSourceInput">
                        <InformationSource 
                            id = "InformationSource"
                            setInputSource = {props.setInputSource} 
                            setEventKey = {props.setEventKey}
                            setIsInputShown = {setIsInputShown}
                            currentInputSource = {props.currentInputSource}
                            currentEventKey = {props.currentEventKey}
                        />
                    </div>
        }

    }

    return <div id = "InformationSourceDisplay">
       
        <button onClick = {() => setIsInputShown(true)}>Change Data Source</button>
        {renderInfoInput(isInputShown)}
    </div>
}
