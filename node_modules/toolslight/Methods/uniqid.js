const toolslight = require('../index.js')

/*
    Returns string.

    Example:
    console.log(toolslight.uniqid().data) // Returns string: random 13 characters with 'a-z' and '0-9'
    console.log(toolslight.uniqid(20).data) // Returns string: random 20 characters with 'a-z' and '0-9'
    console.log(toolslight.uniqid({
        characterCount: 13,
        letterCase: 'mixed', // Default: 'lower'. Can be 'lower', 'upper', 'mixed'.
        lettersLib: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
        numbersLib: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
        specialLib: ['!', '@', '#', '$', '%', '&', '*', '(', ')', '-', '_', '+', ':', ',', '.', ';', '[', ']', '{', '}', '<', '>'],
        customLib: [],
        lettersEnable: true,
        numbersEnable: true,
        specialEnable: false,
        customEnable: false
    }).data) // Returns string: random 13 characters with 'a-z' and '0-9' and 'A-Z'
*/

toolslight.uniqid = function(customOptions = {}) {
    let me = 'toolslight.uniqid'

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
        characterCount: 13,
        letterCase: 'lower',
        lettersLib: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
        numbersLib: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
        specialLib: ['!', '@', '#', '$', '%', '&', '*', '(', ')', '-', '_', '+', ':', ',', '.', ';', '[', ']', '{', '}', '<', '>'],
        customLib: [],
        lettersEnable: true,
        numbersEnable: true,
        specialEnable: false,
        customEnable: false
    }

    let defaultOptionsAvailableTypes = {
        initiator: ['[object String]'],
        characterCount: ['[object Number]'],
        letterCase: ['[object String]'],
        lettersLib: ['[object Array]'],
        numbersLib: ['[object Array]'],
        specialLib: ['[object Array]'],
        customLib: ['[object Array]'],
        lettersEnable: ['[object Boolean]'],
        numbersEnable: ['[object Boolean]'],
        specialEnable: ['[object Boolean]'],
        customEnable: ['[object Boolean]']
    }

    let defaultOptionsAvailableValues = {
        letterCase: ['lower', 'upper', 'mixed'],
    }

    let defaultValue = {
        name: 'characterCount',
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

    let lib = []

    if (options.lettersEnable) {
        for (let character of options.lettersLib) {
            if (Object.prototype.toString.call(character) !== '[object String]') {
                result.stackTrace.push(me + ': ' + 'Error: Incorrect option \'lettersLib\' value. Array must contain only string elements with 1 character.')
                result.error = {
                    code: 'INCORRECT_OPTION_VALUE',
                    message: result.stackTrace[result.stackTrace.length - 1]
                }
                return result
            } else if (character.length !== 1) {
                result.stackTrace.push(me + ': ' + 'Error: Incorrect option \'lettersLib\' value. Array element length need to be 1.')
                result.error = {
                    code: 'INCORRECT_OPTION_VALUE',
                    message: result.stackTrace[result.stackTrace.length - 1]
                }
                return result
            }
        }
        lib = lib.concat(options.lettersLib)
    }
    if (options.numbersEnable) {
        for (let character of options.numbersLib) {
            if (Object.prototype.toString.call(character) !== '[object String]') {
                result.stackTrace.push(me + ': ' + 'Error: Incorrect option \'numbersLib\' value. Array must contain only string elements with 1 character.')
                result.error = {
                    code: 'INCORRECT_OPTION_VALUE',
                    message: result.stackTrace[result.stackTrace.length - 1]
                }
                return result
            } else if (character.length !== 1) {
                result.stackTrace.push(me + ': ' + 'Error: Incorrect option \'lettersLib\' value. Array element length need to be 1.')
                result.error = {
                    code: 'INCORRECT_OPTION_VALUE',
                    message: result.stackTrace[result.stackTrace.length - 1]
                }
                return result
            }
        }
        lib = lib.concat(options.numbersLib)
    }
    if (options.specialEnable) {
        for (let character of options.specialLib) {
            if (Object.prototype.toString.call(character) !== '[object String]') {
                result.stackTrace.push(me + ': ' + 'Error: Incorrect option \'specialLib\' value. Array must contain only string elements with 1 character.')
                result.error = {
                    code: 'INCORRECT_OPTION_VALUE',
                    message: result.stackTrace[result.stackTrace.length - 1]
                }
                return result
            } else if (character.length !== 1) {
                result.stackTrace.push(me + ': ' + 'Error: Incorrect option \'lettersLib\' value. Array element length need to be 1.')
                result.error = {
                    code: 'INCORRECT_OPTION_VALUE',
                    message: result.stackTrace[result.stackTrace.length - 1]
                }
                return result
            }
        }
        lib = lib.concat(options.specialLib)
    }
    if (options.customEnable) {
        for (let character of options.customLib) {
            if (Object.prototype.toString.call(character) !== '[object String]') {
                result.stackTrace.push(me + ': ' + 'Error: Incorrect option \'customLib\' value. Array must contain only string elements with 1 character.')
                result.error = {
                    code: 'INCORRECT_OPTION_VALUE',
                    message: result.stackTrace[result.stackTrace.length - 1]
                }
                return result
            } else if (character.length !== 1) {
                result.stackTrace.push(me + ': ' + 'Error: Incorrect option \'lettersLib\' value. Array element length need to be 1.')
                result.error = {
                    code: 'INCORRECT_OPTION_VALUE',
                    message: result.stackTrace[result.stackTrace.length - 1]
                }
                return result
            }
        }
        lib = lib.concat(options.customLib)
    }

    if (!lib.length) {
        result.stackTrace.push(me + ': ' + 'Error: Arrays in options \'lettersLib\' and \'numbersLib\' and \'specialLib\' and \'customLib\' in empty. One of this array must contain 1 or more string elements.')
        result.error = {
            code: 'INCORRECT_OPTION_VALUE',
            message: result.stackTrace[result.stackTrace.length - 1]
        }
        return result
    }

    result.data = ''

    for (let i = 0; i < options.characterCount; i++) {
        let letter = lib[Math.floor(Math.random() * lib.length)]
        if (options.letterCase === 'lower') {
            letter = letter.toLowerCase()
        } else if (options.letterCase === 'upper') {
            letter = letter.toUpperCase()
        } else {
            if (Math.floor(Math.random() * 2)) {
                letter = letter.toLowerCase()
            } else {
                letter = letter.toUpperCase()
            }
        }

        result.data += letter
    }

    return result
}