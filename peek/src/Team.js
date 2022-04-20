import {TBA} from './TBA'
import React from 'react'
import ReactDOM from 'react-dom'
   
var qualities;

export class Team {

    /*Basically this class should hold all the data
    Makes it searchable, call methods etc.
    Idk if we should update data in this class then pass
    the updated data to the react component 
    */
    constructor(googleSheetHeaders, rank) {
          
        //super(props);

        qualities = Object.assign(googleSheetHeaders, rank)


    }

    printQualities() {
        console.log(this.qualities)
    }
 
    render() {
        //this is where the team blocky thing should be rendered
        return (
            <div>

            <h2></h2>
            <img></img>
            </div>

        )

    }
 

}