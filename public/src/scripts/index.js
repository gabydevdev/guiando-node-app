import { Popover, Dropdown } from 'bootstrap';
import DataTable from 'datatables.net-dt';

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
			const dataSet = result.data.map((item) => {
				const bookingId = item.bookingId;
				const status = item.status;
				const creationDate = item.creationDate;
				const totalPrice = item.totalPrice;

				const activityBookings = JSON.parse(
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

				return [
					status,
					bookingId,
					creationDate,
					externalId,
					dateString,
					totalParticipants,
					totalPrice,
				];
			});

			console.log('dataSet: ', dataSet);

			new DataTable('#bookingsTable', {
				columns: [
					{ title: 'Booking Id' },
					{ title: 'Status' },
					{ title: 'Created On' },
					{ title: 'Total Price' },
					{ title: 'Travel Date' },
					{ title: 'PAX' },
					{ title: 'SKU' },
				],
				data: dataSet,
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
