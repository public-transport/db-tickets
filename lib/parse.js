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

// follows FPTF Line, https://github.com/public-transport/friendly-public-transport-format/blob/master/spec/readme.md#line
const line = (_train) => {
  return {
    type: 'line', // required
    id: _train['$']['tid'], // unique, required
    name: _train['$']['tn'], // official non-abbreviated name, required
    mode: modeCodes[_train['$']['type']], // see section on modes, required

    // seems like stops are not part of the data
    // routes: [], // array of route ids or route objects

    // todo: parse operator
    // operator: '123456', // operator id or operator object
  }
}

// follows FPTF Station, https://github.com/public-transport/friendly-public-transport-format/blob/master/spec/readme.md#station
const station = (_station) => {
  return {
    type: 'station',
    id: _station['nr'][0],
    name: _station['n'][0]
    // todo: add location
  }
}

// follows 'legs' in FPTF Journey, https://github.com/public-transport/friendly-public-transport-format/blob/master/spec/readme.md#journey
const parseLegs = (_trainList) => {

  let legs = []

  for (let i in _trainList) {
    legs.push({
      // - station/stop/location id or object
      // - required
      origin: station(_trainList[i]['dep'][0]),
      
      // station/stop/location id or object
      // - required
      destination: station(_trainList[i]['arr'][0]),

      line: line(_trainList[i]),

      // - ISO 8601 string (with origin timezone)
      // - required
      departure: date(_trainList[i]['dep'][0]['$']),

      // - seconds relative to scheduled departure
      // - optional
      // departureDelay: 120,

      // string, optional
      ...('ptf' in _trainList[i]['dep'][0]) && { departurePlatform: _trainList[i]['dep'][0]['ptf'][0] },

      // - ISO 8601 string (with destination timezone)
      // - required
      arrival: date(_trainList[i]['arr'][0]['$']),

      // - seconds relative to scheduled arrival
      // - optional
      // arrivalDelay: -45,

      // string, optional
      ...('ptf' in _trainList[i]['arr'][0]) && { arrivalPlatform: _trainList[i]['arr'][0]['ptf'][0] },

      // - array of stopover objects
      // - optional
      // stopovers: [],

      // - schedule id or object
      // - optional
      // schedule: '1234',

      mode: modeCodes[_trainList[i]['$']['type']], // mode is allready part of line?

      // subMode: null, // reserved for future use

      // public: true, // is it publicly accessible?

      // todo: parse operator
      //// - operator id or object
      //// - overrides `schedule`'s `operator`
      //// operator: 'sncf',

      //// use this if pricing information is available for specific legs
      // price: { // optional
      //   amount: 12.50, // number, required
      //   currency: 'EUR' // ISO 4217 code, required
      // }
    })
  }

  return legs
}

export default parseLegs
