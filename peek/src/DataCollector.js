import axios from "axios";
import Papa from 'papaparse';

export default class DataCollector {

    constructor(inputSource, eventKey) {
        this.teamData = []
        this.matchData = []
        this.googleSheetHeaders = "N/A"

        // Could put this in constructor
        this.teamColumn = 1;

        this.sheetsRetrievalErrors = 0;

        this.inputSource = inputSource;
        // for dev purposes
        this.eventKey = eventKey;
    }

    getTeamData() {
        return this.teamData;
    }

    getMatchData() {
        return this.matchData;
    }

    getGoogleSheetHeaders() {
        return this.googleSheetHeaders;
    }

    async getData() {


        function isValidHttpUrl(string) {
            let url;
            try {
              url = new URL(string);
            } catch (e) {
              return false;
            }
            return url.protocol === "http:" || url.protocol === "https:";
          }
         
          console.log(this.inputSource)

          const tbaData = this.getTBAData();

       if (this.inputSource instanceof File) {
                console.log("File, time to parse!")
               
            
              async function parseFile (file) {
                const filePromise = new Promise((resolve, reject) => {
                    Papa.parse(file, {complete: result => {
                        console.log(result)
                        return resolve(result)}
                    })
                })

                const betterFile = await filePromise

                console.log(betterFile)

                return betterFile

            }



              const parsedFile = await parseFile(this.inputSource)

              return tbaData.then(() => this.prepareSpreadsheetData(parsedFile.data)).catch(error => console.log(error))

                 
        } else if(this.inputSource.includes("docs.google.com/spreadsheets") && isValidHttpUrl(this.inputSource)){
            console.log("Spreadsheet source")
            // Do i like..send a request? 

            const startId = "d/"

            // The index of the "d/", right before the spreadsheetId
            const startIdIndex = this.inputSource.indexOf(startId)

            // Taking everything after that "d/", the beginning of which should be our id
            // We add the length so we don't include the start of the id at all
            const startOfSpreadsheetId = this.inputSource.slice(startIdIndex + startId.length);

            // Find the next slash, which is the end of our id
            const endIdIndex = startOfSpreadsheetId.indexOf("/")

            // Taking everything within the bounds of the start of the Id, and the end of the id, leaving just the spreadsheet id
            const sheetId = startOfSpreadsheetId.slice(0, endIdIndex);

            console.log(sheetId)

            return tbaData.then(() => this.getSpreadsheetData(sheetId)).catch(error => console.log(error))

            
        } else {
            alert("This is not a valid data source")
            tbaData.then(this.readFromCacheSpreadsheet())
        }

       


    }



    getTBAData() {

        const config = {
            headers: {
                'eventkey': this.eventKey
            }
        }

        console.log(config.headers.eventkey)

        return axios.get('/getTBAData', config).then(rankingResponse => {

            console.log("Tba rank received?")

            const rankings = rankingResponse.data.rankings;

            console.log(rankings)

            axios.get('/getTBATeamName', config).then(nameResponse => {

                const names = nameResponse.data

                console.log("nameResponse")
                console.log(nameResponse)

                if(rankings && names){
                    // Sending the data to local storage for later use
                    localStorage.setItem("teamRankingData", JSON.stringify(rankings))
                    localStorage.setItem("teamNameData", JSON.stringify(names))
                    
    
                    this.parseTbaData(rankings, names)
                } else {
    
                    console.log("cached tba data being read")
                    const cachedRankingData = localStorage.getItem("teamRankingData")
                    const cachedNameData = localStorage.getItem("teamNameData")
                    
                    // Makes sure that the data isn't null or undefined before parsing
                    if(cachedRankingData && cachedNameData) {
                        this.parseTbaData(JSON.parse(cachedRankingData), JSON.parse(cachedNameData))
                    } else {
                        alert("Something went wrong with getting The Blue Alliance data...")
                    }
    
                }

            })


        }).catch(error => {

            // Not sure if this clause is necessary

            console.log(error)

            const cachedData = localStorage.getItem("teamRankingData")

            // Makes sure that the data isn't null or undefined before parsing
            if(cachedData) {
                this.parseTbaData(JSON.parse(cachedData))
            } else {
                alert("Something went wrong with getting The Blue Alliance data...")
            }



        })
    }


    /**
     * Takes in an array of objects that have the team number and the team name, then finds the name recursively
     * @param {Array} arrayOfNames The array of the objects that contain the team names
     * @param {String} targetTeam The number of the team that you want to find the name of
     * @param {Number} lowIndex The lower bounds of the search
     * @param {Number} highIndex The higher bounds of the search
     * @returns {String} The team name of the team with the corresponding number
     */

