console.log('>> main');

// Import all of Bootstrap's JS
import { Popover, Dropdown } from 'bootstrap';

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
		.then((response) => {
			// Check if the response is successful
			if (!response.ok) {
				throw new Error(
					'Network response was not ok ' + response.statusText
				);
			}

			return response.json();
		})
		.then((result) => {
			console.log('Data retrieved from API:', result); // Log data to the console

			if (result.data && Array.isArray(result.data)) {
				// Assuming 'data' is the key where your array of objects is stored
				result.data.forEach((item) => {
					console.log('Booking ID:', item.bookingId);

					// Assume 'activityBookings' is the field with the stringified JSON
					const activityBookings = item.activityBookings;

					// Temporarily replace escaped double quotes with a unique placeholder
					let formattedString = activityBookings.replace(
						/\\"/g,
						'TEMP_DOUBLE_QUOTE'
					);

					// Replace single quotes with double quotes
					formattedString = formattedString
						.replace(/'/g, '"')
						.replace(/False/g, 'false')
						.replace(/True/g, 'true')
						.replace(/None/g, 'null');

					// Revert the placeholder back to escaped double quotes
					const reformattedString = formattedString.replace(
						/TEMP_DOUBLE_QUOTE/g,
						"\\'"
					);

					console.log(typeof reformattedString);
					console.log('reformattedString:', reformattedString);

					try {
						// Parse the string as JSON
						const activityBookingsString =
							JSON.stringify(reformattedString);

						console.log(typeof activityBookingsString);

						// let activityBookingsJSON = JSON.parse(
						// 	activityBookingsString
						// );

						// activityBookingsJSON = JSON.parse(activityBookingsJSON);

						// console.log(typeof activityBookingsJSON[0]);

						// console.log(
						// 	'parentBookingId:',
						// 	activityBookingsJSON[0].parentBookingId
						// );

						// const parentBookingId = activityBookingsJSON.map(
						// 	(item) => item.parentBookingId
						// );

						// console.log('parentBookingId:', parentBookingId);
					} catch (e) {
						console.error('Error parsing activity bookings:', e);
					}
				});
			} else {
				console.log(
					'No booking data found or data is not in expected format'
				);
			}
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
