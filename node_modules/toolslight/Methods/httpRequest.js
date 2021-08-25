const toolslight = require('../index.js')
const { Readable } = require('stream')
const { createBrotliDecompress, createGunzip, createInflate } = require('zlib')
const { existsSync, appendFileSync, unlinkSync } = require('fs')

/*
    Example (through await):
    let httpRequest = await toolslight.httpRequest({
        initiator: '',
        method: 'GET',
        protocol: 'https', // Only 'http' or 'https'.
        host: 'google.com',
        port: 443,
        path: '/',
        headers: {'Content-Type': 'text/plain', 'User-Agent': 'Mozilla/5.0'},
        body: '',
        bodyFormData: {},
        connectionTimeout: 5000,
        responseBodySizeLimit: 1024 * 1024 * 1024, // 1Gb.
        responseBodySaveTo: '',
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
    console.log(httpRequest.data) // Returns object: request and response data.
    if (httpRequest.data.response?.body) console.log(Buffer.from(httpRequest.data.response.body, 'binary').toString()) // Returns string: response body.

    Example (through then):
    toolslight.httpRequest({
        initiator: '',
        method: 'GET',
        protocol: 'https', // Only 'http' or 'https'.
        host: 'google.com',
        port: 443,
        path: '/',
        headers: {},
        body: '',
        bodyFormData: {},
        connectionTimeout: 5000,
        responseBodySizeLimit: 1024 * 1024 * 1024, // 1Gb.
        responseBodySaveTo: '',
        proxy: {
            protocol: 'socks',
            host: '',
            port: 8080,
            username: '',
            password: '',
            connectionTimeout: 5000
        },
        localAddress: '',
        globalTimeout: 30000
    }).then((result) => {console.log(Buffer.from(result.data.response.body, 'binary').toString())}) // Returns string: response body.
*/

