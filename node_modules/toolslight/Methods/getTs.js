const toolslight = require('../index.js')

/*
    Example:
    console.log(toolslight.getTs().data) // Returns number: current timestamp (13 digits)
    console.log(toolslight.getTs(1605468733).data) // Returns number: 1605468733000
    console.log(toolslight.getTs(1605468733050).data) // Returns number: 1605468733050
    console.log(toolslight.getTs('2020-11-15').data) // Returns number: 1605398400000
    console.log(toolslight.getTs({utc: -1}).data) // Returns number: current timestamp (13 digits)
    console.log(toolslight.getTs({date: 1605468733, utc: -1}).data) // Returns number: 1605468733000
    console.log(toolslight.getTs({date: 1605468733050, utc: -1}).data) // Returns number: 1605468733050
    console.log(toolslight.getTs({date: '2020-11-15', utc: -1}).data) // Returns number: 1605398400000
*/

toolslight.getTs = function(customOptions = {}) {
    let me = 'toolslight.getTs'

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
        utc: 0
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

    result.data = timestamp

    return result
}