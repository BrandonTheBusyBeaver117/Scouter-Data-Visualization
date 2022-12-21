import React, { useEffect, useRef, useState } from "react";

import "./InformationSource.scss";

export default function InformationSource(props) {


    const [sheetLink, setSheetLink] = useState("");

    const [eventKey, setEventKey] = useState("");

    const fileInput = useRef();
 
    const handleCsvSubmit = event => {
        event.preventDefault();
        console.log(fileInput.current.files[0])
        props.setInputSource(fileInput.current.files[0])
    }


    const handleLinkSubmit = event => {
        event.preventDefault();
        props.setInputSource(sheetLink)
    }

    const handleEventKeySubmit = event => {
        event.preventDefault();
        props.setEventKey(eventKey)
    }

    return <div id = "InformationSource">
        <p>Choose your data source, either a csv file, or a link to a google sheet</p>
        <form onSubmit={(event) => handleCsvSubmit(event)}>
            <label></label>
            <input type = "file" accept=".csv" ref = {fileInput}/>
            <input type = "submit" value = "Submit file" />
        </form>
        
        <form onSubmit={(event) => handleLinkSubmit(event)}>
            <input type = "text" onChange = {(event) => setSheetLink(event.target.value)}/>
            <input type = "submit" value = "Submit link" />
        </form>

        <form onSubmit={(event) => handleEventKeySubmit(event)}>
            <input type = "text" placeHolder = "event key!" onChange = {(event) => setEventKey(event.target.value)}/>
            <input type = "submit" value = "Submit event key!" />
        </form>

    </div>
}
