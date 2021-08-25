const toolslight = require('../index.js')

/*
    Example (through await):
    await toolslight.sleep(2000)
    console.log('Message after 2 second.')

    Example (through then):
    toolslight.sleep(2000).then(() => {console.log('Message after 2 second.')})
*/

toolslight.sleep = function(customOptions = {}) {
    let me = 'toolslight.sleep'

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
        time: ''
    }

    let defaultOptionsAvailableTypes = {
        initiator: ['[object String]'],
        time: ['[object Number]']
    }

    let defaultOptionsAvailableValues = {}

    let defaultValue = {
        name: 'time',
        position: 1
    }

    me = (customOptions.initiator && Object.prototype.toString.call(customOptions.initiator) === '[object String]') ? customOptions.initiator + '->' + me : me

    let options = this.getOptions(me, customOptions, defaultOptions, defaultOptionsAvailableTypes, defaultOptionsAvailableValues, defaultValue, result.stackTrace)

    return new Promise(resolve => {
        if (customOptions.initiator && Object.prototype.toString.call(customOptions.initiator) !== '[object String]') {
            result.error = {
                code: 'INCORRECT_OPTIONS',
                message: me + 'Error: custom option \'initiator\' can\'t be type of ' + Object.prototype.toString.call(customOptions.initiator) + '\'. Available types for this variable: \'[object String]\'.'
            }
            resolve(result)
            return
        }
        if (!options) {
            result.error = {
                code: 'INCORRECT_OPTIONS',
                message: result.stackTrace[result.stackTrace.length - 1]
            }
            resolve(result)
        }

        /*
            LOGIC:
        */

        setTimeout(resolve, options.time)
    })
}