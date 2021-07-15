
const toolslight = require('../index.js')

/*
    Example (through await):
    let isProxyAvailable = await toolslight.isProxyAvailable({
        protocol: 'https', // Default: 'https'. Can be 'http' or 'https' or 'socks'.
        host: '127.0.0.1', // Default '127.0.0.1'. Proxy host.
        port: 3000, // Default 3000. Proxy port.
        username: 'myUsername', // Default ''. Proxy username. Don't set, if not need.
        password: 'myPassword', // Default ''. Proxy password. Don't set, if not need.
        endpointProtocol: 'https', // Default: 'https'. Can be 'http' or 'https'.
        timeout: 2000 // Default 2000. Timeout in milliseconds.
    })
    console.log(isProxyAvailable.data) // Returns boolean: is proxy available

    Example (through then):
    toolslight.isProxyAvailable({
        protocol: 'https', // Default: 'https'. Can be 'http' or 'https' or 'socks'.
        host: '127.0.0.1', // Default '127.0.0.1'. Proxy host.
        port: 3000, // Default 3000. Proxy port.
        username: 'myUsername', // Default ''. Proxy username. Don't set, if not need.
        password: 'myPassword', // Default ''. Proxy password. Don't set, if not need.
        endpointProtocol: 'https', // Default: 'https'. Can be 'http' or 'https'.
        timeout: 2000 // Default 2000. Timeout in milliseconds.
    }).then((result) => {console.log(result.data)}) // Returns boolean: is proxy available
*/

toolslight.isProxyAvailable = function(customOptions = {}) {
    let me = 'toolslight.isProxyAvailable'

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
        protocol: 'https',
        host: '127.0.0.1',
        port: 3000,
        username: '',
        password: '',
        endpointProtocol: 'https',
        timeout: 2000
    }

    let defaultOptionsAvailableTypes = {
        initiator: ['[object String]'],
        protocol: ['[object String]'],
        host: ['[object String]'],
        port: ['[object Number]'],
        username: ['[object String]'],
        password: ['[object String]'],
        endpointProtocol: ['[object String]'],
        timeout: ['[object Number]']
    }

    let defaultOptionsAvailableValues = {
        protocol: ['http', 'https', 'socks'],
        endpointProtocol: ['http', 'https']
    }

    let defaultValue = {
        name: '',
        position: 1
    }

    let options = this.getOptions(me, customOptions, defaultOptions, defaultOptionsAvailableTypes, defaultOptionsAvailableValues, defaultValue, result.stackTrace)

    return new Promise((resolve) => {
        if (!options) {
            result.error = {
                code: 'INCORRECT_OPTIONS',
                message: result.stackTrace[result.stackTrace.length - 1]
            }
            resolve(result)
            return
        }

        /*
            LOGIC:
        */

        let endpointHost = 'google.com'

        let requestLibrary = options.endpointProtocol === 'http' ? require('http') : require('https')
        let proxyLibrary = options.protocol === 'socks' ? require('socks-proxy-agent') : options.endpointProtocol === 'https' ? require('https-proxy-agent') : require('http-proxy-agent')

        let proxyOptions = {
            protocol: options.protocol + ':',
            slashes: true,
            auth: null,
            host: options.host + ':' + options.port,
            port: options.port.toString(),
            hostname: options.host,
            hash: null,
            search: null,
            query: null,
            pathname: '/',
            path: '/',
            href: options.protocol + '://' + options.host + ':' + options.port + '/'
        }
        if (options.username && options.password) {
            proxyOptions.auth = options.username + ':' + options.password
        }

        let proxyAgent = new proxyLibrary(proxyOptions)
        proxyAgent.timeout = options.timeout

        let requestOptions = {
            protocol: options.endpointProtocol + ':',
            slashes: true,
            auth: null,
            host: endpointHost,
            port: null,
            hostname: endpointHost,
            hash: null,
            search: null,
            query: null,
            pathname: '/',
            path: '/',
            href: options.endpointProtocol + '://' + endpointHost + '/',
            agent: proxyAgent,
            rejectUnauthorized: false
        }
        
        let request = requestLibrary.get(requestOptions, function(res) {
            request.end()
            if (res.statusCode === 301 || res.statusCode === 200) {
                result.data = true
                resolve(result)
                return
            } else {
                result.data = false
                resolve(result)
                return
            }
        }).setTimeout(options.timeout, () => {
            request.end()
            result.data = false
            resolve(result)
            return
        }).on('error', (e) => {
            request.end()
            result.data = false
            resolve(result)
            return
        })
    })
}