import { requestBackend } from './requestBackend.js'
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
    return requestBackend(reqBody).then(json => {
      const data = json.rporderheadlist
  
    const _order = data['orderheadlist'][0]['orderhead'][0]['$']
    return _order})
}
  
    
export default findTicket