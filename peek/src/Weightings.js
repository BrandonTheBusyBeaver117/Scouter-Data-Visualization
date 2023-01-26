
// Contains all weighting and point values for the current year's game
// Can also change the importance of consistency, TBA rank, etc. etc.
// like, this could be a json file, but that's no fun
// Also, no comments in a json file

 // Stuff that stays the same year to year
 // There's some weird side effects if you try to use different years at the same time, but that should never ever happen
class Weightings {

   static consistency = 0;
   static tbaRank = 0; 

}


/**
 * @param {SubDivision} parent
 * @param {Quality} qualities
 * @param {SubDivision} children
 * 
 */
class SubDivision {
    constructor(parent, ...qualities, children = null) {
        this.parent = parent;
        this.children = children

        qualities.forEach((quality) => this[quality.name] = quality)

    }
}

class Global extends SubDivision{
    
}

class Quality {
    constructor(name, points, weighting, parent) {
        this.name = name;
        this.points = points;
        this.weighting = weighting;
        this.parent = parent;

    }
}

export default class Weightings2023 extends Weightings{
   
 
    // Auto


    // Teleop
    static upperCone = 0;

    static version = 0;
    static t = 0;
    static matchType = 0;
    static matchNum = 0;
    


        

}


// For dev purposes (2022)

const weightings2022map = new Map();

const qualities2022 = "version,t,matchType,matchNum,auto-pickup,auto-taxi,auto-upperSucc,auto-upperFail,auto-lowerSucc,auto-lowerFail,teleop-upperSucc,teleop-upperFail,teleop-lowerSucc,teleop-lowerFail,endgame-climb,endgame-fail,endgame-level,wrongCargo,defense,scoutProblems,robotProblems,comments".split(",");

qualities2022.forEach(element => {
    weightings2022map.set(element, 0);
});

// custom points settings

weightings2022map.set("auto-pickup", 4);
weightings2022map.set("auto-taxi", 2);



function findAllHierarchy (object) {
    for (element of object.keys()) {

    }
}

const deleteAttribute  = (path) => {
    delete path
}

export const weightings2022 = new Map(weightings2022map)