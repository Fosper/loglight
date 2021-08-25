const toolslight = require('../index.js')
const websocket = require('ws')

/*
    Example (through await):
    let wsConnect = await toolslight.wsConnect({
        initiator: '',
        protocol: 'wss', // Only 'ws' or 'wss'.
        host: 'google.com',
        port: 8443,
        path: '/',
        headers: {'Content-Type': 'text/plain', 'User-Agent': 'Mozilla/5.0'},
        connectionTimeout: 5000,
        responseBodySizeLimit: 1024 * 1024 * 1024, // 1Gb.
        proxy: {
            protocol: 'socks', // Only 'socks' supported.
            host: '',
            port: 8080,
            username: '',
            password: '',
            connectionTimeout: 5000
        },
        localAddress: '',
        globalTimeout: 30000
    })
    wsConnect.on('open', async () => {
        wsConnect.send('Client: ws connected.');
    })
    wsConnect.on('message', async (data) => {
        console.log('Client: incoming message from server: ', data)
    })

    Example (through then):
    toolslight.wsConnect({
        initiator: '',
        protocol: 'wss', // Only 'ws' or 'wss'.
        host: 'google.com',
        port: 8443,
        path: '/',
        headers: {'Content-Type': 'text/plain', 'User-Agent': 'Mozilla/5.0'},
        connectionTimeout: 5000,
        responseBodySizeLimit: 1024 * 1024 * 1024, // 1Gb.
        proxy: {
            protocol: 'socks', // Only 'socks' supported.
            host: '',
            port: 8080,
            username: '',
            password: '',
            connectionTimeout: 5000
        },
        localAddress: '',
        globalTimeout: 30000
    }).then((result) => {})
*/

