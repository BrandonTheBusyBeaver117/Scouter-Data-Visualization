const express = require('express');
const axios = require('axios');
const {
    google
} = require('googleapis');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

const app = express()
const PORT = process.env.PORT || 5000 //Default is 3000, which is the same as react, so changed to 5000 so there's no conflict

const tbaKey = process.env.TBA_KEY;

const headers = {
    'accept': 'application/json',
    'X-TBA-Auth-Key': tbaKey
};

app.set("json spaces", 2) // indents JSON, makes it easier to read (not needed in the final app)


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get("/getTBAData", (req, res) => {

    console.log(req.headers.eventkey)

    axios.get("https://www.thebluealliance.com/api/v3/event/" + req.headers.eventkey + "/rankings", {
            headers: headers
        })
        .then(response => {
            //console.log(response.data)
            console.log("tba ranking server response success")
            res.json(response.data)

        }).catch(error => {
            console.log("tba ranking server response fail")
            res.json(error)
        })

})

app.get("/getTBATeamName", (req, res) => {

    axios.get("https://www.thebluealliance.com/api/v3/event/" + req.headers.eventkey + "/teams/simple", {
            headers: headers
        })
        .then(response => {

            console.log("tba team name response success")
            res.json(response.data)

        }).catch(error => {
            console.log("tba team name server response fail")
            res.json(error)
        })

})


app.get("/getSpreadsheetData", async (req, res) => {

    console.log(req.headers.spreadsheetId)

    const client = new google.auth.JWT(

        process.env.GOOGLE_CLIENT_EMAIL,
        null,
        process.env.GOOGLE_PRIVATE_KEY,
        ['https://www.googleapis.com/auth/spreadsheets']

    );

    client.authorize((err, tokens) => {

        if (err) {

            console.log("you have angered a higher being \n" + err);
            res.json({
                error: err
            })

        } else {
            readSpreadsheet(client, req.headers.spreadsheetid).then(response => {

                //console.log(response);
                res.json(response)
            }).catch(error => {
                console.log(error)

            })



        }


    })

    async function readSpreadsheet(client, spreadsheetId) {

        const googleSheetsAPI = google.sheets({
            version: 'v4',
            auth: client
        })

        let sheets = await googleSheetsAPI.spreadsheets.values.get({

            spreadsheetId: spreadsheetId,
            range: "'Raw Data'!A1:X450"

        })

        return sheets.data.values;
    }


})

// somehow save it all as an array and maybe map it later?


app.get("/getCloudinarySignature", (req, res) => {
    const timestamp = Math.round(new Date().getTime / 1000)
    const signature = cloudinary.utils.api_sign_request({
            timestamp: timestamp
        },
        process.env.CLOUDINARY_SECRET
    );
    res.json({
        timestamp,
        signature
    })
})

app.listen(PORT, () => {
    console.log(`Ranking collector listening on port ${PORT}`)
})