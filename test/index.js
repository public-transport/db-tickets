import {fileURLToPath} from 'node:url'
import {readFileSync} from 'node:fs'
import {deepStrictEqual} from 'node:assert';
import {parseTicket} from '../lib/queryTicket.js'

const PATH_456800002504 = 'ticket-456800002504-2023-07-10-erika-musterfrau.json'
const TICKET_456800002504 = readFileSync(
	fileURLToPath(new URL(PATH_456800002504, import.meta.url).href),
	{encoding: 'utf8'},
)

;{
	const ticket = JSON.parse(TICKET_456800002504)

	const parsed = parseTicket(ticket)
	deepStrictEqual(parsed, {
		order: {
			ticketNumber: '456800002504',
			bookingDate: '2023-07-10T17:01:51',
			validFrom: '2023-07-23T00:00:00',
			validUntil: '2023-07-24T10:00:00',
			journeyStart: '2023-07-23T00:00:00',
			firstName: 'Erika',
			lastName: 'Musterfrau',
			text: 'Super Sparpreis, 2. Kl., Büchen/Berlin Hbf (tief)',
			class: 'S2'
		},
		journey: {
			type: 'journey',
			id: undefined, // todo: fix this
			legs: [
				{
					origin: {
						type: 'station',
						id: '8000058',
						name: 'Büchen',
						location: {type: 'location'},
					},
					destination: {
						type: 'station',
						id: '8098160',
						name: 'Berlin Hbf (tief)',
						location: {type: 'location'},
					},
					line: {
						type: 'line',
						id: '1',
						name: 'ICE 509',
						mode: 'train',
					},
					departure: '2023-07-23T10:45:00+02:00',
					arrival: '2023-07-23T12:20:00+02:00',
					arrivalPlatform: '1',
					mode: 'train',
					public: true,
				}
			],
			price: {
				amount: '35.90',
				currency: 'EUR',
			},
		},
	})

	console.info('ok parseTicket works with 456800002504')
}
