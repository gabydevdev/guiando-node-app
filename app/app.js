// Import the necessary Node.js modules
const express = require("express"); // For handling HTTP requests
const fs = require("fs"); // For file system operations
const path = require("path"); // For working with file and directory paths

// Create an instance of the express application
const app = express();

// Serve static files from the 'public' directory
// Add this line to allow your Express app to serve your front-end files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, "public")));

// Use express.json() middleware to parse JSON bodies in incoming requests
app.use(express.json());

/**
 * GET endpoint for the '/test' route.
 * Used primarily for testing connectivity and server responsiveness.
 *
 * @return {Response} - Sends a simple text response indicating the GET request was successful.
 */
app.get("/test", (req, res) => {
	res.status(200).send("GET request to /test");
});

/**
 * POST endpoint for the '/test' route.
 * Processes incoming JSON payloads, specifically looking for a "bookingId".
 * If the "bookingId" is present, the entire payload is saved to a JSON file named after the bookingId.
 * If a file with the same bookingId already exists, it will be overwritten with the new data.
 *
 * @param {Object} req.body - The JSON payload of the request.
 * @return {Response} - Sends a response indicating whether the file was created or updated.
 */
app.post("/test", (req, res) => {
	const bookingId = req.body.bookingId; // Extract the booking ID from the request body

	// Validate that the bookingId was provided in the request
	if (!bookingId) {
		return res.status(400).send("Booking ID not found in the request");
	}

	// Define the directory path for storing booking logs
	const logsDir = path.join(__dirname, "booking_logs");

	// Check if the 'booking_logs' directory exists, create it if it doesn't
	if (!fs.existsSync(logsDir)) {
		fs.mkdirSync(logsDir, { recursive: true }); // The 'recursive: true' option creates the directory if it does not exist
	}

	// Construct the file path where the booking data will be saved
	const filePath = path.join(logsDir, `${bookingId}.json`);

	// Write (or overwrite) the JSON payload to a file named after the bookingId
	fs.writeFile(filePath, JSON.stringify(req.body, null, 2), (err) => {
		if (err) {
			console.error("Error writing file:", err);
			return res.status(500).send("Error processing request");
		}
		// Send a response indicating whether the file was created or updated
		res.status(200).send(`File for booking ID ${bookingId} ${fs.existsSync(filePath) ? "updated" : "created"} in the booking_logs folder.`);
	});
});

// Start the server on port 3000 and log a message to the console
app.listen(3000, () => console.log("Server running on port 3000"));
