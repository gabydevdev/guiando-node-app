console.log(">> Test page");

import { apiURL, localeStringOptions } from "@scripts/index.js";
import { fetchDataFromAPI } from "@scripts/apiManager.js";

let bookings, filterDate;
let currentPage = 1;
let limit = -1;
let params = {
	limit: limit,
	page: currentPage,
	sortBy: "startDateTime",
};

document.addEventListener("DOMContentLoaded", async function () {
	bookings = await fetchDataFromAPI(apiURL, params);
	console.log("bookings: ", bookings.total);

	// Populate the table when the page loads
	populateTable(apiURL, params, currentPage);

	// Populate the filter dropdown with unique startDateTime values
	const filterDropdown = document.getElementById("filterDate");
	const uniqueDates = [
		...new Set(
			bookings.data.map(
				(booking) => booking.activityBookings.invoice.dates
			)
		),
	];
	uniqueDates.forEach((dateString) => {
		const option = document.createElement("option");
		option.value = dateString;
		option.textContent = new Date(dateString).toLocaleString(
			"en-US",
			localeStringOptions
		);
		filterDropdown.appendChild(option);
	});

	document
		.getElementById("filterDate")
		.addEventListener("change", (event) => {
			filterDate = event.target.value;
			populateTable(apiURL, params, 1, filterDate);
		});

	// Pagination button event listeners
	document.getElementById("firstPage").addEventListener("click", () => {
		currentPage = 1;
		populateTable(apiURL, params, currentPage);
	});

	document.getElementById("prevPage").addEventListener("click", () => {
		if (currentPage > 1) {
			currentPage--;
			populateTable(apiURL, params, currentPage);
		}
	});

	document.getElementById("nextPage").addEventListener("click", () => {
		const totalPages = Math.ceil(bookings.total / limit);
		if (currentPage < totalPages) {
			currentPage++;
			populateTable(apiURL, params, currentPage);
		}
	});

	document.getElementById("lastPage").addEventListener("click", () => {
		const totalPages = Math.ceil(bookings.total / limit);
		currentPage = totalPages;
		populateTable(apiURL, params, currentPage);
	});
});

// Function to update pagination controls
function updatePaginationControls(currentPage, totalPages) {
	document.getElementById("firstPage").disabled = currentPage === 1;
	document.getElementById("prevPage").disabled = currentPage === 1;
	document.getElementById("nextPage").disabled = currentPage === totalPages;
	document.getElementById("lastPage").disabled = currentPage === totalPages;
}

// Function to populate the table with bookings data
async function populateTable(apiURL, params, page, filterDate) {
	let bookings = await fetchDataFromAPI(apiURL, { ...params, page });
	let bookingsData = bookings.data;

	if (filterDate) {
		console.log("filterDate: ", filterDate);
		bookingsData = bookingsData.filter((booking) => {
			return booking.activityBookings.invoice.dates === filterDate;
		});
	}

	const tableBody = document.querySelector("#bookingsTable tbody");
	tableBody.innerHTML = "";

	// Populate table with bookings data
	bookingsData.forEach((booking) => {
		const row = tableBody.insertRow();

		const invoiceDates = booking.activityBookings.invoice.dates;

		row.insertCell().textContent = booking.bookingId;
		row.insertCell().textContent = new Date(invoiceDates).toLocaleString(
			"en-US",
			localeStringOptions
		);
		row.insertCell().textContent = booking.creationDate;
		// Add more cells for other booking details as needed
	});

	// Update total entries caption
	document.getElementById("totalEntries").textContent = bookings.total;

	// Update pagination controls
	document.getElementById("currentPage").textContent = `Page ${page}`;

	const totalPages = Math.ceil(bookings.total / params.limit);
	updatePaginationControls(page, totalPages);
}
