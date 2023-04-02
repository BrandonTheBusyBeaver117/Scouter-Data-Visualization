export const types = {
    number: "NUMBER",
    boolean: "BOOLEAN",
    levels: "LEVELS",
    string: "STRING"
}

/**
 * Function to return correctly ordered teams
 * @param {Header} header1 
 * @param {Header} header2 
 * @returns {Array} Ordered headers, where positive data is first
 */
export const orderedData = (possiblePositiveHeader, key, dataMap) => {
  
    const potentialOrderData = [dataMap.get(key) ?? [], dataMap.get(possiblePositiveHeader.twinValue) ?? []]

    if(possiblePositiveHeader.isNegativeAttribute) {
        potentialOrderData.reverse()
    }

    return potentialOrderData
}

/**
 * Function to return correctly ordered teams
 * @param {Header} header1 
 * @param {Header} header2 
 * @returns {Array} Ordered headers, where positive data is first
 */
 export const orderedDataWithKeys = (possiblePositiveHeader, key, dataMap) => {
  
    const potentialOrderKeys = [key, possiblePositiveHeader.twinValue]
    const potentialOrderData = [dataMap.get(key) ?? [], dataMap.get(possiblePositiveHeader.twinValue) ?? []]

    if(possiblePositiveHeader.isNegativeAttribute) {
        potentialOrderData.reverse()
        potentialOrderKeys.reverse()
    }

    return [...potentialOrderData, ...potentialOrderKeys]
}

/**
 * 
 * @param {Header} header the object form of the type of data
 * @param {String} stringName string form of the header name
 * @param {Map} teamMap map of the team
 * @returns Average
 */
export const calculateHeaderFrequencyAverage = (header, stringName, teamMap) => {
    return header.calculateFrequencyAverage(teamMap.get(stringName))
}



// bugs with this
// not everything will have a twin value, but you can still calculate consistency with one dataset
// also, the reducing of the success and fail doesn't work with booleans
export const calculateHeaderConsistency = (header, stringName, teamMap) => {

    const [positiveData, negativeData] = orderedData(header, stringName, teamMap)

        const totalSuccess = header.calculateFrequency(positiveData);

        const totalFail = header.calculateFrequency(negativeData);

        console.log(totalSuccess)
        console.log(totalFail)
        
        if(totalFail === 0) return 1

        const totalAttempts = totalSuccess + totalFail;

        return totalSuccess / totalAttempts;

}

export const calculateHeaderTotalPoints = (header, stringName, teamMap) => {
    return header.calculateTotalPoints(teamMap.get(stringName))
}


// Defaults for the configuration object
const defaultConfig = {
    points: 0,
    isNegativeAttribute: false,
    levelsConfig: {},
    twinValue: "",
    combinedName: "",
}

/**A class to keep track of how to calculate the worth of a given data set */
class Header {

    /**
     * @param {SortingType} sortingType which value we should sort by
     * @param {Number} points The points that this quality produces
     * @param {Boolean} isNegativeAttribute Is this a good thing to have, or a bad thing
     */
    constructor(sortingType = types.number, config = {}) {

        this.sortingType = sortingType;
        this.data = [];

        // Going through the configuration and seeing if any values have been ommitted
        // If ommitted, then set the value to be the default
        for (const [key, defaultValue] of Object.entries(defaultConfig)) {
            if (config[key]) {
                this[key] = config[key];
            } else {
                this[key] = defaultValue
            }
        }



    }

