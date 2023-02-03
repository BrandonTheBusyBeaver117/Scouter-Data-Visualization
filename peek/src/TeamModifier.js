import React, { Component } from 'react';
import { Team } from './Team_Component/Team'
import Searchbar from './Searchbar';
import SideMenu from "./SideMenu";
import "./TeamModifier.scss";
import InformationSourceDisplay from './InformationSourceDisplay';

import DataCollector from './DataCollector';
import UserSettingsButton from './UserSettingsButton';
export class TeamModifier extends Component {


    constructor() {
        super();

        this.state = {

            inputSource: "https://docs.google.com/spreadsheets/d/1CKLOwi0YJVL01nasfPA0QrBuVvlBR75ypgbgoyoGRgk/edit#gid=851727545",
            eventKey: "2022cave",
            teamData: [], 

            googleSheetHeaders: "n/a",
            chosenTeams: [],

            selectedQuality: "",
            sortingQuality: "",
            sortedTeamInformation: new Map(),

            userSettings: {
                sortImmediately: true
            }

        }

        //Bindings
        this.setChosenTeams = this.setChosenTeams.bind(this);
        this.sortTeamsQualities = this.sortTeamsQualities.bind(this);
        this.clearChosenTeams = this.clearChosenTeams.bind(this);
        this.setSelectedQuality = this.setSelectedQuality.bind(this);
        this.setInputSource = this.setInputSource.bind(this);
        this.setEventKey = this.setEventKey.bind(this);
        this.setUserSettings = this.setUserSettings.bind(this);
    }

    /**
     * When the component loads, we create the teams
     * AKA, when we start up the page, lets make the teams
    */ 
    componentDidMount = () => {
        console.log("mounted")

        this.createTeams()

    }

    /**
     * Runs when any of the states change
     * To check for changes, compare the prevState to the current state
     * If prevState.something != this.state.something, then update
     */
    componentDidUpdate(__prevProps, prevState) {
        
        // If we've had no selected quality, and then we had the spreadsheet headers come in
        // (the create teams method makes sure that we always have something for the spreadsheet)
        // Just set the default quality to be the first header ([0])
        // Perhaps this could be better if we actually kept track of google sheet headers
        if(prevState.selectedQuality === "" && this.state.sortedTeamInformation.size > 0){
            // Finding the first quality (the first google sheet header)
            const defaultAttribute = this.state.googleSheetHeaders[0]
            this.setSelectedQuality(defaultAttribute)
            console.log(defaultAttribute)
        }

        // If the input source has changed, then recreate the teams 
        // well, more like recreate the info that makes the teams, but it causes the teams to be rebuilt regardless
        if(prevState.inputSource !== this.state.inputSource || prevState.eventKey !== this.state.eventKey) {
            console.log("change in input source!")
            this.createTeams()
        }

      }


    /**
     * Asynchronous function that creates all the info for the teams
     */
    async createTeams() {

        console.log("waiting...")

        // Creating the data collector, which sends requests to our backend in order to get information
        // It takes in our input source (like a file or a link) and the event
        const dataCollector = new DataCollector(this.state.inputSource, this.state.eventKey);

        // Wait for getData (see datacollector class for specifics)
        // After all the data is collected and parsed then...
        await dataCollector.getData().then(() => {

            // Set the google sheet header state with the proper headers
            this.setState({
                googleSheetHeaders: dataCollector.getGoogleSheetHeaders()
            })

            console.log("MAKING TEAMS")
    
            // Then create the map with all the team info with the team data we got from the data collector
            this.createSortedTeamInformation(dataCollector.getTeamData())
            
            
        }).catch((error) => {
            // Log any errors
            console.log(error)
        })
    }

    // All of these are setters, allowing other child components to modify 
    // and send data to the parent class (Team modifier)
    // All of these need to be bound to this class, so when 'this.' is called, the program knows
    // that 'this.' refers to this parent class
    setUserSettings(updatedSettings) {
        this.setState({userSettings: updatedSettings})
    }

    setEventKey(newKey) {
        this.setState({eventKey: newKey})
    }

    setInputSource(newInputSource) {
        this.setState({inputSource: newInputSource})
    }    

    setTeamData(newData) {
        this.setState({teamData: newData});
    }

    setSelectedQuality(newSelectedQuality) {
        this.setState({selectedQuality : newSelectedQuality})
    }

    setChosenTeams(newTeamArray) {
        this.setState({chosenTeams: [...newTeamArray]})
    }

    /**
     * Takes in the 
     */
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

    // End setters

    /**
     * This is a map, where each key is a team number.
     * Each element is another map, each one having a different quality of the team
     * @returns {map} SortedTeamInformation
     */
    getSortedTeamInformation() {
        return this.state.sortedTeamInformation
    }


