import { Popover, Dropdown } from 'bootstrap';
// import { setupDataTable, redrawTable } from './dataTableSetup';
import { createTableWithData } from './tables';

document.addEventListener('DOMContentLoaded', async function () {
	initializeBootstrapComponents();
	// setupDataTable('#bookingsTable');
	// redrawTable();
	createTableWithData('#bookingsTable');
});

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
