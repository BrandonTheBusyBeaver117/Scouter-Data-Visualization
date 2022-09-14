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
            table: [],
            marginHorizontal: "auto",
        }



    }
    componentDidMount () {
        this.formatter()

        const initialMargin =  this.calculateMargin()

        this.setState({marginHorizontal: initialMargin}) 
        
        window.addEventListener("resize", this.handleResize)
    }

    componentDidUpdate (prevProps) {
        if(prevProps != this.props){
        console.log("A team updated...?")
        }
        else{
            console.log("sad")
        }
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.handleResize)
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



    calculateMargin = () => {
        const windowWidth = document.documentElement.clientWidth
        
        const usableArea = windowWidth - 300  //Gets the area of the screen, not including the side menu

        const MINIMUM_SPACE_FOR_TEAM = 450; //Minimum space for a team should be 450px (including margin)

        const numberOfTeamsDisplayed = Math.floor(usableArea / MINIMUM_SPACE_FOR_TEAM)

        //console.log(`usable Area ${usableArea} \nnumber of teams calculated to be displayed ${numberOfTeamsDisplayed}`)
        

       

        //400 represents the actual width of the Team
        //We're getting the area that is not taken up by the actual viewable teams themselves
        //Then, we divide by however many teams there are and their two sides
        //That way each side should receive the same margin
        let margin = ((usableArea - numberOfTeamsDisplayed*400) / (numberOfTeamsDisplayed*2)) + "px"

        //console.log("total space this team takes up: "+( ((usableArea - numberOfTeamsDisplayed*400) / (numberOfTeamsDisplayed*2)*2)+350))

        if(numberOfTeamsDisplayed === 0) {
            margin = "auto"
        }

        /*
        const intMargin = Number(margin.replace("px", ""))

        
        console.log("total area taken up by teams is: " + ((intMargin*2*numberOfTeamsDisplayed)+400*numberOfTeamsDisplayed))
        console.log("total area: " + usableArea)
        console.log(`25px ${this.state.marginHorizontal}`)
        */

        return margin

    }


    handleResize =  () => {
        const calculatedMargin = this.calculateMargin()
       console.log("recalculated margin: " + calculatedMargin)
        this.setState({
            marginHorizontal: calculatedMargin
        })


    }


    render() {
        //this is where the team blocky thing should be rendered
       
        return(
        <div className='teamComponent' style = {{margin: `25px ${this.state.marginHorizontal}`, }}>
            <h1>{this.props.teamData[0]}</h1>
            <h2>Rank: {this.props.teamData[1]}</h2>
            
            {this.state.table}
            

        </div>
        );


    }
 

}