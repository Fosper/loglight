const toolslight = require('../index.js')

/*
    Example:
    console.log(toolslight.getMonth().data) // Returns number: current month (from 1 to 12)
    console.log(toolslight.getMonth(1605468733).data) // Returns number: 11
    console.log(toolslight.getMonth(1605468733050).data) // Returns number: 11
    console.log(toolslight.getMonth('2020-11-15').data) // Returns number: 11
    console.log(toolslight.getMonth({utc: -1}).data) // Returns number: current month (from 1 to 12)
    console.log(toolslight.getMonth({date: 1605468733, utc: -1}).data) // Returns number: 11
    console.log(toolslight.getMonth({date: 1605468733050, utc: -1}).data) // Returns number: 11
    console.log(toolslight.getMonth({date: '2020-11-15', utc: -1}).data) // Returns number: 11
*/

toolslight.getMonth = function(customOptions = {}) {
    let me = 'toolslight.getMonth'

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

    me = (customOptions.initiator && Object.prototype.toString.call(customOptions.initiator) === '[object String]') ? customOptions.initiator + '->' + me : me

    let options = this.getOptions(me, customOptions, defaultOptions, defaultOptionsAvailableTypes, defaultOptionsAvailableValues, defaultValue, result.stackTrace)

    if (customOptions.initiator && Object.prototype.toString.call(customOptions.initiator) !== '[object String]') {
        result.error = {
            code: 'INCORRECT_OPTIONS',
            message: me + 'Error: custom option \'initiator\' can\'t be type of ' + Object.prototype.toString.call(customOptions.initiator) + '\'. Available types for this variable: \'[object String]\'.'
        }
        return result
    }
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
        result.stackTrace.push(me + ': ' + 'Error: Incorrect option \'date\' value: \'' + options.date + '\'.')
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

    result.data = parseInt(new Date(timestamp).getUTCMonth() + 1)

    return result
}