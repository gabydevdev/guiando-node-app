const express = require("express");
const fs = require("fs");
const path = require("path");
require("dotenv").config();
const app = express();

const cors = require("cors");
app.use(cors());

const baseUrlPath = process.env.BASE_URL_PATH || "";
const port = process.env.PORT || 3000;

if (baseUrlPath) {
	app.use(baseUrlPath, express.static(path.join(__dirname, "public")));
} else {
	app.use("/", express.static(path.join(__dirname, "public")));
}

app.use(express.json());

const bookingsDataLogs = path.join(__dirname, "booking_data");

app.get(`${baseUrlPath}/api/bookings`, (req, res) => {
	const page = parseInt(req.query.page) || 1;
	const limit = parseInt(req.query.limit) || 12;
	const sortBy = req.query.sortBy || "creationDate"; // Default sort by creationDate
	const order = req.query.order || "desc"; // Default sort order

	// const start = parseInt(req.query.start) || 0;
	// const length = parseInt(req.query.length) || 10;

	fs.readdir(bookingsDataLogs, (err, files) => {
		if (err) {
			console.error("Could not list the directory.", err);
			res.status(500).send("Internal server error");
			return;
		}

		files.sort((a, b) => {
			return (
				fs.statSync(path.join(bookingsDataLogs, b)).mtime.getTime() -
				fs.statSync(path.join(bookingsDataLogs, a)).mtime.getTime()
			);
		});

		const bookings = [];

		files.forEach((file) => {
			const filePath = path.join(bookingsDataLogs, file);

			let fileData = fs.readFileSync(filePath);
			fileData = JSON.parse(fileData);

			const creationDate = new Date(parseInt(fileData.creationDate));
			fileData.creationDate = creationDate.toISOString();

			let activityBookings = fileData.activityBookings;
			activityBookings = cleanData(activityBookings);
			activityBookings = activityBookings[0];
			fileData.activityBookings = activityBookings;

			let externalId = fileData.activityBookings.product.externalId;
			fileData.externalId = externalId;

			let invoiceDates = fileData.activityBookings.invoice.dates;
			invoiceDates = invoiceDates.replace(/ - /g, ", ");
			fileData.activityBookings.invoice.dates = new Date(
				invoiceDates
			).toISOString();

			let customerPayments = fileData.customerPayments;
			customerPayments = cleanData(customerPayments);
			customerPayments = customerPayments[0];
			fileData.customerPayments = customerPayments;

			let productInvoices = fileData.invoice.productInvoices;
			productInvoices = cleanData(productInvoices);
			productInvoices = productInvoices[0];
			fileData.invoice.productInvoices = productInvoices;

			bookings.push(fileData);
		});

		if (sortBy === "startDateTime") {
			bookings.sort((a, b) => {
				const dateA = new Date(a.activityBookings.startDateTime);
				const dateB = new Date(b.activityBookings.startDateTime);
				if (order === "asc") {
					return dateA - dateB;
				} else {
					return dateB - dateA;
				}
			});
		} else {
			bookings.sort((a, b) => {
				if (order === "asc") {
					return a[sortBy] > b[sortBy] ? 1 : -1;
				} else {
					return a[sortBy] < b[sortBy] ? 1 : -1;
				}
			});
		}

		const today = new Date();

		const results = bookings.filter((booking) => {
			const startDateTime = new Date(
				booking.activityBookings.startDateTime
			);
			return startDateTime >= today;
		});

		const startIndex = (page - 1) * limit;
		const endIndex = startIndex + limit;

		const result = {
			total: results.length,
			nextPage: endIndex < results.length ? page + 1 : null,
			prevPage: page > 1 ? page - 1 : null,
			data: results.slice(startIndex, endIndex),
		};

		res.json(result);
	});
});

