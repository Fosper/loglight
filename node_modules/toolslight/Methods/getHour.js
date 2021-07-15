const toolslight = require('../index.js')

/*
    Example:
    console.log(toolslight.getHour().data) // Returns number: current hour of day (from 0 to 23)
    console.log(toolslight.getHour(1605468733).data) // Returns number: 19
    console.log(toolslight.getHour(1605468733050).data) // Returns number: 19
    console.log(toolslight.getHour('2020-11-15').data) // Returns number: 0
    console.log(toolslight.getHour({utc: -1}).data) // Returns number: current hour of day (from 0 to 23)
    console.log(toolslight.getHour({date: 1605468733, utc: -1}).data) // Returns number: 18
    console.log(toolslight.getHour({date: 1605468733050, utc: -1}).data) // Returns number: 18
    console.log(toolslight.getHour({date: '2020-11-15', utc: -1}).data) // Returns number: 23
*/

toolslight.getHour = function(customOptions = {}) {
    let me = 'toolslight.getHour'

    /*
        PREPARE:
    */

    let result = {
        data: null,
        error: null, // Codes: INCORRECT_OPTIONS, INCORRECT_OPTION_VALUE
        stackTrace: []
    }

    let defaultOptions = {
        initiator: '',
        date: Date.now(),
        utc: this.utc
    }

    let defaultOptionsAvailableTypes = {
        initiator: ['[object String]'],
        date: ['[object Number]', '[object String]'],
        utc: ['[object Number]']
    }

    let defaultOptionsAvailableValues = {}

    let defaultValue = {
        name: 'date',
        position: 1
    }

    let options = this.getOptions(me, customOptions, defaultOptions, defaultOptionsAvailableTypes, defaultOptionsAvailableValues, defaultValue, result.stackTrace)

    if (!options) {
        result.error = {
            code: 'INCORRECT_OPTIONS',
            message: result.stackTrace[result.stackTrace.length - 1]
        }
        return result
    }

    /*
        LOGIC:
    */

    let timestamp
    if (typeof options.date === 'number') {
        timestamp = options.date
    } else {
        timestamp = Date.parse(options.date)
    }

    if (timestamp < 0 || isNaN(timestamp)) {
        result.stackTrace.push((options.initiator ? options.initiator + ': ' : '') + me + ': ' + 'Error: Incorrect option \'date\' value: \'' + options.date + '\'.')
        result.error = {
            code: 'INCORRECT_OPTION_VALUE',
            message: result.stackTrace[result.stackTrace.length - 1]
        }
        return result
    }

    let timestampLengthDifference = 13 - timestamp.toString().length

    if (timestampLengthDifference) {
        timestamp = timestamp * (timestampLengthDifference === 1 ? 10 : timestampLengthDifference === 2 ? 100 : 1000)
    }
    timestamp += options.utc * 3600000

    result.data =  parseInt(new Date(timestamp).getUTCHours())

    return result
}