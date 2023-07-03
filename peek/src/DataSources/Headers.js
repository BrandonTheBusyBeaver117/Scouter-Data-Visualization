export const types = {
	number: "NUMBER",
	boolean: "BOOLEAN",
	levels: "LEVELS",
	string: "STRING",
};

/**
 * Function to return correctly ordered teams
 * @param {Header} possiblePositiveHeader the header that may or may not be positive
 * @param {String} key the string attribute to access the header
 * @param {Map} dataMap the teaminfo stored in the map
 * @returns {Array} Ordered headers, where positive data is first
 */
export const orderedData = (possiblePositiveHeader, key, dataMap) => {
	const potentialOrderData = [dataMap.get(key) ?? [], dataMap.get(possiblePositiveHeader.twinValue) ?? []];

	if (possiblePositiveHeader.isNegativeAttribute) {
		potentialOrderData.reverse();
	}

	return potentialOrderData;
};

/**
 * Function to return correctly ordered teams
 * @param {Header} header1
 * @param {Header} header2
 * @returns {Array} Ordered headers, where positive data is first
 */
export const orderedDataWithKeys = (possiblePositiveHeader, key, dataMap) => {
	const potentialOrderKeys = [key, possiblePositiveHeader.twinValue];
	const potentialOrderData = [dataMap.get(key) ?? [], dataMap.get(possiblePositiveHeader.twinValue) ?? []];

	if (possiblePositiveHeader.isNegativeAttribute) {
		potentialOrderData.reverse();
		potentialOrderKeys.reverse();
	}

	return [...potentialOrderData, ...potentialOrderKeys];
};

/**
 *
 * @param {Header} header the object form of the type of data
 * @param {String} stringName string form of the header name
 * @param {Map} teamMap map of the team
 * @returns Average
 */
export const calculateHeaderFrequencyAverage = (header, stringName, teamMap) => {
	return header.calculateFrequencyAverage(teamMap.get(stringName));
};

/**
 *
 * @param {Header} header the object form of the type of data
 * */
export const calculateHeaderConsistency = (header, stringName, teamMap) => {
	const [positiveData, negativeData] = orderedData(header, stringName, teamMap);

	if (positiveData.length === 0 && negativeData.length > 0) {
		// Getting the positive frequency average
		return 1 - header.calculateFrequencyAverage(negativeData);
	} else if (positiveData.length > 0 && negativeData.length === 0) {
		return header.calculateFrequencyAverage(positiveData);
	} else {
		const totalSuccess = header.calculateFrequency(positiveData);
		const totalFail = header.calculateFrequency(negativeData);

		console.log(totalSuccess);
		console.log(totalFail);

		if (totalFail === 0) return 1;

		const totalAttempts = totalSuccess + totalFail;

		return totalSuccess / totalAttempts;
	}
};

export const calculateHeaderTotalPoints = (header, stringName, teamMap) => {
	return header.calculateTotalPoints(teamMap.get(stringName));
};

// Defaults for the configuration object
export const defaultConfig = {
	points: 0,
	isNegativeAttribute: false,
	levelsConfig: {},
	twinValue: "",
	combinedName: "",
};

/**A class to keep track of how to calculate the worth of a given data set */
class Header {
	/**
	 * @param {SortingType} sortingType which value we should sort by
	 */
	constructor(sortingType = types.number, config = {}) {
		this.sortingType = sortingType;

		// Going through the configuration and seeing if any values have been ommitted
		// If ommitted, then set the value to be the default
		for (const [key, defaultValue] of Object.entries(defaultConfig)) {
			if (config[key]) {
				this[key] = config[key];
			} else {
				this[key] = defaultValue;
			}
		}
	}