    binaryNameSearch(arrayOfNames, targetTeam, lowIndex = 0, highIndex = arrayOfNames.length - 1) {

            if (lowIndex > highIndex) {
              return "No name...what the heck???"
            }
       
            const midPoint = Math.floor((highIndex + lowIndex) / 2)
                 
            const teamNum = String((arrayOfNames[midPoint]).team_number);            
            
            // Comparing lexographically
            if (teamNum == targetTeam) {
              return arrayOfNames[midPoint].nickname
       
            } else if (teamNum < targetTeam) {
              return this.binaryNameSearch(arrayOfNames, targetTeam, midPoint + 1, highIndex);
            } else if (teamNum > targetTeam) {
              return this.binaryNameSearch(arrayOfNames, targetTeam, lowIndex, midPoint - 1);
            }
       
    }



    /**
     * @param {Object} teamRankingData An object containing the ranks of all the teams 
     * @param {Array} teamNameData ASSUMES TBA HAS ALREADY SORTED BY TEAM NUMBER (An array containing the names of all the teams) 
     */
    parseTbaData (teamRankingData, teamNameData) {

        const newData = []

        const sortedTeamNameData = teamNameData

        console.log(sortedTeamNameData)

        // Iterates through the rankings and searches through the names and saves the teams 
        for (const team of teamRankingData) {

            // Gets rid of the "frc" before the number
            const teamNum = Number(team.team_key.replace("frc", ""))

            const teamName = this.binaryNameSearch(sortedTeamNameData, String(teamNum))

            newData.push([teamNum, team.rank, teamName]);
        }    

        /*maybe return team rankings, or just use object append to combine 
        the two arrays with spreadsheets and make one big object or something            
        */
        console.log("TBA datareceived")
        this.teamData = [...newData]
        console.log(this.teamData)

    }


    getSpreadsheetData(sheetId) {

        console.log(sheetId)
        
        const config = {
            headers: {
                'spreadsheetId': sheetId
            }
        }

        return axios.get('/getSpreadsheetData', config).then(response => { 
            // if there's no error, then do the normal preparations
            if(!response.data.error){
                console.log("Spreadsheet data received")

                // Starting to parse the spreadsheet data
                this.prepareSpreadsheetData(response.data) 
            } else {
                console.log("reading from cached spreadsheet")
                this.readFromCacheSpreadsheet()
            }
        }).catch(error => {
            
                console.log("reading from cached spreadsheet")
                this.readFromCacheSpreadsheet()

               
            })

    }


    readFromCacheSpreadsheet() {

        const cachedData = localStorage.getItem("spreadsheetData")

        console.log(JSON.stringify(cachedData))

                // Makes sure that the data isn't null or undefined before parsing
                if(cachedData) {
                    this.prepareSpreadsheetData(JSON.parse(cachedData), false)
                } else {
                    alert("Something went wrong with getting the spreadsheet data...")
                }
    }


    // Takes in a spreadsheet 
    prepareSpreadsheetData(spreadsheetData, shouldCache = true) {

        if(shouldCache) {
            // Sending the data to local storage for later use
            localStorage.setItem("spreadsheetData", JSON.stringify(spreadsheetData))
        }



        //Checks if the headers are the same as before
        //Only if they're different do they change
        //Although, this may not be needed, or a better comparison might be needed

        this.googleSheetHeaders = spreadsheetData[0]
        console.log("Headers set")
        console.log(this.googleSheetHeaders)

        this.matchData = spreadsheetData

        console.log("Match data")
        console.log(this.matchData)
        this.parseThroughSpreadSheetData()

    }


    parseThroughSpreadSheetData() {

        let alteredTeamData = this.teamData.slice()

        console.log("Here's the team data: ")

        //console.log(alteredTeamData)

        console.log(this.teamData)

        for (const Match of this.matchData) {// Gets the individual match data
            let teamNumberFound = false;

            for (const [index, team] of this.teamData.entries()) {//Iterates through all previous data


                if (Match[this.teamColumn] == team[0]) {//Checks if the Team already exists 


                    alteredTeamData[index].push(Match)

                    teamNumberFound = true; // Says that this match was successfully found


                    break
                }

            }

            if (!teamNumberFound) {
                console.log("uh oh, team: \"" + Match[this.teamColumn] + "\" does not exist")
            } // Checking if this match's team number was valid

        }
        this.teamData = alteredTeamData
    }

}