    /**
     * Calculates average based on the data
     * @param {Array} data datapoints of this quality
     */
    calculateFrequencyAverage(data) {

        if (data.length > 0) {
            // Creating a local copy of data

            this.data = data.slice();
            let parsedData = data.slice()

            switch (this.sortingType) {
                case types.number:
                    if ((typeof parsedData[0]) === "string") {
                        parsedData = data.map((number) => Number(number));
                    }
                    console.log(parsedData)
                    // Cool one-liner to add all the elements of the array together
                    
                    const numTotal = (parsedData.reduce((previous, current) => previous + current))

                    console.log(numTotal)
                    console.log(numTotal / data.length)
                    // Taking the average
                    return numTotal / data.length;
                case types.boolean:
                    // Converting the strings to booleans
                    // If the data is TRUE, then the comparison returns true
                    // Otherwise, it returns false, which is the FALSE data
                    // Then, you can add them later (true is 1, false is 0)

                    if ((typeof parsedData[0]) === "string") {
                        parsedData = data.map((stringBoolean) => stringBoolean.toUpperCase() === "TRUE");
                    }

                    // Cool one-liner to add all the elements of the array together
                    const boolTotal = (parsedData.reduce((previous, current) => previous + current));

                    console.log(data)
                    console.log(parsedData)
                    console.log(boolTotal)
                    console.log(boolTotal/data.length)

                    // Taking the average
                    return boolTotal / data.length;

                case types.levels:
                    // Getting the points value stored in the map
                    parsedData = data.map((level) => this.levelsConfig[level]);
    
                    // Cool one-liner to add all the elements of the array together
                    const levelTotal = (parsedData.reduce((previous, current) => previous + current))

                    // Taking the average
                    return levelTotal / data.length;
                case types.string:
                    return 0
                default:
                    console.log("Unsupported")
            }
        } else {
            console.log("Give some actual data!!!")
            return -1
        }

    }

    calculateFrequency (data) {
        return this.calculateFrequencyAverage(data) * data.length
    }

    calculateTotalPoints(data = []) {
        if (data.length > 0) {
            return this.calculateAverage(data) * data.length * this.points;
        } else {
            console.log("Give some actual data!!!")
            return -1
        }
    }

    calculateMatchAverage(data = [0]) {
        return this.calculateTotalPoints(data) / data.length
    }
}


export const Headings2022 = {
    // Auto pickup
    "auto-pickup": new Header(types.number, {
        points: 0
    }),
    // Auto Taxi
    "auto-taxi": new Header(types.boolean, {
        points: 2
    }),

    // Auto upper
    "auto-upperSucc": new Header(types.number, {
        points: 4,
        isNegativeAttribute: false,
        twinValue: "auto-upperFail",
        combinedName: "auto-upper"
    }),
    "auto-upperFail": new Header(types.number, {
        points: 0,
        isNegativeAttribute: true,
        twinValue: "auto-upperSucc",
        combinedName: "auto-upper"
    }),
    // Auto lower
    "auto-lowerSucc": new Header(types.number, {
        points: 2,
        isNegativeAttribute: false,
        twinValue: "auto-lowerFail",
        combinedName: "auto-lower"
    }),
    "auto-lowerFail": new Header(types.number, {
        points: 0,
        isNegativeAttribute: true,
        twinValue: "auto-lowerSucc",
        combinedName: "auto-lower"
    }),
    // Teleop upper
    "teleop-upperSucc": new Header(types.number, {
        points: 2,
        isNegativeAttribute: false,
        twinValue: "teleop-upperFail",
        combinedName: "teleop-upper"
    }),
    "teleop-upperFail": new Header(types.number, {
        points: 0,
        isNegativeAttribute: true,
        twinValue: "teleop-upperSucc",
        combinedName: "teleop-upper"
    }),

    // Teleop lower
    "teleop-lowerSucc": new Header(types.number, {
        points: 1,
        isNegativeAttribute: false,
        twinValue: "teleop-lowerFail",
        combinedName: "teleop-lower"
    }),
    "teleop-lowerFail": new Header(types.number, {
        points: 0,
        isNegativeAttribute: true,
        twinValue: "teleop-lowerSucc",
        combinedName: "teleop-lower"
    }),

    // Did they climb or not?
    "endgame-climb": new Header(types.boolean, {
        isNegativeAttribute: false,
        twinValue: "endgame-fail",
        combinedName: "endgame-climb"
    }),
    "endgame-fail": new Header(types.boolean, {
        isNegativeAttribute: true,
        twinValue: "endgame-climb",
        combinedName: "endgame-climb"
    }),

    // How far did they climb?
    "endgame-level": new Header(types.levels, {
        levelsConfig:  {
            "1 Low": 4,
            "2 Mid Rung" : 6,
            "3 High Rung" : 10,
            "4 Traversal Rung" : 15
        }
    }),
    // Various stuff that we might be interested in
    "wrongCargo": new Header(types.boolean, {isNegativeAttribute: true}),
    "defense": new Header(types.boolean),
    "scoutProblems": new Header(types.boolean, {isNegativeAttribute: true}),
    "robotProblems": new Header(types.boolean, {isNegativeAttribute: true}),
    "comments": new Header(types.string)

}