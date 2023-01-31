# db-tickets
A library to retrieve ticket information from Deutsche Bahn by providing ticket number and last name.

## How to use

```sh
npm install db-tickets
```

```js
import queryTicket from 'db-tickets'
queryTicket('W7KHTA', 'Mustermann').then((response) => console.log(response))
```

```json
{
  "order": {
    "ticketNumber": "W7KHTA",
    "bookingDate": "2023-01-21T12:30:03",
    "validFrom": "2023-01-21T00:00:00",
    "validUntil": "2023-01-21T23:59:59",
    "journeyStart": "2023-01-21T12:40:00",
    "firstName": "Max",
    "lastName": "Mustermann",
    "text": "Einfache Fahrt, Regio120 Ticket, 2. Kl., 1 Erw., Jena/Leipzig#",
    "class": "S2"
  },
  "journey": {
    "type": "journey",
    "id": "51451984",
    "legs": [
      {
        "origin": {
          "type": "station",
          "id": "8011956",
          "name": "Jena Paradies",
          "location": {
            "type": "location",
            "longitude": 11.587464,
            "latitude": 50.924853
          }
        },
        "destination": {
          "type": "station",
          "id": "8010205",
          "name": "Leipzig Hbf",
          "location": {
            "type": "location",
            "longitude": 12.382066,
            "latitude": 51.345467
          }
        },
        "line": {
          "type": "line",
          "id": "C0-0.0",
          "name": "RE  4986",
          "mode": "train"
        },
        "departure": "2023-01-21T12:40:00+01:00",
        "departurePlatform": "2",
        "arrival": "2023-01-21T13:52:00+01:00",
        "arrivalPlatform": "9",
        "mode": "train",
        "public": true
      }
    ],
    "price": {
      "amount": "18.60",
      "currency": "EUR"
    }
  }
}
```
