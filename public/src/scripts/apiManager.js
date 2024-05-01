// apiManager.js

// Function to fetch bookings data from API
export async function fetchDataFromAPI(apiURL, params) {
	const query = new URLSearchParams(params).toString();

	const url = `${apiURL}?${query}`;
	console.log("url: ", url);

	const response = await fetch(url);
	if (!response.ok) {
		throw new Error("Failed to fetch bookings data");
	}
	return await response.json();
}
