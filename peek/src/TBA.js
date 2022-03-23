import React, {Component} from 'react';
import axios from "axios";

export class TBA extends Component {
    constructor() {
        super();
        this.state = {
            team: "N/A"
        }
    }

    componentDidMount = () => {
        console.log('componentMounted');
        axios.get('/getData').then( response => {
            this.state.team = response;
        })
    }
    
    render() {
        return (
        <div>
            <h1>These are the teams:</h1>
            <p>{this.state.team}</p>
        </div>
        )
     
    }

}