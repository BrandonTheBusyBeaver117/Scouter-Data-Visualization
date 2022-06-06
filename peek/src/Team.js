import React, { Component } from 'react'
import "./Team.scss"

export class Team extends Component{

    /*Basically this class should hold all the data
    Makes it searchable, call methods etc.
    Idk if we should update data in this class then pass
    the updated data to the react component 
    */
    constructor(props) {
          
        super(props);
        this.state = {
            table: []
        }

    }
    componentDidMount () {
        this.formatter()
    }


    handleContextMenu (event) {
        event.preventDefault()
        this.props.toggleMenu(true)
        console.log(event)
    }

    formatter () {
       
        //headers
        let headerHolder = []

        for(let i = 2; i < this.props.googleSheetHeaders.length; i++){
            headerHolder.push(<th key = {i} onContextMenu = {(event) => this.handleContextMenu(event)}>
            {this.props.googleSheetHeaders[i]}</th>)
        }

        const googleSheetHeaders = <tr>{headerHolder}</tr> //won't let me use whitespace?
        
        
        
        /*------------------------------------------------------------------------------

        prop.teamData is all the data for the team
        structure is laid out below, but might be subject to change year to year

        prop.teamData[0] is the team number
        prop.teamData[1] is the team ranking 

        Every index afterwards contains an individual match that this team performed in
        prop.teamData[2 --> infinity]
        This is why in the for loop down below, i starts off as 2, because the "individual match data" starts at index 2
        
        */

        //individual match
        let allMatchData = [];
        console.log(this.props.teamData)
        for(let i = 2; i < this.props.teamData.length; i++ ) {// 2 represents the index where the matches actually start

            //Iterates through all the matches, for each iteration,  
            
            let refinedMatchData = []
            
            const rawIndividualMatch = this.props.teamData[i]

            for(let t = 2; t < rawIndividualMatch.length; t++){
                /*
                    2 represents the match data, skipping past version number (index 0) and team Num (index 1)
                    We basically cut off the first two indexes of the raw individual match
                    Then, we save the new data in refinedMatchData
                */

                refinedMatchData.push(<td>{rawIndividualMatch[t]}</td>)

            }
            
            /*
                Now, with the refined match data, we save that as a single row in allMatchData
                In the end, allMatchData will have all the refined matches, each as a separate row
            */

            allMatchData.push(<tr>{refinedMatchData}</tr>)
        }
        

        //The final table to be rendered
        const saveTable = 
        <table>
            <thead>
            {googleSheetHeaders}
            </thead>
            <tbody>
            {allMatchData}
            </tbody>
        </table>


        this.setState({table: saveTable})// Sets state to the table

    }

    render() {
        //this is where the team blocky thing should be rendered
       
        return(
        <div className='teamComponent'>
            <h1>{this.props.teamData[0]}</h1>
            <h2>Rank: {this.props.teamData[1]}</h2>
            
            {this.state.table}
            

        </div>
        );


    }
 

}