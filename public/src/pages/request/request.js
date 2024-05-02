// request.js
document.addEventListener("DOMContentLoaded", async function () {
	const selectedBookings =
		JSON.parse(localStorage.getItem("selectedBookings")) || [];

	const bookingTable = document.querySelector("#matrix_1 tbody");

	// Populate table with bookings data
	selectedBookings.forEach((booking, i) => {
		const bookingRow = bookingTable.rows[i];

		const externalId = booking.activityBookings.product.externalId;
		const customerName = `${booking.customer.firstName} ${booking.customer.lastName}`;
		const pax = booking.activityBookings.totalParticipants;
		const phoneNumber = booking.customer.phoneNumber;

		bookingRow.querySelector("[data-matrix-answer='Reference #']").value =
			externalId;
		bookingRow.querySelector("[data-matrix-answer='Traveler Name']").value =
			customerName;
		bookingRow.querySelector("[data-matrix-answer='# PAX']").value = pax;
		bookingRow.querySelector("[data-matrix-answer='Phone']").value =
			phoneNumber;
	});
});
