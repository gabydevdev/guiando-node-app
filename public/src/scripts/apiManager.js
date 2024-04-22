// apiManager.js
function cleanData(item) {
	const cleanedActivityBookings = JSON.parse(
		item.activityBookings
			.replace(/'/g, '"')
			.replace(/False/g, 'false')
			.replace(/True/g, 'true')
			.replace(/None/g, 'null')
			.replace(
				/(?<=[A-Za-z0-9])"(?=[A-Za-z0-9])/g,
				'SINGLE_QUOTE_STANDBY'
			)
			.replace(/\\x/g, '')
			.replace(/="/g, '=&quot;')
			.replace(/;"/g, ';&quot;')
			.replace(/">/g, '&quot;&gt;')
			.replace(/SINGLE_QUOTE_STANDBY/g, "'")
	);

	return cleanedActivityBookings[0];
}

export async function fetchDataFromAPI(params) {
	const query = new URLSearchParams(params).toString();
	const apiUrl = `http://localhost:3000/api/test?${query}`;

	console.log(apiUrl);

	try {
		const response = await fetch(apiUrl);
		const result = await response.json();
		return result.data.map((item) => {
			const activityBookings = cleanData(item);
			return {
				"status": item.status,
				"bookingId": item.bookingId,
				"creationDate": item.creationDate,
				"externalId": activityBookings.activity.externalId,
				"dateString": activityBookings.dateString,
				"totalParticipants": activityBookings.totalParticipants,
				"totalPrice": item.totalPrice,
			};
		});
	} catch (error) {
		console.error('There was a problem with your fetch operation:', error);
	}
}
