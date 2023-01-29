import fetch from 'node-fetch'
import { parseString } from 'xml2js'
import { parseLegs, price } from './parse.js'

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

  return fetch(endpoint, {
    method: 'POST',
    headers: {
      'User-Agent': 'github.com/envake/db-tickets',
      'Accept-Language': 'de-DE,de;q=0.9'
    },
    body: reqBody
  })
  .then(response => {
    if (!response.ok) {
      throw new HTTPResponseError(response)
    }
    return response.text()
  })
  .then(body => {
    return new Promise((resolve, reject) => parseString(body, (err, result) => {
      if (err) {
        reject(err)
      }
      else {
        resolve(result)
      }
    }))
  })
  .then(json => {
    if (json['rperror']) {
      throw new XMLRPCError(json['rperror']['error'])
    }

    const data = json.rporderdetails
  
    // selectors
    const _order = data['order'][0]['$']
    const _ticket = data['order'][0]['tcklist'][0]['tck'][0]['mtk'][0]

    return {
      order: { // doesn't follow a standard by now and just dumps some info
        ticketNumber: _order['on'],
        bookingDate: _order['cdt'],
        validFrom: _order['vfrom'],
        validUntil: _order['vto'],
        journeyStart: _order['sdt'],
        firstName: _ticket['reisender_vorname'][0],
        lastName: _ticket['reisender_nachname'][0],
        text: _ticket['txt'][0],
        class: _ticket['nvplist'][0]['nvp'][3]['_'] // could be wrong
      },
      journey: { // follows FPTF Journey, https://github.com/public-transport/friendly-public-transport-format/blob/master/spec/readme.md#journey
        type: 'journey',
        id: _order['cid'], // unique, required, use cid as id here?
        legs: parseLegs(data['order'][0]['schedulelist'][0]['out'][0]['trainlist'][0]['train']),
        price: {
	        amount: price(data['order'][0]['tcklist'][0]['tck'][0]['htdata'][0]['ht'][1]['_']),
	        currency: 'EUR'
        }
      },
      ...(data['order'][0]['schedulelist'][0]['ret'] && { returnJourney: {
        type: 'journey',
        id: _order['cid'], // unique, required, ! same as outward journey?
        legs: parseLegs(data['order'][0]['schedulelist'][0]['ret'][0]['trainlist'][0]['train']),
        price: {
          amount: price(data['order'][0]['tcklist'][0]['tck'][0]['htdata'][0]['ht'][1]['_']),
          currency: 'EUR'
        }
      }})
    }
  })
}

class HTTPResponseError extends Error {
  constructor(response, ...args) {
    super(`HTTP Error Response: ${response.status} ${response.statusText}`, ...args)
    this.response = response
  }
}

class XMLRPCError extends Error {
  constructor(response, ...args) {
    super(`XML Error Response: 
      ${response[0]['$']['nr']}
      ${response[0]['txt'][0]}`, ...args)
    this.response = response
  }
}

export default queryTicket
