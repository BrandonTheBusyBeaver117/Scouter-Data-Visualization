import React, { useEffect, useRef, useState } from "react";
import "./SearchBar.scss"


export default function Searchbar(props) {

    const [searchbarValue, setSearchbarValue] = useState("");
    const [clickedInsideSearchbar, setClickedInsideSearchbar] = useState(false);

    // Allows chosen teams values to persist 
    const prevChosenTeams = useRef(props.chosenTeams)

    const handleResultClick = (newTeam) => {

        if (prevChosenTeams.current.includes(newTeam)) {
            props.setChosenTeams([...prevChosenTeams.current])
        } else {
            props.setChosenTeams([...prevChosenTeams.current, newTeam])
        }

    }


    // Thanks to Ben Bud's answer for inspiration
    // Solution found at https://stackoverflow.com/a/42234988

    const lastClickedClassName = useRef("")
    useEffect(() => {
        
        function handleClickOutside(event) {

            if (lastClickedClassName.current === "insideSearchbar" && event.target.className !== "insideSearchbar") {

                console.log("click outside")

                setClickedInsideSearchbar(false)

            } else if (lastClickedClassName.current !== "insideSearchbar" && event.target.className === "insideSearchbar") {
                console.log("Click inside")

                setClickedInsideSearchbar(true)
            }
            lastClickedClassName.current = event.target.className
        }
        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Handle chosen team update
    useEffect(() => {
        prevChosenTeams.current = props.chosenTeams

    }, [props.chosenTeams])


    /**
        When there's a change to the searchbar, this function will run

        It works to filter through the teams and output team results
    */
    const handleChange = (allTeamsMap, inputValue, chosenTeams, isClickedInsideSearchbar) => {

        //console.log(inputValue)

        // Is there a response? OR The user has clicked outside the searchbar
        if (inputValue.length < 1 || !isClickedInsideSearchbar) {
            // Show no results
            return []
        }

        // All the teams that matches the response
        const teamSearchResults = []

        // All the teams that we grab from the map
        const allTeams = allTeamsMap.keys()

        // Makes sure that the searchbar input doesn't have letters
        if (!(/[a-z]/i.test(inputValue))) { 

            // Were there any results found?
            let anyResultFound = false; 
        
            // Traverses through all the team numbers
            for (const teamNumber of allTeams) {

                // .slice takes the length of the teamnumber to compare to the input value
                // If they are equal, then it's a match, and it's a possible result
                if (String(teamNumber).slice(0, inputValue.length) === inputValue) {

                    // We did find a result
                    anyResultFound = true;

                    // Only push it if it's not already included
                    if (!chosenTeams.includes(teamNumber)) {
                        
                        // Push the result
                        teamSearchResults.push(<p
                            key={teamNumber}
                            onClick={() => handleResultClick(teamNumber)}
                            className="insideSearchbar"
                        >Team {teamNumber} --- rank: {allTeamsMap.get(teamNumber).get("teamRank")}</p>
                        )
                    }
                }


            }

            if (anyResultFound) {// If there's any results found set the state, "searchable team results", to those results
                return teamSearchResults
            } else {
                //If there's no result found, then the state will just be plain text that says the following message
                return <p className="insideSearchbar">No teams found with that number</p>
            }

        } else {
            //display warning that they need to have only numbers
            return <p className="insideSearchbar">Hey! No letters allowed!</p>
        }

    };
   

    return (

        <div className="Searchbar" >
            <input
                id="searchbar"
                type="text"
                placeholder="Search Teams"
                value={searchbarValue}
                onInput={event => setSearchbarValue(event.target.value)}
                autoComplete="off"
                className="insideSearchbar"
            />

            <div className="results">{handleChange(props.teamInformation, searchbarValue, props.chosenTeams, clickedInsideSearchbar)}</div>
        </div>
    )

}