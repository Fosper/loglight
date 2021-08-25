
const toolslight = require('../index.js')
const { existsSync } = require('fs')

/*
    Example:
    console.log(toolslight.isPathExists('/srv/project/file.txt').data) // Returns boolean: is path (directory or file) exists
    console.log(toolslight.isPathExists({initiator: 'Parent', file: '/srv/project/file.txt'}).data) // Returns boolean: is path (directory or file) exists
*/

toolslight.isPathExists = function(customOptions = {}) {
    let me = 'toolslight.isPathExists'

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
        file: ''
    }

    let defaultOptionsAvailableTypes = {
        initiator: ['[object String]'],
        file: ['[object String]']
    }

    let defaultOptionsAvailableValues = {}

    let defaultValue = {
        name: 'file',
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

    result.data = existsSync(options.file)

    return result
}