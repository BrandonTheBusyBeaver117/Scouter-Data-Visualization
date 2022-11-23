import React, { useState } from "react";
import "./SideMenu.scss"

export default function SideMenu (props) {

    const[optionState, setOptionState] = useState("")
    
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

        // Array of all the options
        const options = [];

        // Makes sure that the team isn't undefined (duh)
        if(firstTeam !== undefined){
            // Iterates through all the attributes and data of the team
            for(const [attribute, data] of firstTeam) {
                // Checks if the data is actually iterable (for the data chart)
                if(typeof data[Symbol.iterator] === 'function'){
                    options.push(<option key = {attribute} value = {attribute}>{attribute}</option>)
                }
            }
        }

        return (
                <div>
                    <select value = {optionState} onChange={event => setOptionState(event.target.value)}>
                    {options}
                    </select>
                </div>
                )
    }

    const updateTeamSelectedProperty = (newSelectedQuality) => {
        props.setSelectedQuality(newSelectedQuality)
        props.sortTeamsQualities(newSelectedQuality)
    }

    

    console.log(props.teamInformation)
    return (
        <div id = "SideMenu">

            <div id = "TeamButtons">
                <h2>Teams Selected</h2>
                <div>{createTeamButtons(props.chosenTeams)}</div>
                <h2>Sort Teams by:</h2>
                <button onClick = {() => updateTeamSelectedProperty(optionState)}>
                    {optionState}
                </button>
                {optionSelector(props.teamInformation)}
           </div>
            <h2>Clear Teams:</h2>
                <button id = "clear" onClick = {() => props.setChosenTeams([])}>CLEAR</button>
        </div>
    )

}