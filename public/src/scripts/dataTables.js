// dataTables.js
import DataTable from "datatables.net-dt";

export function setupDataTable(selector, apiURL) {
	const table = new DataTable(selector, {
		processing: true,
		serverSide: true,
		ajax: {
			url: apiURL,
		},
		columns: [
			{ data: "bookingId", title: "Booking Id", name: "bookingId" },
			{
				data: "creationDate",
				render: function (data, type) {
					let d = new Date(data);

					if (type === "display") {
						return d.toLocaleDateString("en-US", {
							month: "2-digit",
							year: "numeric",
							day: "2-digit",
						});
					}
					return data;
				},
				title: "Created On",
				name: "creationDate",
				className: "created-on date",
			},
			{
				data: "activityBookings[0].product.externalId",
				title: "External ID",
				name: "externalId",
			},
			{
				data: "customer",
				render: function (data) {
					return `${data.firstName} ${data.lastName}`;
				},
				title: "Traveler Name",
				name: "customer",
			},
			{ data: "customer.phoneNumber", title: "Phone #", name: "phoneNumber" },
			{
				data: "activityBookings[0].dateString",
				render: function (data, type) {
					let d = new Date(data);

					if (type === "display") {
						const date = d.toLocaleDateString(undefined, {
							weekday: "long",
							year: "numeric",
							month: "long",
							day: "numeric",
						});
						const time = d.toLocaleTimeString("en-US", {
							hour: "2-digit",
							minute: "2-digit",
							hour12: true,
						});

						return `${date}, ${time}`;
					}
					return data;
				},
				title: "Travel Date",
				name: "travelDate",
				className: "travel-date date",
			},
			{ data: "activityBookings[0].totalParticipants", title: "# PAX", name: "pax" },
			{
				data: "totalPrice",
				title: "Total Price",
				name: "totalPrice",
				className: "price currency",
			},
			{ data: "status", title: "Status", name: "status", className: "status" },
		],
		paging: true,
		autoWidth: false,
		pageLength: 12,
		lengthMenu: [6, 12, 24, 50],
		ordering: true,
		order: {
			name: "travelDate",
			dir: "asc"
		},
		retrieve: true,
		initComplete: function () {
			console.log("DataTables has finished initialisation.");

			const evt = new Event("tableComplete", {
				bubbles: true,
				cancelable: false,
			});
			document.dispatchEvent(evt);
		},
	});

	// @see https://datatables.net/reference/api/init()#Description
	// console.log(table.init());

	var order = table.order();
	console.log("Column " + order + " is the ordering column");
}
