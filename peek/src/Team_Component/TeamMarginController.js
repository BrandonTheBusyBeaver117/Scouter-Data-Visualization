
/**
     * @param {Array} stringArrayTeams An array of team numbers as a string
*/
export default class TeamMarginController {
    
    constructor (stringArrayTeams, minimumMargin = 25) {
        this.onlyTeamMargins = new Map();
        this.teamMarginObjects = new Map();
        this.teams = [...stringArrayTeams];
        this.default = true;

        this.minimumMargin = minimumMargin;

        this.initializeTeamMargin()
        
    }

    getMargins() {
        console.log(this.onlyTeamMargins)
        return this.onlyTeamMargins;
    }

    updateMargins (newTeamArray) {

        console.log(newTeamArray)
        this.teams = [...newTeamArray]
        for (const team of this.teams) {
            if(!this.teamMarginObjects.has(team)) {
                this.teamMarginObjects.set(team, new TeamMargin());
            }
        }

        this.setMargins()
    }

    setMargins () {

        const newMarginMap = this.calculateMargin(this.teamMarginObjects)

        for (const team of this.teams) {
            // Sets the new margin for every team
            this.onlyTeamMargins.set(team, newMarginMap.get(team).getMargin())
        }
    }

    
    /**
     * 
     * @param {Map} marginMap  The current marginMap of the teams
     * @returns {Map} A map of team margins
     */
    calculateMargin (marginMap) {

        // Creating a map with all the teams and their margins
        const newTeamMarginsMap = new Map(marginMap);

        // Total horizontal space in the window
        const windowWidth = document.documentElement.clientWidth;
        
        const widthSideMenu = 300;

        const extraSpace = 50;

        // The area of the screen, not including the side menu and extra for scrollbar
        const usableArea = windowWidth - widthSideMenu - extraSpace;  

        // Keeping track of the teams and their width in the current row
        let currentRowTotalWidth = 0;
        let currentTeamsInRow = [];

        // How many times have we iterated through the array
        let count = 0;
        
        // Traversing to access every team
       for (const teamMargins of newTeamMarginsMap) {
           count++;
        //console.log(currentRowTotalWidth)
       

           // teamMargins is an array with [0] being the key and [1] being the value
           // teamMarginObject is thus the team margin object defined for each team
           const teamMarginObject = teamMargins[1];

           // The minimum width for a team should be the component width + minimum margin 
           const minimumTotalWidth = teamMarginObject.getWidth() + this.minimumMargin * 2;


           // If the new team would exceed the row, then we work out the margin for the current teams
           // There should also be at least one team in the current row
           // We also want to calculate if we've reached the end of the list
           if(((minimumTotalWidth + currentRowTotalWidth >= usableArea) && (currentTeamsInRow.length != 0) )|| count === this.teams.length){
           
            // Keeping track of the row minimum width (without margins)
            let currentRowMinimumWidth = 0;
               
            
                // Find the minimum width of the row (without margins)
               for(const team of currentTeamsInRow) {
                   const componentWidth = team[1].getWidth();
                   currentRowMinimumWidth += componentWidth;
               }
               // Getting the leftover area and then dividing by the amount of sides there are 
               // (There are currentTeamsInRow.length * 2 teams)
 
               const rowMargin = Math.floor((usableArea - currentRowMinimumWidth) / (currentTeamsInRow.length * 2)); 
              
               if(rowMargin > 100 || rowMargin < 70) {
                console.log("DANGER!!!")
                console.log("current teams: " + currentTeamsInRow)
                console.log("Row margin: " + rowMargin)
                console.log("Count: " + count)
               }

               // Set all the teams in the current row to have the same margin
               for(const team of currentTeamsInRow) {
                   
                   newTeamMarginsMap.get(team[0]).setMargin(rowMargin)

               }



               // Resetting the widths and teams in the row, because we've moved on to the next row
               currentRowTotalWidth = minimumTotalWidth;
               currentTeamsInRow = [teamMargins];

           } 
           // If the row exceeds the usable area, but no teams have been added, the margin should just be auto
           else if ((minimumTotalWidth + currentRowTotalWidth >= usableArea) && (currentTeamsInRow.length == 0)){
            newTeamMarginsMap.get(teamMargins[0]).setMargin("auto");

            // Resetting the widths and teams in the row, because we've moved on to the next row
            currentRowTotalWidth = 0;
            currentTeamsInRow = [];

            console.log("This shouldn't happen yet")

           } 
           // Otherwise, the row has not been filled up yet, so keep adding teams to the row
           else {
                // Adding the current team's width to the current row width
                currentRowTotalWidth += minimumTotalWidth;

                // Add the current team to the row
                currentTeamsInRow.push(teamMargins)
                //console.log("new current teams in row: " + currentTeamsInRow)
           }
           
       }


       console.log(newTeamMarginsMap)

        return newTeamMarginsMap;

    }

    /**
     * 
     * @param {String} teamKey The team whose width is being changed
     * @param {Number} newWidth The new width of the team
     */
    setTeamMargin(teamKey, newWidth) {

      // Sets the width of that team object for that team
        this.teamMarginObjects.get(teamKey).setWidth(newWidth);

        this.default = false;
    }


    initializeTeamMargin () {
        const newDefaultMarginMap = new Map()

        for (const team of this.teams) {
            newDefaultMarginMap.set(team, new TeamMargin())
        }

        const marginMap = this.calculateMargin(newDefaultMarginMap)
        this.teamMarginObjects = new Map(marginMap);

        this.setMargins() 
    }
}

/**
 * Keeps track of team's Margin
 */
class TeamMargin {
    constructor (width = 400, margin = 50, height = 350) {
        this.margin = margin;
        this.width = width;
        this.height = height

    }
    getMargin () {
        return this.margin
    }

    getWidth () {
        return this.width
    }

    setMargin(newMargin) {
        this.margin = newMargin
    }

    setWidth (newWidth) {
        this.width = newWidth;
    }

    setHeight (height) {
       this.height = height;
    }

    getHeight () {
        return this.height
    }

}