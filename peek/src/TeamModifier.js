import React, { Component } from 'react';
import { Team } from './Team_Component/Team'
import { ContextMenu } from './ContextMenu';
import Searchbar from './Searchbar';
import SideMenu from "./SideMenu";
import "./TeamModifier.scss";


import axios from "axios";
export class TeamModifier extends Component {



    constructor() {
        super();
        this.matchData = []
        this.teamData = []
        this.mapOfTeamElements = new Map()
        this.sortedTeamInformation =  new Map()
        this.chosenTeamEnum = {
                                isEmpty: "empty",
                                isDefault: "default",
                                isUserChosen: "user"
                                }

        this.state = {

            googleSheetHeaders: "n/a",
            chosenTeams: [],
            
            chosenTeamState: this.chosenTeamEnum.isDefault,


            //Individual year variables

            teamColumn: 1, //Column (in array notation) where team number is defined, in case it (for whatever reason) changes year to year

            // Context menu
            toggleMenu: false,
            xPositionOfContextMenu: 0,
            yPositionOfContextMenu: 0,
            clicked: false,
        }

        //Bindings
        this.toggleMenu = this.toggleMenu.bind(this)
        this.setChosenTeams = this.setChosenTeams.bind(this)
    }

    componentDidMount = () => {
        console.log("mounted")
        this.createTeams()

    }
    componentDidUpdate(__prevProps, prevState) {
        //If prevState.something != this.state.something, then update
        
      }



    toggleMenu(isToggled, mouseX, mouseY, isClicked) {

        console.log(isToggled + mouseX + mouseY)
        this.setState({
            toggleMenu: isToggled,
            xPositionOfContextMenu: mouseX,
            yPositionOfContextMenu: mouseY,
            clicked: isClicked
        })
    }


    setTeamData(newData) {
        this.teamData = [...newData]
    }

    getTBAData() {

        return axios.get('/getData').then(response => {

            /*
            Ideas to make this more efficient:
            Save a previous iteration of the json file, then constantly compare it to the current json file
            Only if you see a difference, then you iterate through the entire array
            then change the rest of the data on the site

            This might only be useful for google sheets however
            */

            const newData = []

            for (const team of response.data.rankings) {

                newData.push([
                    Number(team.team_key.replace("frc", "")),//gets rid of the "frc" before the number
                    team.rank]);
            }//This is basically a for-each loop. It iterates through the entire response data array and saves the rankings     
            this.setTeamData(newData)
            /*maybe return team rankings, or just use objectappend to combine 
            the two arrays with spreadsheets and make one big object or something            
            */
            console.log("TBA data received")
        }).catch(error => {
            console.log("Error occured!" + error)
        })
    }


    setMatchData(newMatches) {
        this.matchData = [...newMatches]
    }

    getSpreadsheetData() {
        return axios.get('/getSpreadsheetData').then(response => {

            //Checks if the headers are the same as before
            //Only if they're different do they change
            //Although, this may not be needed, or a better comparison might be needed

            const responseHeaders = response.data[0];

            if (responseHeaders.length !== this.state.googleSheetHeaders.length) {

                this.setState({ googleSheetHeaders: responseHeaders })
                console.log("headers are set")

            } else {

                for (let i = 0; i < responseHeaders.length; i++) {

                    if (responseHeaders[i] !== this.state.googleSheetHeaders[i]) {
                        this.setState({ googleSheetHeaders: responseHeaders })
                        console.log("headers are set")

                    }

                }

            }

            this.setMatchData(response.data)

            this.parseThroughSpreadSheetData()
        }).catch(error => console.log(error))


    }

    parseThroughSpreadSheetData() {

        let alteredTeamData = this.teamData.slice()
        console.log("Here's the team data: ")

        for (const Match of this.matchData) {// Gets the individual match data
            let teamNumberFound = false;
            
            for (const [index, team] of this.teamData.entries()) {//Iterates through all previous data

                if (Match[this.state.teamColumn] == team[0]) {//Checks if the Team already exists 


                    alteredTeamData[index].push(Match)

                    teamNumberFound = true; // Says that this match was successfully found

                    /*
                    this.setState({
                        teamData : alteredTeamData
                    })
                    */

                    break
                }

            }

            if (!teamNumberFound) {
                console.log("uh oh, team: \"" + Match[this.state.teamColumn] + "\" does not exist")
            } // Checking if this match's team number was valid

        }
        this.setTeamData(alteredTeamData)
    }


    getData() {

        return new Promise((resolve) => {
            this.getTBAData().then(() => {

                this.getSpreadsheetData().then(() => resolve(true))
                //lol this is so cursed 
                //Basically, we get TBA data first
                //Only then do we get spreadsheetdata
                //then, when both of those finish, we resolve
            })

        })


    }


    async createTeams() {

        console.log("waiting...")

        await this.getData().then(() => {

            console.log("MAKING TEAMS")
    

            this.createSortedTeamInformation()

            let teamArray = this.teamData.map((item, iterate) => <Team key={iterate}
                googleSheetHeaders={this.state.googleSheetHeaders}
                teamData={item}
                toggleMenu={this.toggleMenu}
            />)
            
            const newMapOfTeamElements = new Map()
            console.log(this.teamData)
            for (const [index, team] of this.teamData.entries()) {
                console.log(team)
                console.log(index)
                newMapOfTeamElements.set(team[0], <Team key={index}
                    googleSheetHeaders={this.state.googleSheetHeaders}
                    teamData={team}
                    toggleMenu={this.toggleMenu}
                />)
            }
            console.log(newMapOfTeamElements)
           
 
            this.setMapOfTeamElements(newMapOfTeamElements)


            //Default behavior to just set all teams to be shown
            this.setState({chosenTeamState: this.chosenTeamEnum.isDefault})
                this.setTeamHolder(teamArray)

                const allTeamArray = []
                console.log(this.mapOfTeamElements)
                for (const key of this.mapOfTeamElements.keys()){
                    allTeamArray.push(key)
                }

                console.log(allTeamArray)
                //I need to somehow iterate through all the teams?
                this.setChosenTeams(allTeamArray)
                console.log(this.state.chosenTeams)

            
            //this.sortTeamsQualities(8)
            
        }).catch((error) => {
            console.log(error)
        })
    }

