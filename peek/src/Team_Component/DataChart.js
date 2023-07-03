import "./DataChart.scss";
import { Headings2022, types } from "../DataSources/Headers";

import {
	Chart as ChartJS,
	CategoryScale,
	LineController,
	LineElement,
	ArcElement,
	PointElement,
	LinearScale,
	Title,
	Tooltip,
	Legend,
} from "chart.js";

import { Line, Pie, Bar } from "react-chartjs-2";

import chartTrendline from "chartjs-plugin-trendline";

ChartJS.register(chartTrendline);

ChartJS.register(
	CategoryScale,
	LineController,
	LineElement,
	ArcElement,
	PointElement,
	LinearScale,
	Title,
	Tooltip,
	Legend
);

export default function DataChart(props) {
	const createChart = (
		matches,
		positiveDataSet,
		negativeDataSet,
		positiveKey,
		negativeKey,
		selectedQuality,
		sortingType
	) => {
		switch (sortingType) {
			case types.boolean: {
				let numFail = 0;
				let numSuccess = 0;

				if (positiveDataSet.length > 0 && negativeDataSet.length > 0) {
					positiveDataSet.forEach(
						(matchResult) => (numSuccess += matchResult.toUpperCase() === "TRUE" ? 1 : 0)
					);
					negativeDataSet.forEach((matchResult) => (numFail += matchResult.toUpperCase() === "TRUE" ? 1 : 0));
				} else if (positiveDataSet.length > 0 && negativeDataSet.length === 0) {
					positiveDataSet.forEach((matchResult) =>
						matchResult.toUpperCase() === "TRUE" ? numSuccess++ : numFail++
					);
				} else if (negativeDataSet.length > 0) {
					negativeDataSet.forEach((matchResult) =>
						matchResult.toUpperCase() === "FALSE" ? numSuccess++ : numFail++
					);
				}
				console.log("pos");
				console.log(positiveDataSet);
				console.log(numSuccess);
				console.log("neg");
				console.log(negativeDataSet);
				console.log(numFail);

				return (
					<Pie
						className="dataChart"
						datasetIdKey="booleanPieChart"
						data={{
							// Should be match numbers
							labels: ["Success", "Failed"],
							datasets: [
								{
									id: 1,
									label: "",
									data: [numSuccess, numFail],
									backgroundColor: ["rgb(0, 255, 115)", "rgb(255, 15, 40)"],
								},
							],
						}}
						options={{
							// If there are two values, then have a border radius
							// Otherwise, complete the entire pie chart
							borderWidth: numSuccess > 0 && numFail > 0 ? 2 : 0,
							maintainAspectRatio: false,
							plugins: {
								title: {
									display: false,
									text: selectedQuality,
								},
							},
						}}
					/>
				);
			}
			case types.number: {
				let yOption = {};

				console.log(positiveDataSet);

				if (!positiveDataSet?.includes("0") && !negativeDataSet?.includes("0")) {
					yOption = {
						min: 0,
					};
				}

				let positiveConfig = {};
				let negativeConfig = {};

				if (positiveDataSet.length !== 0) {
					positiveConfig = {
						trendlineLinear: {
							lineStyle: "dotted",
							width: 3,
							colorMin: "blue",
							colorMax: "blue",
						},
					};
				} else {
					negativeConfig = {
						trendlineLinear: {
							lineStyle: "dotted",
							width: 3,
							colorMin: "red",
							colorMax: "red",
						},
					};
				}

				console.log(positiveKey);
				console.log(negativeKey);

				return (
					<Line
						className="dataChart"
						datasetIdKey="defaultLineChart"
						data={{
							// Should be match numbers
							labels: matches.map((matchNum) => "Match #" + matchNum),
							datasets: [
								{
									id: 1,
									label: positiveKey,
									data: positiveDataSet,
									backgroundColor: "rgb(15, 230, 255)",
									borderColor: "rgb(205, 205, 205)",
									borderWidth: 2,
									...positiveConfig,
								},
								{
									id: 2,
									label: negativeKey,
									data: negativeDataSet,
									backgroundColor: "rgb(255, 15, 40)",
									borderColor: "rgb(205, 205, 205)",
									borderWidth: 2,
									...negativeConfig,
								},
							],
						}}
						options={{
							maintainAspectRatio: false,
							scales: {
								y: {
									ticks: {
										stepSize: 1,
									},
									...yOption,
								},
								x: {
									title: {
										display: true,
										text: "Match Number",
									},
								},
							},
							elements: {
								point: {
									borderWidth: 10,
								},
							},
							plugins: {
								title: {
									display: false,
									text: selectedQuality,
								},
							},
						}}
					/>
				);
			}
			case types.string: {
				return positiveDataSet.map((dataPoint) => <p>{dataPoint}</p>);
			}
			case types.levels: {
				// Assumes that there's only one positive or negative level data set
				const data = [];
				if (positiveDataSet.length > 0) {
					data.push(...positiveDataSet);
				} else if (negativeDataSet.length > 0) {
					data.push(...negativeDataSet);
				} else {
					console.log("NO DATA GIVEN!!");
				}

				const typesOfLevels = Object.keys(Headings2022[selectedQuality].levelsConfig);

				const levelFrequency = new Map();
				// Initializing the frequency of each level
				for (const level of typesOfLevels) {
					levelFrequency.set(level, 0);
				}

				// Getting frequency of each level
				data.forEach((dataPoint) => levelFrequency.set(dataPoint, levelFrequency.get(dataPoint) + 1));

				const orderedFrequencies = typesOfLevels.map((level) => levelFrequency.get(level));

				return (
					<Bar
						className="dataChart"
						datasetIdKey="defaultBarChart"
						data={{
							labels: typesOfLevels,
							datasets: [
								{
									id: 1,
									label: selectedQuality,
									data: orderedFrequencies,
									backgroundColor: [
										"rgba(255, 99, 132, 0.2)",
										"rgba(255, 159, 64, 0.2)",
										"rgba(255, 205, 86, 0.2)",
										"rgba(75, 192, 192, 0.2)",
										"rgba(54, 162, 235, 0.2)",
										"rgba(153, 102, 255, 0.2)",
										"rgba(201, 203, 207, 0.2)",
									],
									borderColor: [
										"rgb(255, 99, 132)",
										"rgb(255, 159, 64)",
										"rgb(255, 205, 86)",
										"rgb(75, 192, 192)",
										"rgb(54, 162, 235)",
										"rgb(153, 102, 255)",
										"rgb(201, 203, 207)",
									],
									borderWidth: 2,
								},
							],
						}}
						options={{
							maintainAspectRatio: false,
							scales: {
								y: {
									ticks: {
										stepSize: 1,
									},
								},
								x: {
									title: {
										display: true,
										text: "Match Number",
									},
								},
							},
							plugins: {
								title: {
									display: false,
									text: selectedQuality,
								},
							},
						}}
					/>
				);
			}
		}
	};

	return (
		<div className="chart">
			{createChart(
				props.matches,
				props.positiveDataSet,
				props.negativeDataSet,
				props.positiveKey,
				props.negativeKey,
				props.selectedQuality,
				props.sortingType
			)}
		</div>
	);
}
