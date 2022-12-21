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

            /*maybe return team rankings, or just use object append to combine 
            the two arrays with spreadsheets and make one big object or something            
            */
            console.log("TBA data received")

            this.teamData = [...newData]

            console.log(this.teamData)

        }).catch(error => {
            console.log(error)
        })
    }

    // ventura spreadsheet id
    getSpreadsheetData(sheetId) {

        console.log(sheetId)
        
        const config = {
            headers: {
                'spreadsheetId': sheetId
            }
        }

        return axios.get('/getSpreadsheetData', config).then(response => { this.prepareSpreadsheetData(response.data) })
            .catch(error => {

                if (this.sheetsRetrievalErrors < 3) {
                    console.log(error)
                    alert("check console")

                    this.sheetsRetrievalErrors++;
                    return setTimeout(this.getSpreadsheetData, 1500);
                } else {
                    // read from local cache
                    alert("reading from cache, plz implement ")
                }

            })

    }

    // Takes in a spreadsheet 
    prepareSpreadsheetData(spreadsheetData) {

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




