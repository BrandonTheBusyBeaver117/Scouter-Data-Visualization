import React, { useState } from "react";


export default function Searchbar (props) {

    const[searchableTeamResults, setSearchableTeamResults] = useState([])

    let totalTeamsComponent = [];
    let listOfTotalTeams = []


    const makeSearchable = () => {
       totalTeamsComponent = props.teamData.map( (item, iterate) =>

        <p key ={iterate}>Team {item[0]} --- rank: {item[1]}</p> // I kinda want to format it so that name is on left, ranking on the far right
        
        )

        for (const item of props.teamData) {
            listOfTotalTeams.push({
                teamNumber: String(item[0]),
                teamRanking: item[1]
            
            })
        }


    }

    makeSearchable() //idk if this is good practice, but there's no componentWillMount or constructor method
                    //More research is needed for this...maybe make it state?


    const handleChange = event => {
        //Works to filter through teams
        const response = [...event.target.value]; 

        const teamSearchResults = []

        if(response.length < 1) {
            setSearchableTeamResults([])
            console.log("no input")
        }else if(/\d/.test(response)){ // this line tests whether the input string as numbers or not

            let anyResultFound = false;

            console.log("string: " + response + "length: " + response.length)
            for ( let teamIndex = 0; teamIndex < listOfTotalTeams.length; teamIndex++) {

                const team = listOfTotalTeams[teamIndex];

                //Here's where sorting algorithms come into play
                console.log (typeof team.teamNumber)
                const arrayTeamNumber = [...team.teamNumber]
                const comparableDigits = []
                for ( let i = 0; i < response.length; i++){
                    comparableDigits.push(arrayTeamNumber[i])                   
                }
                
                let successfulCharacterMatches = 0;
                for(let i = 0; i < response.length; i++) {
                    if(response[i] == comparableDigits[i]){
                        successfulCharacterMatches++;
                    }
                }

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

               if(anyResultFound){
                setSearchableTeamResults(teamSearchResults)
                
               } else {
                   setSearchableTeamResults(["No teams found with that number"])
               }
    
            }

        }else{
            //display warning that they need to have only numbers
            setSearchableTeamResults(["Hey! No letters allowed!"])
        }

        console.log("response length" + response.length)


        
    };
/*
onChange, run this function with the current input to sort through our teams, and deliver results



*/

        return (
        <div>
            <input id="SearchBar" type="text" placeholder="Search Teams" onChange = {handleChange} />
            <div>
                {searchableTeamResults}
            </div>
        </div>
        )
     

}