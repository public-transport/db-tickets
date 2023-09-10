import fetch from 'node-fetch'
import { parseString } from 'xml2js'

const endpoint = 'https://fahrkarten.bahn.de/mobile/dbc/xs.go?'

/**
 * requestBackend function, that is used to make a request to the backend
 * @param string | body of the request
 * @return Promise | fulfills with an object that contains the  data from the request
 */
export const requestBackend = async (reqBody) => {
    return fetch(endpoint, {
        method: 'POST',
        headers: {
            'User-Agent': 'github.com/public-transport/db-tickets',
            'Accept-Language': 'de-DE,de;q=0.9'
        },
        body: reqBody
    }).then(response => {
        if (!response.ok) {
            const err = new HTTPResponseError(response)
            err.url = endpoint
            err.requestBody = reqBody
            throw err
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
        return json
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
  export default requestBackend