import { parseLegs, price } from './parse.js'
import requestBackend from './requestBackend.js';

/**
 * parseTicket
 *
 * @param   string | ticket API response body, JSON-decoded
 * @return  object | the ticket data
 */
const parseTicket = (json) => {
  const data = json.rporderdetails

  // selectors
  const _order = data['order'][0]['$']
  const _tck = data['order'][0]['tcklist']?.[0]['tck'][0]
  const _ticket = _tck?.['mtk'][0]
  let _encoded_price = _tck['htdata'][0]['ht'][0]['_']
  //if _tck['htdata'][0]['ht'][0]['_'] starts with data:image/png;base64, then it is a old ticket, we need to check for that
  if(_encoded_price.startsWith('data:image/png;base64,')){
    _encoded_price = _tck['htdata'][0]['ht'][1]['_'] // revert back to the old price format
  }

  const _price = _tck ? {
    amount: price(_encoded_price),
    currency: 'EUR'
   }: undefined

  return {
    // doesn't follow a standard by now and just dumps some info
    order: {
      ticketNumber: _order['on'],
      bookingDate: _order['cdt'],
      validFrom: _order['vfrom'],
      validUntil: _order['vto'],
      journeyStart: _order['sdt'],
      firstName: _ticket?.['reisender_vorname'][0],
      lastName: _ticket?.['reisender_nachname'][0],
      text: _ticket?.['txt'][0],
      class: _ticket?.['nvplist'][0]['nvp'][3]['_'] // could be wrong
    },

    // follows FPTF Journey, https://github.com/public-transport/friendly-public-transport-format/blob/master/spec/readme.md#journey
    journey: {
      type: 'journey',
      id: _order['cid'], // unique, required, use cid as id here?
      legs: parseLegs(data['order'][0]['schedulelist'][0]['out'][0]['trainlist'][0]['train']),
      price: _price
    },

    ...(data['order'][0]['schedulelist'][0]['ret'] && { returnJourney: {
      type: 'journey',
      id: _order['cid'], // unique, required, ! same as outward journey?
      legs: parseLegs(data['order'][0]['schedulelist'][0]['ret'][0]['trainlist'][0]['train']),
      price: _price
    }})
  }
}

/**
 * queryTicket function
 *
 * @param   string | DB ticket number (Auftragsnummer)
 * @param   lastName | last name of purchaser 
 * @param   kwid | kwid of the ticket (only needed for tickets from the new system)
 * @return  Promise | fulfills with an object that contains the ticket data
 */
const queryTicket = async (ticketNumber, lastName,kwid=null) => {

  let reqBody = `<?xml version="1.0"?> <rqorderdetails version="2.0"> <rqheader l="de" v="23080000" d="iPhone16.4.1" os="iOS_15.7.5" app="NAVIGATOR" /> <rqorder on="${ticketNumber}" ${kwid ? `kwid="${kwid}" ` : ''}/> <authname tln="${lastName}"/> </rqorderdetails> `

  return await requestBackend(reqBody)
  .then(json => {
    console.error(JSON.stringify(json))
    return parseTicket(json)
  })
}

export {
  parseTicket,
  queryTicket,
}
