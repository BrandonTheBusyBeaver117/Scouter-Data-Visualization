import React, { Component } from 'react';
import {Team} from './Team'
import { ContextMenu } from './ContextMenu';
import Searchbar from './Searchbar';

import axios from "axios";  


let matchData = []

export class TeamModifier extends Component {


    constructor() {
        super();
        this.state = {
             
            googleSheetHeaders: "n/a",
            teamData: [],
            teamHolder: "",

            //Individual year variables

            teamColumn: 1, //Column (in array notation) where team number is defined, in case it (for whatever reason) changes year to yea

            // Context menu
            toggleMenu: false,
            xPositionOfContextMenu: 0,
            yPositionOfContextMenu: 0 
        }

        this.toggleMenu = this.toggleMenu.bind(this)
    }

    componentDidMount = () => { 
        console.log("mounted")
        this.createTeams()

    }



    toggleMenu (isToggled, mouseX, mouseY) {
     
        console.log(isToggled + mouseX + mouseY)
        this.setState({
            toggleMenu: isToggled,
            xPositionOfContextMenu: mouseX,
            yPositionOfContextMenu: mouseY 
        })
    }
   
        
    
    getTBAData() { 

        return axios.get('/getData').then( response => {
            
            /*
            Ideas to make this more efficient:
            Save a previous iteration of the json file, then constantly compare it to the current json file
            Only if you see a difference, then you iterate through the entire array
            then change the rest of the data on the site

            This might only be useful for google sheets however
            */      
            const responseSave = response.data.rankings; 
            
            for (const Team of responseSave){
                this.state.teamData.push([
                    Team.team_key.replace("frc",""),//gets rid of the "frc" before the number
                    Team.rank]);
            }//This is basically a for-each loop. It iterates through the entire response data array and saves the rankings     

            /*maybe return teamrankings, or just use objectappend to combine 
            the two arrays with spreadsheets and make one big object or something            
            */
           console.log("Tba gotten")
                }).catch(error => {
                console.log("Error occured!" + error)
                })
    }

    getSpreadsheetData () {
       return axios.get('/getSpreadsheetData').then( response => {  

        //Checks if the headers are the same as before
        //Only if they're different do they change
        //Although, this may not be needed, or a better comparison might be needed

        const responseHeaders = response.data[0];

        if(responseHeaders.length !== this.state.googleSheetHeaders.length) {

            this.setState({googleSheetHeaders : responseHeaders})
            console.log("headers are set")

        } else {

            for(let i = 0; i < responseHeaders.length; i++) {
                
                if(responseHeaders[i] !== this.state.googleSheetHeaders[i]){
                    this.setState({googleSheetHeaders : responseHeaders})
                    console.log("headers are set")

                }
                
            }

        }

            matchData = response.data;  

            this.parseThroughSpreadSheetData()
        }).catch(error => console.log(error))

        
    }

    parseThroughSpreadSheetData () {

        for(const Match of matchData){// Gets the individual match data
           let teamNumberFound = false;
            for(let i = 0; i < this.state.teamData.length; i++){//Iterates through all previous data
                
                if(Match[this.state.teamColumn] === (this.state.teamData[i])[0]){//Checks if the Team already exists
                    
                    
                    let alteredTeamData = this.state.teamData
                    alteredTeamData[i].push(Match)
                    
                    teamNumberFound = true; // Says that this match was successfully found
 
                    this.setState({
                        teamData : alteredTeamData
                    })
                    
                }  

            }

            if(!teamNumberFound){
                console.log("uh oh, team: \"" + Match[this.state.teamColumn] + "\" does not exist")
            } // Checking if this match's team number was valid
            
        } 
    }


    getData () {

        return new Promise ( (resolve) => {
            this.getTBAData().then( () => {
        
            this.getSpreadsheetData().then ( () => resolve(true))
            //lol this is so cursed 
            //Basically, we get TBA data first
            //Only then do we get spreadsheetdata
            //then, when both of those finish, we resolve
        })

    })


    }

    async createTeams () {

        console.log("waiting...")

        await this.getData().then( () =>{

            console.log("MAKING TEAMS")   
        
                let teamArray= this.state.teamData.map((item,iterate) => <Team key = {iterate} 
                googleSheetHeaders = {this.state.googleSheetHeaders}
                teamData = {item}
                toggleMenu = {this.toggleMenu}
                />)

                
                this.setState({teamHolder: teamArray})

        }).catch((error) =>{
            console.log(error)
        })
    }




    render() {
        return (
            <div>
            <Searchbar teamData = {this.state.teamData}/>
            <ContextMenu menuToggled = {this.state.toggleMenu} mouseX = {this.state.xPositionOfContextMenu} mouseY = {this.state.yPositionOfContextMenu}/>
        {this.state.teamHolder}
            </div>
        )

    }

}