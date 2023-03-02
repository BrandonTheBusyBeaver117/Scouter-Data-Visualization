const types = {
    number: "NUMBER",
    boolean: "BOOLEAN",
    levels: "LEVELS",
    string: "STRING"
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
    }),
    "auto-upperFail": new Header(types.number, {
        points: 0,
        isNegativeAttribute: true,
        twinValue: "auto-upperSucc",
    }),
    // Auto lower
    "auto-lowerSucc": new Header(types.number, {
        points: 2,
        isNegativeAttribute: false,
        twinValue: "auto-lowerFail",
    }),
    "auto-lowerFail": new Header(types.number, {
        points: 0,
        isNegativeAttribute: true,
        twinValue: "auto-lowerSucc",
    }),
    // Teleop upper
    "teleop-upperSucc": new Header(types.number, {
        points: 2,
        isNegativeAttribute: false,
        twinValue: "teleop-upperFail",
    }),
    "teleop-upperFail": new Header(types.number, {
        points: 0,
        isNegativeAttribute: true,
        twinValue: "teleop-upperSucc",
    }),

    // Teleop lower
    "teleop-lowerSucc": new Header(types.number, {
        points: 1,
        isNegativeAttribute: false,
        twinValue: "teleop-lowerFail",
    }),
    "teleop-lowerFail": new Header(types.number, {
        points: 0,
        isNegativeAttribute: true,
        twinValue: "teleop-lowerSucc",
    }),

    // Did they climb or not?
    "endgame-climb": new Header(types.boolean),
    "endgame-fail": new Header(types.boolean, {
        isNegativeAttribute: true,
        twinValue: "endgame-climb",
    }),

    // How far did they climb?
    "endgame-level": new Header(null, types.levels, {
        levelsConfig:  {
            "1 Low": 4,
            "2 Mid Rung" : 6,
            "3 High Rung" : 10,
            "4 Traversal Rung" : 15
        }
    }),
    // Various stuff that we might be interested in
    "wrongCargo": new Header(types.boolean),
    "defense": new Header(types.boolean),
    "scoutProblems": new Header(types.boolean),
    "robotProblems": new Header(types.boolean),
    "comments": new Header(types.string)

}

// Defaults for the configuration object
const defaultConfig = {
    points: 0,
    isNegativeAttribute: false,
    levelsConfig: {},
    twinValue: "",
}

export const calculateHeaderAverage = (header, stringName, teamMap) => {
    return header.calculateAverage(teamMap.get(stringName))
}

export const calculateHeaderConsistency = (header, stringName, teamMap) => {
    
    if(header.twinValue !== defaultConfig.twinValue) {

        const potentialOrder = [teamMap.get(stringName), teamMap.get(header.twinValue)]

        if(potentialOrder[0].isNegativeAttribute) {
           potentialOrder.reverse()
        }

        const [positiveData, negativeData] = potentialOrder;

        const totalSuccess = positiveData.reduce((previous, current) => previous + current)
        const totalFail = negativeData.reduce((previous, current) => previous + current)

        const totalAttempts = totalSuccess + totalFail;

        return totalSuccess / totalAttempts;

        }

    return 1
}

export const calculateHeaderTotalPoints = (header, stringName, teamMap) => {
    return header.calculateTotalPoints(teamMap.get(stringName))
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
        for (const key of defaultConfig) {
            if (config[key]) {
                this[key] = config[key];
            } else {
                this[key] = defaultConfig[key]
            }
        }



    }

    /**
     * Calculates average based on the data
     * @param {Array} data datapoints of this quality
     */
    calculateAverage(data) {

        if (data.length > 0) {
            // Creating a local copy of data

            this.data = data.slice();
            let parsedData = data.slice()

            switch (this.sortingType) {
                case types.number:
                    if (typeOf(parsedData[0]) === "string") {
                        parsedData = data.map((number) => Number(number));
                    }

                    // Cool one-liner to add all the elements of the array together
                    const numTotal = (parsedData.reduce((previous, current) => previous + current)) * this.points;

                    // Taking the average
                    return numTotal / data.length;
                case types.boolean:
                    // Converting the strings to booleans
                    // If the data is TRUE, then the comparison returns true
                    // Otherwise, it returns false, which is the FALSE data
                    // Then, you can add them later (true is 1, false is 0)

                    if (typeOf(parsedData[0]) === "string") {
                        parsedData = data.map((stringBoolean) => stringBoolean.toUpperCase() === "TRUE");
                    }

                    // Cool one-liner to add all the elements of the array together
                    const boolTotal = (parsedData.reduce((previous, current) => previous + current)) * this.points;

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



    calculateTotalPoints(data = []) {
        if (data.length > 0) {
            const average = this.calculateAverage(data);
            return average * data.length;
        } else {
            console.log("Give some actual data!!!")
            return -1
        }
    }
}