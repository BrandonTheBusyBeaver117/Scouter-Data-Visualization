import React, {Component} from 'react';
import axios from "axios";

let teamRankings = [];
let responseSave;
let holdTeams = "";
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

    componentDidMount = () => {  this.backgroundDataCollector()    }

    backgroundDataCollector (){
        setInterval(this.getData(), interval)
    }    

    getData (){
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
            console.log(responseSave.rankings)// printing out the json file
            
            for (const Team of responseSave.rankings){
                teamRankings.push({
                    "teamNumber" : Team.team_key.replace("frc",""),//gets rid of the "frc" before the number
                    "ranking" : Team.rank});
            }     

            console.log(teamRankings)
            this.setState({rawTeam : teamRankings});
            console.log(this.state.rawTeam);
                
            console.log(this.state)

                }).catch(function(error) {
                console.log("Error occured!" + error)
                })

    }
   printAllTeams() {
       console.log("get")
        for (const Team of this.state.rawTeam){
            
        holdTeams+="Team #" + Team.teamNumber + " is rank: " +Team.ranking + "\n";

    }

    console.log(holdTeams)  
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
            <button onClick={this.printAllTeams}>{this.state.allTeamsString}</button>
        </div>
        )
     
    }

}