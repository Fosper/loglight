const toolslight = require('../index.js')
const os = require('os')

/*
    Example:
    console.log(toolslight.getMyIPv6().data) // Returns string: last finded IPv6 for all network interfaces
    console.log(toolslight.getMyIPv6('ens3').data) // Returns string: last finded IPv6 for network interface 'ens3'
    console.log(toolslight.getMyIPv6(['ens3', 'lo']).data) // Returns string: last finded IPv6 for network interface 'ens3' and 'lo'
*/

toolslight.getMyIPv6 = function(customOptions = {}) {
    let me = 'toolslight.getMyIPv6'

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
        interfaces: []
    }

    let defaultOptionsAvailableTypes = {
        initiator: ['[object String]'],
        interfaces: ['[object String]', '[object Array]']
    }

    let defaultOptionsAvailableValues = {}

    let defaultValue = {
        name: 'interfaces',
        position: 1
    }

    me = (customOptions.initiator && Object.prototype.toString.call(customOptions.initiator) === '[object String]') ? customOptions.initiator + '->' + me : me

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

    let IPs = []
    let networkInterfaces = os.networkInterfaces()

    for (const networkInterface in networkInterfaces) {
        if (options.interfaces.length) {
            if (!options.interfaces.includes(networkInterface)) {
                continue
            }
        }

        for (let network of networkInterfaces[networkInterface]) {
            if (network.family === 'IPv6' && network.address) {
                IPs.push(network.address)
            }
        }
    }

    result.data = ''
    if (IPs.length) {
        result.data = IPs[IPs.length - 1]
    }

   return result
}