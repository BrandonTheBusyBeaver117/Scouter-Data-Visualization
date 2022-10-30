import React, { useEffect, useRef, useState } from "react";
import "./SearchBar.scss"


export default function Searchbar (props) {

    const [searchableTeamResults, setSearchableTeamResults] = useState([]);
    const [totalTeamsComponent, setTotalTeamComponents] = useState([]);
    const [teamsForComparison, setTeamsForComparison] = useState([]);
    const [searchbarValue, setSearchbarValue] = useState("");


    const noDoubles = (previousTeams, newTeam) => {
        if(previousTeams.includes(newTeam)) {
            return [...previousTeams]
        } else {
            return [...previousTeams, newTeam]
        }
    }

    // Allows chosen teams values to persist 
    const prevChosenTeams = useRef(props.chosenTeams)

    const handleClick = newTeam => {

        console.log(props.chosenTeams)
        console.log(newTeam)

        
        
        const newArray = noDoubles(prevChosenTeams.current, newTeam)
        props.setChosenTeams(newArray)
        
        console.log(newArray)
        
    }



    useEffect(() => {
       
        //Makes all the team components and stores them in an array
        const allTeamComponents = []
        for(const [iterate, item] of props.teamData.entries()){
            //console.log(item[0])
            allTeamComponents.push( 
            //Also might make this my own component
            //If not, I need to add class and its own scss file
            //Might be where caching comes in?
            // I kinda want to format it so that name is on left, ranking on the far right
            
            <p key ={iterate} onClick = {() => handleClick(item[0])}>Team {item[0]} --- rank: {item[1]}</p> 
            )
        }
        setTotalTeamComponents(allTeamComponents)

        for (const item of props.teamData) { // This goes through all the elements in the teamData array
            const newTeam = { 
                //For each element, it pushes that a new team object to a list of all the teams

                /*
                 Property 1 is the team's team number 
                 It's a string so it can be compared to the string output of the searchbar later
                */

                teamNumber: String(item[0]),

                teamRanking: item[1] // The rank of the team at competition
            
            }
            setTeamsForComparison(prevTeams => [...prevTeams, newTeam] )
 
        }

    }, [props.teamData])
    

    // Handle chosen team update
    useEffect(() => {

        console.log("New teams")
        // Change the string passed into this handleChange if you want the searchbar to disappear
        // I.e. make it ""
        handleChange(searchbarValue)
        prevChosenTeams.current = props.chosenTeams
    }, [props.chosenTeams])


    // Handle SearchbarUpdate
    useEffect(() => {
        console.log(searchbarValue)
        handleChange(searchbarValue)
    }, [searchbarValue])
   


    /**
        When there's a change to the searchbar, this function will run

        It takes in the event, which will be stored in "response"

        It works to filter through the teams and output team results
    */
    const handleChange = inputValue => {
       
        // A little redundant, but allows us to have greater control
        setSearchbarValue(inputValue)

        const response = [...inputValue]; //Splits the searchbar response into an array of characters

        const teamSearchResults = []// These are all the teams that matches the response

        if(response.length < 1) { // Checks if there actually is a response 

            setSearchableTeamResults([])// Says that there's no results

            //console.log("no input")
        }else if(!(/[a-z]/i.test(response))){ // Makes sure that the searchbar input doesn't have letters

            let anyResultFound = false; // Were there any results found?

            //console.log("string: " + response + "length: " + response.length)


            /*
                Goes through all the teams and compares it to Search Input
            */
            for ( let teamIndex = 0; teamIndex < teamsForComparison.length; teamIndex++) {

                const team = teamsForComparison[teamIndex];//Defining the team in this iteration

                const arrayTeamNumber = [...team.teamNumber] //Splits the team number into an array of characters
                if (!props.chosenTeams.includes(Number(team.teamNumber))){
           

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
                    for(let i = 0; i < response.length; i++) {

                        if(response[i] == arrayTeamNumber[i]){
                            successfulCharacterMatches++;
                        }
                    }


                    /*
                        If all the compared characters are equal, then a result is found
                        Make sure we have found at least 1 match, and set anyResult to true (That's important later)
                        
                        Then, add the found team's <p> result element to the "team search results" array
                    */

                    if(successfulCharacterMatches === response.length){ // Basically saying if all the characters check out, then put the search
                                                                    //I wonder if there's a way to make it more efficient
                                                                    //Like, somehow eliminate choices as the program searches
                        /*
                        Is it more efficient to make a new <p> or result element every time I find a match
                        or just iterate through another list full of all those premade elements
                        */
                            anyResultFound = true;
                            teamSearchResults.push(totalTeamsComponent[teamIndex])
                    }
                }
    
            }

            if(anyResultFound){// If there's any results found set the state, "searchable team results", to those results
                setSearchableTeamResults(teamSearchResults)

               } else {
                   //If there's no result found, then the state will just be plain text that says the following message
                   setSearchableTeamResults(<p>No teams found with that number</p>)
               }

        }else{
            //display warning that they need to have only numbers
            setSearchableTeamResults(<p>Hey! No letters allowed!</p>)
        }

    
        console.log(searchbarValue)

        
    };
/*
onChange, run this function with the current input to sort through our teams, and deliver results



*/




        return (
        
            <div className = "Searchbar">
                <input id = "searchbar" type="text" placeholder="Search Teams" value = {searchbarValue}  onInput = {event => setSearchbarValue(event.target.value)} />
                <div className = "results">{searchableTeamResults}</div>
            </div>
        )
     

}