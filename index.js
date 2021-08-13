const toolslight = require('toolslight')
const tgmlight = require('tgmlight')
const { Readable } = require('stream')
const { writeFileSync } = require('fs')

class Loglight {
    constructor(customOptions = {}) {
        let defaultOptions = {
            reportPhrases: [],
            reportHeader: '',
            UTC: 0
        }

        let getOptions = (defaultOptions, customOptions) => {
            let options = {}
            for (const defaultOption in defaultOptions) {
                if (Object.prototype.toString.call(defaultOptions[defaultOption]) === Object.prototype.toString.call(customOptions[defaultOption])) {
                    if (Object.prototype.toString.call(defaultOptions[defaultOption]) === '[object Object]') {
                        options[defaultOption] = getOptions(defaultOptions[defaultOption], customOptions[defaultOption])
                    } else {
                        options[defaultOption] = customOptions[defaultOption]
                    }
                } else {
                    if (customOptions[defaultOption] === undefined) {
                        options[defaultOption] = defaultOptions[defaultOption]
                    } else {
                        throw new Error('loglight: class create error. Incorrect data type for option \'' + defaultOption + '\'.')
                    }
                }
            }
            return options
        }

        let options = getOptions(defaultOptions, customOptions)

        for (let reportPhrase of options.reportPhrases) {
            if (typeof reportPhrase !== 'string') {
                throw new Error('loglight: class create error. Incorrect data type in option \'reportPhrases\' - all elements of this array must be string.')
            }
        }

        this.options = options
        this.sources = []
        this.stackTrace = []
        this.tgm = new tgmlight
    }

    setUTC = (UTC) => {
        if (typeof UTC !== 'number') {
            throw new Error('loglight: \'setUTC\' function error. Incorrect data type in argument. Must be number, from -12 to 14.')
        }
        if (UTC < -12 || UTC > 14) {
            throw new Error('loglight: \'setUTC\' function error. Incorrect data value in argument. Must be number, from -12 to 14.')
        }
        this.options.UTC = UTC

        return this
    }

    addSource = (source = '',  customOptions = {}) => {
        let defaultOptions
        switch (source) {
            case 'console':
                defaultOptions = {
                    name: '',
                    reportPhrases: [],
                    reportHeader: ''
                }
                break
            case 'file':
                defaultOptions = {
                    name: '',
                    reportPhrases: [],
                    reportHeader: '',
                    directory: ''
                }
                break
            case 'telegram':
                defaultOptions = {
                    name: '',
                    reportPhrases: [],
                    reportHeader: '',
                    directory: '',
                    botToken: '',
                    channelId: '',
                    message: ''
                }
                break
            default:
                throw new Error('loglight: \'addSource\' function error. Incorrect source \'' + source + '\'. Supports sources: \'console\', \'file\', \'telegram\'.')
        }

        let getOptions = (defaultOptions, customOptions) => {
            let options = {}
            for (const defaultOption in defaultOptions) {
                if (Object.prototype.toString.call(defaultOptions[defaultOption]) === Object.prototype.toString.call(customOptions[defaultOption])) {
                    if (Object.prototype.toString.call(defaultOptions[defaultOption]) === '[object Object]') {
                        options[defaultOption] = getOptions(defaultOptions[defaultOption], customOptions[defaultOption])
                    } else {
                        options[defaultOption] = customOptions[defaultOption]
                    }
                } else {
                    if (customOptions[defaultOption] === undefined) {
                        options[defaultOption] = defaultOptions[defaultOption]
                    } else {
                        throw new Error('loglight: \'addSource\' function error. Incorrect data type for option \'' + defaultOption + '\'.')
                    }
                }
            }
            return options
        }

        let options = getOptions(defaultOptions, customOptions)

        for (let reportPhrase of options.reportPhrases) {
            if (typeof reportPhrase !== 'string') {
                throw new Error('loglight: \'addSource\' function error. Incorrect data type in option \'reportPhrases\' - all elements of this array must be string.')
            }
        }

        switch (source) {
            case 'console':
                this.sources.push({
                    source: 'console',
                    name: options.name,
                    reportPhrases: options.reportPhrases,
                    reportHeader: options.reportHeader
                })
                break
            case 'file':
                if (!toolslight.isPathExists(options.directory).data) {
                    throw new Error('loglight: \'addSource\' function error. Incorrect data type in option \'directory\' - directory \'' + options.directory + '\' not exists. Create directory or use path to existing directory.')
                }
                this.sources.push({
                    source: 'file',
                    name: options.name,
                    reportPhrases: options.reportPhrases,
                    reportHeader: options.reportHeader,
                    directory: options.directory
                })
                break
            case 'telegram':
                if (!toolslight.isPathExists(options.directory).data) {
                    throw new Error('loglight: \'addSource\' function error. Incorrect data type in option \'directory\' - directory \'' + options.directory + '\' not exists. Create directory or use path to existing directory.')
                }
                if (!options.botToken) {
                    throw new Error('loglight: \'addSource\' function error. You didn\'t set option \'botToken\' for send messages to telegram channel.')
                }
                if (!options.channelId) {
                    throw new Error('loglight: \'addSource\' function error. You didn\'t set option \'channelId\' for send messages to telegram channel.')
                }
                this.sources.push({
                    source: 'telegram',
                    name: options.name,
                    reportPhrases: options.reportPhrases,
                    reportHeader: options.reportHeader,
                    directory: options.directory,
                    botToken: options.botToken,
                    channelId: options.channelId,
                    message: options.message
                })
                break
        }

        return this
    }

