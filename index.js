/*!
 * db-tickets
 * ISC Licensed
 */

import {default  as rqorderdetails} from './lib/queryTicket.js' 
import findTicket from './lib/findTicket.js' 

/**
 * queryTicket function, returns the ticket data based on the ticket number and last name. handles both old and new ticket system
 * @param   string | DB ticket number (ticket number up 12 digits or 6 characters)
 * @param   lastName | last name of purchaser
 * @return  Promise | fulfills with an object that contains the ticket data
 */
const queryTicket = async (ticketNumber, lastName) => {
    //create a null kwid variable
    let kwid = null
    if (ticketNumber.length > 5) {
        const order = await findTicket(ticketNumber, lastName) 
        //extract the kwid from the order object
        kwid = order.kwid
    }
    const ticketData = await rqorderdetails(ticketNumber, lastName, kwid)
    return ticketData
}


export default queryTicket 
