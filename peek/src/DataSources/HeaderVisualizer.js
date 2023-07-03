import React, { useEffect, useState } from "react";

// import "./InformationSourceDisplay.scss";

// import InformationSource from "./InformationSource";

import { defaultConfig } from "../Headers";

export default function HeaderVisualizer(props) {
	const [isInputShown, setIsInputShown] = useState(false);

	const destructureHeadings = (annualHeadings) => {
		for (const header of annualHeadings) {
			destructureHeader(header);
		}
	};

	const destructureHeader = (headerJSON) => {
		for (const [key, value] of headerJSON) {
			console.log("key: " + key);
			console.log("value: " + value);
		}
	};

	return (
		<div id="InformationSourceDisplay">
			<button onClick={() => setIsInputShown(true)}>Change Data Source</button>
			{renderInfoInput(isInputShown)}
		</div>
	);
}
