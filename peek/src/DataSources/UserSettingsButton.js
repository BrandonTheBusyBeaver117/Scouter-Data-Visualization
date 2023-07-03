import settingsIcon from "../Images/SettingsIcon.png";
import "./UserSettingsButton.scss";
import React, { useState } from "react";
import UserSettings from "./UserSettings";

export default function UserSettingsBUtton(props) {
	const [areSettingsShown, setAreSettingsShown] = useState(false);

	const renderSettings = (shouldSettingsBeShown) => {
		if (shouldSettingsBeShown) {
			return (
				<div id="settingsSelectorWrapper">
					<UserSettings
						currentUserSettings={props.currentUserSettings}
						setUserSettings={props.setUserSettings}
						setAreSettingsShown={setAreSettingsShown}
					/>
				</div>
			);
		}
	};
	return (
		<div id="userSettings">
			<div
				id="imageWrapper"
				onClick={() => setAreSettingsShown(true)}
			>
				<img
					src={settingsIcon}
					alt="settings icon"
				></img>
			</div>
			{renderSettings(areSettingsShown)}
		</div>
	);
}
