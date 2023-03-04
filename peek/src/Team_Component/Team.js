import React, { Component } from 'react'
import "./Team.scss"
import DataChart from '../DataChart.js';
import { BiImageAdd } from "react-icons/bi"
import axios from "axios";
import CloudinaryUploadWidget from "./CloudinaryUploadWidget";


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
        //this is where the team blocky thing should be rendered
        
        console.log(this.props.sortedTeamInformationMap)
        console.log(this.props.sortedTeamInformationMap.get(this.props.selectedQuality))
        return(
        <div className='teamComponent' 
            id = {"team" + this.props.sortedTeamInformationMap.get("teamNumber")}>
            <h1>{this.props.sortedTeamInformationMap.get("teamNumber")}</h1>
            <h1>{this.props.sortedTeamInformationMap.get("teamName")}</h1>
            <h2>TBA Ranking: {this.props.sortedTeamInformationMap.get("teamRank")}</h2>
            
            <DataChart 
                matches = {this.props.sortedTeamInformationMap.get("matchNum")}
                teamData = {this.props.sortedTeamInformationMap.get(this.props.selectedQuality)}
                selectedQuality = {this.props.selectedQuality}
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
            <CloudinaryUploadWidget teamNumber = {this.props.sortedTeamInformationMap.get("teamNumber")}/>
            <BiImageAdd/>

        </div>
        );


    }
 

}