// home.js
console.log('>> Home page');

import { setupDataTable } from '@scripts/dataTables';

document.addEventListener('tableComplete', async function () {
	doSomething();
});

function doSomething() {
	console.log('tableComplete event!');

	var table = setupDataTable();
	console.log('table: ', table);
}
