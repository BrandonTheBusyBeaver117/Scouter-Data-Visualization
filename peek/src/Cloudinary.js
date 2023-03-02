const apiKey = "967297274394931";
const cloudName = "drzeip1bi";

import React, { useState } from "react"
import UserSettings from "./UserSettings"


export default function cloudinaryComponent(props) {

    // get signature. Store this in localstorage or some other cache mechanism, it's good for 1 hour
    const signatureResponse = await axios.get("/get-signature")

    const data = new FormData()
    data.append("file", document.querySelector("#file-field").files[0])
    data.append("api_key", apiKey)
    data.append("signature", signatureResponse.data.signature)
    data.append("timestamp", signatureResponse.data.timestamp)
    data.append("tag", props.teamName)

    const cloudinaryResponse = await axios.post(`https://api.cloudinary.com/v1_1/${cloud_name}/auto/upload`, data, {
        headers: {
            "Content-Type": "multipart/form-data"
        },
        // For dev purposes
        onUploadProgress: function (e) {
            console.log(e.loaded / e.total)
        }
    })

   
    return <div >

        </div>
}