toolslight.wsConnect = function(customOptions = {}) {
    let me = 'toolslight.wsConnect'

    /*
        PREPARE:
    */

    let result = {
        data: null,
        error: null, // Codes: INCORRECT_OPTIONS, INCORRECT_OPTION_VALUE, RESPONSE_BODY_SIZE_LIMIT, HOST_CONNECTION_TIMEOUT, HOST_ABORTED_CONNECTION, HOST_UNSUPPORTED_TLS, HOST_UNREACHABLE, HOST_UNHANDLED_ERROR, PROXY_CONNECTION_TIMEOUT, PROXY_ABORTED_CONNECTION, GLOBAL_TIMEOUT ?
        stackTrace: []
    }

    let defaultOptions = {
        initiator: '',
        protocol: 'wss',
        host: 'google.com',
        port: 443,
        path: '/',
        url: '',
        headers: {},
        connectionTimeout: 10000,
        responseBodySizeLimit: 1024 * 1024 * 1024, // 1Gb
        proxy: {
            protocol: 'socks',
            host: '',
            port: 8080,
            username: '',
            password: '',
            connectionTimeout: 5000
        },
        localAddress: '',
        globalTimeout: 0
    }

    let defaultOptionsAvailableTypes = {
        initiator: ['[object String]'],
        protocol: ['[object String]'],
        host: ['[object String]'],
        port: ['[object Number]'],
        path: ['[object String]'],
        url: ['[object String]'],

        headers: ['[object Object]'],
        connectionTimeout: ['[object Number]'],

        responseBodySizeLimit: ['[object Number]'],

        proxy: {
            type: ['[object String]'],
            host: ['[object String]'],
            port: ['[object Number]'],
            username: ['[object String]'],
            password: ['[object String]'],
            connectionTimeout: ['[object Number]']
        },
        localAddress: ['[object String]'],
        globalTimeout: ['[object Number]']
    }

    let defaultOptionsAvailableValues = {
        protocol: ['ws', 'wss'],
        proxy: {
            type: ['socks']
        }
    }

    let defaultValue = {
        name: '',
        position: 1
    }

    me = (customOptions.initiator && Object.prototype.toString.call(customOptions.initiator) === '[object String]') ? customOptions.initiator + '->' + me : me

    if (customOptions.url) {
        let parsedUrl = require('url').parse(customOptions.url)
        customOptions.protocol = parsedUrl.protocol.substr(0, parsedUrl.protocol.length - 1)
        customOptions.host = parsedUrl.hostname
        customOptions.port = parsedUrl.port ? parseInt(parsedUrl.port) : customOptions.protocol === 'wss' ? 443 : 80
        customOptions.path = parsedUrl.hash ? parsedUrl.path + parsedUrl.hash : parsedUrl.path
    }

    let options = this.getOptions(me, customOptions, defaultOptions, defaultOptionsAvailableTypes, defaultOptionsAvailableValues, defaultValue, result.stackTrace)

    return new Promise(async (resolve) => {
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
            return
        }

        /*
            LOGIC:
        */

        if (!options.host) {
            result.stackTrace.push(me + ': ' + 'Error: Incorrect option \'host\' value: \'' + options.host + '\'. Host can\'t be empty.')
            result.error = {
                code: 'INCORRECT_OPTION_VALUE',
                message: result.stackTrace[result.stackTrace.length - 1]
            }
            resolve(result)
            return
        }

        if (options.port < 0 || options.port > 65536) {
            result.stackTrace.push(me + ': ' + 'Error: Incorrect option \'port\' value: \'' + options.port + '\'. This option can\'t be less than 0 and more than 65536.')
            result.error = {
                code: 'INCORRECT_OPTION_VALUE',
                message: result.stackTrace[result.stackTrace.length - 1]
            }
            resolve(result)
            return
        }

        if (options.proxy.host && (options.proxy.port < 0 || options.proxy.port > 65536)) {
            result.stackTrace.push(me + ': ' + 'Error: Incorrect option \'proxy.port\' value: \'' + options.proxy.port + '\'. This option can\'t be less than 0 and more than 65536.')
            result.error = {
                code: 'INCORRECT_OPTION_VALUE',
                message: result.stackTrace[result.stackTrace.length - 1]
            }
            resolve(result)
            return
        }

        if (options.proxy.host && !options.proxy.username && options.proxy.password) {
            result.stackTrace.push(me + ': ' + 'Error: Incorrect option \'proxy.username\' value: \'' + options.proxy.username + '\'. Proxy username must set, if you set proxy password.')
            result.error = {
                code: 'INCORRECT_OPTION_VALUE',
                message: result.stackTrace[result.stackTrace.length - 1]
            }
            resolve(result)
            return
        }

        if (options.proxy.host && !options.proxy.password && options.proxy.username) {
            result.stackTrace.push(me + ': ' + 'Error: Incorrect option \'proxy.password\' value: \'' + options.proxy.password + '\'. Proxy password must set, if you set proxy username.')
            result.error = {
                code: 'INCORRECT_OPTION_VALUE',
                message: result.stackTrace[result.stackTrace.length - 1]
            }
            resolve(result)
            return
        }

        let requestUrl = options.protocol + '://' + options.host + ':' + options.port + options.path

        let requestOptions = {
            headers: Object.assign({}, options.headers),
            timeout: options.timeout,
            rejectUnauthorized: false,
            followRedirect: true,
            maxRedirects: 10
        }

        if (options.proxy.host) {
            let proxyLibrary = require('socks-proxy-agent')

            let proxyOptions = require('url').parse(options.proxy.protocol + '://' + options.proxy.host + ':' + options.proxy.port + '/')
            if (options.proxy.username && options.proxy.password) {
                proxyOptions.auth = options.proxy.username + ':' + options.proxy.password
            }

            let proxyAgent = new proxyLibrary(proxyOptions)
            proxyAgent.timeout = options.proxy.connectionTimeout
            requestOptions.agent = proxyAgent
        }

        if (options.localAddress) {
            requestOptions.localAddress = options.localAddress
        }

        let wsConnect = new websocket(requestUrl, requestOptions)
  
        resolve(wsConnect)
    })
}