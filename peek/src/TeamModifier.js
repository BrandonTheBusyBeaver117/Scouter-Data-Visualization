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
        this.teamData = []
        this.mapOfTeamElements = new Map()

        this.state = {

            inputSource: null,
            teamData: [], 

            googleSheetHeaders: "n/a",
            chosenTeams: [],

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

        // If the input source has changed, then recreate the teams
        if(prevState.inputSource !== this.state.inputSource) {
            this.createTeams()
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

        const dataCollector = new DataCollector(this.state.inputSource);

        await dataCollector.getData().then(() => {
            this.teamData = dataCollector.getTeamData();

            this.setState({
                googleSheetHeaders: dataCollector.getGoogleSheetHeaders()
            })

            console.log("MAKING TEAMS")
    

            this.createSortedTeamInformation()
            
            //this.sortTeamsQualities(8)
            
        }).catch((error) => {
            console.log(error)
        })
    }


    setTeamData(newData) {
        this.setState({teamData: newData});
    }

    setSelectedQuality(newSelectedQuality) {
        this.setState({selectedQuality : newSelectedQuality})
    }

    setMapOfTeamElements(newMap) {
        this.mapOfTeamElements = newMap
    }

    setChosenTeams(newTeamArray) {


        this.setState({chosenTeams: [...newTeamArray]})

        
    }

    clearChosenTeams(removedTeams = []) {
        if(removedTeams.length === 0){

            this.setChosenTeams([])
        
        } else{
            const newTeamArray = []

            for(const chosenTeam of this.state.chosenTeams) {
                if (!removedTeams.includes(chosenTeam)) {
                    newTeamArray.push(chosenTeam)
                }
            }

            this.setChosenTeams(newTeamArray);
        }
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
            
            

            // Because of our data structure, the team is an array
            // First element is the teamnumber
            const firstTeamRight = sortedTeamRight[0]
            const firstTeamLeft = sortedTeamLeft[0]


            // The second element is the value (the average)
            const valueRightTeam = firstTeamRight[1]
            const valueLeftTeam = firstTeamLeft[1]

            // If the value on the left is bigger, then we push the entire team to the front of the array
            // The team, again, is made up of the teamnumber and the average
            if (valueLeftTeam > valueRightTeam) {
                sortedArray.push(sortedTeamLeft.shift())
            } else if (valueLeftTeam < valueRightTeam) {
            // If the value on the right is bigger, then we push the entire team to the front of the array
                sortedArray.push(sortedTeamRight.shift())
            } else {
            // Else, if the values are equal, keep the original order and shift them both
                sortedArray.push(sortedTeamLeft.shift())
                sortedArray.push(sortedTeamRight.shift())
            }
        }
        
        console.log([...sortedArray, ...sortedTeamLeft, ...sortedTeamRight])

        // the sorted array, plus any leftover arrays, just in case the sorted arrays are inequal in size
        // any leftovers should be the smallest one left
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
       const arrayOfChosenTeams = this.state.chosenTeams;

       const arrayOfTeamQualities = []
       for (const teamKey of arrayOfChosenTeams) {
            console.log(teamKey)
            
            const mapOfTeam = allTeamData.get(Number(teamKey))
            console.log(mapOfTeam)
            const arrayOfQuality = mapOfTeam.get(quality)

            let castedArray = [];
                
            if(arrayOfQuality.includes("TRUE") || arrayOfQuality.includes("FALSE")) {

                // Converting the strings to booleans
                // If the data is TRUE, then the comparison returns true
                // Otherwise, it returns false, which is the FALSE data
                // Then, you can add them later (true is 1, false is 0)
                castedArray = arrayOfQuality.map((data) => data === "TRUE");

                //console.log(arrayOfQuality)
                //console.log(castedArray)

            } else {
            
                castedArray = arrayOfQuality.map((data) => Number(data));

            }

            const total = (castedArray.reduce((previous, current) => previous + current)) 

            const average = total / arrayOfQuality.length;

            // IDK if this is good code, but basically the "teams" that we're pushing to be compared have two pieces of data
            // We basically make the teamKey and the average 1 element
            // It's compared later
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

        let teamComponents = this.neoGetTeamComponents(this.state.chosenTeams);

        return (
            <div>
                <header>
                    <Searchbar 
                        chosenTeams = {this.state.chosenTeams} 
                        teamInformation = {this.state.sortedTeamInformation}
                        setChosenTeams = {this.setChosenTeams}
                    />

                    <div id = "sortingMessage">Currently sorting by: {this.state.selectedQuality}</div>
                </header>
                
                
                <SideMenu 
                    chosenTeams = {this.state.chosenTeams} 
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