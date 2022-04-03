import React, { Component } from 'react';

export class TeamModifier extends Component {

    constructor() {
        super();
        this.state = {
            listOfAllTeams: []
        }
        //this.printAllTeams = this.printAllTeams.bind(this);
        this.getData = this.getData.bind(this);

    }

    componentDidMount = () => { this.backgroundDataCollector() }// there's something in tba api that already does this

    backgroundDataCollector() {
        setInterval(this.getData(), interval)
    }


    render() {
        return (
            <div>
                <h1>These are the teams:</h1>
                <button onClick={this.printAllTeams}>{this.state.allTeamsString}</button>
            </div>
        )

    }

}