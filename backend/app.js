
const express = require('express')
const axios = require('axios')

const app = express()
const PORT = process.env.PORT || 5000 //Default is 3000, which is the same as react, so changed to 5000 so there's no conflict

let teamRankings = [];// make this an object of all the teams and their rankings
let responseSave;

const headers = {
    'accept': 'application/json',
    'X-TBA-Auth-Key': 'd6rcNFJBhBq2qXfA7VJbIf7gECZvo2CjR2VVOlqJBQurZWaEGKG9rz0MgV7Kq4km' //lol, just leaving this key out in the open
};

const eventKey = "2022cave"
 
app.set("json spaces", 2) // indents JSON, makes it easier to read (not needed in the final app)


app.get('/', (req, res) => {
  res.send('Hello World!')
})


app.get("/getData", (req, res) => {
    axios.get("https://www.thebluealliance.com/api/v3/event/"+ eventKey + "/rankings", {params: headers})
      .then(function(response) {
        responseSave = response.data;
        res.json(response.data)
        console.log(responseSave)// printing out the json file
        
        for (let i = 0; i <responseSave.rankings.length; i++){
            teamRankings.push({
                "teamNumber" : responseSave.rankings[i].team_key.replace("frc",""),
                "ranking" : responseSave.rankings[i].rank});
       }     

       /*
       Ideas to make this more efficient:
       Save a previous iteration of the json file, then constantly compare it to the current json file
       Only if you see a difference, then you iterate through the entire array
       then change the rest of the data on the site
       */

       console.log(teamRankings[35].teamNumber + "'s ranking is " + teamRankings[35].ranking)

      }).catch(function(error) {
        res.json("Error occured!" + error)
      })
  })

  // somehow save it all as an array and maybe map it later?


app.listen(PORT, () => {
  console.log(`Ranking collector listening on port ${PORT}`)
})