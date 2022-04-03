
const express = require('express')
const axios = require('axios')

const app = express()
const PORT = 5000 //Default is 3000, which is the same as react, so changed to 5000 so there's no conflict


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
    axios.get("https://www.thebluealliance.com/api/v3/event/" + eventKey + "/rankings", { headers })
        .then(function (response) {
        console.log(response)
        res.json(response)
       
        }).catch(function (error) {
            res.json(error)
        })

})

// somehow save it all as an array and maybe map it later?


app.listen(PORT, () => {
    console.log(`Ranking collector listening on port ${PORT}`)
})