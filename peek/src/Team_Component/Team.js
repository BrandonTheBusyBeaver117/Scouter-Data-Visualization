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

    handleClick = () => {
        this.props.toggleMenu(false, 5026, 5026, true)

       
        
    }

    handleContextMenu (event) {
        event.preventDefault()
        this.props.toggleMenu(true, event.clientX, event.clientY, false)
        
        console.log(event.clientX, event.clientY)
        
    }


    formatter () {
       
        //headers
        let headerHolder = []

        for(let i = 2; i < this.props.googleSheetHeaders.length; i++){
            headerHolder.push(<th key = {i} onContextMenu = {(event) => this.handleContextMenu(event)} onClick={this.handleClick}>
            {this.props.googleSheetHeaders[i]}</th>)
        }

        const googleSheetHeaders = <tr>{headerHolder}</tr>
        
        
        
        /*------------------------------------------------------------------------------

        prop.teamData is all the data for the team
        structure is laid out below, but might be subject to change year to year

        prop.teamData[0] is the team number
        prop.teamData[1] is the team ranking 

        Every index afterwards contains an individual match that this team performed in
        prop.teamData[2 --> infinity]

        This is why matchData down below is props.teamData slice starts off at 2, 
        because the "individual match data" starts at index 2
        
        */


        /*  
            allMatchData is going to do exactly what it sounds like
            It'll hold all the matches' data as an array of "table row" elements
            That way, we can use it later in the table
        */
        let allMatchData = []; // This could be refactored into another map statement, but I think that reduces readability
        console.log(this.props.teamData);


        const matchData = this.props.teamData.slice(2); // 2 represents the index where the matches actually start, ignoring team number and ranking

        
        //Iterates through all the matches 
        for(const match of matchData) {

            /*
                2 represents the match data, skipping past version number (index 0) and team Num (index 1)
                We basically cut off the first two indexes of the raw individual match
                Then, we save the new data as a "table data" element in refinedMatchData
            */

            let refinedMatchData = match.slice(2).map((item) => <td>{item}</td>)
            

            /*
                Now, with the refined match data, we save that as a single row in allMatchData
                In the end, allMatchData will have all the refined matches, each as a separate row
            */

            allMatchData.push(<tr>{refinedMatchData}</tr>)
        }
        

        //The final table to be rendered
        const saveTable = 
            <table>
                <thead>{googleSheetHeaders}</thead>
                <tbody>{allMatchData}</tbody>
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