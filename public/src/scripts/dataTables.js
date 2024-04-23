// dataTables.js
import DataTable from 'datatables.net-dt';

export function setupDataTable(selector, apiURL) {
	var table = new DataTable(selector, {
		processing: true,
		serverSide: true,
		ajax: {
			url: apiURL
		},
		columns: [
			{ data: 'bookingId', title: 'Booking Id' },
			{ data: 'creationDate', title: 'Created On' },
			{ data: 'activityBookings[0].product.externalId', title: 'External ID' },
			{ data: 'customer.firstName', title: 'First Name' },
			{ data: 'customer.lastName', title: 'Last Name' },
			{ data: 'customer.email', title: 'Email' },
			{ data: 'customer.phoneNumber', title: 'Phone #' },
			{ data: 'activityBookings[0].dateString', title: 'Travel Date' },
			{ data: 'activityBookings[0].totalParticipants', title: 'PAX' },
			{ data: 'totalPrice', title: 'Total Price' },
			{ data: 'status', title: 'Status' },
		],
		paging: true,
		initComplete: function () {
			console.log('DataTables has finished its initialisation.');
		},
	});
}
