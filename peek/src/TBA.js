import React, {Component} from 'react';
import axios from "axios"; 

let teamRankings = [];
let responseSave;
let newText;
const interval = 3 *1000;// 1000 represents milliseconds

export class TBA extends Component {

    constructor() {
        super();
        this.state = {
            rawTeam: "N/A",
            allTeamsString : "Get Data"
        }
        this.printAllTeams = this.printAllTeams.bind(this);
        this.getData = this.getData.bind(this);
  
    }

    componentDidMount = () => {
        //this.backgroundDataCollector()
        this.getData(); 
    }// there's something in tba api that already does this

    backgroundDataCollector (){
        setInterval(this.getData(), interval)
    }    

    getData (){
        axios.get('/getData').then( response => {
            
            /*
            Ideas to make this more efficient:
            Save a previous iteration of the json file, then constantly compare it to the current json file
            Only if you see a difference, then you iterate through the entire array
            then change the rest of the data on the site

            This might only be useful for google sheets however
            */      
            responseSave = response.data; 

            console.log(responseSave.rankings)// printing out the rankings part of the json file
            
            for (const Team of responseSave.rankings){
                teamRankings.push({
                    "teamNumber" : Team.team_key.replace("frc",""),//gets rid of the "frc" before the number
                    "ranking" : Team.rank});
            }//This is basically a for-each loop. It iterates through the entire response data array and saves the rankings     

            console.log(teamRankings)
            this.setState({rawTeam : teamRankings});
            console.log(this.state.rawTeam);
                
            console.log(this.state)

                }).catch(error => {
                console.log("Error occured!" + error)
                })

    }



    printAllTeams() { 

        newText = this.state.rawTeam.map((item,iterate) => <p key={iterate}>Team {item.teamNumber} is currently rank: {item.ranking}</p>)
    
        this.setState({allTeamsString : newText});//Sets the state of the 

    } // Basically creates a bunch of team paragraphs

    render() {
        return (
        <div>
            <h1>These are the teams:</h1>
            <button onClick={this.printAllTeams}>{this.state.allTeamsString}</button>
        </div>
        )
     
    }

}