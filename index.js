const toolslight = require('toolslight')
const tgmlight = require('tgmlight')
const fs = require('fs')

class Handlerlight {
    constructor(options) {
        this.serviceInfo = options.serviceInfo
        this.logDirectory = options.logDirectory
        this.telegramChannelId = options.telegramChannelId
        this.telegramBotToken = options.telegramBotToken
        this.triggerText = options.triggerText
        this.stackTrace = []
        this.tgm = new tgmlight
    }

    static create = (customOptions = {}) => {
        let defaultOptions = {
            serviceInfo: {}, // Default: {}. Required: no. Type: Object. Description: additional arbitrary information about service.
            logDirectory: '', // Default: ''. Required: yes. Type: String. Description: Path to folder, for save log files.
            telegramChannelId: '', // Default: ''. Required: no. Type: String. Description: Telegram channel id for collect reports.
            telegramBotToken: '', // Default: ''. Required: no. Type: String. Description: Token of telegram bot, who can send messages to telegram channel.
            triggerText: 'Critical: true.' // Default: ''. Required: yes. Type: String. Description: If this text will contain in the end of 'log' function argument - stack trace will save to file, send to telegram channel, and reset.
        }

        let options = {}

        for (const defaultOption in defaultOptions) {
            if (Object.prototype.toString.call(defaultOptions[defaultOption]) === Object.prototype.toString.call(customOptions[defaultOption])) {
                options[defaultOption] = customOptions[defaultOption]
            } else {
                options[defaultOption] = defaultOptions[defaultOption]
            }
        }

        if (!options.logDirectory) {
            throw new Error('handlerlight: incorrect \'create\' function argument. Argument \'logDirectory\' missing or empty. For example: let handler = handlerlight.create({logDirectory: \'/srv/project/log\', triggerText: \'Critical: true.\'})')
        }

        if (!options.triggerText) {
            throw new Error('handlerlight: incorrect \'create\' function argument. Argument \'triggerText\' missing or empty. For example: let handler = handlerlight.create({logDirectory: \'/srv/project/log\', triggerText: \'Critical: true.\'})')
        }

        if (!fs.existsSync(options.logDirectory)) {
            throw new Error('handlerlight: incorrect \'create\' function argument. Directory \'' + options.logDirectory + '\' in argument \'logDirectory\' not exists. For example: let handler = handlerlight.create({logDirectory: \'/srv/project/log\', triggerText: \'Critical: true.\'})')
        }

        return new this(options)
    }

    log = async (data = '') => {
        data = data.toString()
        let ts = toolslight.getTs()

        this.stackTrace.push('[' + toolslight.getDate(ts) + ']' + ' ' + data)
        if (data.substr(data.length - this.triggerText.length, this.triggerText.length) === this.triggerText) {
            let year = toolslight.getYear(ts)
            let month = toolslight.getMonth(ts) > 9 ? toolslight.getMonth(ts) : '0' + toolslight.getMonth(ts)
            let day = toolslight.getDay(ts) > 9 ? toolslight.getDay(ts) : '0' + toolslight.getDay(ts)
            let hour = toolslight.getHour(ts) > 9 ? toolslight.getHour(ts) : '0' + toolslight.getHour(ts)
            let minute = toolslight.getMinute(ts) > 9 ? toolslight.getMinute(ts) : '0' + toolslight.getMinute(ts)
            let second = toolslight.getSecond(ts) > 9 ? toolslight.getSecond(ts) : '0' + toolslight.getSecond(ts)
            let random = toolslight.uniqid()
            let logFileName = year + '-' + month + '-' + day + '_' + hour + ':' + minute + ':' + second + '_' + random + '.log'
            let stackTraceText = this.stackTrace.join('\r\n')
            fs.writeFileSync(this.logDirectory + '/' + logFileName, stackTraceText)
            this.stackTrace = null
            delete this.stackTrace
            this.stackTrace = []

            if (this.telegramChannelId && this.telegramBotToken) {
                let text = ''
                for (const serviceInfoName in this.serviceInfo) {
                    text += serviceInfoName + ': ' + this.serviceInfo[serviceInfoName] + '\n'
                }

                let result = await this.tgm
                .setBotToken(this.telegramBotToken)
                .setChatId(this.telegramChannelId)
                .setText(text)
                .setDocument(fs.createReadStream(this.logDirectory + '/' + logFileName))
                .setDisableNotification()
                .sendDocument()

                result = toolslight.jsonToObject(result.response.body)
                if (result.ok) {
                    fs.unlinkSync(this.logDirectory + '/' + logFileName)
                }
            }
        }
    }

    reset = () => {
        this.stackTrace = null
        delete this.stackTrace
        this.stackTrace = []
    }
}

module.exports = Handlerlight