    removeSource = (customOptions = {}) => {
        let defaultOptions = {
            name: ''
        }

        let getOptions = (defaultOptions, customOptions) => {
            let options = {}
    
            for (const defaultOption in defaultOptions) {
                if (defaultOption === 'name' && typeof customOptions === 'string') {
                    options[defaultOption] = customOptions
                    continue
                }
    
                if (Object.prototype.toString.call(defaultOptions[defaultOption]) === Object.prototype.toString.call(customOptions[defaultOption])) {
                    if (Object.prototype.toString.call(defaultOptions[defaultOption]) === '[object Object]') {
                        options[defaultOption] = getOptions(defaultOptions[defaultOption], customOptions[defaultOption])
                    } else {
                        options[defaultOption] = customOptions[defaultOption]
                    }
                } else {
                    if (customOptions[defaultOption] === undefined) {
                        options[defaultOption] = defaultOptions[defaultOption]
                    } else {
                        throw new Error('loglight: \'removeSource\' function error. Incorrect data type for option \'' + defaultOption + '\'.')
                    }
                }
            }
            return options
        }
    
        let options = getOptions(defaultOptions, customOptions)

        if (!options.name) {
            return this
        }

        let sources = []
        for (let sourceOptions of this.sources) {
            if (sourceOptions.name === options.name) {
                continue
            }
            sources.push(sourceOptions)
        }
        this.sources = sources

        return this
    }

    log = (logData = '') => {

        let dataList = []
        if (Object.prototype.toString.call(logData) === '[object String]') {
            dataList.push(logData)
        } else {
            dataList = logData
        }

        for (let data of dataList) {
            if (!data) {
                continue
            }
            data = data.toString()
            let ts = toolslight.getTs({utc: this.options.UTC}).data
    
            this.stackTrace.push('[' + toolslight.getDate(ts).data + ']' + ' ' + data)
    
            let sources = []
            for (let sourceOptions of this.sources) {
                let reportPhrases = toolslight.arraysMerge({arrays: [this.options.reportPhrases, sourceOptions.reportPhrases]})
                if (reportPhrases.error) {
                    throw new Error('loglight: \'log\' function error. Internal error, please write to developer.')
                }
                reportPhrases = reportPhrases.data
                for (let reportPhrase of reportPhrases) {
                    if (data.includes(reportPhrase)) {
                        sources.push(sourceOptions)
                    }
                }
            }
    
            if (sources.length) {
                this.report(sources)
            }
        }

        return this
    }

