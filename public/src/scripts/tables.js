// tables.js
export async function createTableWithData(element, jsonData) {
	const tbody = element.lastElementChild;
	const result = jsonData;

	result.forEach((item) => {
		const row = document.createElement('tr');
		tbody.appendChild(row);

		Object.entries(item).forEach(([key, value]) => {
			// Formatting the value if it's a date
			if (key === 'createdOn' || key === 'travelDate') {
				value = new Date(value).toLocaleDateString();
			}

			// Formatting the value if it's currency
			if (key === 'totalPrice') {
				value = new Intl.NumberFormat().format(value);
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
