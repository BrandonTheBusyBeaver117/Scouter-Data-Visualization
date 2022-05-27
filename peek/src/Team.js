import React, { Component } from 'react'

export class Team extends Component{
//among us is sus 
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
        
        
        
        //--------------------

        //individual match
        let data = [];
        for(let i = 2; i < this.props.teamData.length; i++ ) {// 2 represents the index where the matches actually start
            let individualMatchData = []
            const individualMatch = this.props.teamData[i]
            for(let t = 2; t < individualMatch.length; t++){//1 represents the match data, skipping past version number and team Num

                individualMatchData.push(<td>{individualMatch[t]}</td>)

            }
            data.push(<tr>{individualMatchData}</tr>)
        }
        

        const saveTable = 
        <table>
            <thead>
            {googleSheetHeaders}
            </thead>
            <tbody>
            {data}
            </tbody>
        </table>


        this.setState({
            table: saveTable
        })

    }

    render() {
        //this is where the team blocky thing should be rendered
       
        return(
        <div>
            <h1>{this.props.teamData[0]}</h1>
            <h2>Rank: {this.props.teamData[1]}</h2>
            
            {this.state.table}
            

        </div>
        );


    }
 

}