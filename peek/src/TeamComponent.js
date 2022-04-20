import {TBA} from './TBA'
import React from 'react'
import ReactDOM from 'react-dom'
   
var qualities;

export class TeamComponent extends React.Component {

    constructor(props) {
          
        super(props);

        qualities = Object.assign(props.googleSheetHeaders, props.rank)


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