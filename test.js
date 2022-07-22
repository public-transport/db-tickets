import queryTicket from './index.js'
import util from 'util'
import process from 'process'

// request data with ticket number and lastname
const ticketNumber = process.env.TICKET_NR || 'XXXXXX'
const lastname = process.env.LAST_NAME || 'Mustermann'

console.log('testing with ' + ticketNumber + ' ' + lastname)

const data = await queryTicket(ticketNumber, lastname)
console.log(util.inspect(data, false, null))
