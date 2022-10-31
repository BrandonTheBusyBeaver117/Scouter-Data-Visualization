import React, { useState } from "react";
import "./SideMenu.scss"

export default function SideMenu (props) {

    const[teamButtons, setTeamButtons] = useState([])
    
    const createTeamButtons = (teamList) => {
        console.log("Trying to createTeamButtons")
        console.log(teamList)

        const newTeamButtons = []
        for (const team of teamList) {
            const newTeamButton = <div id = {team} key = {team}>
                                        <button class = "teamSelector" >{team}</button>
                                        <button class = "delete" onClick = {() => props.clearChosenTeams([team])}>x</button>
                                  </div>
            newTeamButtons.push(newTeamButton)
        }


        console.log(newTeamButtons)
        return newTeamButtons
    }



    return (
        <div id = "SideMenu">

            <div id = "TeamButtons">
                <h2>Teams Selected</h2>
                <div>{createTeamButtons(props.chosenTeams)}</div>
                <h2>Sort By:</h2>
                <button onClick = {() => props.sortTeamsQualities("auto-pickup")}>Auto-Pickup</button>
            </div>
            <h2>Clear Teams:</h2>
                <button id = "clear" onClick = {() => props.setChosenTeams([])}>CLEAR</button>
        </div>
    )

}