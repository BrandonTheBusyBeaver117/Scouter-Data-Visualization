import React from "react";

export class Team extends React.Component {
    render() {
        const team = {

            teamNumber: 5026,
            rank : 1,
            hometown : "Burlingame"


        }
        return <h1>Team #{team.teamNumber} is currently ranked #{team.rank} in the world
        and constructs their robots in {team.hometown}</h1>

    }
}
