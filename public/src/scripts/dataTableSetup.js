// dataTableSetup.js
import DataTable from 'datatables.net-dt';
import { fetchDataFromAPI } from './apiManager';

let tableInstance;

export function setupDataTable(selector) {
	tableInstance = new DataTable(selector, {
		processing: true,
		serverSide: true,
		ajax: async function (data, callback) {
			const params = {
				start: data.start,
				length: data.length,
				draw: data.draw,
			};
			try {
				const result = await fetchDataFromAPI(params);
				callback({
					draw: data.draw,
					recordsTotal: result.recordsTotal,
					recordsFiltered: result.recordsFiltered,
					data: result.data,
				});
				console.log(result);
			} catch (error) {
				console.error('DataTables ajax error:', error);
			}
		},
		columns: [
			{ data: 'status' },
			{ data: 'bookingId' },
			{ data: 'creationDate' },
			{ data: 'externalId' },
			{ data: 'dateString' },
			{ data: 'totalParticipants' },
			{ data: 'totalPrice' },
		],
		paging: true,
		pageLength: 10,
		initComplete: function () {
			console.log('DataTables has finished its initialisation.');
		},
	});

	console.log(
		'There are' +
			tableInstance.data().length +
			' row(s) of data in this table'
	);

	console.log(tableInstance.state());
}

export function redrawTable() {
	if (tableInstance) {
		tableInstance.draw();
	}
}