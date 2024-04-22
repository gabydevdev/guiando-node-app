import { Popover, Dropdown } from 'bootstrap';

document.addEventListener('DOMContentLoaded', async function () {
	initializeBootstrapComponents();
	await createTableWithData('#bookingsTable');
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

async function createTableWithData(selector) {
	const table = document.getElementById(selector);
	console.log(table); // currently shows as null and stops

	const tbody = table.getElementsByTagName('tbody');
	console.log(tbody);

	const params = {
		limit: 10,
		page: 1,
	};

	const result = await fetchDataFromAPI(params);

	console.log(result);

	result.forEach((item) => {
		const row = document.createElement('tr');
		tbody.appendChild(row);

		Object.entries(item).forEach(([key, value]) => {
			// Formatting the value if it's a date
			if (key === 'createdOn' || key === 'travelDate') {
				value = new Date(value).toLocaleDateString();
			}
			addCell(row, value);
		});
	});
}

export async function fetchDataFromAPI(params) {
	const query = new URLSearchParams(params).toString();
	const apiUrl = `http://localhost:3000/api/test?${query}`;

	console.log(apiUrl);

	try {
		const response = await fetch(apiUrl);
		const result = await response.json();
		return result.data.map((item) => {
			const activityBookings = cleanData(item);
			return {
				"status": item.status,
				"bookingId": item.bookingId,
				"creationDate": item.creationDate,
				"externalId": activityBookings.activity.externalId,
				"dateString": activityBookings.dateString,
				"totalParticipants": activityBookings.totalParticipants,
				"totalPrice": item.totalPrice,
			};
		});
	} catch (error) {
		console.error('There was a problem with your fetch operation:', error);
	}
}

function addCell(row, text) {
	const cell = document.createElement('td');
	cell.textContent = text;
	row.appendChild(cell);
}

function cleanData(item) {
	const cleanedActivityBookings = JSON.parse(
		item.activityBookings
			.replace(/'/g, '"')
			.replace(/False/g, 'false')
			.replace(/True/g, 'true')
			.replace(/None/g, 'null')
			.replace(
				/(?<=[A-Za-z0-9])"(?=[A-Za-z0-9])/g,
				'SINGLE_QUOTE_STANDBY'
			)
			.replace(/\\x/g, '')
			.replace(/="/g, '=&quot;')
			.replace(/;"/g, ';&quot;')
			.replace(/">/g, '&quot;&gt;')
			.replace(/SINGLE_QUOTE_STANDBY/g, "'")
	);

	return cleanedActivityBookings[0];
}
