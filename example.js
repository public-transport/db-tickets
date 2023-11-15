import queryTicket from './index.js'
import util from 'util'

// request data with ticket number and lastname
const ticketNumber = process.env.TICKET_NR || 'XXXXXX'
const lastname = process.env.LAST_NAME || 'Mustermann'

const data = await queryTicket(ticketNumber, lastname)
// console.log(util.inspect(data, false, null))
console.log(JSON.stringify(data))