    setMapOfTeamElements(newMap) {
        this.mapOfTeamElements = newMap
    }

    setChosenTeams(newTeamArray) {
        console.log(newTeamArray)
       const arrayOfTeamComponents = this.getTeamComponents(newTeamArray)
       
       if(this.state.chosenTeamState === this.chosenTeamEnum.isDefault || this.state.chosenTeamState == this.chosenTeamEnum.isEmpty) {
            this.setState({chosenTeams: [...arrayOfTeamComponents], 
                        chosenTeamState: this.chosenTeamEnum.isUserChosen})

        } else if (this.state.chosenTeamState === this.chosenTeamEnum.isUserChosen) {
          
            this.setState({chosenTeams: [...arrayOfTeamComponents]})
            console.log(arrayOfTeamComponents)
            console.log(newTeamArray)
        }
        
        
        
        console.log(this.state.chosenTeams)
        
    }

    clearChosenTeams(chosenTeams = []) {
        if(chosenTeams.length === 0){
            this.setState({chosenTeams: [], 
                            chosenTeamState: this.chosenTeamEnum.isEmpty})
        } else{
            const newMap = new Map(this.state.chosenTeams)
            for (const team in chosenTeams){
                if (this.state.chosenTeams.has(team)){
                    
                    console.log(newMap)
                    newMap.delete(team)

                    
                } else{
                    console.log(this.state.chosenTeams.has(team))
                    console.log(team + " doesn't seem to exist")
                }
                
            }
            this.setState({chosenTeams: newMap})
        }
    }

    /**
     * Input an array of teams, runs through map, and returns array of team components
     */
    getTeamComponents(arrayOfTeams) {
        const arrayOfTeamsComponents = []
        for (const team of arrayOfTeams){
            arrayOfTeamsComponents.push(this.mapOfTeamElements.get(team))
            console.log(team)
            console.log(this.mapOfTeamElements.get(team))
        }
        return arrayOfTeamsComponents
    }
    /**
     * This is a map, where each key is a team number.
     * Each element is another map, each one having a different quality of the team
     * @returns {map} SortedTeamInformation
     */
    getSortedTeamInformation() {
        return this.sortedTeamInformation
    }

    createSortedTeamInformation() {
            
        /*
            Look into object fromEntries, which creates object from map
            Somehow need to convert array of: [TeamNum, Ranking, [Data]] (or something, I can't remember)
            To a map of header, [data for header] and so forth
            The team num and rank would have to be stored elsewhere
        */
        console.log(this.teamData)
        
        const initialTeamMap = new Map()
        //Initalizing Map with the keys, but empty values to be filled in later
        for (const header of this.state.googleSheetHeaders){
            initialTeamMap.set(header, [])
        }
        for (const team of this.teamData){
            const newTeamMap = new Map(initialTeamMap)
            console.log(team)
            newTeamMap.set("teamNumber", team[0])
            newTeamMap.set("teamRank", team[1])

            const matches = team.slice(2) // THis is an array of all the matches, skipping over teamnum and rank
            console.log(matches)
            /*
                something to note here is that if there was a null value 
                (like somone leaving the comment's block blank), this script 
                would not just add anything to the key list
                in that way, you cannot map these data points to matches for sure
                unless you're really certain that thre's no null value
                
                one easy way to fix this is to, in the scouting app, set a default 
                response for every criteria (which I might do)

            */

            /*
                One thing to consider is the types of data there will be
                There'll be:
                    * Team Number
                    * Ranking
                    * Version of Scouting App,
                    * Comments
                    * Quantitative Data (how much of something) (we can run statistics on these data points)
                    * Boolean? Data (Whether a robot did something or not)


            */

            for(const match of matches){

                for(let i = this.state.teamColumn; i < match.length; i++){// We start when the Team number starts
                    const key = this.state.googleSheetHeaders[i] // The header will be the key to the map
                
                    const oldValue = newTeamMap.get(key)// Getting the old value for this particular key in the map
                
                    newTeamMap.set(key, [...(oldValue), match[i]])
                    
                } 
            }
            
                this.sortedTeamInformation.set(team[0], newTeamMap)// Setting teamnum to be key of newTeamMap
                }
            //console.log(arrayOfMaps)
    }


    sortTeamsQualities(quality){
        //Sorts by qualities

        const allTeamData = this.getSortedTeamInformation()
        //So like...get the teams currently displayed, find their qualities, and sort them 
        // We need to pass in the teams and compare somehow...
        
       

        
    }




    render() {
        return (
            <div>
                <Searchbar teamData={this.teamData} setChosenTeams = {this.setChosenTeams}/>
                <SideMenu />
                <ContextMenu
                    menuToggled={this.state.toggleMenu}
                    mouseX={this.state.xPositionOfContextMenu}
                    mouseY={this.state.yPositionOfContextMenu}
                    clicked={this.state.clicked}
                />

                <div id="Teams">{this.state.chosenTeams}</div>

            </div>
        )

    }

}