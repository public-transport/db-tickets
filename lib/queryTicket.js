'use strict'

import fetch from 'node-fetch'
import { parseString } from 'xml2js'

const endpoint = 'https://fahrkarten.bahn.de/mobile/dbc/xs.go?'

/**
 * queryTicket function
 *
 * @param   string | DB ticket number (Auftragsnummer)
 * @param   lastName | last name of purchaser 
 * @return  Promise | fulfills with an object that contains the ticket data
 */
const queryTicket = async (ticketNumber, lastName) => {

	const reqBody = '<?xml version="1.0"?><rqorderdetails version="1.0">'
		+ '<rqheader tnr="61743782011" ts="2022-07-15T22:29:00" l="de" v="22060000" d="iPhone13,1" os="iOS_15.5" app="NAVIGATOR"/>'
		+ '<rqorder on="' + ticketNumber + '"/><authname tln="' + lastName + '"/></rqorderdetails>'

	return new Promise((resolve) => {

		fetch(endpoint, {
			method: 'POST',
			headers: {
				'User-Agent': 'DB%20Navigator/13056071 CFNetwork/1333.0.4 Darwin/21.5.0',
				'Accept-Language': 'de-DE,de;q=0.9'
			},
			body: reqBody
		})
		.then(response => {
			try {
				checkStatus(response);
			} catch (error) {
				console.error(error);

				const errorBody = error.response.text();
				console.error(`Error body: ${errorBody}`);
			}
			return response.text()
		})
		.then(body => {
			return new Promise((resolve, reject) => parseString(body, (err, result) => {
				if (err) {
					console.error(err)
					reject(err)
				}
				else {
					resolve(result)
				}
			}))
		})
		.then(json => {
			// resolve(json.rporderdetails.order[0].schedulelist[0].out[0].trainlist[0].train)
			resolve(json.rporderdetails)
		})
		.catch(err => {
			console.error(err)
		})
	})
}

class HTTPResponseError extends Error {
	constructor(response, ...args) {
		super(`HTTP Error Response: ${response.status} ${response.statusText}`, ...args);
		this.response = response;
	}
}

const checkStatus = response => {
	if (response.ok) {
		// response.status >= 200 && response.status < 300
		return response;
	} else {
		throw new HTTPResponseError(response);
	}
}

export default queryTicket
