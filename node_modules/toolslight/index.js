const { Readable, Writable } = require('stream')

class Toolslight {
    static utc = 0

    static setUTC(utc) {
        if (typeof utc !== 'number') {
            throw new Error('toolslight: \'setUTC\' function error. Incorrect data type in argument. Must be number, from -12 to 14.')
        }
        if (utc < -12 || utc > 14) {
            throw new Error('toolslight: \'setUTC\' function error. Incorrect data value in argument. Must be number, from -12 to 14.')
        }
        this.utc = utc

        return this
    }

    static getOptions(functionName, customOptions, defaultOptions, defaultOptionsAvailableTypes, defaultOptionsAvailableValues, defaultValue, stackTrace, isFirstRun = true) {

        if (isFirstRun) {
            stackTrace.push(functionName + ': ' + 'Function started.')
            stackTrace.push(functionName + ': ' + 'Income custom options: ' + JSON.stringify(customOptions))
        }
        
        if (customOptions === undefined || customOptions === null) {
            stackTrace.push(functionName + ': ' + 'Error: custom options can\'t be \'undefined\' or \'null\'.')
            return false
        }

        let options = {}

        if ((customOptions instanceof Readable || customOptions instanceof Writable) || Object.prototype.toString.call(customOptions) !== '[object Object]') {
            if (defaultValue.name) {
                let replaceTo = customOptions
                let findCount = 0
                let isFind = false
                let replace = (defaultOptions) => {
                    let customOptions = {}
                    for (const defaultOption in defaultOptions) {
                        if (!isFind && defaultOption === defaultValue.name) {
                            findCount++
                            if (findCount === defaultValue.position) {
                                customOptions[defaultOption] = replaceTo
                                isFind = true
                                continue
                            }
                        }

                        if (Object.prototype.toString.call(defaultOptions[defaultOption]) === '[object Object]' && !(defaultOptions[defaultOption] instanceof Readable) && !(defaultOptions[defaultOption] instanceof Writable)) {
                            customOptions[defaultOption] = replace(defaultOptions[defaultOption])
                        } else {
                            customOptions[defaultOption] = defaultOptions[defaultOption]
                        }
                    }
                    return customOptions
                }
    
                customOptions = replace(defaultOptions)
            } else {
                stackTrace.push(functionName + ': ' + 'Error: invalid function argument \'' + customOptions + '\'. See examples in node_modules->toolslight->Methods->functionName.js')
                return false
            }
        }

        for (const defaultOption in defaultOptions) {
            if (customOptions[defaultOption] !== undefined) {
                if (Object.prototype.toString.call(defaultOptions[defaultOption]) === '[object Object]') {
                    if (Object.keys(defaultOptions[defaultOption]).length) {
                        let getOptionsResult = this.getOptions(functionName, customOptions[defaultOption], defaultOptions[defaultOption], defaultOptionsAvailableTypes[defaultOption], defaultOptionsAvailableValues[defaultOption], defaultValue, stackTrace, false)
                        if (!getOptionsResult) {
                            return false
                        } else {
                            options[defaultOption] = getOptionsResult
                        }
                    } else {
                        if (Object.prototype.toString.call(customOptions[defaultOption]) === '[object Object]' && Object.keys(customOptions[defaultOption]).length) {
                            options[defaultOption] = customOptions[defaultOption]
                        } else {
                            options[defaultOption] = defaultOptions[defaultOption]
                        }
                    }
                } else {
                    let isAvailableType = false

                    if (defaultOptionsAvailableTypes[defaultOption] && defaultOptionsAvailableTypes[defaultOption].length) {

                        for (let availableType of defaultOptionsAvailableTypes[defaultOption]) {
                            if (isAvailableType) {
                                break
                            }
                            switch (availableType) {
                                case 'instanceof Readable':
                                    if (customOptions[defaultOption] instanceof Readable) {
                                        isAvailableType = true
                                    }
                                    break
                                case 'instanceof Writeable':
                                    if (customOptions[defaultOption] instanceof Writable) {
                                        isAvailableType = true
                                    }
                                    break
                                default:
                                    if (Object.prototype.toString.call(customOptions[defaultOption]) === availableType) {
                                        isAvailableType = true
                                    }
                                    break
                            }
                        }
                    } else {
                        isAvailableType = true
                    }
                    
                    if (!isAvailableType) {
                        stackTrace.push(functionName + ': ' + 'Error: custom option \'' + defaultOption + '\' can\'t be type of \'' + Object.prototype.toString.call(customOptions[defaultOption]) + '\'. Available types for this variable: \'' + defaultOptionsAvailableTypes[defaultOption].join('\', \'') + '\'.')
                        return false
                    }

                    let isAvailableValue = false
                    if (defaultOptionsAvailableValues[defaultOption] && defaultOptionsAvailableValues[defaultOption].length) {
                        for (let availableValue of defaultOptionsAvailableValues[defaultOption]) {
                            if (customOptions[defaultOption] === availableValue) {
                                isAvailableValue = true
                                break
                            }
                        }
                    } else {
                        isAvailableValue = true
                    }
                    if (!isAvailableValue) {
                        stackTrace.push(functionName + ': ' + 'Error: custom option \'' + defaultOption + '\' can\'t contain value \'' + customOptions[defaultOption] + '\'. Available values: \'' + defaultOptionsAvailableValues[defaultOption].join('\', \'') + '\'.')
                        return false
                    }

                    options[defaultOption] = customOptions[defaultOption]
                }
            } else {
                if (Object.prototype.toString.call(defaultOptions[defaultOption]) === '[object Object]') {
                    let getOptionsResult = this.getOptions(functionName, {}, defaultOptions[defaultOption], defaultOptionsAvailableTypes[defaultOption], defaultOptionsAvailableValues[defaultOption], defaultValue, stackTrace, false)
                    if (!getOptionsResult) {
                        return false
                    } else {
                        options[defaultOption] = getOptionsResult
                    }
                } else {
                    options[defaultOption] = defaultOptions[defaultOption]
                }
            }
        }

        if (isFirstRun) {
            stackTrace.push(functionName + ': ' + 'Use options: ' + JSON.stringify(options))
        }

        return options
    }
}

module.exports = Toolslight

require('./Methods/arraysMerge.js')
require('./Methods/getDate.js')
require('./Methods/getDayOfMonth.js')
require('./Methods/getDayOfWeek.js')
require('./Methods/getHash.js')
require('./Methods/getHour.js')
require('./Methods/getMinute.js')
require('./Methods/getMonth.js')
require('./Methods/getMyEachIPv4.js')
require('./Methods/getMyEachIPv6.js')
require('./Methods/getMyIPv4.js')
require('./Methods/getMyIPv6.js')
require('./Methods/getRandomUseragent.js')
require('./Methods/getSecond.js')
require('./Methods/getTs.js')
require('./Methods/getYear.js')
require('./Methods/httpRequest.js')
require('./Methods/isInternetAvailable.js')
require('./Methods/isPathExists.js')
require('./Methods/isProxyAvailable.js')
require('./Methods/jsonToObject.js')
require('./Methods/randInt.js')
require('./Methods/sleep.js')
require('./Methods/uniqid.js')
require('./Methods/wsConnect.js')