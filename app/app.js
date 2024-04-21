const express = require("express"); const fs = require("fs"); const path = require("path"); require("dotenv").config();
const app = express();

const baseUrlPath = process.env.BASE_URL_PATH || "";
const port = process.env.PORT || 3000;

if (baseUrlPath) {
	app.use(baseUrlPath, express.static(path.join(__dirname, "public")));
} else {
	app.use("/", express.static(path.join(__dirname, "public")));
}

app.use(express.json());

const bookingLogs = path.join(__dirname, "booking_data");

app.get(`${baseUrlPath}/api/single`, (req, res) => {
	const bookingIdQuery = req.query.bookingId;
	if (!bookingIdQuery) {
				return res.status(400).json({ message: "Booking ID required" });
	}

	fs.readdir(bookingLogs, (err, files) => {
		if (err) {
			console.error("Could not list the directory.", err);
			res.status(500).send("Internal server error");
			return;
		}

		let single = [];
		files.forEach((file) => {
			const filePath = path.join(bookingLogs, file);
			const bookingData = JSON.parse(fs.readFileSync(filePath, "utf8"));

			if (!bookingIdQuery || bookingData.bookingId === bookingIdQuery) {
				single.push(bookingData);
			}
		});

				res.json(single);
	});
});

app.get(`${baseUrlPath}/api/bookings`, (req, res) => {
	fs.readdir(bookingLogs, (err, files) => {
		if (err) {
			console.error("Could not list the directory.", err);
			res.status(500).send("Internal server error");
			return;
		}

				files.sort((a, b) => {
			return fs.statSync(path.join(bookingLogs, b)).mtime.getTime() - fs.statSync(path.join(bookingLogs, a)).mtime.getTime();
		});

				const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 5; 		const startIndex = (page - 1) * limit;
		const endIndex = startIndex + limit;

		const testLogs = [];
		files.slice(startIndex, endIndex).forEach((file) => {
			const filePath = path.join(bookingLogs, file);
			const testData = fs.readFileSync(filePath);
			testLogs.push(JSON.parse(testData));
		});

				const result = {
			total: files.length,
			nextPage: endIndex < files.length ? page + 1 : null,
			prevPage: page > 1 ? page - 1 : null,
			data: testLogs,
		};

		res.json(result);
	});
});


app.get(`${baseUrlPath}/bookings`, (req, res) => {
	res.status(200).send("GET request to the /bookings endpoint");
});


app.post(`${baseUrlPath}/bookings`, (req, res) => {
	const bookingId = req.body.bookingId;
		const logsDir = bookingLogs;

		if (!fs.existsSync(logsDir)) {
		fs.mkdirSync(logsDir, { recursive: true });
	}

		const filePath = path.join(logsDir, `${bookingId}.json`);

		fs.writeFile(filePath, JSON.stringify(req.body, null, 2), (err) => {
		if (err) {
			console.error("Error writing file:", err);
			return res.status(500).send("Error processing request");
		}

				res.status(200).send(`File for booking ID ${bookingId} ${fs.existsSync(filePath) ? "updated" : "created"} in the booking_logs folder.`);
	});
});

app.listen(port, () => console.log(`Application is running on port ${port}`));
