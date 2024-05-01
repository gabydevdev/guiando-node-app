console.log(">> Test page");

// import { fetchDataFromAPI } from "@scripts/apiManager.js";

let apiURL = process.env.API_URL + "/api/bookings";
let params = {
	sortBy: "startDateTime",
};

// Function to fetch bookings data from API
async function fetchDataFromAPI(apiURL, params) {
	const query = new URLSearchParams(params).toString();

	apiURL = `${apiURL}?${query}`;
	console.log("apiURL: ", apiURL);

	const response = await fetch(apiURL);
	return await response.json();
}

// Function to populate the table with bookings data
async function populateTable(apiURL, params) {
	const bookings = await fetchDataFromAPI(apiURL, params);

	// Clear existing table rows
	const tableBody = document.querySelector("#bookingsTable tbody");
	tableBody.innerHTML = "";

	// Populate table with bookings data
	bookings.data.forEach((booking) => {
		const row = tableBody.insertRow();
		row.insertCell(0).textContent = booking.bookingId;
		row.insertCell(1).textContent = booking.activityBookings.startDateTime;
		row.insertCell(2).textContent = booking.creationDate;
		// Add more cells for other booking details as needed
	});

	// Update total entries caption
	document.getElementById("totalEntries").textContent = bookings.total;
}

// Populate the table when the page loads
populateTable(apiURL, params);
