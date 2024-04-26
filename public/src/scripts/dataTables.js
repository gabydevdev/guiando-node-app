// dataTables.js
import DataTable from 'datatables.net-dt';

export function setupDataTable(selector, apiURL) {
	return new DataTable(selector, {
		processing: true,
		serverSide: true,
		ajax: {
			url: apiURL,
		},
		columns: [
			{ data: 'bookingId', title: 'Booking Id' },
			{
				data: 'creationDate',
				render: function (data, type) {
					var d = new Date(data);

					if (type === 'display') {
						return d.toLocaleDateString('en-US', {
							month: '2-digit',
							year: 'numeric',
							day: '2-digit',
						});
					}
					return data;
				},
				title: 'Created On',
				className: 'created-on date',
			},
			{
				data: 'activityBookings[0].product.externalId',
				title: 'External ID',
			},
			{
				data: 'customer',
				render: function (data) {
					return `${data.firstName} ${data.lastName}`;
				},
				title: 'Traveler Name',
			},
			{ data: 'customer.phoneNumber', title: 'Phone #' },
			{
				data: 'activityBookings[0].dateString',
				title: 'Travel Date',
				className: 'travel-date date',
			},
			{ data: 'activityBookings[0].totalParticipants', title: '# PAX' },
			{
				data: 'totalPrice',
				title: 'Total Price',
				className: 'price currency',
			},
			{ data: 'status', title: 'Status', className: 'status' },
		],
		paging: true,
		autoWidth: false,
		pageLength: 12,
		lengthMenu: [5, 10, 25, 50],
		retrieve: true,
		initComplete: function () {
			console.log('DataTables has finished its initialisation.');

			const evt = new Event("tableComplete", { bubbles: true, cancelable: false });
			document.dispatchEvent(evt);
		},
	});

	// @see https://datatables.net/reference/api/init()#Description
	// console.log(table.init());
}
