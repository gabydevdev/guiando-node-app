// request.js
console.log(">> Request page");

import { apiURL, localeStringShort } from "@scripts/index.js";
import { fetchDataFromAPI } from "@scripts/apiManager.js";

let bookings, startDate, endDate;
let currentPage = 1;
let limit = -1;
let params = {
	limit: limit,
	page: currentPage,
	sortBy: "startDateTime",
};

document.addEventListener("DOMContentLoaded", async function () {
	bookings = await fetchDataFromAPI(apiURL, params);
	console.log("all bookings: ", bookings.total);

	// End Date Field
	const endDateField = document.getElementById("date_2");

	// If start date field is empty, end date field should be disabled.
	document
		.getElementById("date_1")
		.addEventListener("change", (event) => {
			startDate = event.target.value;

			if (startDate) {
				endDateField.disabled = false;
			} else {
				// Clear and disable end date field if start date is cleared.
				endDateField.disabled = true;
				endDateField.value = "";
			}

			console.log('startDate: ', startDate);
			return startDate;
		});

	console.log('startDate: ', startDate);

	endDateField
		.addEventListener("change", (event) => {
			endDate = event.target.value;
			console.log('endDate: ', endDate);

			if (!startDate || !endDate) {
				return;
			}

			// Define API parameters
			params = {
				limit: limit,
				page: currentPage,
				sortBy: "startDateTime",
				startDate: startDate,
				endDate: endDate,
			};

			populateTable(apiURL, params);
		});
});

// Function to populate the table with bookings data
async function populateTable(apiURL, params) {
	const bookings = await fetchDataFromAPI(apiURL, { ...params });
	const bookingsData = bookings.data;

	console.log('total bookings: ', bookings.total);

	// Update total entries caption
	document.getElementById("totalEntries").textContent = bookings.total;

	const tableBody = document.querySelector("#checkbox_2 tbody");
	tableBody.innerHTML = "";

	bookingsData.forEach((booking, i) => {
		// Booking values required
		const { externalId } = booking.activityBookings.product;
		const customerName = `${booking.customer.firstName} ${booking.customer.lastName}`;

		const invoiceDates = booking.activityBookings.invoice.dates;
		const invoiceDatesFormatted = new Date(invoiceDates).toLocaleString(
			"en-US",
			localeStringShort
		);

		const pax = booking.activityBookings.totalParticipants;
		const phoneNumber = booking.customer.phoneNumber;

		// Collect values into an object
        const bookingValues = {
            externalId: externalId,
            customerName: customerName,
            invoiceDates: invoiceDates,
            pax: pax,
            phoneNumber: phoneNumber
        };

        // Convert object to JSON string
        const bookingValuesJSON = JSON.stringify(bookingValues);

		// Create table row
		const row = tableBody.insertRow();

		// Create table cell with checkbox
		const cell_cb = row.insertCell();
		cell_cb.id = "cell_cb";

		const cb = document.createElement("input");
		cb.setAttribute('type', 'checkbox');
		cb.setAttribute('name', 'checkbox_2[]');
		cb.setAttribute('id', 'checkbox_2_' + i);

		cb.value = bookingValuesJSON;

		cb.setAttribute('data-refid', externalId);
		cb.setAttribute('data-name', customerName);
		cb.setAttribute('data-date', invoiceDates);
		cb.setAttribute('data-pax', pax);
		cb.setAttribute('data-phone', phoneNumber);

		cell_cb.appendChild(cb);

		// Create info table cells
		//
		// Reference #
		row.insertCell().textContent = externalId;

		// Traveler Name
		row.insertCell().textContent = customerName;

		// Tour Date
		row.insertCell().textContent = invoiceDatesFormatted;

		// # PAX
		row.insertCell().textContent = pax;

		// Phone
		row.insertCell().textContent = phoneNumber;
	});
}
