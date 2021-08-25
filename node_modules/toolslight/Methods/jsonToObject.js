
const toolslight = require('../index.js')

/*
    Example:
    console.log(toolslight.jsonToObject('{"name":"Jack"}').data) // Returns object: { name: 'Jack' }
*/

toolslight.jsonToObject = function(customOptions = {}) {
    let me = 'toolslight.jsonToObject'

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
        json: ''
    }

    let defaultOptionsAvailableTypes = {
        initiator: ['[object String]'],
        json: ['[object String]']
    }

    let defaultOptionsAvailableValues = {}

    let defaultValue = {
        name: 'json',
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

    try {
        result.data = JSON.parse(options.json)
        return result
    } catch (e) {
        result.stackTrace.push(me + ': ' + 'Error: Incorrect option \'json\', value: \'' + options.json + '\'. This is not JSONable string.')
        result.error = {
            code: 'INCORRECT_OPTION_VALUE',
            message: result.stackTrace[result.stackTrace.length - 1]
        }
        return result
    }
}


