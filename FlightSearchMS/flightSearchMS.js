import { getPrediction } from "./autocompleteAPI.js"
import { getResults } from "./travelokaAPI.js";
import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import multer from "multer";
import cors from "cors";

// CHANGE 
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(cors());

app.get("/", function (req, res) {
	res.sendFile(__dirname + "/MainPageUI/FlightSearchUI.html");
});

app.get("/BookingUI.html", function (req, res) {
	res.sendFile(__dirname + "/MainPageUI/BookingUI.html");
});

app.get("/BookingHistoryUI.html", function (req, res) {
	res.sendFile(__dirname + "/MainPageUI/BookingHistoryUI.html");

});

app.set("view engine", "pug");
app.set("views", "./views");

// for parsing application/json
app.use(bodyParser.json());

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true }));
//form-urlencoded

// for parsing multipart/form-data
var upload = multer();
app.use(upload.array());
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname));

// autocomplete here
app.post("/getPred",async function(req, res) {
	console.log('getting autocomplete', req.body);
	var text = req.body.text
	let data = await getPrediction(text)
	res.send({
		code: 200,
		data: data,
	});
})	

// taking in travel data from flightSearchUI.html
app.post("/getResults", async function (req, res) {
	console.log(req.body);
	var numAdults = req.body.numAdults;
	var numChildren = req.body.numChildren;
	var infants = req.body.Infants;
	var dAP = req.body.dAP;
	var sAP = req.body.sAP;
	var seatClass = req.body.seatClass;
	var flightDate = req.body.date.split("-");

	for (i = 1; i < flightDate.length - 1; i++) {
		flightDate[i] = parseInt(flightDate[i].toString(10)).toString();
		console.log(flightDate[i]);
	}
	// console.log(flightDate[1]);
	let data = await getResults(
		numAdults,
		numChildren,
		infants,
		dAP,
		sAP,
		seatClass,
		flightDate
	);

	// console.log(data.data.searchResults.length);
	let airlineID = [];
	let sourceAP = [];
	let destAP = [];
	let price = [];
	for (var i = 0; i < data.data.searchResults.length; i++) {
		price.push(data.data.searchResults[i].desktopPrice);
		airlineID.push(data.data.searchResults[i].flightMetadata[0].airlineId);
		sourceAP.push(data.data.searchResults[i].flightMetadata[0].sourceAirport);
		destAP.push(
			data.data.searchResults[i].flightMetadata[0].destinationAirport
		);
	}
	res.send({
		code: 200,
		data: {
			airlineDataMap: data.data.airlineDataMap,
			airportDataMap: data.data.airportDataMap,
			flights: {
				price: price,
				airlineID: airlineID,
				destAP: destAP,
				sourceAP: sourceAP,
			},
		},
	});
	
	// listOfAirlines = data.data.airlineDataMap;
});
app.listen(3000, () => {
	console.log("App is listening on port 3000");
});
