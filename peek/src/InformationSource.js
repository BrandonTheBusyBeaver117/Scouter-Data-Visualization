import React, { useEffect, useRef, useState } from "react";

export default function InformationSource(props) {
	const testString = (testValue) => {
		return typeof testValue === "string" || testValue instanceof String;
	};

	const findSourceTypeSelected = (inputSource) => {
		if (testString(inputSource)) {
			function isValidHttpUrl(string) {
				let url;
				try {
					url = new URL(string);
				} catch (e) {
					return false;
				}
				return url.protocol === "http:" || url.protocol === "https:";
			}

			if (isValidHttpUrl(inputSource)) {
				return "link";
			} else {
				return "INVALID LINK";
			}
		} else if (inputSource instanceof File) {
			return "csv";
		} else {
			// something would have to go very wrong if this were to happen
			return "";
		}
	};

	const [sourceTypeSelected, setSourceTypeSelected] = useState(findSourceTypeSelected(props.currentInputSource));

	const [sheetLink, setSheetLink] = useState(testString(props.currentInputSource) ? props.currentInputSource : "");

	const [eventKey, setEventKey] = useState(props.currentEventKey);

	const fileInput = useRef();

	const handleUpdate = (
		changedEventKey,
		changedSheetLink,
		changedFile,
		propsCurrentEventKey,
		propsCurrentInputSource
	) => {
		if (propsCurrentEventKey !== changedEventKey) {
			props.setEventKey(changedEventKey);
		}

		// User has not changed the file
		if (changedFile == null) {
			// The only other thing they could have changed is the sheet link
			if (changedSheetLink !== propsCurrentInputSource) {
				props.setInputSource(changedSheetLink);
			}
		}
		// If they changed the file, I'm pretty sure they want to use the file they changed
		else if (changedFile != null) {
			props.setInputSource(changedFile);
		}

		props.setIsInputShown(false);
	};

	const handleError = (changedEventKey, changedSheetLink, changedFile) => {
		const fieldsEmpty = [];

		if (changedEventKey === "") {
			fieldsEmpty.push(' "event key"');
		}

		// We could also check if it's a valid url
		if (changedSheetLink === "") {
			fieldsEmpty.push(' "link to google sheet"');
		}

		if (changedFile == null) {
			fieldsEmpty.push(' "csv file"');
		}

		if (fieldsEmpty.length > 0) {
			let errorString = "You cannot leave the";

			if (fieldsEmpty.length === 1) {
				errorString += fieldsEmpty[0] + " field blank!";
			} else if (fieldsEmpty.length > 1) {
				// Going through all the empty fields
				for (let i = 0; i < fieldsEmpty.length; i++) {
					// If it's not the last, add a comma
					if (i != fieldsEmpty.length - 1) {
						errorString += fieldsEmpty[i] + ", ";
					} else {
						// If it is the last, add an "and"
						errorString += "and " + fieldsEmpty[i] + " fields blank!";
					}
				}
			}

			return <p id="error message">{errorString}</p>;
		}
	};

	const createForm = (typeInputSource) => {
		if (typeInputSource === "csv") {
			return (
				<form>
					<label>CSV file: </label>
					<input
						type="file"
						accept=".csv"
						ref={fileInput}
					/>
				</form>
			);
		} else if (typeInputSource === "link") {
			return (
				<form>
					<label>Link to google sheet: </label>
					<input
						type="text"
						value={sheetLink}
						placeholder="Google sheet link"
						onChange={(event) => setSheetLink(event.target.value)}
					/>
				</form>
			);
		}
	};

	useEffect(() => {
		function handleClickOutside(event) {
			if (event.target.id === "InfoSourceInput") {
				console.log("click outside info source");

				props.setIsInputShown(false);
			}
		}
		// Bind the event listener
		document.addEventListener("mousedown", handleClickOutside);

		return () => {
			// Unbind the event listener on clean up
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	const buttonHighlighting = (currentSourceType, buttonSourceType) => {
		return {
			backgroundColor: currentSourceType === buttonSourceType ? "rgb(255, 255, 0)" : "rgb(225, 225, 225)",
			transition: "0.3s linear",
		};
	};

	return (
		<div id="InformationSource">
			<p>Input an event key</p>
			<input
				type="text"
				placeholder="Input your event key"
				value={eventKey}
				onChange={(event) => setEventKey(event.target.value)}
			/>

			<p>Choose your data source:</p>

			<p>Select either a csv file, OR a link to a google sheet</p>

			<div id="typeChooser">
				<button
					onClick={() => setSourceTypeSelected("link")}
					style={buttonHighlighting(sourceTypeSelected, "link")}
				>
					Google Sheets Link
				</button>
				<button
					onClick={() => setSourceTypeSelected("csv")}
					style={buttonHighlighting(sourceTypeSelected, "csv")}
				>
					Csv File
				</button>
			</div>

			{createForm(sourceTypeSelected)}

			<div className="submissionOptions">
				<button
					onClick={() =>
						handleUpdate(
							eventKey,
							sheetLink,
							fileInput?.current?.files[0],
							props.currentEventKey,
							props.currentInputSource
						)
					}
				>
					Update Data sources
				</button>
				<button onClick={() => props.setIsInputShown(false)}>Discard changes</button>
			</div>
		</div>
	);
}
