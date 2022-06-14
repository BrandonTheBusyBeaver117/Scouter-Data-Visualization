import React, { useState } from "react";
import "./SideMenu.scss"

export default function SideMenu (props) {

    const[teamButtons, setTeamButtons] = useState([])



    return (
        <div id = "SideMenu">

            <div id = "TeamButtons">
                <h2>Teams Selected</h2>
                <button>5026</button>
            </div>
        </div>
    )

}