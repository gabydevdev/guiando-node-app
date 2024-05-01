// apiManager.js
export async function fetchDataFromAPI(apiURL, params) {
	const query = new URLSearchParams(params).toString();

	apiURL = `${apiURL}?${query}`;
	console.log("apiURL: ", apiURL);

	const fetchedData = await fetch(apiURL)
		.then((response) => response.json())
		.then((result) => {
			let dataSet = result.data.map((item) => {
				const bookingId = item.bookingId;
				const status = item.status;
				const creationDate = item.creationDate;
				const totalPrice = item.totalPrice;

				const dataArray = {
					status: status,
					bookingId: bookingId,
					creationDate: creationDate,
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

// Cleaning function for JSON
// function cleanData(string) {
// 	const formattedData = JSON.parse(
// 		string
// 			.replace(/'/g, '"')
// 			.replace(/False/g, "false")
// 			.replace(/True/g, "true")
// 			.replace(/None/g, "null")
// 			.replace(
// 				/(?<=[A-Za-z0-9])"(?=[A-Za-z0-9])/g,
// 				"SINGLE_QUOTE_STANDBY"
// 			)
// 			.replace(/\\x/g, "")
// 			.replace(/="/g, "=&quot;")
// 			.replace(/;"/g, ";&quot;")
// 			.replace(/">/g, "&quot;&gt;")
// 			.replace(/SINGLE_QUOTE_STANDBY/g, "'")
// 	);

// 	return formattedData;
// }
