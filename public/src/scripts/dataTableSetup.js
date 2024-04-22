// dataTableSetup.js
import $ from 'jquery';
import DataTable from 'datatables.net-dt';
import { fetchDataFromAPI } from './apiManager';

export function setupDataTable(selector) {
	$(selector).DataTable({
		processing: true,
		serverSide: true,
		ajax: async function (data, callback, settings) {
			const params = {
				limit: data.length,
				page: data.start / data.length + 1,
				sortCol: data.columns[data.order[0].column].data,
				sortDir: data.order[0].dir,
			};
			const result = await fetchDataFromAPI(params);
			callback({
				draw: data.draw,
				recordsTotal: result.total,
				recordsFiltered: result.total,
				data: result.data,
			});
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
		ordering: true,
		searching: false,
	});
}
