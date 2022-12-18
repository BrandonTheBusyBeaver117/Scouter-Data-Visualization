import React, { Component } from 'react';
import { Team } from './Team_Component/Team'
import { ContextMenu } from './ContextMenu';
import Searchbar from './Searchbar';
import SideMenu from "./SideMenu";
import "./TeamModifier.scss";

import DataCollector from './DataCollector';
export class TeamModifier extends Component {


    constructor() {
        super();
        this.matchData = []
        this.teamData = []
        this.mapOfTeamElements = new Map()
        this.chosenTeams = []


        this.state = {

            googleSheetHeaders: "n/a",
            chosenTeams: [],
            chosenTeamsStringKey: [],

            selectedQuality: "",
            sortedTeamInformation: new Map(),

            // Context menu
            toggleMenu: false,
            xPositionOfContextMenu: 0,
            yPositionOfContextMenu: 0,
            clicked: false,
        }

        //Bindings
        this.toggleMenu = this.toggleMenu.bind(this);
        this.setChosenTeams = this.setChosenTeams.bind(this);
        this.sortTeamsQualities = this.sortTeamsQualities.bind(this);
        this.clearChosenTeams = this.clearChosenTeams.bind(this);
        this.setSelectedQuality = this.setSelectedQuality.bind(this);
    }

    componentDidMount = () => {
        console.log("mounted")

        this.createTeams()

    }

    componentWillUnmount () {
    }
    componentDidUpdate(__prevProps, prevState) {
        
        //If prevState.something != this.state.something, then update
        //console.log("Previous state " + prevState.chosenTeamsStringKey + "\nCurrent state " + this.state.chosenTeamsStringKey)
        //console.log(prevState.chosenTeamsStringKey)


        if(prevState.selectedQuality === "" && this.state.sortedTeamInformation.size > 0){
            // Finding the first quality (the first google sheet header)
            const defaultAttribute = this.state.googleSheetHeaders[0]
            this.setSelectedQuality(defaultAttribute)
            console.log(defaultAttribute)
        }
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

        const dataCollector = new DataCollector();
        await dataCollector.getData().then(() => {
            this.matchData = dataCollector.getMatchData();
            this.teamData = dataCollector.getTeamData();

            this.setState({
                googleSheetHeaders: dataCollector.getGoogleSheetHeaders()
            })

            console.log("MAKING TEAMS")
    

            this.createSortedTeamInformation()

            
            const newMapOfTeamElements = new Map()
            console.log(this.teamData)

            const allTeamArray = []
            for (const team of this.teamData) {
                allTeamArray.push(team[0])
            }

            for (const [index, team] of this.teamData.entries()) {
                //console.log(team)
                //console.log(index)
                newMapOfTeamElements.set(team[0], <Team key={index}
                    googleSheetHeaders={this.state.googleSheetHeaders}
                    teamData={team}
                    toggleMenu={this.toggleMenu}
                />)
            }
            console.log(newMapOfTeamElements)
           
 
            this.setMapOfTeamElements(newMapOfTeamElements)

           

                console.log(allTeamArray)
                // This sets the default teams
                this.setChosenTeams([])
                console.log(this.state.chosenTeams)

            
            //this.sortTeamsQualities(8)
            
        }).catch((error) => {
            console.log(error)
        })
    }


    setSelectedQuality(newSelectedQuality) {
        this.setState({selectedQuality : newSelectedQuality})
    }

    setMapOfTeamElements(newMap) {
        this.mapOfTeamElements = newMap
    }

    setChosenTeams(newTeamArray) {


        
        this.chosenTeams = this.getTeamComponents(newTeamArray)

        this.setState({chosenTeamsStringKey: [...newTeamArray]})

        
    }

    clearChosenTeams(removedTeams = []) {
        if(removedTeams.length === 0){

            this.setChosenTeams([])
        
        } else{
            const newTeamArray = []

            for(const chosenTeam of this.state.chosenTeamsStringKey) {
                if (!removedTeams.includes(chosenTeam)) {
                    newTeamArray.push(chosenTeam)
                }
            }

            this.setChosenTeams(newTeamArray);
        }
    }

