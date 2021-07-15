const toolslight = require('../index.js')
    
/*
    Example:
    console.log(toolslight.arraysMerge([[123, 456], [456, 789]]).data) // Returns array: [123, 456, 789]
    console.log(toolslight.arraysMerge({arrays: [[123, 456], [456, 789]], unique: false}).data) // Returns array: [123, 456, 456, 789]
*/

toolslight.arraysMerge = function(customOptions = {}) {
    let me = 'toolslight.arraysMerge'

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
        arrays: [],
        unique: true
    }

    let defaultOptionsAvailableTypes = {
        initiator: ['[object String]'],
        arrays: ['[object Array]'],
        unique: ['[object Boolean]']
    }

    let defaultOptionsAvailableValues = {}

    let defaultValue = {
        name: 'arrays',
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

    result.data = []
    if (options.unique) {
        for (let array of options.arrays) {
            if (Object.prototype.toString.call(array) !== '[object Array]') {
                result.stackTrace.push((options.initiator ? options.initiator + ': ' : '') + me + ': ' + 'Error: Can\'t merge array with \'' + Object.prototype.toString.call(array) + '\'.')
                result.error = {
                    code: 'INCORRECT_OPTION_VALUE',
                    message: result.stackTrace[result.stackTrace.length - 1]
                }
                return result
            }
            for (let arrayValue of array) {
                if (!result.data.includes(arrayValue)) {
                    result.data.push(arrayValue)
                }
            }
        }
    } else {
        for (let array of options.arrays) {
            if (Object.prototype.toString.call(array) !== '[object Array]') {
                result.stackTrace.push((options.initiator ? options.initiator + ': ' : '') + me + ': ' + 'Error: Can\'t merge array with \'' + Object.prototype.toString.call(array) + '\'.')
                result.error = {
                    code: 'INCORRECT_OPTION_VALUE',
                    message: result.stackTrace[result.stackTrace.length - 1]
                }
                return result
            }
            for (let arrayValue of array) {
                result.data.push(arrayValue)
            }
        }
    }

    return result
}