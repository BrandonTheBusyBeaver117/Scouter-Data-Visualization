import React, { Component } from 'react'

export class Team extends Component{

    /*Basically this class should hold all the data
    Makes it searchable, call methods etc.
    Idk if we should update data in this class then pass
    the updated data to the react component 
    */
    constructor(props) {
          
        super(props);

    }
    componentDidMount = () => {
        //this.backgroundDataCollector()
        this.printQualities(); 
    }// there's something in tba api that already does this


    printQualities() {
        console.log(this.props)
    }
 
    render() {
        //this is where the team blocky thing should be rendered
       
        return(
        <div>
            <p>{this.props.googleSheetHeaders}</p>
            <p>{this.props.teamData}</p>
        </div>
        );

        /*
        return (
            <div>
            <p>{this.state.qualities.teamData}</p>
            <h2></h2>
            <img></img>
            </div>

        )
        */

    }
 

}