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

	const startDateField = document.getElementById("date_1");
	const endDateField = document.getElementById("date_2");
	const tableBody = document.querySelector("#checkbox_2 tbody");

	startDateField.addEventListener("change", handleDateChange);
	endDateField.addEventListener("change", handleDateChange);

	function handleDateChange(event) {
		if (event.target.id === "date_1") {
			startDate = event.target.value;
			endDateField.disabled = !startDate;
			if (!startDate) endDateField.value = "";
		} else {
			endDate = event.target.value;
		}

		console.log("startDate: ", startDate);
		console.log("endDate: ", endDate);

		if (!startDate || !endDate) {
			tableBody.style.display = "none";
			return;
		}

		params = {
			limit: limit,
			page: currentPage,
			sortBy: "startDateTime",
			startDate: startDate,
			endDate: endDate,
		};

		tableBody.style.display = "";
		populateTable(apiURL, params);
	}
});

// Function to populate the table with bookings data
async function populateTable(apiURL, params) {
	const bookings = await fetchDataFromAPI(apiURL, { ...params });
	const bookingsData = bookings.data;

	console.log("total bookings: ", bookings.total);

	// Update total entries caption
	document.getElementById("totalEntries").textContent = bookings.total;

	const tableBody = document.querySelector("#checkbox_2 tbody");
	tableBody.innerHTML = "";

	bookingsData.forEach((booking, i) => {
		// Booking values required
		const { bookingId } = booking;
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
			bookingId: bookingId,
			externalId: externalId,
			customerName: customerName,
			invoiceDates: invoiceDates,
			pax: pax,
			phoneNumber: phoneNumber,
		};

		// Convert object to JSON string
		const bookingValuesJSON = JSON.stringify(bookingValues);

		// Create table row
		const row = tableBody.insertRow();

		// Create table cell with checkbox
		const cell_cb = row.insertCell();
		cell_cb.id = "cell_cb";

		const cb = document.createElement("input");
		cb.setAttribute("type", "checkbox");
		cb.setAttribute("name", "checkbox_2[]");
		cb.setAttribute("id", "checkbox_2_" + i);

		cb.value = bookingValuesJSON;

		cb.setAttribute("data-booking", bookingId);
		cb.setAttribute("data-tour", externalId);
		cb.setAttribute("data-name", customerName);
		cb.setAttribute("data-date", invoiceDates);
		cb.setAttribute("data-pax", pax);
		cb.setAttribute("data-phone", phoneNumber);

		cell_cb.appendChild(cb);

		// Create info table cells
		// Booking Id
		row.insertCell().textContent = bookingId;

		// Tour
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

	// Dispatch the custom event
	document.dispatchEvent(new Event("populateTableComplete"));
}

document.addEventListener("populateTableComplete", function () {
	console.log("Table population is complete.");

	// Find all checkboxes in the booking data table
	let checkboxes = document.querySelectorAll("#checkbox_2 input[type='checkbox']");
	console.log("checkboxes: ", checkboxes);

	// Add the event listener to each checkbox
	checkboxes.forEach((cb) => {
		cb.addEventListener("change", (event) => {
			console.log("event: ", event);

			if (cb.checked) {
				console.log("checked!!");
			} else {
				console.log("unchecked...");
			}

			updatePaxTotal(event);
		});
	});
});

function updatePaxTotal(event) {
	const cb = event.target;
	const paxData = parseInt(cb.dataset.pax, 10);

	const totalPaxField = document.querySelector("#totalPax input");
	let paxTotal = parseInt(totalPaxField.value, 10);

	if (cb.checked) {
		paxTotal += paxData;
	} else {
		paxTotal -= paxData;
	}

	// Update the totalPaxField with the new paxTotal
	totalPaxField.value = paxTotal;
}

