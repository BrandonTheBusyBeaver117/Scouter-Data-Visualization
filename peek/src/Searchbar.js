import React, {Component} from 'react';


export class Searchbar extends Component {

    filterThroughTeams (e) {
        const searchString = e.target.value;
        const filteredChars = aa;
    }


    render() {
        return (
        <div>
            <input id="SearchBar" type="text" placeholder="Search Teams" keyUp = {this.filterThroughTeams(e)}/>
        </div>
        )
     
    }

}