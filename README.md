# db-tickets
A library to retrieve ticket information from Deutsche Bahn by providing ticket number and last name.

## How to use

```sh
npm install db-tickets
```

```js
import queryTicket from 'db-tickets'
queryTicket('W7KHTA', 'Mustermann').then((response) => console.log(response))
```
