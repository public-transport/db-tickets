import { fileURLToPath } from 'node:url'
import { readFileSync } from 'node:fs'
import { deepStrictEqual } from 'node:assert';
import { parseTicket } from '../lib/queryTicket.js'

const PATH_456800002504 = 'ticket-456800002504-2023-07-10-erika-musterfrau.json'
const TICKET_456800002504 = readFileSync(
	fileURLToPath(new URL(PATH_456800002504, import.meta.url).href),
	{ encoding: 'utf8' },
);
const PATH_XXXXXX = 'ticket-XXXXXX-2023-05-12-erika-musterman.json'
const TICKET_XXXXXX = readFileSync(
    fileURLToPath(new URL(PATH_XXXXXX, import.meta.url).href),
    { encoding: 'utf8' },
);

{
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
						location: { type: 'location' },
					},
					destination: {
						type: 'station',
						id: '8098160',
						name: 'Berlin Hbf (tief)',
						location: { type: 'location' },
					},
					line: {
						type: 'line',
						id: '1',
						name: 'ICE 509',
						mode: 'train',
					},
					departure: '2023-07-23T10:45:00+00:00',
					arrival: '2023-07-23T12:20:00+00:00',
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
	const ticket_xxxxx = JSON.parse(TICKET_XXXXXX)

    const parsed_xxxxx = parseTicket(ticket_xxxxx)
    deepStrictEqual(parsed_xxxxx, {
        order: {
            ticketNumber: 'XXXXXX',
            bookingDate: '2023-05-12T23:57:51',
            validFrom: '2023-05-14T00:00:00',
            validUntil: '2023-05-15T23:59:59',
            journeyStart: '2023-05-14T13:38:00',
            firstName: 'Erika',
            lastName: 'Musterman',
            text: 'Einfache Fahrt, Flexpreis, 2. Kl., 1 Erw., BC 50, Berlin+City/Hamburg+City#',
            class: 'S2'
        },
        journey: {
            type: 'journey',
            id: '12922018',
            legs: [
                {
                    origin: {
                        type: 'station',
                        id: '8098160',
                        name: 'Berlin Hbf (tief)',
                        location: {
                            latitude: 52.525589,
                            longitude: 13.369549,
                            type: 'location'
                        },
                    },
                    destination: {
                        type: 'station',
                        id: '8002553',
                        name: 'Hamburg-Altona',
                        location: {
                            latitude: 53.552697,
                            longitude: 99.35175,
                            type: 'location'
                        },
                    },
                    line: {
                        type: 'line',
                        id: 'C0-0.0',
                        name: 'ICE 1600',
                        mode: 'train'
                    },
                    departure: '2023-05-14T13:38:00+00:00',
                    departurePlatform: '8',
                    arrival: '2023-05-14T15:39:00+00:00',
                    arrivalPlatform: '6',
                    mode: 'train',
                    public: true
                }
            ],
            price: { amount: '42.90', currency: 'EUR' }
        }
    }
    )

    console.info('ok parseTicket works with XXXXXX')
}
