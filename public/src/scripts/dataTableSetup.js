// dataTableSetup.js
import DataTable from 'datatables.net-dt';

export function setupDataTable(selector, dataSet) {
	new DataTable(selector, {
		paging: true,
		ordering: true,
		searching: true,
		columns: [
			{ title: 'Status' },
			{ title: 'Booking Id' },
			{ title: 'Created On' },
			{ title: 'External ID' },
			{ title: 'Travel Date' },
			{ title: 'Participants' },
			{ title: 'Total Price' },
		],
		data: dataSet,
	});
}
