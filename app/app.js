// Import the necessary Node.js modules
const express = require("express"); // Handles HTTP requests
const fs = require("fs"); // Performs file system operations
const path = require("path"); // Manages file and directory paths
require("dotenv").config(); // Loads environment variables from a .env file into process.env
const mysql = require("mysql2/promise"); // For interacting with MySQL database using Promises

// Create an Express application instance
const app = express();

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Middleware to parse JSON bodies in incoming requests
app.use(express.json());

// Retrieve the base URL path and port from environment variables or use defaults
const baseUrlPath = process.env.BASE_URL_PATH || "";
const port = process.env.PORT || 3000;

// Create a MySQL connection pool with configuration from environment variables
// This improves performance and reliability of database operations
const pool = mysql.createPool({
	connectionLimit: 10, // Maximum number of connections in the pool
	host: process.env.DB_HOST, // MySQL server address
	user: process.env.DB_USER, // MySQL user
	password: process.env.DB_PASSWORD, // MySQL password
	database: process.env.DB_NAME // Database name
});

/**
 * GET endpoint for testing server responsiveness.
 * This endpoint dynamically adjusts based on the BASE_URL_PATH environment variable.
 *
 * @return {Response} Sends a text response confirming the successful GET request.
 */
app.get(`${baseUrlPath}/zapier`, (req, res) => {
	res.status(200).send("GET request to the zapier endpoint");
});

/**
 * POST endpoint to handle incoming JSON payloads with a "bookingId".
 * It saves or updates a JSON file named after the "bookingId" in the "booking_logs" directory.
 * The endpoint's path is dynamically adjusted based on the BASE_URL_PATH environment variable.
 *
 * @param {Object} req.body - The JSON payload of the request, expected to contain "bookingId".
 * @return {Response} Indicates whether the corresponding file was created or updated.
 */
app.post(`${baseUrlPath}/zapier`, (req, res) => {

	// const bookingId = req.body.bookingId; // Extracts the booking ID from the request body

	const { bookingId, productBookings } = req.body; // Destructure required fields from request body

	// Validate the presence of bookingId and productBookings in the request
	if (!bookingId || !productBookings) {
		return res.status(400).send("Booking ID or productBookings not found in the request");
	}

	// Correct the JSON format by replacing single quotes with double quotes
	const correctedJsonString = productBookings.replace(/'/g, '"');
	let bookingsData;
	try {
		bookingsData = JSON.parse(correctedJsonString);
	} catch (error) {
		return res.status(500).send("Error parsing productBookings JSON");
	}

	// Extract status and tour information from the first booking in productBookings
	const status = bookingsData[0]?.status;
	const tourId = bookingsData[0]?.product?.id;

	// Ensure required data is available
	if (!status || !tourId) {
		return res.status(400).send("Required booking information is missing");
	}

	// Try-catch block to handle database operations safely
	// try {
	// 	// Insert a new booking or update an existing one using the bookingId
	// 	// The `ON DUPLICATE KEY UPDATE` clause handles the case where a bookingId already exists
	// 	const [rows] = await pool.query(
	// 		`INSERT INTO bookings (bookingId, status, tourId)
	// 		 VALUES (?, ?, ?)
	// 		 ON DUPLICATE KEY UPDATE status = VALUES(status), tour = VALUES(tour)`,
	// 		[bookingId, status, tourId]
	// 	);

	// 	// Send a response indicating the booking was successfully created or updated
	// 	res.status(200).send(`Booking ID ${bookingId} ${rows.affectedRows === 1 ? "created" : "updated"} in the database.`);
	// } catch (err) {
	// 	// Log the error and send a 500 Internal Server Error response if database operation fails
	// 	console.error("Database operation failed:", err);
	// 	res.status(500).send("Error processing request");
	// }

	// Defines the path to the directory where booking logs will be stored
	const logsDir = path.join(__dirname, "booking_logs");

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
		res.status(200).send(
			`File for booking ID ${bookingId} ${
				fs.existsSync(filePath) ? "updated" : "created"
			} in the booking_logs folder.`,
		);
	});
});



app.get(`${baseUrlPath}/test`, (req, res) => {
	res.status(200).send("GET request to the /test endpoint");
});

app.post(`${baseUrlPath}/test`, (req, res) => {
    res.status(200).send(req.body);
});


// Starts the server on the configured port and logs a startup message
app.listen(port, () => console.log(`Application is running on port ${port}`));
