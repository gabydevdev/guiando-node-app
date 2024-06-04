// request.js
console.log(">> Request page");

import { apiURL } from "@scripts/index.js";
import { fetchDataFromAPI } from "@scripts/apiManager.js";

let bookings, startDate, endDate;
let currentPage = 1;
let limit = 10;
let params = {
	limit: limit,
	page: currentPage,
	sortBy: "startDateTime",
};

document.addEventListener("DOMContentLoaded", async function () {
	const startDateField = document.querySelector("#date_1");
	const endDateField = document.querySelector("#date_2");

	// Enable end date field if start date has a value
	startDateField.addEventListener("change", function () {
		if (startDateField.value) {
			endDateField.disabled = false;
		} else {
			endDateField.disabled = true;
			endDateField.value = ""; // Clear end date if start date is cleared
		}

		console.log(startDateField.value);
	});

	// Run the API function on end date value change
	endDateField.addEventListener("change", async function () {
		startDate = startDateField.value;
		endDate = endDateField.value;

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

		// Fetch data from API using the date fields as parameters
		try {
			bookings = await fetchDataFromAPI(apiURL, params);
			// console.log("Bookings: ", bookings);
			console.log("Total Bookings: ", bookings.total);
			// Update total entries caption
			document.getElementById("totalEntries").textContent = bookings.total;

			// Update the table with the fetched bookings data
			populateTable(bookings.data);
		} catch (error) {
			console.error("Error fetching data from API: ", error);
			alert("Failed to fetch data from API. Please try again.");
		}
	});
});

// Function to populate the table with bookings data
function populateTable(bookingsData) {
	const bookingTable = document.querySelector("#matrix_1 tbody");

	bookingsData.forEach((booking, i) => {
		const bookingRow = bookingTable.rows[i];
		const { externalId } = booking.activityBookings.product;
		const customerName = `${booking.customer.firstName} ${booking.customer.lastName}`;
		const pax = booking.activityBookings.totalParticipants;
		const phoneNumber = booking.customer.phoneNumber;

		bookingRow.querySelector("[data-matrix-answer='Reference #']").value = externalId;
		bookingRow.querySelector("[data-matrix-answer='Traveler Name']").value = customerName;
		bookingRow.querySelector("[data-matrix-answer='# PAX']").value = pax;
		bookingRow.querySelector("[data-matrix-answer='Phone']").value = phoneNumber;
	});
}