    /**
     * Takes in the team data (a 2d array) and parses through it, row by row.
     * It's fed matches, which it then takes data from each column and matches it to a google sheet header.
     * This allows you to just find the team, and all the particular data for a given quality.
     * The hashmap it creates is very helpful later on.
     * Could be improved if we just created the array sorted by headers rather than matches
     * @param {Array} teamData 
     */
    createSortedTeamInformation(teamData) {
            
        /*
            Look into object fromEntries, which creates object from map
            Somehow need to convert array of: [TeamNum, Ranking, [Data]] (or something, I can't remember)
            To a map of header, [data for header] and so forth
            The team num and rank would have to be stored elsewhere
        */
        console.log(teamData)

        const initialTeamMap = new Map()
        // Initializing Map with the keys, but empty values to be filled in later
        // Allows for this initial map to be reused
        for (const header of this.state.googleSheetHeaders){
            initialTeamMap.set(header, [])
        }

        // Represents the global map that will contain all the sorted info of the teams
        const localSortedTeamInformationMap = new Map();

        // Goes through each team of the team data
        for (const team of teamData){
            // We initialize their team map with that initial team map with all the headers
            const newTeamMap = new Map(initialTeamMap)

            // If you wanna take a peek at the team info...
            //console.log(team)

            // Out of every team, the first 3 values are always these values (designed this way)
            newTeamMap.set("teamNumber", team[0])
            newTeamMap.set("teamRank", team[1])
            newTeamMap.set("teamName", team[2])

            // Gets the data from the matches, starting from the non-match data we already know about
            // Now matches is truly a 2d array
            const matches = team.slice(3)

            // If you wanna take a peek at the match info...
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

            // Goes through all the matches
            for(const match of matches){
                
                // Goes through each individual data point within the match
                for(let i = 0; i < match.length; i++){

                    // The header will be the key to the data set that contains data for each quality
                    // I hope this makes sense?
                    const key = this.state.googleSheetHeaders[i] 
                
                    // Getting the old value for this particular key in the map
                    const oldValue = newTeamMap.get(key)

                    // Then, we use the spread operator (...) to flatten the array of old values
                    // And then we push the new data for the given quality
                    // Honestly, we could just push the data normally to the old value, and then set it here
                    // But this one-liner looks so nice
                    newTeamMap.set(key, [...(oldValue), match[i]])
                    
                } 
            }
            
            // After each team is done with the map-making process
            // We then push the team map to the bigger map with all the team maps
            localSortedTeamInformationMap.set(team[0], newTeamMap)// Setting teamnum to be key of newTeamMap
        }
            
        // Setting the local sorted map to state
        this.setState({sortedTeamInformation : new Map(localSortedTeamInformationMap)})
    }


    /**
     * Recursion step needed for merge sorting.
     * Goes through two sorted arrays and then compares them and sorts them
     * @param {Array} sortedTeamLeft 
     * @param {Array} sortedTeamRight 
     * @returns {Array} The sorted array 
     */
    mergeSortStep(sortedTeamLeft, sortedTeamRight){

        // The final sorted array
        const sortedArray = []

        // While there are still elements within the left and right arrays...
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
        
        // Wanna see the sorted array?
        //console.log([...sortedArray, ...sortedTeamLeft, ...sortedTeamRight])

        // the sorted array, plus any leftover arrays, just in case the sorted arrays are inequal in size
        // any leftovers should be the smallest one left
        return [...sortedArray, ...sortedTeamLeft, ...sortedTeamRight]

    }
    

    /**
     * Sorts the array of qualities efficiently and recursively.
     * @param {Array} arrayOfQualities A 2d array containing the team number and the selected quality
     * @returns {Array} The sorted array 
     */
    mergeSortTeams(arrayOfQualities) {

        // Base case, if we have an array that's size 1 or 0, it must be sorted
        if(arrayOfQualities.length <= 1 ) {
            return arrayOfQualities
        }

        // Taking the halfway point of the array
        const halfOfArray = Math.floor(arrayOfQualities.length / 2 )
        
        // Then, taking the left of the array
        // Slice is exclusive, so it goes to the point before halfway, which is good
        const leftHalfOfArray = arrayOfQualities.slice(0, halfOfArray)

        // Then, taking the right of the array
        const rightHalfOfArray = arrayOfQualities.slice(halfOfArray)

        // Using recursion to sort the left and right teams
        // We keep splitting until we reach base case
        // Then we mergeSortStep to sort the left and right split teams
        // Works our way back up to sort the final sorted left and right teams
        return this.mergeSortStep(this.mergeSortTeams(leftHalfOfArray), this.mergeSortTeams(rightHalfOfArray))

    }

    /**
     * Input a quality you would like to sort by and the program will set the sorted teams to chosen teams.
     * A human readable name for this function is: "Sort Teams by the selected Quality"
     * @param {String} quality The datatype you would like to sort the teams by
     */

