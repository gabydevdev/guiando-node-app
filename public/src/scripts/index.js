console.log('>> main');

// Import all of Bootstrap's JS
import { Popover, Dropdown } from 'bootstrap';

// Create an example popover
document.querySelectorAll('[data-bs-toggle="popover"]').forEach((popover) => {
	new Popover(popover);
});

// Create an example dropdown
document
	.querySelectorAll('[data-bs-toggle="dropdown"]')
	.forEach((dropdownToggleEl) => {
		new Dropdown(dropdownToggleEl);
	});

import { Grid } from 'gridjs';

const grid = new Grid({
	columns: [
		'Booking Id',
		'Status',
		'Created on',
		'SKU',
		'Customer Name',
		'Customer Last Name',
		'Phone #',
		'Email',
		'Travel Date',
		'PAX',
		'Total Price',
	],
	data: [],
});

grid.render(document.getElementById('bookingLogs'));
