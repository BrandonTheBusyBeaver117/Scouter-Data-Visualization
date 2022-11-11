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
        
        this.state = {
        }



    }
    componentDidMount () {


    }

    componentDidUpdate (prevProps) {


    }


    handleClick = () => {
        this.props.toggleMenu(false, 5026, 5026, true)

       
        
    }

    handleContextMenu (event) {
        // Was used for toggling custom context menu on table
        event.preventDefault()
        this.props.toggleMenu(true, event.clientX, event.clientY, false)
        
        console.log(event.clientX, event.clientY)
        
    }

    render() {
        //this is where the team blocky thing should be rendered
        
        console.log(this.props.sortedTeamInformationMap)
        console.log(this.props.sortedTeamInformationMap.get(this.props.selectedQuality))
        return(
        <div className='teamComponent' style = {{margin: `25px ${this.props.marginHorizontal}px`}}>
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