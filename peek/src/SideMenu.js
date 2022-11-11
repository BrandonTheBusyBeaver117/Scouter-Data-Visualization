import React, { useState } from "react";
import "./SideMenu.scss"

export default function SideMenu (props) {

    //const[optionState, setOptionState] = useState("")
    
    const createTeamButtons = (teamList) => {

        const newTeamButtons = []
        if(teamList.length === 0){
            newTeamButtons.push(
                <div>
                    <button className = "teamSelector" >No teams selected</button>
                </div>
            )
        } else {
            for (const team of teamList) {
                const newTeamButton = <div id = {team} key = {team}>
                                        <button className = "teamSelector" >{team}</button>
                                        <button className = "delete" onClick = {() => props.clearChosenTeams([team])}>x</button>
                                      </div>
                newTeamButtons.push(newTeamButton)
            }
        }

        return newTeamButtons
    } 

    const optionSelector = (teamMap) => {

        // Finding the first team in the map
        // Starting an iterator, getting the first element, then getting its value (the team)
        const firstTeam = teamMap.values().next().value;

        // Finding the keys of the first team
        // If it's undefined, then just make the keys an empty array
        const attributes = firstTeam?.keys() ?? [];

        // Array of all the options
        const options = [];

        for (const attribute of attributes){
            options.push(<option value = {attribute ?? ""}>{attribute ?? ""}</option>)
        }
        return (
                <div>
                    <select value = {props.selectedQuality} onChange={event => props.setSelectedQuality(event.target.value)}>
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
                <button onClick = {() => props.sortTeamsQualities(props.selectedQuality)}>
                    {props.selectedQuality === "" ? "No Quality selected" : props.selectedQuality}
                </button>
                {optionSelector(props.teamInformation)}
           </div>
            <h2>Clear Teams:</h2>
                <button id = "clear" onClick = {() => props.setChosenTeams([])}>CLEAR</button>
        </div>
    )

}