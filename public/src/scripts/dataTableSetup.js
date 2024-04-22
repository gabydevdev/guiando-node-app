// dataTableSetup.js
import $ from 'jquery';
import DataTable from 'datatables.net-dt';
import { fetchDataFromAPI } from './apiManager';

export function setupDataTable(selector) {
	var table = new DataTable(selector, {
		processing: true,
		serverSide: true,
		ajax: function (data, callback) {
			const params = {
				start: data.start,
				length: data.length,
				draw: data.draw,
			};
			const result = fetchDataFromAPI(params);
			callback(result);
			console.log('result: ', result);
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
		'There are' + table.data().length + ' row(s) of data in this table'
	);

	console.log(table.state());
}
