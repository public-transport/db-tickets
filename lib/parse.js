const modeCodes = {
  T: 'train'
  // todo: find out letters for other modes
}

const parseDate = (d) => {
  // merge date fields
  let date = new Date(d['dt'].slice(0, 10))
  const t = d['t'].split(':')
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
const parseLine = (l) => {
  return {
    type: 'line', // required
    id: l['$']['tid'], // unique, required
    name: l['$']['tn'], // official non-abbreviated name, required
    mode: modeCodes[l['$']['type']], // see section on modes, required
    // subMode: …, // reserved for future use
    // todo: color, ...

    // seems like stops are not part of the data
    // routes: [], // array of route ids or route objects

    // todo: parse operator
    // operator: '123456', // operator id or operator object
  }
}

const parseLegs = (trains) => {

  let legs = []

  for (let i in trains) {
    let leg = [
      {
        // - station/stop/location id or object
        // - required
        origin: trains[i]['dep'][0]['ebhf_nr'][0],

        // station/stop/location id or object
        // - required
        destination: trains[i]['arr'][0]['ebhf_nr'][0],

        line: parseLine(trains[i]),

        // - ISO 8601 string (with origin timezone)
        // - required
        departure: parseDate(trains[i]['dep'][0]['$']),

        // - seconds relative to scheduled departure
        // - optional
        // departureDelay: 120,

        departurePlatform: trains[i]['dep'][0]['ptf'][0], // string, optional

        // - ISO 8601 string (with destination timezone)
        // - required
        arrival: parseDate(trains[i]['arr'][0]['$']),

        // - seconds relative to scheduled arrival
        // - optional
        // arrivalDelay: -45,

        arrivalPlatform: trains[i]['arr'][0]['ptf'][0], // string, optional

        // - array of stopover objects
        // - optional
        // stopovers: [],

        // - schedule id or object
        // - optional
        // schedule: '1234',

        // - see section on modes
        // - overrides `schedule`'s `mode`
        mode: modeCodes[trains[i]['$']['type']], // mode is allready part of line?

        // subMode: null, // reserved for future use

        // public: true, // is it publicly accessible?

        // todo: parse operator
        // - operator id or object
        // - overrides `schedule`'s `operator`
        // operator: 'sncf',

        // use this if pricing information is available for specific legs
        // price: { // optional
        //   amount: 12.50, // number, required
        //   currency: 'EUR' // ISO 4217 code, required
        // }
      }
    ]

    legs.push(leg)
  }

  return legs
}

export default parseLegs
