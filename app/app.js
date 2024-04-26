// Import the necessary Node.js modules
const express = require("express"); // Handles HTTP requests
const fs = require("fs"); // Performs file system operations
const path = require("path"); // Manages file and directory paths
require("dotenv").config(); // Loads environment variables from a .env file into process.env

// Create an Express application instance
const app = express();

// This will enable CORS for all routes and origins
const cors = require("cors");
app.use(cors());

// Retrieve the base URL path and port from environment variables or use defaults
const baseUrlPath = process.env.BASE_URL_PATH || "";
const port = process.env.PORT || 3000;

// Serve static files from the 'public' directory
if (baseUrlPath) {
	app.use(baseUrlPath, express.static(path.join(__dirname, "public")));
} else {
	app.use("/", express.static(path.join(__dirname, "public")));
}

// Middleware to parse JSON bodies in incoming requests
app.use(express.json());

// Defines the path to the directory where booking logs will be stored
const bookingsDataLogs = path.join(__dirname, "booking_data");

app.get(`${baseUrlPath}/api/bookings`, (req, res) => {
	// Get query parameters
	const start = parseInt(req.query.start) || 0;
	const length = parseInt(req.query.length) || 10;

	fs.readdir(bookingsDataLogs, (err, files) => {
		if (err) {
			console.error("Could not list the directory.", err);
			res.status(500).send("Internal server error");
			return;
		}

		// Sort files by last modified time, descending
		files.sort((a, b) => {
			return fs.statSync(path.join(bookingsDataLogs, b)).mtime.getTime() - fs.statSync(path.join(bookingsDataLogs, a)).mtime.getTime();
		});

		const endIndex = start + length;

		const bookings = [];
		files.slice(start, endIndex).forEach((file) => {
			const filePath = path.join(bookingsDataLogs, file);

			let fileData = fs.readFileSync(filePath);
			fileData = JSON.parse(fileData);

			/* START clean and format functions */

			// clean activitiBookings
			let activityBookings = fileData.activityBookings;
			delete fileData.activityBookings;
			activityBookings = cleanData(activityBookings);
			fileData.activityBookings = activityBookings;

			// clean dateString
			let dateString = fileData.activityBookings[0].dateString;
			delete fileData.activityBookings[0].dateString;
			dateString = dateString.replace(/ - /g, " ");
			dateString = new Date(dateString);
			fileData.activityBookings[0].dateString = dateString.toISOString();

			// format creationDate
			let creationDate = fileData.creationDate;
			delete fileData.creationDate;
			creationDate = new Date(parseInt(creationDate));
			fileData.creationDate = creationDate;

			// clean porductInvoices
			let productInvoices = fileData.invoice.productInvoices;
			delete fileData.invoice.productInvoices;
			productInvoices = cleanData(productInvoices);
			fileData.invoice.productInvoices = productInvoices;

			/* END clean and format functions */

			bookings.push(fileData);
		});

		const result = {
			draw: parseInt(req.query.draw),
			recordsTotal: files.length,
			recordsFiltered: files.length,
			data: bookings,
		};

		res.json(result);
	});
});

app.get(`${baseUrlPath}/api/bookings/single`, (req, res) => {
	const bookingIdQuery = req.query.bookingId; // Retrieve the bookingId from query parameters

	if (!bookingIdQuery) {
		// Respond with an error or empty array if no bookingId is specified
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
			const bookingData = JSON.parse(fs.readFileSync(filePath, "utf8"));

			if (!bookingIdQuery || bookingData.bookingId === bookingIdQuery) {
				single.push(bookingData);
			}
		});

		// Optionally, sort and paginate results here if necessary
		res.json(single);
	});
});

/**
 * GET endpoint for testing server responsiveness
 *
 * This endpoint dynamically adjusts based on the BASE_URL_PATH environment variable.
 *
 * @return {Response} Sends a text response confirming the successful GET request
 */
app.get(`${baseUrlPath}/zapier`, (req, res) => {
	res.status(200).send("GET request to the /zapier endpoint");
});

/**
 * POST endpoint to handle incoming JSON payloads with a "bookingId"
 *
 * It saves or updates a JSON file named after the "bookingId" in the "booking_logs" directory.
 * The endpoint's path is dynamically adjusted based on the BASE_URL_PATH environment variable.
 *
 * @param {Object} req.body - JSON payload of the request
 * @return {Response} A file was created or updated
 */
app.post(`${baseUrlPath}/zapier`, (req, res) => {
	// Extracts the bookingId from the request body
	const bookingId = req.body.bookingId;

	// Defines the path to the directory where booking logs will be stored
	const logsDir = path.join(__dirname, "booking_data");

	// Ensures the existence of the 'booking_logs' directory, creating it if necessary
	if (!fs.existsSync(logsDir)) {
		fs.mkdirSync(logsDir, { recursive: true });
	}

	// Constructs the full path for the new or existing file
	const filePath = path.join(logsDir, `${bookingId}.json`);

	// Writes the JSON payload to the file, creating or overwriting it as needed
	fs.writeFile(filePath, JSON.stringify(req.body, null, 2), (err) => {
		if (err) {
			console.error("Error writing file:", err);
			return res.status(500).send("Error processing request");
		}

		// Responds to indicate the action taken on the file
		res.status(200).send(`File for booking ID ${bookingId} ${fs.existsSync(filePath) ? "updated" : "created"} in the booking_data folder.`);
	});
});

function cleanData(string) {
	const formattedData = JSON.parse(
		string
			.replace(/'/g, '"')
			.replace(/False/g, "false")
			.replace(/True/g, "true")
			.replace(/None/g, "null")
			.replace(/(?<=[A-Za-z0-9])"(?=[A-Za-z0-9])/g, "SINGLE_QUOTE_STANDBY")
			.replace(/\\x/g, "")
			.replace(/="/g, "=&quot;")
			.replace(/;"/g, ";&quot;")
			.replace(/">/g, "&quot;&gt;")
			.replace(/SINGLE_QUOTE_STANDBY/g, "'")
	);

	return formattedData;
}

// Starts the server on the configured port and logs a startup message
app.listen(port, () => console.log(`Application is running on port ${port}`));
