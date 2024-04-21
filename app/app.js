const express = require("express");
const fs = require("fs");
const path = require("path");

require("dotenv").config();

const app = express();

const baseUrlPath = process.env.BASE_URL_PATH || "";
const port = process.env.PORT || 3000;

if (baseUrlPath) {
	app.use(baseUrlPath, express.static(path.join(__dirname, "public")));
} else {
	app.use("/", express.static(path.join(__dirname, "public")));
}

app.use(express.json());

// Set the base directory for booking data
const bookingLogs = path.join(__dirname, "booking_data");

/**
 * GET /api/bookings - Fetch multiple bookings with pagination.
 * URL Parameters: None
 * Query Parameters:
 *   - page (optional): The page number of the bookings to retrieve (default is 1).
 *   - limit (optional): The number of bookings to retrieve per page (default is 5).
 * Request Body: None
 * Response:
 *   - 200 OK: Returns an object containing an array of bookings, total count, and pagination details.
 *   - 500 Internal Server Error: Server error or directory cannot be accessed.
 * Errors:
 *   - If the server encounters a problem reading the directory, returns a 500 error.
 */
app.get(`${baseUrlPath}/api/bookings`, (req, res) => {
	// Parse query parameters for pagination
	const page = parseInt(req.query.page) || 1;
	const limit = parseInt(req.query.limit) || 5;

	// Read directory contents
	fs.readdir(bookingLogs, (err, files) => {
		if (err) {
			// Log error and send 500 response if directory cannot be accessed
			console.error("Could not list the directory.", err);
			res.status(500).send("Internal server error");
			return;
		}

		// Sort files by modification time to ensure the latest are considered first
		files.sort((a, b) => {
			return fs.statSync(path.join(bookingLogs, b)).mtime.getTime() - fs.statSync(path.join(bookingLogs, a)).mtime.getTime();
		});

		// Calculate pagination boundaries
		const startIndex = (page - 1) * limit;
		const endIndex = Math.min(startIndex + limit, files.length);

		// Initialize array to hold booking data
		const bookings = [];

		// Loop through files within the current pagination slice
		for (let i = startIndex; i < endIndex; i++) {
			const filePath = path.join(bookingLogs, files[i]);
			const fileContents = fs.readFileSync(filePath, "utf8");
			bookings.push(JSON.parse(fileContents));
		}

		// Construct response object with pagination info and data
		const result = {
			total: files.length,
			nextPage: endIndex < files.length ? page + 1 : null,
			prevPage: page > 1 ? page - 1 : null,
			data: bookings,
		};

		// Send response with booking data
		res.json(result);
	});
});

/**
 * GET /api/single - Fetch a single booking by booking ID.
 * URL Parameters: None
 * Query Parameters:
 *   - bookingId (required): The unique identifier of the booking to retrieve.
 * Request Body: None
 * Response:
 *   - 200 OK: Returns a JSON object containing the booking details.
 *   - 400 Bad Request: Booking ID not provided in the query.
 *   - 500 Internal Server Error: Server error or directory cannot be accessed.
 * Errors:
 *   - If no bookingId is provided, returns a 400 error with a message prompting for the booking ID.
 *   - If the server encounters a problem reading the directory, returns a 500 error.
 */
app.get(`${baseUrlPath}/api/single`, (req, res) => {
	// Retrieve the bookingId from query parameters
	const bookingIdQuery = req.query.bookingId;

	// Return an error response if bookingId is not provided
	if (!bookingIdQuery) {
		return res.status(400).json({ message: "Booking ID required" });
	}

	// Read the booking_data directory
	fs.readdir(bookingLogs, (err, files) => {
		if (err) {
			console.error("Could not list the directory.", err);
			res.status(500).send("Internal server error");
			return;
		}

		let single = [];

		// Iterate through each file in the directory
		files.forEach((file) => {
			const filePath = path.join(bookingLogs, file);
			const bookingData = JSON.parse(fs.readFileSync(filePath, "utf8"));

			// Add the booking to the response if it matches the bookingIdQuery
			if (bookingData.bookingId === bookingIdQuery) {
				single.push(bookingData);
			}
		});

		// Send the matched booking data or an empty array if no match is found
		res.json(single);
	});
});

/**
 * POST /bookings - Save or update a booking based on the provided booking ID.
 * URL Parameters: None
 * Query Parameters: None
 * Request Body:
 *   - bookingId (required): The ID of the booking to create or update.
 *   - Other relevant booking details that will be included in the JSON payload.
 * Response:
 *   - 200 OK: Indicates whether the booking file was created or updated.
 *   - 500 Internal Server Error: Error in writing the file or server error.
 * Errors:
 *   - If there is an error writing the file, a 500 error is returned with a message detailing the issue.
 */
app.post(`${baseUrlPath}/bookings`, (req, res) => {
	const bookingId = req.body.bookingId;

	// Check for bookingId in the request body
	if (!bookingId) {
		return res.status(400).send("Booking ID is required");
	}

	const filePath = path.join(bookingLogs, `${bookingId}.json`);

	// Write the booking data to the specified file, creating or updating it
	fs.writeFile(filePath, JSON.stringify(req.body, null, 2), (err) => {
		if (err) {
			console.error("Error writing file:", err);
			return res.status(500).send("Error processing request");
		}

		// Respond indicating the action taken on the file
		res.status(200).send(`File for booking ID ${bookingId} ${fs.existsSync(filePath) ? "updated" : "created"} in the booking_logs folder.`);
	});
});

/**
 * GET /bookings - Endpoint for testing server responsiveness.
 * URL Parameters: None
 * Query Parameters: None
 * Request Body: None
 * Response:
 *   - 200 OK: Sends a simple text response confirming the successful GET request.
 * Errors:
 *   - This endpoint is primarily for testing and generally should not error out under normal circumstances.
 */
app.get(`${baseUrlPath}/bookings`, (req, res) => {
	res.status(200).send("GET request to the /bookings endpoint");
});

// Start server
app.listen(port, () => console.log(`Application is running on port ${port}`));