toolslight.httpRequest = function(customOptions = {}) {
    let me = 'toolslight.httpRequest'

    /*
        PREPARE:
    */

    let result = {
        data: null,
        error: null, // Codes: INCORRECT_OPTIONS, INCORRECT_OPTION_VALUE, RESPONSE_BODY_SIZE_LIMIT, HOST_CONNECTION_TIMEOUT, HOST_ABORTED_CONNECTION, HOST_UNSUPPORTED_TLS, HOST_UNREACHABLE, HOST_UNHANDLED_ERROR, PROXY_CONNECTION_TIMEOUT, PROXY_ABORTED_CONNECTION, GLOBAL_TIMEOUT
        stackTrace: []
    }

    let defaultOptions = {
        initiator: '',
        method: 'GET',
        protocol: 'https',
        host: 'google.com',
        port: 443,
        path: '/',
        url: '',
        headers: {},
        body: '',
        bodyFormData: {},
        connectionTimeout: 10000,
        responseBodySizeLimit: 1024 * 1024 * 1024, // 1Gb
        responseBodySaveTo: '',
        proxy: {
            protocol: 'socks',
            host: '',
            port: 8080,
            username: '',
            password: '',
            connectionTimeout: 5000
        },
        localAddress: '',
        globalTimeout: 86400000 // 1 Day
    }

    let defaultOptionsAvailableTypes = {
        initiator: ['[object String]'],
        method: ['[object String]'],
        protocol: ['[object String]'],
        host: ['[object String]'],
        port: ['[object Number]'],
        path: ['[object String]'],
        url: ['[object String]'],

        headers: ['[object Object]'],
        body: ['[object String]', '[object Uint8Array]', 'instanceof Readable'],
        bodyFormData: ['[object Object]'],
        connectionTimeout: ['[object Number]'],

        responseBodySizeLimit: ['[object Number]'],
        responseBodySaveTo: ['[object String]'],

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
        method: ['GET', 'POST', 'PUT', 'DELETE', 'CONNECT', 'OPTIONS', 'HEAD', 'PATCH'],
        protocol: ['http', 'https'],
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
        customOptions.port = parsedUrl.port ? parseInt(parsedUrl.port) : customOptions.protocol === 'https' ? 443 : 80
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

        if (options.body && Object.keys(options.bodyFormData).length) {
            result.stackTrace.push(me + ': ' + 'Error: Incorrect option \'body\' value: \'' + options.body + '\' and option \'bodyFormData\' value: \'' + JSON.stringify(options.bodyFormData) + '\'. Use \'body\' or \'bodyFormData\', not both.')
            result.error = {
                code: 'INCORRECT_OPTION_VALUE',
                message: result.stackTrace[result.stackTrace.length - 1]
            }
            resolve(result)
            return
        }

        if (options.responseBodySaveTo) {
            while (options.responseBodySaveTo.includes('//')) {
                options.responseBodySaveTo = options.responseBodySaveTo.replaceAll('//', '/')
            }

            if (options.responseBodySaveTo.split('.').length > 1 && options.responseBodySaveTo.substr(-1, 1) === '/') {
                options.responseBodySaveTo = options.responseBodySaveTo.substr(0, options.responseBodySaveTo.length - 1)
            }

            let path = options.responseBodySaveTo
            if (path.split('.').length > 1) {
                path = path.split('/')
                path.splice(-1, 1)
                path = path.join('/')
            }
            if (!existsSync(path)) {
                result.stackTrace.push(me + ': ' + 'Error: Incorrect option \'responseBodySaveTo\' value: \'' + options.responseBodySaveTo + '\'. Selected directory didn\'t exists. Change path or create this directory.')
                result.error = {
                    code: 'INCORRECT_OPTION_VALUE',
                    message: result.stackTrace[result.stackTrace.length - 1]
                }
                resolve(result)
                return
            }
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

        const mimeTypes = {
            json: 'application/json',
            pdf: 'application/pdf',
            zip: 'application/zip',
            gzip: 'application/gzip',
            rar: 'application/x-rar-compressed',
            tar: 'application/x-tar',
            torrent: 'application/x-bittorrent',
            doc: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            docx: 'application/msword',
            xls: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            xlsx: 'application/vnd.ms-excel',
            xlsm: 'application/vnd.ms-excel.sheet.macroEnabled.12',
            ppt: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            pptx: 'application/vnd.ms-powerpoint',
            dvi: 'application/x-dvi',
            ttf: 'application/x-font-ttf',
            p12: 'application/x-pkcs12',
            pfx: 'application/x-pkcs12',
            p7b: 'application/x-pkcs7-certificates',
            spc: 'application/x-pkcs7-certificates',
            p7r: 'application/x-pkcs7-certreqresp',
            p7c: 'application/x-pkcs7-mime',
            p7m: 'application/x-pkcs7-mim',
            p7s: 'application/x-pkcs7-signature',
            mp3: 'audio/mpeg',
            aac: 'audio/aac',
            ogg: 'audio/ogg',
            gif: 'image/gif',
            jpeg: 'image/jpeg',
            jpg: 'image/jpeg',
            png: 'image/png',
            svg: 'image/svg+xml',
            tiff: 'image/tiff',
            ico: 'image/vnd.microsoft.icon',
            wbmp: 'image/vnd.wap.wbmp',
            cmd: 'text/cmd',
            css: 'text/css',
            csv: 'text/csv',
            html: 'text/html',
            js: 'text/javascript',
            txt: 'text/plain',
            php: 'text/php',
            xml: 'text/xml',
            mpeg: 'video/mpeg',
            mp4: 'video/mp4',
            webm: 'video/webm',
            flv: 'video/x-flv',
            avi: 'video/x-msvideo',
            '3gpp': 'video/3gpp',
            '3gp': 'video/3gpp',
            '3gpp2': 'video/3gpp2',
            '3g2': 'video/3gpp2'
        }

        let getHeadersSize = (headers) => {
            let size = 0
            for (const headerName in headers) {
                size += headerName.length + headers[headerName].length + 4
            }
            return size
        }

        let data = {
            request: {
                headers: {},
                headersSize: 0,
                body: '',
                bodyFormData: {},
                bodySize: 0
            },
            response: {
                headers: {},
                headersSize: 0,
                body: '',
                bodySize: 0,
                bodySavedTo: '',
                statusCode: 0
            }
        }

        let requestLibrary = options.protocol === 'http' ? require('http') : require('https')

        let boundary = ''
        if (Object.keys(options.bodyFormData).length > 0) {
            boundary = '--------------------------'
            for (let i = 0; i < 24; i++) {
                boundary += Math.floor(Math.random() * 10).toString(16)
            }
        }

        let requestOptions = {
            method: options.method,
            host: options.host,
            port: options.port,
            path: options.path,
            headers: Object.assign({}, options.headers),
            timeout: options.connectionTimeout,
            rejectUnauthorized: false,
            followRedirect: true,
            maxRedirects: 10
        }

        if (Object.keys(options.bodyFormData).length) {
            requestOptions.headers['Content-Type'] = 'multipart/form-data; boundary=' + boundary
        } else if (options.body instanceof Readable && !requestOptions.headers['Content-Type']) {
            let fileName = options.body.path.split('/')[options.body.path.split('/').length - 1]
            let fileExt = fileName.split('.')[1]
            if (fileExt && mimeTypes[fileExt]) {
                requestOptions.headers['Content-Type'] = mimeTypes[fileExt]
            } else {
                requestOptions.headers['Content-Type'] = mimeTypes.txt
            }
        }

        if (options.localAddress) {
            requestOptions.localAddress = options.localAddress
        }

        data.request.headers = Object.assign({}, requestOptions.headers)
        data.request.headersSize = getHeadersSize(data.request.headers)
        data.request.body = options.body
        data.request.bodyFormData = Object.assign({}, options.bodyFormData)
        data.response.bodySavedTo = options.responseBodySaveTo

        if (options.proxy.host && options.proxy.protocol === 'socks') {
            let proxyLibrary = require('socks-proxy-agent')

            let proxyOptions = require('url').parse(options.proxy.protocol + '://' + options.proxy.host + ':' + options.proxy.port + '/')
            if (options.proxy.username && options.proxy.password) {
                proxyOptions.auth = options.proxy.username + ':' + options.proxy.password
            }

            let proxyAgent = new proxyLibrary(proxyOptions)
            proxyAgent.timeout = options.proxy.connectionTimeout
            requestOptions.agent = proxyAgent
        }

        let request = requestLibrary.request(requestOptions, (res) => {
            let output
            switch (res.headers['content-encoding']) {
                case 'br':
                    let br = createBrotliDecompress()
                    res.pipe(br)
                    output = br
                    break
                case 'gzip':
                    let gzip = createGunzip()
                    res.pipe(gzip)
                    output = gzip
                    break
                case 'deflate':
                    let deflate = createInflate()
                    res.pipe(deflate)
                    output = deflate
                    break
                default:
                    output = res
                    break
            }

            res.setEncoding('binary')

            if (data.response.bodySavedTo && data.response.bodySavedTo.split('.').length === 1) {
                if (data.response.bodySavedTo.substr(-1, 1) !== '/') {
                    data.response.bodySavedTo += '/'
                }
                let lib = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
                for (let i = 0; i < 15; i++) {
                    data.response.bodySavedTo += lib[Math.floor(Math.random() * lib.length)]
                }
            } else {
                data.response.body = []
            }

            output.on('data', (chunk) => {
                data.response.bodySize += chunk.length
        
                if (data.response.bodySize > options.responseBodySizeLimit) {
                    res.destroy()
                    result.stackTrace.push(me + ': ' + 'Error: Response body size more than \'' + options.responseBodySizeLimit + '\' bytes. You can increase this value in option \'responseBodySizeLimit\'.')
                    result.error = {
                        code: 'RESPONSE_BODY_SIZE_LIMIT',
                        message: result.stackTrace[result.stackTrace.length - 1]
                    }
                    resolve(result)
                    return
                } else {
                    if (data.response.bodySavedTo) {
                        try {
                            appendFileSync(data.response.bodySavedTo, Buffer.from(chunk, 'binary'), 'utf8')
                        } catch (error) {
                            res.destroy()
                            request.destroy()
                            result.stackTrace.push(me + ': ' + 'Error: Can\'t save response body to file: \'' + data.response.bodySavedTo + '\'. Somebody remove this file while saving in progress, or rename/remove file directory.')
                            result.error = {
                                code: 'INCORRECT_OPTION_VALUE',
                                message: result.stackTrace[result.stackTrace.length - 1]
                            }
                            resolve(result)
                            return
                        }
                    } else {
                        data.response.body.push(Buffer.from(chunk, 'binary'))
                    }
                }
            })

            output.on('end', () => {
                clearTimeout(globalTimeout)
                request.destroy()
                if (!data.response.bodySavedTo) {
                    data.response.body = Buffer.concat(data.response.body)
                } else {
                    data.response.body = ''
                }
                result.data = data
                resolve(result)
                return
            })
        })

        let globalTimeout = setTimeout(() => {
            request.destroy()
            result.stackTrace.push(me + ': ' + 'Error: Request aborted cause request lasted more than \'' + options.globalTimeout + '\' ms. You can increase timeout in option \'globalTimeout\'.')
            result.error = {
                code: 'GLOBAL_TIMEOUT',
                message: result.stackTrace[result.stackTrace.length - 1]
            }
            resolve(result)
            return
        }, options.globalTimeout)

        request.on('response', response => {
            data.response.statusCode = response.statusCode
            data.response.headers = Object.assign({}, response.headers)
            data.response.headersSize = getHeadersSize(data.response.headers)
        })

        request.on('timeout', () => {
            request.destroy()
            result.stackTrace.push(me + ': ' + 'Error: Request aborted cause trying to connection with host take more than \'' + options.connectionTimeout + '\' ms, request didn\'t send. You can increase timeout in option \'timeout\'.')
            result.error = {
                code: 'HOST_CONNECTION_TIMEOUT',
                message: result.stackTrace[result.stackTrace.length - 1]
            }
            resolve(result)
            return
        })

        request.on('error', (error) => {
            request.destroy()
            if (data.response.bodySavedTo) {
                try {
                    unlinkSync(data.response.bodySavedTo)
                } catch(error) {
    
                }
            }

            result.stackTrace.push(me + ': ' + 'Request error event with error: ' + error.message)

            if (error.message.includes('routines:ssl3_get_record:wrong version number')) {
                error.message = 'routines:ssl3_get_record:wrong version number'
            } else if (error.message.includes('A "socket" was not created for HTTP request before')) {
                error.message = 'A "socket" was not created for HTTP request before'
            } else if (error.message.includes('connect ECONNREFUSED')) {
                error.message = 'connect ECONNREFUSED'
            }

            switch (error.message) {
                case 'socket hang up':
                    result.stackTrace.push(me + ': ' + 'Error: Host \'' + options.host + '\' aborted connection, request didn\'t send.')
                    result.error = {
                        code: 'HOST_ABORTED_CONNECTION',
                        message: result.stackTrace[result.stackTrace.length - 1]
                    }
                    break
                case 'routines:ssl3_get_record:wrong version number':
                    result.stackTrace.push(me + ': ' + 'Error: Host \'' + options.host + '\' unsupported TSL, request didn\'t send. Maby you trying send request to https through 80 port.')
                    result.error = {
                        code: 'HOST_UNSUPPORTED_TLS',
                        message: result.stackTrace[result.stackTrace.length - 1]
                    }
                    break
                case 'A "socket" was not created for HTTP request before':
                    result.stackTrace.push(me + ': ' + 'Error: Request aborted cause trying to connection with proxy take more than \'' + options.proxy.connectionTimeout + '\' ms, request didn\'t send. You can increase timeout in option \'proxy.connectionTimeout\'.')
                    result.error = {
                        code: 'PROXY_CONNECTION_TIMEOUT',
                        message: result.stackTrace[result.stackTrace.length - 1]
                    }
                    break
                case 'connect ECONNREFUSED':
                    result.stackTrace.push(me + ': ' + 'Error: Host \'' + options.host + '\' unreachable, request didn\'t send.')
                    result.error = {
                        code: 'HOST_UNREACHABLE',
                        message: result.stackTrace[result.stackTrace.length - 1]
                    }
                    break
                case 'Client network socket disconnected before secure TLS connection was established':
                    result.stackTrace.push(me + ': ' + 'Error: Request aborted cause trying to connection with proxy take more than \'' + options.proxy.connectionTimeout + '\' ms, request didn\'t send. You can increase timeout in option \'proxy.connectionTimeout\'.')
                    result.error = {
                        code: 'PROXY_ABORTED_CONNECTION',
                        message: result.stackTrace[result.stackTrace.length - 1]
                    }
                    break
                default:
                    result.stackTrace.push(me + ': ' + 'Error: ' + error.message)
                    result.error = {
                        code: 'HOST_UNHANDLED_ERROR',
                        message: result.stackTrace[result.stackTrace.length - 1]
                    }
                    break
            }
            resolve(result)
            return
        })

        if (!data.request.body && !Object.keys(data.request.bodyFormData).length) {
            request.end()
        } else if (data.request.body && !(data.request.body instanceof Readable)) {
            data.request.bodySize = data.request.body.length
            request.write(data.request.body)
            request.end()
        } else if (data.request.body instanceof Readable) {
            // TO DO: COUNT THE AMOUNT OF REQUEST BODY SIZE
            data.request.body.pipe(request)
        } else if (Object.keys(data.request.bodyFormData).length) {
            // TO DO: COUNT THE AMOUNT OF REQUEST BODY SIZE
            let sendBodySync = (boundary, formDataName, formDataValue, isStart, isEnd, writeStream) => {
                return new Promise((resolve) => {
                    
                    /*
                        BODY HEADER CREATE STREAM:
                    */
        
                    let bodyHead = ''
                    if (!isStart) {
                        bodyHead += '\r\n'
                    }
                    bodyHead += '--' + boundary + '\r\n'
        
                    if (typeof(formDataValue) !== 'object') {
                        bodyHead += 'Content-Disposition: form-data; name="' + formDataName + '"' + '\r\n\r\n'
                    } else {
                        let fileName = formDataValue.path.split('/')[formDataValue.path.split('/').length - 1]
                        let fileExt = fileName.split('.')
                        let bodyHeadContentType = mimeTypes[fileExt]
                        if (!bodyHeadContentType) {
                            bodyHeadContentType = mimeTypes.txt
                        }
                        bodyHead += 'Content-Disposition: form-data; name="' + formDataName + '"; filename="' + formDataValue.path.split('/')[formDataValue.path.split('/').length - 1] + '"' + '\r\n'
                        bodyHead += 'Content-Type: ' + bodyHeadContentType + '\r\n\r\n'
                    }
                    let bodyHeadStream = Readable.from(Buffer.from(bodyHead.toString()))
        
                    bodyHeadStream.on('end', () => {
        
                        /*
                            BODY DATA CREATE STREAM:
                        */
        
                        let bodyDataStream
                        if (typeof(formDataValue) !== 'object') {
                            bodyDataStream = Readable.from(Buffer.from(formDataValue.toString()))
                        } else {
                            bodyDataStream = formDataValue
                        }
            
                        bodyDataStream.on('end', () => {
                            if (isEnd) {
        
                                /*
                                    BODY FOOTER CREATE STREAM:
                                */
        
                                let bodyFooterStream = Readable.from(Buffer.from('\r\n' + '--' + boundary + '--'))
        
                                bodyFooterStream.on('end', () => {
                                    resolve(writeStream)
                                    return
                                })
        
                                /*
                                    BODY FOOTER SEND STREAM:
                                */

                                bodyFooterStream.pipe(writeStream)
                            } else {
                                resolve(writeStream)
                                return
                            }
                        })
            
                        /*
                            BODY DATA SEND STREAM:
                        */
        
                        bodyDataStream.pipe(writeStream, {end: false})
                    })
        
                    /*
                        BODY HEADER SEND STREAM:
                    */
        
                    bodyHeadStream.pipe(writeStream, {end: false})
                })
            }

            let i = 0
            for (const formDataName in data.request.bodyFormData) {
                i++
                let isStart = i === 1 ? true : false
                let isEnd = i === Object.keys(data.request.bodyFormData).length ? true : false
    
                let formDataValue = data.request.bodyFormData[formDataName]
                if (formDataValue === undefined) {
                    formDataValue = ''
                }
                await sendBodySync(boundary, formDataName, formDataValue, isStart, isEnd, request)
            }
        } else {
            result.stackTrace.push(me + ': ' + 'Error: Unknow request type.')
            result.error = {
                code: 'HOST_UNHANDLED_ERROR',
                message: result.stackTrace[result.stackTrace.length - 1]
            }
            resolve(result)
            return
        }
    })
}