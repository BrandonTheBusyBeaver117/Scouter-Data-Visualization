import React, { Component } from 'react';
import {Team} from 'teams.' 


let teamRankings = [];
let teamMatchData = [];
let googleSheetHeaders = [];



export class TeamModifier extends Component {


    constructor() {
        super();
        this.state = {
            listOfAllTeams: []
            

        }
        //this.printAllTeams = this.printAllTeams.bind(this);
        this.getData = this.getData.bind(this);

    }

    componentDidMount = () => { this.backgroundDataCollector() }// there's something in tba api that already does this

    backgroundDataCollector() {
        setInterval(this.getData(), interval)
    }

    
    getTBAData() { 

        axios.get('/getData').then( response => {
            
            /*
            Ideas to make this more efficient:
            Save a previous iteration of the json file, then constantly compare it to the current json file
            Only if you see a difference, then you iterate through the entire array
            then change the rest of the data on the site

            This might only be useful for google sheets however
            */      
            const responseSave = response.data.rankings; 
            
            for (const Team of responseSave){
                teamRankings.push({
                    "teamNumber" : Team.team_key.replace("frc",""),//gets rid of the "frc" before the number
                    "ranking" : Team.rank});
            }//This is basically a for-each loop. It iterates through the entire response data array and saves the rankings     
 
            //this.setState({rawTeam : teamRankings}); 


            /*maybe return teamrankings, or just use objectappend to combine 
            the two arrays with spreadsheets and make one big object or something            
            */
                }).catch(error => {
                console.log("Error occured!" + error)
                })
    }

    getSpreadsheetData () {
        axios.get('getSpreadsheetData').then( response => { 
            console.log(response)

            googleSheetHeaders =  response[0]; 

            for(const Match of response){// Gets the individual match data
                if(!Match == googleSheetHeaders){// Doesn't check that row with headers 
                    for(let i = 0; i < Match.length; i++){//Iterates through each piece of data in match
                        if(Match[1]){
                            this.state.listOfAllTeams.push(new Team(googleSheetHeaders,teamRankings))
                        }
                        teamMatchData[i].push([Match[i]]
                            //iterate through the first index first or smth, cause we know that's all the teams and headers 
                        )

                    }
                }
        
            }
            return response;
        }).catch(error => console.log(error))
    }

    createTeams () {

        this.getTBAData();
    
        for (const team of teamRankings){
            teamHolder = this.state.rawTeam.map((item,iterate) => <Team googleSheetHeaders = {this.googleSheetHeaders}></Team>)
    
        }

        
    }


    render() {
        return (
            <div>
                <h1>These are the teams:</h1>
                <button onClick={this.printAllTeams}>{this.state.allTeamsString}</button>
            </div>
        )

    }

}