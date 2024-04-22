import { Popover, Dropdown } from 'bootstrap';
import { fetchDataFromAPI } from './apiManager';
import { setupDataTable } from './dataTableSetup';

document.addEventListener('DOMContentLoaded', async function () {
	initializeBootstrapComponents();
	setupDataTable('#bookingsTable');
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
