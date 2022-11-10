import React, { useState } from "react";
import "./SideMenu.scss"

export default function SideMenu (props) {

    const[teamButtons, setTeamButtons] = useState([])
    const[optionState, setOptionState] = useState("")
    
    const createTeamButtons = (teamList) => {
        console.log("Trying to createTeamButtons")
        console.log(teamList)

        const newTeamButtons = []
        for (const team of teamList) {
            const newTeamButton = <div id = {team} key = {team}>
                                        <button className = "teamSelector" >{team}</button>
                                        <button className = "delete" onClick = {() => props.clearChosenTeams([team])}>x</button>
                                  </div>
            newTeamButtons.push(newTeamButton)
        }


        console.log(newTeamButtons)
        return newTeamButtons
    }

    const optionSelector = (teamMap) => {
        const firstTeam = teamMap.values().next().value;

        const attributes = firstTeam?.keys() ?? [];

        const options = [];

        for (const attribute of attributes){
            options.push(<option value = {attribute ?? ""}>{attribute ?? ""}</option>)
        }
        return (
                <div>
                    <select value = {optionState} onChange={event => setOptionState(event.target.value)}>
                    {options}
                    </select>
                </div>
                )
    }

    console.log(props.teamInformation)
    return (
        <div id = "SideMenu">

            <div id = "TeamButtons">
                <h2>Teams Selected</h2>
                <div>{createTeamButtons(props.chosenTeams)}</div>
                <h2>Sort Teams by:</h2>
                <button Sort = {() => props.sortTeamsQualities(optionState)}>{optionState}</button>
                {optionSelector(props.teamInformation)}
           </div>
            <h2>Clear Teams:</h2>
                <button id = "clear" onClick = {() => props.setChosenTeams([])}>CLEAR</button>
        </div>
    )

}