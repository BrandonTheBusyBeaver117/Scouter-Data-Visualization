import React, {Component} from 'react';
import React, { useState } from "react";


export default function Searchbar () {

    const filterThroughTeams = e => {
        const searchString = e.target.value;
        const filteredChars = aa;
    };


    render() {
        return (
        <div>
            <input id="SearchBar" type="text" placeholder="Search Teams" keyUp = {this.filterThroughTeams(e)}/>
        </div>
        )
     
    }

}