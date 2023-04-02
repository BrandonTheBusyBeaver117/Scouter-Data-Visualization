import React, { Component } from 'react'
import { Headings2022, orderedDataWithKeys } from '../Headers';
import "./Team.scss"
import DataChart from '../DataChart.js';
import axios from "axios";
import CloudinaryUploadWidget from "./CloudinaryUploadWidget";
import { Offline, Online } from "react-detect-offline";


import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
export class Team extends Component{

    /*Basically this class should hold all the data
    Makes it searchable, call methods etc.
    Idk if we should update data in this class then pass
    the updated data to the react component 
    */
    constructor(props) {
        
        super(props);
        this.state = {
            links: ""
        }
    }

    componentDidMount() {
        this.getImages().then( imageLinks =>{
            
            this.setState({links: imageLinks})
            console.log(imageLinks)
        })
    }

    getImages() {

        const teamNumber = this.props.sortedTeamInformationMap.get("teamNumber")

        // Gets all images tagged with the team number
        return axios.get(`https://res.cloudinary.com/drzeip1bi/image/list/${teamNumber}.json`).then( response =>{
            const imageLinks = []
            for(const image of response.data.resources) {
                
                const version = image.version
                const format = image.format
                const id = image.public_id;

                imageLinks.push(`https://res.cloudinary.com/drzeip1bi/image/upload/v${version}/${id}.${format}`)
                //console.log(`https://res.cloudinary.com/drzeip1bi/image/upload/v${version}/${id}.${format}`)
            }

            return imageLinks;
        }).catch(error => {
            console.log("Cloudinary Error occurred")
            console.log(error)
            return ""
        })

    }
   
    

    render() {

        const dataMap = this.props.sortedTeamInformationMap
        const selectedQuality = this.props.selectedQuality

        console.log(selectedQuality)

        let positiveData = []
        let negativeData = []

        let positiveKey = selectedQuality + "Succ";
        let negativeKey = selectedQuality + "Fail";

        let currentSortingType = Headings2022[selectedQuality].sortingType;

        console.log(Headings2022[selectedQuality])

        if(Headings2022[selectedQuality].isNegativeAttribute){
            negativeData = dataMap.get(selectedQuality);
        } else {
            positiveData = dataMap.get(selectedQuality);
        }

        if(Headings2022[selectedQuality].combinedName !== ""){
            for(const [key, value] of Object.entries(Headings2022)) {

                console.log(value.combinedName)
                console.log(Headings2022[selectedQuality])
                console.log(Headings2022[selectedQuality].combinedName)
                
                if(value.combinedName == Headings2022[selectedQuality].combinedName) {

                    const data = orderedDataWithKeys(Headings2022[selectedQuality], key, dataMap)

                    positiveData = data[0]
                    negativeData = data[1]

                    positiveKey = data[2]
                    negativeKey = data[3]

                    console.log(positiveKey)
                    console.log(negativeKey)

                    currentSortingType = value.sortingType;
                    break;
                }
            }
        }

        // if(positiveData.length === negativeData.length && negativeData.length === 0 ) {
        //     if(Headings2022[selectedQuality].isNegativeValue) {
        //         positiveData = dataMap.get(selectedQuality)
        //     } else {
        //         negativeData = dataMap.get(selectedQuality)
        //     }
        // }
        //this is where the team blocky thing should be rendered
        

        console.log(dataMap)
        console.log(dataMap.get(this.props.selectedQuality))

        return(
        <div className='teamComponent' 
            id = {"team" + dataMap.get("teamNumber")}>
            <h1>{dataMap.get("teamNumber")}</h1>
            <h1>{dataMap.get("teamName")}</h1>
            <h2>TBA Ranking: {dataMap.get("teamRank")}</h2>
            
            <DataChart 
                matches = {dataMap.get("matchNum")}
                positiveDataSet = {positiveData}
                negativeDataSet = {negativeData}
                positiveKey = {positiveKey}
                negativeKey = {negativeKey}
                selectedQuality = {selectedQuality}
                sortingType = {currentSortingType}
            />
            {this.state.links !== "" &&
                <Carousel 
                    autoPlay = {true}
                    infiniteLoop = {true} 
                    interval = {5000} 
                    emulateTouch = {true}
                >
                    {this.state.links.map(link => <div><img src = {link}/></div>)}
                </Carousel>
            }
            
            {/* <Online>
                <CloudinaryUploadWidget teamNumber = {dataMap.get("teamNumber")}/>
            </Online> */}

        </div>
        );


    }
 

}