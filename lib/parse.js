const modeCodes = {
  T: 'train'
  // todo: letters for other modes
}

const date = (_date) => {
  // merge date fields
  let date = new Date(_date['dt'].slice(0, 10))
  const t = _date['t'].split(':')
  date.setHours(t[0], t[1])

  // convert to extended ISO 8601 with timezone
  const tzOffset = -date.getTimezoneOffset()
  const diff = tzOffset >= 0 ? '+' : '-'
  const pad = n => `${Math.floor(Math.abs(n))}`.padStart(2, '0')
  return date.getFullYear() +
    '-' + pad(date.getMonth() + 1) +
    '-' + pad(date.getDate()) +
    'T' + pad(date.getHours()) +
    ':' + pad(date.getMinutes()) +
    ':' + pad(date.getSeconds()) +
    diff + pad(tzOffset / 60) +
    ':' + pad(tzOffset % 60)
}

const coordinate = (_coordinate) => {
  return parseFloat(_coordinate.slice(0,2) + '.' + _coordinate.slice(2))
}

// follows FPTF Line, https://github.com/public-transport/friendly-public-transport-format/blob/master/spec/readme.md#line
const line = (_train) => {
  return {
    type: 'line', // required
    id: _train['$']['tid'], // unique, required
    name: _train['$']['tn'], // official non-abbreviated name, required
    mode: modeCodes[_train['$']['type']], // see section on modes, required

    // seems like stops are not part of the data
    // routes: [], // array of route ids or route objects

    // operator: '123456', // operator id or operator object
  }
}

// follows FPTF Station, https://github.com/public-transport/friendly-public-transport-format/blob/master/spec/readme.md#station
const station = (_station) => {

  // the longitudes and latitudes are optional in _station
  // if they are not present, the longitude and longitude should not be included in the locaton object
  let location = {}
  if (('x' in _station) && ('y' in _station)) {
    location = {
      type: 'location',
      longitude: coordinate(_station['x'][0]),
      latitude: coordinate(_station['y'][0])
    }
  } else {
    location = {
      type: 'location',
    }
  }
    
  
  return {
    type: 'station',
    id: _station['nr'][0],
    name: _station['n'][0],
    location: location
  }
}

// follows 'legs' in FPTF Journey, https://github.com/public-transport/friendly-public-transport-format/blob/master/spec/readme.md#journey
const parseLegs = (_trainList) => {

  let legs = []

  for (let i in _trainList) {
    legs.push({

      origin: station(_trainList[i]['dep'][0]),

      destination: station(_trainList[i]['arr'][0]),

      line: line(_trainList[i]),

      departure: date(_trainList[i]['dep'][0]['$']),

      ...('ptf' in _trainList[i]['dep'][0]) && { departurePlatform: _trainList[i]['dep'][0]['ptf'][0] },

      arrival: date(_trainList[i]['arr'][0]['$']),

      ...('ptf' in _trainList[i]['arr'][0]) && { arrivalPlatform: _trainList[i]['arr'][0]['ptf'][0] },

      mode: modeCodes[_trainList[i]['$']['type']],

      public: true,

      // operator: '',
    })
  }

  return legs
}

// takes the base64 encoded httext field and extracts the ticket price
const price = (_httext) => {

  let c = atob(_httext.replace(/\r?\n|\r/g, ""))
  
  let price=null;
  price = c.match(/Gesamtpreis:\s*\d{0,2},\d{0,2}\s*EUR/g)
  //when Gesamtpreis is not found search again but with html tags, because thats what the new ticket layout gives in the new systems
  if (!price) { 
    const regexPrice = /Gesamtpreis: <\/span><span>([\d,]+,\d{2})<\/span>/;
    const matchPrice = c.match(regexPrice);
    if (matchPrice && matchPrice[1]) {
       price = matchPrice[1];
  }else{
    price=price[0];
  }
  }
  price = price.match(/\d{0,2},\d{0,2}/g)
  price = price[0].replace(',', '.')
  
  return parseFloat(price).toPrecision(4)
}

export { parseLegs, price }