	parseData(data = []) {
		if (data.length > 0) {
			switch (this.sortingType) {
				case types.number:
					return data.map((number) => Number(number));
				case types.boolean:
					return data.map((stringBoolean) => stringBoolean.toUpperCase() === "TRUE");
				case types.levels:
					// Getting the points value stored in the map
					// Might need to fix above behavior
					return data.map((level) => this.levelsConfig[level]);
				case types.string:
					return [0];
				default:
					console.log("Unsupported");
			}
		} else {
			console.log("Give some actual data!!!");
			return [0];
		}
	}

	/**
	 * Calculates average based on the data
	 * @param {Array} data datapoints of this quality
	 */
	calculateFrequencyAverage(data) {
		return this.calculateFrequency(data) / data.length;
	}

	calculateFrequency(data) {
		if (data.length === 0) return 0;

		const parsedData = this.parseData(data);

		return parsedData.reduce((previous, current) => previous + current);
	}

	// Fix to actually do the levels properly too
	calculateTotalPoints(data = []) {
		if (data.length > 0) {
			return this.calculateAverage(data) * data.length * this.points;
		} else {
			console.log("Give some actual data!!!");
			return -1;
		}
	}

	calculateMatchAverage(data = []) {
		return this.calculateTotalPoints(data) / data.length;
	}
}

export const Headings2022 = {
	// Auto pickup
	"auto-pickup": new Header(types.number, {
		points: 0,
	}),
	// Auto Taxi
	"auto-taxi": new Header(types.boolean, {
		points: 2,
	}),

	// Auto upper
	"auto-upperSucc": new Header(types.number, {
		points: 4,
		isNegativeAttribute: false,
		twinValue: "auto-upperFail",
		combinedName: "auto-upper",
	}),
	"auto-upperFail": new Header(types.number, {
		points: 0,
		isNegativeAttribute: true,
		twinValue: "auto-upperSucc",
		combinedName: "auto-upper",
	}),
	// Auto lower
	"auto-lowerSucc": new Header(types.number, {
		points: 2,
		isNegativeAttribute: false,
		twinValue: "auto-lowerFail",
		combinedName: "auto-lower",
	}),
	"auto-lowerFail": new Header(types.number, {
		points: 0,
		isNegativeAttribute: true,
		twinValue: "auto-lowerSucc",
		combinedName: "auto-lower",
	}),
	// Teleop upper
	"teleop-upperSucc": new Header(types.number, {
		points: 2,
		isNegativeAttribute: false,
		twinValue: "teleop-upperFail",
		combinedName: "teleop-upper",
	}),
	"teleop-upperFail": new Header(types.number, {
		points: 0,
		isNegativeAttribute: true,
		twinValue: "teleop-upperSucc",
		combinedName: "teleop-upper",
	}),

	// Teleop lower
	"teleop-lowerSucc": new Header(types.number, {
		points: 1,
		isNegativeAttribute: false,
		twinValue: "teleop-lowerFail",
		combinedName: "teleop-lower",
	}),
	"teleop-lowerFail": new Header(types.number, {
		points: 0,
		isNegativeAttribute: true,
		twinValue: "teleop-lowerSucc",
		combinedName: "teleop-lower",
	}),

	// Did they climb or not?
	"endgame-climb": new Header(types.boolean, {
		isNegativeAttribute: false,
		twinValue: "endgame-fail",
		combinedName: "endgame-climb",
	}),
	"endgame-fail": new Header(types.boolean, {
		isNegativeAttribute: true,
		twinValue: "endgame-climb",
		combinedName: "endgame-climb",
	}),

	// How far did they climb?
	"endgame-level": new Header(types.levels, {
		levelsConfig: {
			"1 Low": 4,
			"2 Mid Rung": 6,
			"3 High Rung": 10,
			"4 Traversal Rung": 15,
		},
	}),
	// Various stuff that we might be interested in
	wrongCargo: new Header(types.boolean, { isNegativeAttribute: true }),
	defense: new Header(types.boolean, { isNegativeAttribute: false }),
	scoutProblems: new Header(types.boolean, { isNegativeAttribute: true }),
	robotProblems: new Header(types.boolean, { isNegativeAttribute: true }),
	comments: new Header(types.string),
};
