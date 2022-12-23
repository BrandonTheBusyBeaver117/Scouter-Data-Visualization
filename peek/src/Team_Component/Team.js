import React, { Component } from 'react'
import "./Team.scss"
import DataChart from '../DataChart.js';
export class Team extends Component{

    /*Basically this class should hold all the data
    Makes it searchable, call methods etc.
    Idk if we should update data in this class then pass
    the updated data to the react component 
    */
    constructor(props) {
        
        super(props);
    }



    render() {
        //this is where the team blocky thing should be rendered
        
        console.log(this.props.sortedTeamInformationMap)
        console.log(this.props.sortedTeamInformationMap.get(this.props.selectedQuality))
        return(
        <div className='teamComponent' 
            id = {"team" + this.props.sortedTeamInformationMap.get("teamNumber")}>
            <h1>{this.props.sortedTeamInformationMap.get("teamNumber")}</h1>
            <h2>Rank: {this.props.sortedTeamInformationMap.get("teamRank")}</h2>
            
            <DataChart 
                matches = {this.props.sortedTeamInformationMap.get("matchNum")}
                teamData = {this.props.sortedTeamInformationMap.get(this.props.selectedQuality)}
                selectedQuality = {this.props.selectedQuality}

            />
            
            

        </div>
        );


    }
 

}