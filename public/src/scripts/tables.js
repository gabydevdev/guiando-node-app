import { fetchDataFromAPI } from './apiManager';

export async function createTableWithData(selector) {
	const table = document.getElementById(selector);
	const tbody = table.getElementsByTagName('tbody');

	console.log(table); // currently shows as null
	console.log(tbody); // currently shows as null

	const params = {
		limit: 10,
		page: 1,
	};

	const result = await fetchDataFromAPI(params); // It doesn't seem to be loading the data

	console.log(result);

	result.forEach((item) => {
		const row = document.createElement('tr');
		tbody.appendChild(row);

		Object.entries(item).forEach(([key, value]) => {
			// Formatting the value if it's a date
			if (key === 'createdOn' || key === 'travelDate') {
				value = new Date(value).toLocaleDateString();
			}
			addCell(row, value);
		});
	});
}

function addCell(row, text) {
	const cell = document.createElement('td');
	cell.textContent = text;
	row.appendChild(cell);
}
