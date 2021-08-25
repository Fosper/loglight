const toolslight = require('../index.js')

/*
    Example:
    console.log(toolslight.randInt().data) // Returns number: from 0 to 1
    console.log(toolslight.randInt({from: 1, to: 10}).data) // Returns number: from 1 to 10 (includes 1 and 10)
*/

toolslight.randInt = function(customOptions = {}) {
    let me = 'toolslight.randInt'

    /*
        PREPARE:
    */

    let result = {
        data: null,
        error: null, // Codes: INCORRECT_OPTIONS
        stackTrace: []
    }

    let defaultOptions = {
        initiator: '',
        from: 0,
        to: 1
    }

    let defaultOptionsAvailableTypes = {
        initiator: ['[object String]'],
        from: ['[object Number]'],
        to: ['[object Number]']
    }

    let defaultOptionsAvailableValues = {}

    let defaultValue = {
        name: '',
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

    result.data = Math.floor(Math.random() * (options.to - options.from + 1) + options.from)

    return result
}