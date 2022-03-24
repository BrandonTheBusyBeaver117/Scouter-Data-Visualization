import React, {Component} from 'react';
import axios from "axios";

let teamRankings = [];
let responseSave;
let holdTeams = "";
let newText;
let idMaker;

export class TBA extends Component {

    constructor() {
        super();
        this.state = {
            rawTeam: "N/A",
            allTeamsString : "Get Data"
        }
        this.getAllTeams = this.getAllTeams.bind(this);
  
    }

    componentDidMount = () => {        
        axios.get('/getData').then( response => {
            console.log(response)
            
       /*
       Ideas to make this more efficient:
       Save a previous iteration of the json file, then constantly compare it to the current json file
       Only if you see a difference, then you iterate through the entire array
       then change the rest of the data on the site
       */      
       responseSave = response.data;
       //res.json(response.data)
       console.log(responseSave)// printing out the json file
       
       for (let i = 0; i <responseSave.rankings.length; i++){
           teamRankings.push({
               "teamNumber" : responseSave.rankings[i].team_key.replace("frc",""),
               "ranking" : responseSave.rankings[i].rank});
      }     

       console.log(teamRankings)
       this.setState({rawTeam : teamRankings});
        console.log(this.state.rawTeam);
        
       console.log(this.state)
        }).catch(function(error) {
           console.log("Error occured!" + error)
          })
    }
    
   getAllTeams() {
       console.log("get")
        for (let i = 0; i <this.state.rawTeam.length; i++){
            
        holdTeams+="Team #" + this.state.rawTeam[i].teamNumber + " is rank: " + this.state.rawTeam[i].ranking + "\n";

    }

    console.log(holdTeams)  
    /*
       newText = holdTeams.split ('\n').map ((item, iterate) => {
        idMaker = "TeamList#" + iterate;
       return <p key= {idMaker}>{item}</p>
       
       });
       */
       newText = holdTeams.split ('\n').map ((item, iterate) => <p key={iterate}>{item}</p>);
console.log(newText[7])
       this.setState({allTeamsString : newText});

       {this.state.people.map((person, index) => (
        <p>Hello, {person.name} from {person.country}!</p>
    ))}

    }

    render() {
        return (
        <div>
            <h1>These are the teams:</h1>
            <button onClick={this.getAllTeams}>{this.state.allTeamsString}</button>
        </div>
        )
     
    }

}