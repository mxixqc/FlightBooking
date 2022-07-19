// This file supports getting one-way flight information using the Traveloka API
//

import fetch from "node-fetch";

export async function getResults(
	numAdults,
	numChildren,
	infants,
	dAP,
	sAP,
	seatClass,
	flightDate
) {
	const response = await fetch(
		"https://m.traveloka.com/api/v2/flight/search/oneway",
		{
			headers: {
				accept: "application/json, text/plain, */*",
				"accept-language": "en-US,en;q=0.9",
				"cache-control": "no-cache",
				"content-type": "application/json",
				pragma: "no-cache",
				"sec-fetch-dest": "empty",
				"sec-fetch-mode": "cors",
				"sec-fetch-site": "same-origin",
				"x-domain": "flight",
				"x-route-prefix": "en-sg",
				referer:
					"https://m.traveloka.com/en-sg/flight/fullsearch?ap=SIN.TYOA&dt=02-03-2022.NA&ps=1.0.0&sc=ECONOMY",
				cookie:
					"tv-repeat-visit=true; amp_1a5adb_traveloka.com=pFqwHD84uD4EiO1kiF1dIe...1ft08cpm8.1ft08cpma.0.0.0; _gid=GA1.2.2134308536.1646055024; G_ENABLED_IDPS=google; selectedCurrency=SGD; flightLastSearchedDepartDate=2022-3-1; flightLastSearchedIsRoundTrip=false; flightLastSearchedNumberOfPassengers=1.0.0; flightLastSearchedOriginAirport=SIN; _gcl_au=1.1.428391486.1646055046; _gac_UA-29776811-12=1.1646055622.CjwKCAiAgvKQBhBbEiwAaPQw3FZRaHd8vx6S5sekZwCj2jIa7u6qlJLW6SN8mQLket9tNL9-WnA6ZBoCNdQQAvD_BwE; flightLastSearchedDestinationAirport=TYOA; state-auth=auth-61fb79be-2881-41b5-b0ee-bb4c1803605f; flightDepartureDate=2-3-2022; flightFlightType=ONE_WAY; flightSourceLocation=Singapore; flightSourceAirport=SIN; flightDestinationAirport=TYOA; flightDestinationLocation=Tokyo; flightNumChildren=0; flightNumOfAdults=1; flightNumInfants=0; flightSeatClassType=ECONOMY; flexibility=0; tvs=qgdHX7GvehrD9XH5a3S4PWL3Nd74xArIuT+JzcRMbKddQHovERAJ9HWRLrAaZ0jPhWj5HSxm0ZKiRbldET1ham2PeYg1sQr2h/wIBjIyPQ1tS9i9ufbXcfjuzPOTFPWWJN1MELxoZZr7Bl88iTqbRIavZFOouSBTEikTUsH013biIEPnUwFu0TAphlHVzNNCsCnSYBwIASiTyKsWj9+CeG2PeYg1sQr2h/wIBjIyPQ3f6u8nPJclnZIp684AwXTe; _gat_UA-29776811-12=1; cto_bundle=4Io3gF82YWk0Z3ZGdU1aUDBIdGpqbFJMU0xaRDE4OE0yVUxTbnh0eWtCcTMlMkJhRTZqaWJoS3hnSUhkNVpRaVpVdU42QlVlYWtkcHhnJTJCcklYVjdOQ2h5WjlPT2twUUl6Y0xsJTJCRkZ1eE42V2N6emdTZnNOQjhrOGJPN0RHTUtxa2s1bkJwNkRRZ1F5d3ljN1FMRTNhckx5a0klMkJRZyUzRCUzRA; _ga_RSRSMMBH0X=GS1.1.1646120103.3.1.1646120159.0; amp_1a5adb=pFqwHD84uD4EiO1kiF1dIe...1ft26eru3.1ft26giie.1b.0.1b; _ga=GA1.1.1687458201.1646055024; tvl=qgdHX7GvehrD9XH5a3S4PdE8AYpuF3hYPaT5bxhY7ZZA2/Nf9A/rXSaJQHUWS5WaSMHsGWHO01pfUVMlJ6wAZ7mbdOt8aKeqUyYAEx/f9JrvnTaGimAgs0pSnsKzjPIV9o2bMgCQT2Jbd3KrGTWNcxnD/2I+tDfU7mMdnamyRg7vlyHfFnPptZUxAgMVwRNSCMYWUJplNNMY2P4/83O9X+8GNrPf8Ng75ZieUaJama8=",
				Referer:
					"https://m.traveloka.com/en-sg/flight/fullsearch?ap=SIN.TYOA&dt=2-9-2022.NA&ps=1.0.0&sc=ECONOMY",
				"Referrer-Policy": "strict-origin-when-cross-origin",
			},
			// if you want to change the destination country or the flight country, you can change that information here.
			// Currently, TYOA == Tokyo and SIN == Singapore
			body: `{"fields":[],"clientInterface":"mobile","data":{"currency":"SGD","isReschedule":false,"locale":"en_SG","numSeats":{"numAdults":${parseInt(
				numAdults
			)},"numChildren":${parseInt(numChildren)},"numInfants":${parseInt(
				infants
			)}},"seatPublishedClass":"${seatClass.toUpperCase()}","destinationAirportOrArea":"${dAP}","flexibleTicket":false,"flightDate":{"year":${parseInt(
				flightDate[0]
			)},"month":${parseInt(flightDate[1])},"day":${parseInt(
				flightDate[2]
			)}},"sourceAirportOrArea":"${sAP}","newResult":true,"seqNo":null,"searchId":"58a87e03-fbe4-4f4b-8d89-828480999d3d","visitId":"8a6d27c5-1f4e-4de2-aec0-25214645f73b","utmId":null,"utmSource":null,"searchSpecRoutesTotal":1}}`,
			method: "POST",
		}
	);
	const json = await response.json();
	return json;
	// search results stored in json.data.searchResults
	// list airlines that send you to the desired destination is in json.data.airlineDataMap
}
