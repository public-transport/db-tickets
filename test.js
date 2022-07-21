import queryTicket from './index.js'
import util from 'util'
import process from 'process'

// request ticket data with (ticket number, lastname)
const data = await queryTicket(process.env.TICKET_NR || 'XXXXXX', process.env.LAST_NAME || 'Mustermann')
console.log(util.inspect(data, false, null))
