import axios from "axios";


export default class DataGetter {

    constructor () {
        this.teamData = []
        this.matchData = []
        this.googleSheetHeaders = "N/A"

        // Could put this in constructor
        this.teamColumn = 1;

    }

    getTeamData () {
        return this.teamData;
    }

    getMatchData () {
        return this.matchData;
    }

    getGoogleSheetHeaders () {
        return this.googleSheetHeaders;
    }

    getData() {

        
        // First get the teamData from The Blue Alliance
        // Then go to our spreadsheeet and read data from there
        return this.getTBAData()
                .then(() =>  this.getSpreadsheetData())
                .catch(error => console.log(error))
    

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

        /*maybe return team rankings, or just use objectappend to combine 
        the two arrays with spreadsheets and make one big object or something            
        */
        console.log("TBA data received")
        
        this.teamData = [...newData]
        
    }).catch(error => {
        console.log(error)
    })
}

 getSpreadsheetData() {
    return axios.get('/getSpreadsheetData').then(response => {

        //Checks if the headers are the same as before
        //Only if they're different do they change
        //Although, this may not be needed, or a better comparison might be needed

        const responseHeaders = response.data[0];

        if (responseHeaders.length !== this.googleSheetHeaders.length) {

            this.googleSheetHeaders = responseHeaders
            console.log("headers are set")

        } else {

            for (let i = 0; i < responseHeaders.length; i++) {

                if (responseHeaders[i] !== this.googleSheetHeaders[i]) {
                    this.googleSheetHeaders = responseHeaders
                    console.log("headers are set")

                }

            }

        }

        this.matchData = response.data

        this.parseThroughSpreadSheetData()
    }).catch(error => console.log(error))

}

 parseThroughSpreadSheetData() {

    let alteredTeamData = this.teamData.slice()
    console.log("Here's the team data: ")

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


    

