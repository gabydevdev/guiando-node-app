console.log('>> main');

import { Popover, Dropdown } from 'bootstrap'; // Import Bootstrap's JS

// Create an example popover
document.querySelectorAll('[data-bs-toggle="popover"]').forEach((popover) => {
	new Popover(popover);
});

// Create an example dropdown
document
	.querySelectorAll('[data-bs-toggle="dropdown"]')
	.forEach((dropdownToggleEl) => {
		new Dropdown(dropdownToggleEl);
	});

// Test scripts
// Define the API endpoint
const apiUrl = 'http://localhost:3000/api/test';

// Function to fetch data from the API
function fetchDataFromAPI() {
	fetch(apiUrl)
		.then((response) => response.json())
		.then((result) => {
			result.data.forEach((item) => {
				const bookingId = item.bookingId;
				const status = item.status;
				const creationDate = item.creationDate;
				const totalPrice = item.totalPrice;

				let activityBookings = item.activityBookings;

				const cleanedString = activityBookings
					.replace(/'/g, '"')
					.replace(/False/g, 'false')
					.replace(/True/g, 'true')
					.replace(/None/g, 'null');

				const formattedString = cleanedString
					.replace(
						/(?<=[A-Za-z0-9])"(?=[A-Za-z0-9])/g,
						'SINGLE_QUOTE_STANDBY'
					)
					.replace(/\\x/g, '')
					.replace(/="/g, '=&quot;')
					.replace(/;"/g, ';&quot;')
					.replace(/">/g, '&quot;&gt;');

				const reformattedString = formattedString.replace(
					/SINGLE_QUOTE_STANDBY/g,
					"'"
				);

				activityBookings = JSON.parse(reformattedString);

				const dateString = activityBookings[0].dateString;
				const totalParticipants = activityBookings[0].totalParticipants;

				const activityData = activityBookings[0].activity;
				const externalId = activityData.externalId;

				const customerData = item.customer;

				console.log('bookingId: ', bookingId);
				console.log('status: ', status);
				console.log('creationDate: ', creationDate);
				console.log('totalPrice: ', totalPrice);
				console.log('dateString: ', dateString);
				console.log('totalParticipants: ', totalParticipants);
				console.log('externalId: ', externalId);
				console.log('customerData: ', customerData);
			});
		})
		.catch((error) => {
			console.error(
				'There was a problem with your fetch operation:',
				error
			);
		});
}

// Call the function to fetch data
fetchDataFromAPI();
