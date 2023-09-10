import fetch from 'node-fetch'
import { parseString } from 'xml2js'

const endpoint = 'https://fahrkarten.bahn.de/mobile/dbc/xs.go?'

/**
 * findTicket function
 * @param   string | DB ticket number (Auftragsnummer 12 digits)
 * @param   lastName | last name of purchaser
 * @return  Promise | fulfills with an object that contains the ticket data
 */
export const findTicket = async (ticketNumber, lastName) => {
  //make a request to the endpoint with the following body: <?xml version="1.0"?>
//<rqfindorder version="1.0"><rqheader tnr="xxx" ts="2023-08-11T11:36:51" l="de" v="23080000" d="xxx" os="xxx" app="NAVIGATOR"/><rqorder on="INT-UP-TO-12"/><authname tln="Lastname"/></rqfindorder>
  const reqBody = '<?xml version="1.0"?><rqfindorder version="1.0">'
    + '<rqheader l="de" v="23080000" d="iPhone16.4.1" os="iOS_15.7.5" app="NAVIGATOR"/>'
    + '<rqorder on="' + ticketNumber + '"/><authname tln="' + lastName + '"/></rqfindorder>'
  return fetch(endpoint, {
    method: 'POST',
    headers: {
      'User-Agent': 'github.com/envake/db-tickets',
      'Accept-Language': 'de-DE,de;q=0.9'
    },
    body: reqBody
  }).then(response => {
    if (!response.ok) {
      throw new HTTPResponseError(response)
    }
    return response.text()
  }).then(body => {
    return new Promise((resolve, reject) => parseString(body, (err, result) => {
      if (err) {
        reject(err)
      }
      else {
        resolve(result)
      }
    }))
  }).then(json => {
    if (json['rperror']) {
      throw new XMLRPCError(json['rperror']['error'])
    }
    const data = json.rporderheadlist
  
    const _order = data['orderheadlist'][0]['orderhead'][0]['$']
    return _order
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
export default findTicket