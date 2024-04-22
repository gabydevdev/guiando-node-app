import { Popover, Dropdown } from 'bootstrap';
import { fetchDataFromAPI } from './apiManager';
import { createTableWithData } from './tables';

let apiURL = "http://localhost:3000/api/test";

let params = {
	limit: 10,
	page: 1,
};

if (document.readyState === 'loading') {
	// Loading hasn't finished yet
	document.addEventListener('DOMContentLoaded', doSomething());
} else {
	// `DOMContentLoaded` has already fired
	doSomething();
}

async function doSomething() {
	initializeBootstrapComponents();

	const tableEl = document.getElementById('bookingsTable')
	let jsonData = await fetchDataFromAPI(params, apiURL);
	createTableWithData(tableEl, jsonData);
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
