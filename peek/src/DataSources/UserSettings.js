import React, { useState, useEffect } from "react";

import "react-toggle/style.css";

import Toggle from "react-toggle";

export default function UserSettings(props) {
	const [settings, setSettings] = useState(props.currentUserSettings);

	const handleToggle = (newState, quality) => {
		setSettings((prevState) => ({
			...prevState,
			[quality]: newState,
		}));
	};

	useEffect(() => {
		function handleClickOutside(event) {
			if (event.target.id === "settingsSelectorWrapper") {
				console.log("click outside info source");

				props.setAreSettingsShown(false);
			}
		}
		// Bind the event listener
		document.addEventListener("mousedown", handleClickOutside);

		return () => {
			// Unbind the event listener on clean up
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	const createSetting = (labelMessage, settingObjectName, currentSettings) => {
		console.log(currentSettings);

		return (
			<div className="settingOption">
				<label>{labelMessage}</label>
				<Toggle
					defaultChecked={currentSettings[settingObjectName]}
					onChange={(event) => handleToggle(event.target.checked, settingObjectName)}
					className="toggle"
				/>
			</div>
		);
	};

	const handleUpdate = (userSettings) => {
		props.setUserSettings(userSettings);
		props.setAreSettingsShown(false);
	};

	return (
		<div id="settingsSelector">
			{createSetting("Sort immediately after changing quality?", "sortImmediately", settings)}

			<div className="submissionOptions">
				<button onClick={() => handleUpdate(settings)}>Update Settings</button>
				<button onClick={() => props.setAreSettingsShown(false)}>Discard changes</button>
			</div>
		</div>
	);
}
