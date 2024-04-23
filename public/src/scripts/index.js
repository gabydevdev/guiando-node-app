import { Popover, Dropdown } from 'bootstrap';
import { setupDataTable } from './dataTables';

let apiURL = "http://localhost:3000/api/test";

if (document.readyState === 'loading') {
	// Loading hasn't finished yet
	document.addEventListener('DOMContentLoaded', doSomething());
} else {
	// `DOMContentLoaded` has already fired
	doSomething();
}

async function doSomething() {
	initializeBootstrapComponents();

	const tableEl = document.getElementById('bookingsTable');
	setupDataTable(tableEl, apiURL);
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
