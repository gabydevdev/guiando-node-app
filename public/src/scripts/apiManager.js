// apiManager.js
export async function fetchDataFromAPI(apiURL, params) {
	const query = new URLSearchParams(params).toString();

	apiURL = `${apiURL}?${query}`;
	console.log("apiURL: ", apiURL);

	const fetchedData = await fetch(apiURL)
		.then((response) => response.json())
		.then((result) => {
			const dataSet = result.data.map((item) => {
				const bookingId = item.bookingId;
				const status = item.status;
				const creationDate = item.creationDate;
				const totalPrice = item.totalPrice;
				const dateString = item.activityBookings[0].dateString;
				const totalParticipants =
					item.activityBookings[0].totalParticipants;
				const activity = item.activityBookings[0].activity;
				const externalId = activity.externalId;

				const dataArray = {
					status: status,
					bookingId: bookingId,
					creationDate: creationDate,
					externalId: externalId,
					dateString: dateString,
					totalParticipants: totalParticipants,
					totalPrice: totalPrice,
				};

				// console.log('dataArray: ', dataArray);

				return dataArray;
			});

			// console.log('dataSet: ', dataSet);
			return dataSet;
		})
		.catch((error) => {
			console.error(
				"There was a problem with your fetch operation:",
				error
			);
		});

	return fetchedData;
}