    sortTeamsQualities(quality){

        // Getting Team info
        const allTeamData = this.getSortedTeamInformation()
        console.log(allTeamData)

        //So like...get the teams currently displayed, find their qualities, and sort them 
        // We need to pass in the teams and compare somehow...

        console.log(quality)

        // Chosen teams
        const arrayOfChosenTeams = this.state.chosenTeams;

        // 2d Array containing the team numbers and their averages for the given quality
        const arrayOfTeamQualities = []

        // Going through each team
        for (const teamKey of arrayOfChosenTeams) {
            //console.log(teamKey)

            // Getting the map of each team from the sorted team map
            const mapOfTeam = allTeamData.get(Number(teamKey))

            //console.log(mapOfTeam)

            // Getting the data for each quality
            const arrayOfQuality = mapOfTeam.get(quality)

            // Getting the data, and making sure the data types are correct
            let castedArray = [];

            // If there are booleans in string form, cast them to actual js booleans
            if(arrayOfQuality.includes("TRUE") || arrayOfQuality.includes("FALSE")) {

                // Converting the strings to booleans
                // If the data is TRUE, then the comparison returns true
                // Otherwise, it returns false, which is the FALSE data
                // Then, you can add them later (true is 1, false is 0)
                castedArray = arrayOfQuality.map((data) => data === "TRUE");


            } else {
            
                // Making sure the data is actually numbers, not string
                castedArray = arrayOfQuality.map((data) => Number(data));

            }

            // Cool one-liner to add all the elements of the array together
            const total = (castedArray.reduce((previous, current) => previous + current)) 

            // Taking the average
            const average = total / arrayOfQuality.length;

            // IDK if this is good code, but basically the "teams" that we're pushing to be have two pieces of data
            // We basically combine teamKey and the average into 1 array element
            // It's compared later in the sorting
            arrayOfTeamQualities.push([teamKey, average])

            console.log([teamKey, average])

           
        }

        // We then sort the teams and their qualities
        const sortedTeamQualities = this.mergeSortTeams(arrayOfTeamQualities)
        
        // Array of the sorted teams, just getting the team numbers from the sort
        const arrayOfSortedTeams = sortedTeamQualities.map(team => team[0])

        console.log(sortedTeamQualities)

        // The quality being sorted by, is the quality that we just sorted by (the one passed into this function)
        this.setState({sortingQuality: quality})

        // The chosen teams should be are sorted teams
        this.setChosenTeams(arrayOfSortedTeams)        
        
    }


    // Name is self-explanatory
    renderTeamComponents(chosenTeams, googleSheetHeaders, sortedTeamInformationMap, selectedQuality) {
        // Array of all the team components
        let teamComponents = [];

        // Iterating through all chosen teams
        for(let i = 1; i <= chosenTeams.length; i++){

            // Getting the chosen team of each iteration
            const chosenTeam = chosenTeams [i - 1];

            // Pushing each team
            teamComponents.push(
                <Team key={chosenTeam}
                    googleSheetHeaders={googleSheetHeaders}
                    sortedTeamInformationMap = {sortedTeamInformationMap.get(chosenTeam)}
                    selectedQuality = {selectedQuality}
                    teamRanking = {i}
                />
            );
        }
    
        return teamComponents
    }


    render() {

        
        // Getting the team components
        let teamComponents = this.renderTeamComponents(this.state.chosenTeams, 
            this.state.googleSheetHeaders, this.state.sortedTeamInformation, this.state.selectedQuality)


        return (
            <div>

                <SideMenu 
                    chosenTeams = {this.state.chosenTeams} 
                    sortTeamsQualities = {this.sortTeamsQualities} 
                    setChosenTeams = {this.setChosenTeams} 
                    clearChosenTeams = {this.clearChosenTeams}
                    teamInformation = {this.state.sortedTeamInformation}
                    selectedQuality = {this.state.selectedQuality}
                    setSelectedQuality = {this.setSelectedQuality}
                    sortImmediately = {this.state.userSettings.sortImmediately}
                />

               

                <header>
                    <Searchbar 
                        chosenTeams = {this.state.chosenTeams} 
                        teamInformation = {this.state.sortedTeamInformation}
                        setChosenTeams = {this.setChosenTeams}
                    />

                    <div id = "sortingMessage">Currently sorting by: {this.state.sortingQuality}</div>
                    
                    <InformationSourceDisplay 
                        currentInputSource = {this.state.inputSource} 
                        setInputSource = {this.setInputSource}

                        currentEventKey = {this.state.eventKey}
                        setEventKey = {this.setEventKey}
                    />

                    <UserSettingsButton 
                        currentUserSettings = {this.state.userSettings}
                        setUserSettings = {this.setUserSettings}

                    />
                    
                </header>
                
                
                <div id="Teams">{teamComponents}</div>               

            </div>
        )

    }

}