// index.js
import { Popover, Dropdown } from "bootstrap";
// import { setupDataTable } from "./dataTables";

export const apiURL = process.env.API_URL + "/api/bookings";
export const localeStringOptions = {
	hour12: false,
	timeZone: "America/Los_Angeles",
	weekday: "short",
	year: "numeric",
	month: "short",
	day: "2-digit",
	hour: "2-digit",
	minute: "2-digit",
};

if (document.readyState === "loading") {
	// Loading hasn't finished yet
	document.addEventListener("DOMContentLoaded", init());
} else {
	// `DOMContentLoaded` has already fired
	init();
}

async function init() {
	initializeBootstrapComponents();

	// const tableEl = document.getElementById("bookingsTable");
	// setupDataTable(tableEl, apiURL);
}

function initializeBootstrapComponents() {
	// Initialize all popovers
	const popoverElements = document.querySelectorAll(
		'[data-bs-toggle="popover"]'
	);
	popoverElements.forEach((popover) => new Popover(popover));

	// Initialize all dropdowns
	const dropdownElements = document.querySelectorAll(
		'[data-bs-toggle="dropdown"]'
	);
	dropdownElements.forEach((dropdown) => new Dropdown(dropdown));
}
