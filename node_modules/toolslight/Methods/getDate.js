const toolslight = require('../index.js')
    
/*
    Example:
    console.log(toolslight.getDate().data) // Returns string: current date in format YYYY-MM-DD HH:MM:SS
    console.log(toolslight.getDate(1605468733).data) // Returns string: 2020-11-15 19:32:13
    console.log(toolslight.getDate(1605468733050).data) // Returns string: 2020-11-15 19:32:13
    console.log(toolslight.getDate('2020-11-15').data) // Returns string: 2020-11-15 00:00:00
    console.log(toolslight.getDate({utc: -1}).data) // Returns string: current date in format YYYY-MM-DD HH:MM:SS
    console.log(toolslight.getDate({date: 1605468733, utc: -1}).data) // Returns string: 2020-11-15 18:32:13
    console.log(toolslight.getDate({date: 1605468733050, utc: -1}).data) // Returns string: 2020-11-15 18:32:13
    console.log(toolslight.getDate({date: '2020-11-15', utc: -1}).data) // Returns string: 2020-11-14 23:00:00
*/

toolslight.getDate = function(customOptions = {}) {
    let me = 'toolslight.getDate'

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

    let dt = new Date(timestamp)
    let year = dt.getUTCFullYear()
    let month = parseInt(dt.getUTCMonth() + 1)
    if (month < 10) {
        month = '0' + month
    }
    let day = dt.getUTCDate()
    if (day < 10) {
        day = '0' + day
    }
    let hour = dt.getUTCHours()
    if (hour < 10) {
        hour = '0' + hour
    }
    let minute = dt.getUTCMinutes()
    if (minute < 10) {
        minute = '0' + minute
    }
    let second = dt.getUTCSeconds()
    if (second < 10) {
        second = '0' + second
    }

    result.data = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second

    return result
}