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

        if(this.inputSource === ""){
            // First get the teamData from The Blue Alliance
            // Then go to our spreadsheet and read data from there
            return tbaData.then(() => this.getSpreadsheetData())
                .catch(error => console.log(error))
        } else if (this.inputSource instanceof File) {
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

        return axios.get('/getData', config).then(response => {

            if(response.data.rankings){
                // Sending the data to local storage for later use
                localStorage.setItem("teamRankingData", JSON.stringify(response.data.rankings))

                this.parseTbaData(response.data.rankings)
            } else {

                console.log("cached tba data being read")
                const cachedData = localStorage.getItem("teamRankingData")
                
                // Makes sure that the data isn't null or undefined before parsing
                if(cachedData) {
                    this.parseTbaData(JSON.parse(cachedData))
                } else {
                    alert("Something went wrong with getting The Blue Alliance data...")
                }

            }


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


    parseTbaData (teamRankingData) {

        const newData = []

            for (const team of teamRankingData) {

                newData.push([
                    Number(team.team_key.replace("frc", "")),//gets rid of the "frc" before the number
                    team.rank]);
            }//This is basically a for-each loop. It iterates through the entire response data array and saves the rankings     

            /*maybe return team rankings, or just use object append to combine 
            the two arrays with spreadsheets and make one big object or something            
            */
            console.log("TBA data received")

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

                // Starting to parse the spreadsheet data
                this.prepareSpreadsheetData(response.data) 
            } else {
                console.log("reading from cached spreadsheet")
                this.readFromCacheSpreadsheet()
            }
        }).catch(error => {
                /*
                if (this.sheetsRetrievalErrors < 3) {
                    console.log(error)
                    alert("check console")

                    this.sheetsRetrievalErrors++;
                    return setTimeout(this.getSpreadsheetData, 1500);
                } else {
                    // read from local cache
                    alert("reading from cache, plz implement ")
                }
                */

                // Above code seeeemed like a good idea, but idk how "safe" just retrying the connection is


                // console.log(error)
                // console.log("reading from cache!")

                // alert(error)
                // this.readFromCacheSpreadsheet()

                // seems like the error clause is useless during testing
               
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




