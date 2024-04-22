// dataTableSetup.js
import $ from 'jquery';
import 'datatables.net-dt';
import { fetchDataFromAPI } from './apiManager';

export function setupDataTable(selector) {
	$(selector).DataTable({
		processing: true,
		serverSide: true,
		ajax: async function (data, callback) {
			const params = {
				start: data.start,
				length: data.length,
				draw: data.draw,
			};
			const result = await fetchDataFromAPI(params);
			callback(result);
			console.log('result: ', result);
		},
		columns: [
			{ data: 'status', title: 'Status' },
			{ data: 'bookingId', title: 'Booking Id' },
			{ data: 'creationDate', title: 'Created On' },
			{ data: 'externalId', title: 'External ID' },
			{ data: 'dateString', title: 'Travel Date' },
			{ data: 'totalParticipants', title: 'Participants' },
			{ data: 'totalPrice', title: 'Total Price' },
		],
		paging: true,
		ordering: false,
		searching: false,
	});
}
