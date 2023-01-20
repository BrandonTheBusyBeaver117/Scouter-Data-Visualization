import React, { useEffect, useState } from "react";
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
                const newTeamButton = <div key = {team}>
                                        <button className = "teamSelector" onClick = {() => document.getElementById("team" + team).scrollIntoView({behavior: "smooth", block: "center"})}>{team}</button>
                                        <button className = "delete" onClick = {() => props.clearChosenTeams([team])}>x</button>
                                      </div>
                newTeamButtons.push(newTeamButton)
            }
        }

        return newTeamButtons
    } 

    const optionSelector = (teamMap, sortImmediately) => {

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

    // Update the selected quality and sort
    const sortTeams = newSelectedQuality => {
        
        // Finding the first team in the map
        // Starting an iterator, getting the first element, then getting its value (the team)
        const firstTeam = props.teamInformation.values().next().value;

        const data = firstTeam.get(newSelectedQuality)

        // Assumes that data actually exists...
        // If the data is actually something we can process, then sort
        // Otherwise, if it's a string (like a comment), then do not sort
        if(data.includes("TRUE") || data.includes("FALSE") || !isNaN(data[0])){
            props.sortTeamsQualities(newSelectedQuality)
        } 
        

    }

    // Once the teammodifier has a selected quality, use it if we have none in this component
    useEffect(() => {
        if(optionState === "") {
            setOptionState(props.selectedQuality)
        }
        
    },[props.selectedQuality])

    useEffect(() => {
        
        props.setSelectedQuality(optionState)

        if(props.sortImmediately) sortTeams (optionState)

    }, [optionState, props.sortImmediately])
    

    console.log(props.teamInformation)
    return (
        <div id = "SideMenu">

            <div id = "TeamButtons">
                <h2>Teams Selected</h2>
                <div>{createTeamButtons(props.chosenTeams)}</div>
                <h2>Sort Teams by:</h2>
                <button onClick = {() => sortTeams(optionState)} style={{display: props.sortImmediately ? "none" : ""}}>
                    {optionState}
                </button>
                {optionSelector(props.teamInformation, props.sortImmediately)}
           </div>
            <h2>Clear Teams:</h2>
                <button id = "clear" onClick = {() => props.setChosenTeams([])}>CLEAR</button>
        </div>
    )

}