import React, { useEffect, useRef, useState } from "react";
import "./SearchBar.scss"


export default function Searchbar(props) {

    const [searchbarValue, setSearchbarValue] = useState("");
    const [clickedInsideSearchbar, setClickedInsideSearchbar] = useState(false);

    // Allows chosen teams values to persist 
    const prevChosenTeams = useRef(props.chosenTeams)

    const handleResultClick = newTeam => {

        console.log(props.chosenTeams)
        console.log(newTeam)

        const noDoubles = (previousTeams, newTeam) => {
            if (previousTeams.includes(newTeam)) {
                return [...previousTeams]
            } else {
                return [...previousTeams, newTeam]
            }
        }

        const newArray = noDoubles(prevChosenTeams.current, newTeam)
        props.setChosenTeams(newArray)

        console.log(newArray)

    }




    // Thanks to Ben Bud
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

        console.log("New teams")
        // Change the string passed into this handleChange if you want the searchbar to disappear
        // I.e. make it ""
        handleChange(searchbarValue, props.chosenTeams)
        prevChosenTeams.current = props.chosenTeams
    }, [props.chosenTeams])


    // Handle SearchbarUpdate
    useEffect(() => {
        console.log(searchbarValue)
        handleChange(searchbarValue, props.chosenTeams)
    }, [searchbarValue])



    /**
        When there's a change to the searchbar, this function will run

        It works to filter through the teams and output team results
    */
    const handleChange = (allTeamsMap, inputValue, chosenTeams, isClickedInsideSearchbar) => {

        console.log(inputValue)

        if (inputValue.length < 1 || !isClickedInsideSearchbar) { // Checks if there actually is a response 

            return []// Says that there's no results

            //console.log("no input")
        }

        const response = [...inputValue]; //Splits the searchbar response into an array of characters

        const teamSearchResults = []// These are all the teams that matches the response

        const allTeams = allTeamsMap.keys()

        if (!(/[a-z]/i.test(response))) { // Makes sure that the searchbar input doesn't have letters

            let anyResultFound = false; // Were there any results found?

            console.log("string: " + response + "length: " + response.length)


            /*
                Goes through all the teams and compares it to Search Input
            */
            for (const teamNumber of allTeams) {

                const arrayTeamNumber = [...String(teamNumber)] //Splits the team number into an array of characters          

                /*
                    For each iteration, it starts off with 0 character matches between th e
                    search input and the team number
                */
                let successfulCharacterMatches = 0;


                /*
                    Goes through all the characters in the response and compares it to the first 
                    same amount of characters in the team number 
                    
                    If a match is found, add 1 to the successful matches
                */
                for (let i = 0; i < response.length; i++) {

                    if (response[i] == arrayTeamNumber[i]) {
                        successfulCharacterMatches++;
                    }
                }


                /*
                    If all the compared characters are equal, then a result is found
                    Make sure we have found at least 1 match, and set anyResult to true (That's important later)
                    
                    Then, add the found team's <p> result element to the "team search results" array
                */

                if (successfulCharacterMatches === response.length) { // Basically saying if all the characters check out, then put the search
                    //I wonder if there's a way to make it more efficient
                    //Like, somehow eliminate choices as the program searches
                    /*
                    Is it more efficient to make a new <p> or result element every time I find a match
                    or just iterate through another list full of all those premade elements
                    */
                    anyResultFound = true;
                    if (!chosenTeams.includes(teamNumber)) {
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