import { Popover, Dropdown } from 'bootstrap';
import { fetchDataFromAPI } from './apiManager';

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

async function createTableWithData(element, jsonData) {
	const tbody = element.lastElementChild;
	const result = jsonData;

	result.forEach((item) => {
		const row = document.createElement('tr');
		tbody.appendChild(row);

		Object.entries(item).forEach(([key, value]) => {
			// Formatting the value if it's a date
			if (key === 'createdOn' || key === 'travelDate') {
				value = new Date(value).toLocaleDateString();
			}

			// Formatting the value if it's currency
			if (key === 'totalPrice') {
				value = new Intl.NumberFormat().format(value);
			}
			addCell(row, value);
		});
	});
}

function addCell(row, text) {
	const cell = document.createElement('td');
	cell.textContent = text;
	row.appendChild(cell);
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