    report = (sources = []) => {
        let stackTrace = Array.from(this.stackTrace)

        if (Object.prototype.toString.call(stackTrace) !== '[object Array]') {
            return this.report()
        }

        if (!stackTrace.length) {
            return this
        }

        this.clear()

        if (!sources.length) {
            sources = this.sources
        } else {
            let customSources = []
            if (Object.prototype.toString.call(sources) === '[object String]') {
                let tmp = sources
                sources = [tmp]
            }
            for (let source of sources) {
                if (Object.prototype.toString.call(source) === '[object Object]') {
                    customSources.push(source)
                } else {
                    for (let sourceOptions of this.sources) {
                        if (sourceOptions.name === source) {
                            customSources.push(sourceOptions)
                            break
                        }
                    }
                }
            }
            sources = customSources
        }

        for (let sourceOptions of sources) {
            let reportHeader = ''
            if (this.options.reportHeader) {
                reportHeader = this.options.reportHeader
            }

            if (sourceOptions.reportHeader) {
                if (reportHeader) {
                    reportHeader += '\r\n'
                }
                reportHeader += sourceOptions.reportHeader
            }

            if (reportHeader) {
                reportHeader += '\r\n\r\n'
            }

            switch (sourceOptions.source) {
                case 'console':
                    console.log(reportHeader + stackTrace.join('\r\n') + '\r\n')
                    break
                case 'file':
                    writeFileSync(sourceOptions.directory + '/' + this.generateLogFileName(), reportHeader + stackTrace.join('\r\n') + '\r\n')
                    break
                case 'telegram':
                    let document = Readable.from(Buffer.from(reportHeader + stackTrace.join('\r\n') + '\r\n'))
                    document.path = this.generateLogFileName(true)
        
                    this.tgm
                    .setBotToken(sourceOptions.botToken)
                    .setChatId(sourceOptions.channelId)
                    .setText(sourceOptions.message)
                    .setParseMode('HTML')
                    .setDocument(document)
                    .sendDocument().then((result) => {
                        result = toolslight.jsonToObject(result.data)
                        let isOk = true
                        if (result.data) {
                            if (!result.data.ok) {
                                isOk = false
                            }
                        } else {
                            isOk = false
                        }

                        if (!isOk && sourceOptions.directory) {
                            writeFileSync(sourceOptions.directory + '/' + this.generateLogFileName(), reportHeader + stackTrace.join('\r\n') + '\r\n')
                        }
                    })
                    break
            }
        }
        
        return this
    }

    clear = () => {
        this.stackTrace = null
        delete this.stackTrace
        this.stackTrace = []

        return this
    }

    tgMsg = (data = '', onlyForFirst = true) => {
        for (let sourceOptions of this.sources) {
            switch (sourceOptions.source) {
                case 'telegram':
                    this.tgm
                    .setBotToken(sourceOptions.botToken)
                    .setChatId(sourceOptions.channelId)
                    .setText(data)
                    .setParseMode('HTML')
                    .sendMessage()
                    if (onlyForFirst) {
                        return this
                    }
                    break
            }
        }

        return this
    }

    generateLogFileName = function(isShort = false) {
        let ts = toolslight.getTs({utc: this.options.UTC}).data
        let year = toolslight.getYear(ts).data
        let month = toolslight.getMonth(ts).data > 9 ? toolslight.getMonth(ts).data : '0' + toolslight.getMonth(ts).data
        let day = toolslight.getDayOfMonth(ts).data > 9 ? toolslight.getDayOfMonth(ts).data : '0' + toolslight.getDayOfMonth(ts).data
        let hour = toolslight.getHour(ts).data > 9 ? toolslight.getHour(ts).data : '0' + toolslight.getHour(ts).data
        let minute = toolslight.getMinute(ts).data > 9 ? toolslight.getMinute(ts).data : '0' + toolslight.getMinute(ts).data
        let second = toolslight.getSecond(ts).data > 9 ? toolslight.getSecond(ts).data : '0' + toolslight.getSecond(ts).data
        let random = toolslight.uniqid().data

        if (isShort) {
            return year + '_' + month + '_' + day + '_' + hour + '-' + minute + '-' + second + '.log'
        }
        
        return year + '_' + month + '_' + day + '_' + hour + '-' + minute + '-' + second + '-' + random + '.log'
    }
}

module.exports = Loglight