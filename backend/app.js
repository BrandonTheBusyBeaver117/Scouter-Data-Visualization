
const express = require('express')
const axios = require('axios')

const app = express()
const PORT = process.env.PORT || 5000 //Default is 3000, which is the same as react, so changed to 5000 so there's no conflict

let teamRankings;// make this an object of all the teams and their rankings

const headers = {
    'accept': 'application/json',
    'X-TBA-Auth-Key': 'd6rcNFJBhBq2qXfA7VJbIf7gECZvo2CjR2VVOlqJBQurZWaEGKG9rz0MgV7Kq4km' //lol, just leaving this key out in the open
};

const eventKey = "2022cave"
 
app.set("json spaces", 2) // indents JSON, makes it easier to read


app.get('/', (req, res) => {
  res.send('Hello World!')
})


app.get("/getData", (req, res) => {
    axios.get("https://www.thebluealliance.com/api/v3/event/"+ eventKey + "/rankings", {params: headers})
      .then(function(response) {

        //console.log(response.data)
        res.json(response.data)// printing out the json file


        teamRankings = response.data;
        console.log(teamRankings.rankings[1].team_key)
        
    
      }).catch(function(error) {
        res.json("Error occured!" + error)
      })
  })

  // somehow save it all as an array and maybe map it later?


app.listen(PORT, () => {
  console.log(`Ranking collector listening on port ${PORT}`)
})