import React, { useEffect, useState, useRef } from "react";
import "./SideMenu.scss";
import { Headings2022, calculateHeaderAverage, calculateHeaderConsistency } from "./DataSources/Headers";

export default function SideMenu(props) {
	const [optionState, setOptionState] = useState("");

	const currentHeaders = useRef([]);
	const currentKeysAndHeaders = useRef([]);

	const createTeamButtons = (teamList) => {
		const newTeamButtons = [];
		if (teamList.length === 0) {
			newTeamButtons.push(
				<div>
					<button className="teamSelector">No teams selected</button>
				</div>
			);
		} else {
			for (const team of teamList) {
				const newTeamButton = (
					<div key={team}>
						<button
							className="teamSelector"
							onClick={() =>
								document
									.getElementById("team" + team)
									.scrollIntoView({ behavior: "smooth", block: "center" })
							}
						>
							{team}
						</button>
						<button
							className="delete"
							onClick={() => props.clearChosenTeams([team])}
						>
							x
						</button>
					</div>
				);
				newTeamButtons.push(newTeamButton);
			}
		}

		return newTeamButtons;
	};

	const optionSelector = () => {
		// Uses predefined headers
		for (const [key, value] of Object.entries(Headings2022)) {
			// Finding the true name, whether the values are linked in some way
			const displayName = value.combinedName === "" ? key : value.combinedName;

			const isNegativeTwin = value.combinedName !== "" && value.isNegativeAttribute;

			if (!isNegativeTwin && !currentHeaders.current.includes(displayName)) {
				currentHeaders.current.push(displayName);
				console.log([key, displayName]);
				currentKeysAndHeaders.current.push([key, displayName]);
			}
		}

		return (
			<div>
				<select
					value={optionState}
					onChange={(event) => setOptionState(event.target.value)}
				>
					{currentKeysAndHeaders.current.map(([positiveAttribute, displayName]) => (
						<option
							key={positiveAttribute}
							value={positiveAttribute}
						>
							{displayName}
						</option>
					))}
				</select>
			</div>
		);
	};

	// Update the selected quality and sort
	const sortTeams = (newSelectedQuality) => {
		// Finding the first team in the map
		// Starting an iterator, getting the first element, then getting its value (the team)
		const firstTeam = props.teamInformation.values().next().value;

		console.log(firstTeam);

		if (firstTeam !== undefined) {
			const data = firstTeam.get(newSelectedQuality);

			// Assumes that data actually exists...
			// If the data is actually something we can process, then sort
			// Otherwise, if it's a string (like a comment), then do not sort
			if (data.includes("TRUE") || data.includes("FALSE") || !isNaN(data[0])) {
				props.sortTeamsQualities(newSelectedQuality);
			}
		}
	};

	// Once the teammodifier has a selected quality, use it if we have none in this component
	useEffect(() => {
		if (optionState === "") {
			setOptionState(props.selectedQuality);
		}
	}, [props.selectedQuality]);

	useEffect(() => {
		props.setSelectedQuality(optionState);

		if (props.sortImmediately) props.sortTeamsQualities(optionState);
	}, [optionState, props.sortImmediately]);

	console.log(props.teamInformation);
	return (
		<div id="SideMenu">
			<div id="TeamButtons">
				<h2>Teams Selected</h2>
				<div>{createTeamButtons(props.chosenTeams)}</div>
				<h2>Sort Teams by:</h2>
				<button
					onClick={() => props.sortTeamsQualities(optionState)}
					style={{ display: props.sortImmediately ? "none" : "" }}
				>
					{optionState}
				</button>
				{optionSelector()}
			</div>
			<h2>Clear Teams:</h2>
			<button
				id="clear"
				onClick={() => props.setChosenTeams([])}
			>
				CLEAR
			</button>
		</div>
	);
}
