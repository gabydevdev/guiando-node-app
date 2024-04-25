// request.js
import { fetchDataFromAPI } from '@scripts/apiManager.js';

let apiURL = process.env.API_URL + '/api/bookings';

let params = {
	start: 0,
	length: 20,
};

document.addEventListener('DOMContentLoaded', async function () {
	// Assuming `selectedBookings` is an array of booking IDs stored in localStorage or passed in some other way
	const bookings = JSON.parse(localStorage.getItem('selectedBookings'));

	if (!bookings || bookings.length === 0) {
		let fetchData = await fetchDataFromAPI(apiURL, params);
		fetchData.map(item => item.bookingId);
		updateBookingsDisplay(fetchData);
		// populateTourGuides();
	} else {
		// Display selected bookings
		updateBookingsDisplay(bookings);
		// populateTourGuides();
	}
});

function updateBookingsDisplay(bookings) {
	const select = document.getElementById('selectedBookings');
	bookings.forEach(item => {
		const option = document.createElement('option');
		option.textContent = item.bookingId;
		option.value = item.bookingId;
		select.appendChild(option);
	});
	document.getElementById('selectedBookings').value = bookings.join(', ');
}

function populateTourGuides() {
	const headers = new Headers();
	headers.append('Content-Type', 'application/json');

	const dataReq = new Request('./guias.json', {
		method: 'GET',
		mode: 'no-cors',
		headers: headers,
		destination: 'json',
		credentials: 'omit',
	});

	console.log('dataReq: ', dataReq);

	fetch(dataReq)
		.then((res) => {
			console.log('res: ', res);

			if (!res.ok) {
				throw new Error (`HTTP error! Status: ${res.status}`);
			}
			return res.json();
		})
		.then(data => {
			console.log('data: ', data);

			const select = document.getElementById('tourGuide');
			data.forEach(person => {
				const option = document.createElement('option');
				option.textContent = `${person.firstName} ${person.lastName}`;
				option.value = person.userId;
				select.appendChild(option);
			});
		})
		.catch((error) => {
			console.error(
				'There was a problem with your fetch operation:',
				error
			);
		});
}

populateTourGuides();
