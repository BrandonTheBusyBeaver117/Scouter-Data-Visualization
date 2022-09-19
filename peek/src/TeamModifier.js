import React, { Component } from 'react';
import { Team } from './Team_Component/Team'
import { ContextMenu } from './ContextMenu';
import Searchbar from './Searchbar';
import SideMenu from "./SideMenu";
import "./TeamModifier.scss";

import "./DataCollector";


import axios from "axios";
import DataGetter from './DataCollector';
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
            chosenTeamsStringKey: [],
            
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
        this.sortTeamsQualities = this.sortTeamsQualities.bind(this)
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


    async createTeams() {

        console.log("waiting...")

        const dataGetter = new DataGetter();
        await dataGetter.getData().then(() => {
            this.matchData = dataGetter.getMatchData();
            this.teamData = dataGetter.getTeamData();

            this.setState({
                googleSheetHeaders: dataGetter.getGoogleSheetHeaders()
            })

            console.log("MAKING TEAMS")
    

            this.createSortedTeamInformation()

            
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
        
        console.log(newTeamArray)
        this.setState({chosenTeamsStringKey: [...newTeamArray]})
        
        console.log(this.state.chosenTeamsStringKey)


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
     * @param {Array} arrayOfTeams an array of team numbers
     * @returns {Array} An array of team components
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


    mergeSortStep(sortedTeamLeft, sortedTeamRight){

        const sortedArray = []
//
        while ( sortedTeamLeft.length > 0 && sortedTeamRight.length > 0 ) {
            
            
            const firstTeamRight = sortedTeamRight[0]
            const firstTeamLeft = sortedTeamLeft[0]


            const valueRightTeam = firstTeamRight[1]
            const valueLeftTeam = firstTeamLeft[1]
            if (valueLeftTeam > valueRightTeam) {
                sortedArray.push(sortedTeamRight.shift())
            } else {
                sortedArray.push(sortedTeamLeft.shift())
            }
        }
        

        return [...sortedArray, ...sortedTeamLeft, ...sortedTeamRight]

    }
    
    mergeSortTeams(arrayOfQualities) {

        if(arrayOfQualities.length <= 1 ) {
            return arrayOfQualities
        }

        const halfOfArray = Math.floor(arrayOfQualities.length / 2 )
        
        const leftHalfOfArray = arrayOfQualities.slice(0, halfOfArray)

        const rightHalfOfArray = arrayOfQualities.slice(halfOfArray)

       

        return this.mergeSortStep(this.mergeSortTeams(leftHalfOfArray), this.mergeSortTeams(rightHalfOfArray))

    }

    /**
     * Input a quality you would like to sort by and the program will set the sorted teams to chosen teams
     * @param {String} quality The datatype you would like to sort the teams by
     */

    sortTeamsQualities(quality){
        //Sorts by qualities

        const allTeamData = this.getSortedTeamInformation()
        console.log(allTeamData)
        //So like...get the teams currently displayed, find their qualities, and sort them 
        // We need to pass in the teams and compare somehow...
        console.log(quality)
       const arrayOfChosenTeams = this.state.chosenTeamsStringKey;

       const arrayOfTeamQualities = []
       for (const teamKey of arrayOfChosenTeams) {
            console.log(teamKey)
            
            const mapOfTeam = allTeamData.get(Number(teamKey))
            console.log(mapOfTeam)
            const arrayOfQuality = mapOfTeam.get(quality)
            
            const average = (arrayOfQuality.reduce((previous, current) => Number(previous) + Number(current))) / arrayOfQuality.length
            arrayOfTeamQualities.push([teamKey, average])
            console.log([teamKey, average])
        }

        const sortedTeamQualities = this.mergeSortTeams(arrayOfTeamQualities).reverse()
        
        const arrayOfSortedTeams = []

        for (const team of sortedTeamQualities) {
            arrayOfSortedTeams.push(team[0])
        }
        console.log(sortedTeamQualities)
        this.setChosenTeams(arrayOfSortedTeams)
        
        
    }




    render() {
        return (
            <div>
                <Searchbar teamData={this.teamData} setChosenTeams = {this.setChosenTeams}/>
                <SideMenu sortTeamsQualities = {this.sortTeamsQualities} />
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