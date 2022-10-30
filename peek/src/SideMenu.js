import React, { useState } from "react";
import "./SideMenu.scss"

export default function SideMenu (props) {

    const[teamButtons, setTeamButtons] = useState([])
    



    return (
        <div id = "SideMenu">

            <div id = "TeamButtons">
                <h2>Teams Selected</h2>
                <button>5026</button>
                <h2>Sort By:</h2>
                <button onClick = {() => props.sortTeamsQualities("auto-pickup")}>Auto-Pickup</button>
                <h2>Clear Teams:</h2>
                <button id = "clear" onClick = {() => props.setChosenTeams([])}>CLEAR</button>
            </div>
        </div>
    )

}