app.get(`${baseUrlPath}/api/booking/single`, (req, res) => {
	const bookingIdQuery = req.query.bookingId;
	if (!bookingIdQuery) {
		return res.status(400).json({ message: "Booking ID required" });
	}

	fs.readdir(bookingsDataLogs, (err, files) => {
		if (err) {
			console.error("Could not list the directory.", err);
			res.status(500).send("Internal server error");
			return;
		}

		let single = [];
		files.forEach((file) => {
			const filePath = path.join(bookingsDataLogs, file);
			const fileData = JSON.parse(fs.readFileSync(filePath));

			if (fileData.bookingId === bookingIdQuery) {
				// const creationDate = new Date(parseInt(fileData.creationDate));
				// fileData.creationDate = creationDate.toISOString();

				let activityBookings = fileData.activityBookings;
				activityBookings = cleanData(activityBookings);
				activityBookings = activityBookings[0];
				fileData.activityBookings = activityBookings;

				let invoiceDates = fileData.activityBookings.invoice.dates;
				invoiceDates = invoiceDates.replace(/ - /g, ", ");
				// invoiceDates = Date.parse(invoiceDates);
				fileData.activityBookings.invoice.dates = new Date(
					invoiceDates
				).toISOString();

				// const startDateTime = new Date(
				// 	fileData.activityBookings.startDateTime
				// );
				// fileData.activityBookings.startDateTime =
				// 	startDateTime.toISOString();

				// const endDateTime = new Date(
				// 	fileData.activityBookings.endDateTime
				// );
				// fileData.activityBookings.endDateTime =
				// 	endDateTime.toISOString();

				let customerPayments = fileData.customerPayments;
				customerPayments = cleanData(customerPayments);
				customerPayments = customerPayments[0];
				fileData.customerPayments = customerPayments;

				let productInvoices = fileData.invoice.productInvoices;
				productInvoices = cleanData(productInvoices);
				productInvoices = productInvoices[0];
				fileData.invoice.productInvoices = productInvoices;

				single.push(fileData);
			}
		});

		res.json(single);
	});
});

// WEBHOOKS ---------------------------------------
app.get(`${baseUrlPath}/zapier`, (req, res) => {
	res.status(200).send("GET request to the /zapier endpoint");
});

app.post(`${baseUrlPath}/zapier`, (req, res) => {
	const bookingId = req.body.bookingId;
	const logsDir = path.join(__dirname, "booking_data");

	if (!fs.existsSync(logsDir)) {
		fs.mkdirSync(logsDir, { recursive: true });
	}

	const filePath = path.join(logsDir, `${bookingId}.json`);

	fs.writeFile(filePath, JSON.stringify(req.body, null, 2), (err) => {
		if (err) {
			console.error("Error writing file:", err);
			return res.status(500).send("Error processing request");
		}

		res.status(200).send(
			`File for booking ID ${bookingId} ${
				fs.existsSync(filePath) ? "updated" : "created"
			} in the booking_data folder.`
		);
	});
});

// START TEST ENDPOINTS ---------------------------
app.get(`${baseUrlPath}/test`, (req, res) => {
	res.status(200).send("GET request to the /test endpoint");
});

app.post(`${baseUrlPath}/test`, (req, res) => {
	const bookingId = req.body.bookingId;
	const logsDir = path.join(__dirname, "booking_test_logs");

	if (!fs.existsSync(logsDir)) {
		fs.mkdirSync(logsDir, { recursive: true });
	}

	const filePath = path.join(logsDir, `${bookingId}.json`);

	fs.writeFile(filePath, JSON.stringify(req.body, null, 2), (err) => {
		if (err) {
			console.error("Error writing file:", err);
			return res.status(500).send("Error processing request");
		}

		res.status(200).send(
			`File for booking ID ${bookingId} ${
				fs.existsSync(filePath) ? "updated" : "created"
			} in the booking_test_logs folder.`
		);
	});
});
// ------------------------------------------------

// Cleaning function for JSON
function cleanData(string) {
	const formattedData = JSON.parse(
		string
			.replace(/'/g, '"')
			.replace(/False/g, "false")
			.replace(/True/g, "true")
			.replace(/None/g, "null")
			.replace(
				/(?<=[A-Za-z0-9])"(?=[A-Za-z0-9])/g,
				"SINGLE_QUOTE_STANDBY"
			)
			.replace(/\\x/g, "")
			.replace(/="/g, "=&quot;")
			.replace(/;"/g, ";&quot;")
			.replace(/">/g, "&quot;&gt;")
			.replace(/SINGLE_QUOTE_STANDBY/g, "'")
	);

	return formattedData;
}

app.listen(port, () => console.log(`Application is running on port ${port}`));