    /**
     * @param {Array} arrayOfTeams an array of team numbers
     * @returns {Array} An array of team components
     */
    getTeamComponents(arrayOfTeams) {
        const arrayOfTeamsComponents = []
        console.log(arrayOfTeams)
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
        return this.state.sortedTeamInformation
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
        //Initializing Map with the keys, but empty values to be filled in later
        for (const header of this.state.googleSheetHeaders){
            initialTeamMap.set(header, [])
        }

        const localSortedTeamInformationMap = new Map();

        for (const team of this.teamData){
            const newTeamMap = new Map(initialTeamMap)

            //console.log(team)
            newTeamMap.set("teamNumber", team[0])
            newTeamMap.set("teamRank", team[1])

            const matches = team.slice(2) // THis is an array of all the matches, skipping over teamnum and rank
            //console.log(matches)

            /*
                something to note here is that if there was a null value 
                (like someone leaving the comment's block blank), this script 
                would not just add anything to the key list
                in that way, you cannot map these data points to matches for sure
                unless you're really certain that there's no null value
                
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

                for(let i = 0; i < match.length; i++){// We start when the Team number starts
                    const key = this.state.googleSheetHeaders[i] // The header will be the key to the map
                
                    const oldValue = newTeamMap.get(key)// Getting the old value for this particular key in the map
                    //console.log(oldValue)
                    newTeamMap.set(key, [...(oldValue), match[i]])
                    
                } 
            }
            
               localSortedTeamInformationMap.set(team[0], newTeamMap)// Setting teamnum to be key of newTeamMap
                }
            
        // Setting the map to state
        this.setState({sortedTeamInformation : new Map(localSortedTeamInformationMap)})
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
                sortedArray.push(sortedTeamLeft.shift())
            } else if (valueLeftTeam < valueRightTeam) {
                sortedArray.push(sortedTeamRight.shift())
            } else {
                sortedArray.push(sortedTeamLeft.shift())
                sortedArray.push(sortedTeamRight.shift())
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

        const sortedTeamQualities = this.mergeSortTeams(arrayOfTeamQualities)
        
        const arrayOfSortedTeams = []

        for (const team of sortedTeamQualities) {
            arrayOfSortedTeams.push(team[0])
        }
        console.log(sortedTeamQualities)
        this.setChosenTeams(arrayOfSortedTeams)
        
        
    }


    neoGetTeamComponents (chosenTeams) {


        const arrayOfTeams = []

        for (const chosenTeam of chosenTeams) {
            arrayOfTeams.push(
                <Team key={chosenTeam}
                    googleSheetHeaders={this.state.googleSheetHeaders}
                    toggleMenu={this.toggleMenu}
                    sortedTeamInformationMap = {this.state.sortedTeamInformation.get(chosenTeam)}
                    selectedQuality = {this.state.selectedQuality}
                />)
        }

        return arrayOfTeams
    }

    render() {

        let teamComponents = this.neoGetTeamComponents(this.state.chosenTeamsStringKey);
        //teamComponents = this.chosenTeams;
        return (
            <div>
                <header>
                    <Searchbar 
                        chosenTeams = {this.state.chosenTeamsStringKey} 
                        teamInformation = {this.state.sortedTeamInformation}
                        setChosenTeams = {this.setChosenTeams}
                    />

                    <div id = "sortingMessage">Currently sorting by: {this.state.selectedQuality}</div>
                </header>
                
                
                <SideMenu 
                    chosenTeams = {this.state.chosenTeamsStringKey} 
                    sortTeamsQualities = {this.sortTeamsQualities} 
                    setChosenTeams = {this.setChosenTeams} 
                    clearChosenTeams = {this.clearChosenTeams}
                    teamInformation = {this.state.sortedTeamInformation}
                    selectedQuality = {this.state.selectedQuality}
                    setSelectedQuality = {this.setSelectedQuality}
                />

                <ContextMenu
                    menuToggled={this.state.toggleMenu}
                    mouseX={this.state.xPositionOfContextMenu}
                    mouseY={this.state.yPositionOfContextMenu}
                    clicked={this.state.clicked}
                />

                <div id="Teams">{teamComponents}</div>

            </div>
        )

    }

}