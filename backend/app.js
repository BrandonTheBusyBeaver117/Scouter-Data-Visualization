
const express = require('express');
const axios = require('axios');
const { google } = require('googleapis');
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

app.get("/getData", (req, res) => {

    console.log(req.headers.eventkey)

    axios.get("https://www.thebluealliance.com/api/v3/event/" + req.headers.eventkey + "/rankings", { headers: headers })
        .then(response => {
            //console.log(response.data)
            console.log("tba ok in theory")
            res.json(response.data)

        }).catch(error => {
            console.log("tba bad")
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

    client.authorize( (err, tokens) => {

        if(err){

            console.log("you have angered a higher being \n" + err);
            res.json({error: err})
            
        } else {
            readSpreadsheet(client, req.headers.spreadsheetid).then(response =>{

            console.log(response);
            res.json(response)
            }).catch(error => {
                console.log(error)
                
            })
             

            
        }


    })

    async function readSpreadsheet(client, spreadsheetId) {

        const googleSheetsAPI = google.sheets({version:'v4', auth:client})

        let sheets = await googleSheetsAPI.spreadsheets.values.get({

            spreadsheetId: spreadsheetId,
            range: "'Raw Data'!A1:X450"

        })

        return sheets.data.values;
    }


/*


    const credentials = {
        
  "type": process.env.GOOGLE_TYPE,
  "project_id": process.env.GOOGLE_PROJECT_ID,
  "private_key_id": process.env.GOOGLE_PRIVATE_KEY_ID,
  "private_key": process.env.GOOGLE_PRIVATE_KEY,
  "client_email": process.env.GOOGLE_CLIENT_EMAIL,
  "client_id": process.env.GOOGLE_CLIENT_ID,
  "auth_uri": process.env.GOOGLE_AUTH_URI,
  "token_uri": process.env.GOOGLE_TOKEN_URI,
  "auth_provider_x509_cert_url": process.env.GOOGLE_AUTH_PROVIDER_X509_CERT_URL,
  "client_x509_cert_url": process.env.GOOGLE_CLIENT_X509_CERT_URL

    }

    //const credentials = JSON.stringify(credentialsJSON)


    const auth = new google.auth.GoogleAuth({

        credentials: credentials,

        scopes: "https://www.googleapis.com/auth/spreadsheets"


    })

    const client = await auth.getClient();

    const googleSheets = google.sheets({version: "v4", auth:client})
    
    const spreadsheetID = "1CKLOwi0YJVL01nasfPA0QrBuVvlBR75ypgbgoyoGRgk"; //perhaps use env?

    console.log(spreadsheetID)

    const data = await googleSheets.spreadsheets.get({auth, spreadsheetID})
 */ 

})

// somehow save it all as an array and maybe map it later?


app.listen(PORT, () => {
    console.log(`Ranking collector listening on port ${PORT}`)
})