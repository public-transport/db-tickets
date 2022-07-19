import queryTicket from './index.js'
import util from 'util'

// request ticket data with (ticket number, lastname)
const ticket = await queryTicket('XXXXXX', 'Mustermann')

console.log(util.inspect(ticket, false, null))
