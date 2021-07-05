const tl = require('toolslight')
const stream = require('stream')
const fs = require('fs')

class Tgmlight {
    constructor() {
        this.apiUrl = 'api.telegram.org'
        this.contentType = 'application/json'
        this.botToken = ''
        this.messageType = 'sendMessage'
        this.requestOptions = {}
    }
    
    /*
        Lib tools.
    */

    setApiUrl = (value) => {
        this.apiUrl = value
        return this
    }
    
    getApiUrl = () => {
        return this.apiUrl
    }

    setContentType = (value) => {
        this.contentType = value
        return this
    }
    
    getContentType = () => {
        return this.contentType
    }

    setBotToken = (value) => {
        this.botToken = value
        return this
    }
    
    getBotToken = () => {
        return this.botToken
    }

    setRequestOptions = (value) => {
        this.requestOptions = value
        return this
    }

    getRequestOptions = () => {
        return this.requestOptions
    }

    setMessageType = (value) => {
        this.messageType = value
        return this
    }
    
    getMessageType = () => {
        return this.messageType
    }

    addKeyboardRow = (value) => {
        let keyboardType = 'inline_keyboard'
        if (typeof value[0] === 'string') {
            keyboardType = 'keyboard'
        } else {
            if (value[0].requestContact !== undefined || value[0].requestLocation !== undefined || value[0].requestPoll !== undefined) {
                keyboardType = 'keyboard'
            }
        }

        let keyboardRow = []
        for (const button of value) {
            let key = {}
            if (typeof button === 'string') {
                key.text = button
            } else {
                for (const buttonField of Object.keys(button)) {
                    switch (buttonField) {
                        case 'text':
                            key.text = button[buttonField]
                            break;
                        case 'requestContact':
                            key.request_contact = button[buttonField]
                            break
                        case 'requestLocation':
                            key.request_location = button[buttonField]
                            break
                        case 'requestPoll':
                            key.request_poll = button[buttonField]
                            break
                        case 'url':
                            key.url = button[buttonField]
                            break
                        case 'loginUrl':
                            key.login_url = button[buttonField]
                            break
                        case 'callbackData':
                            key.callback_data = button[buttonField]
                            break
                        case 'switchInlineQuery':
                            key.switch_inline_query = button[buttonField]
                            break
                        case 'switchInlineQueryCurrentChat':
                            key.switch_inline_query_current_chat = button[buttonField]
                            break
                        case 'callbackGame':
                            key.callback_game = button[buttonField]
                            break
                        case 'pay':
                            key.pay = button[buttonField]
                            break
                        default:
                            key[buttonField] = button[buttonField]
                            break
                    }
                }
            }
            keyboardRow.push(key)
        }

        let replyMarkup = this.getReplyMarkup()
        if (tl.isEmpty(replyMarkup[keyboardType])) {
            replyMarkup[keyboardType] = []
        }
        replyMarkup[keyboardType].push(keyboardRow)

        this.setReplyMarkup(replyMarkup)

        return this
    }

    /*
        For set telegram methods fields.
    */

    setChatId = (value) => {
        this.requestOptions.chat_id = value
        return this
    }
    
    getChatId = () => {
        return this.requestOptions.chat_id
    }

    setMessageId = (value) => {
        this.requestOptions.message_id = value
        return this
    }
    
    getMessageId = () => {
        return this.requestOptions.message_id
    }

    setGameShortName = (value) => {
        this.requestOptions.game_short_name = value
        return this
    }
    
    getGameShortName = () => {
        return this.requestOptions.game_short_name
    }

    setInlineMessageId = (value) => {
        this.requestOptions.inline_message_id = value
        return this
    }
    
    getInlineMessageId = () => {
        return this.requestOptions.inline_message_id
    }

    setText = (value) => {
        this.requestOptions.text = value
        return this
    }
    
    getText = () => {
        return this.requestOptions.text
    }

    setDocument = (value) => {
        this.requestOptions.document = value
        return this
    }

    getDocument = () => {
        return this.requestOptions.document
    }

    setThumb = (value) => {
        this.requestOptions.thumb = value
        return this
    }

    getThumb = () => {
        return this.requestOptions.thumb
    }

    setCaption = (value) => {
        this.requestOptions.caption = value
        return this
    }

    getCaption = () => {
        return this.requestOptions.caption
    }

    setCaptionEntities = (value) => {
        this.requestOptions.caption_entities = value
        return this
    }

    getCaptionEntities = () => {
        return this.requestOptions.caption_entities
    }

    setUrl = (value) => {
        this.requestOptions.url = value
        return this
    }
    
    getUrl = () => {
        return this.requestOptions.url
    }
    
    setCacheTime = (value) => {
        this.requestOptions.cache_time = value
        return this
    }
    
    getCacheTime = () => {
        return this.requestOptions.cache_time
    }

    setCallbackQueryId = (value) => {
        this.requestOptions.callback_query_id = value
        return this
    }
    
    getCallbackQueryId = () => {
        return this.requestOptions.callback_query_id
    }

    setParseMode = (value) => {
        this.requestOptions.parse_mode = value
        return this
    }
    
    getParseMode = () => {
        return this.requestOptions.parse_mode ? this.requestOptions.parse_mode : 'Markdown'
    }

    setEntities = (value) => {
        this.requestOptions.entities = value
        return this
    }
    
    getEntities = () => {
        return this.requestOptions.entities
    }

    setDisableWebPagePreview = (value = true) => {
        this.requestOptions.disable_web_page_preview = value
        return this
    }

    getDisableWebPagePreview = () => {
        return this.requestOptions.disable_web_page_preview
    }

    setDisableContentTypeDetection = (value = true) => {
        this.requestOptions.disable_content_type_detection = value
        return this
    }

    getDisableContentTypeDetection = () => {
        return this.requestOptions.disable_content_type_detection
    }

    setDisableNotification = (value = true) => {
        this.requestOptions.disable_notification = value
        return this
    }

    getDisableNotification = () => {
        return this.requestOptions.disable_notification
    }

    setAllowSendingWithoutReply = (value = true) => {
        this.requestOptions.allow_sending_without_reply = value
        return this
    }

    getAllowSendingWithoutReply = () => {
        return this.requestOptions.allow_sending_without_reply
    }

    setReplyToMessageId = (value) => {
        this.requestOptions.reply_to_message_id = value
        return this
    }

    getReplyToMessageId = () => {
        return this.requestOptions.reply_to_message_id
    }

    setResizeKeyboard = (value = true) => {
        if (tl.isEmpty(this.requestOptions.reply_markup)) {
            this.requestOptions.reply_markup = {}
        }
        this.requestOptions.reply_markup.resize_keyboard = value
        return this
    }

    getResizeKeyboard = () => {
        return this.requestOptions.reply_markup.resize_keyboard
    }

    setOneTimeKeyboard = (value = true) => {
        if (tl.isEmpty(this.requestOptions.reply_markup)) {
            this.requestOptions.reply_markup = {}
        }
        this.requestOptions.reply_markup.one_time_keyboard = value
        return this
    }

    getOneTimeKeyboard = () => {
        return this.requestOptions.reply_markup.one_time_keyboard
    }

    setSelective = (value = true) => {
        if (tl.isEmpty(this.requestOptions.reply_markup)) {
            this.requestOptions.reply_markup = {}
        }
        this.requestOptions.reply_markup.selective = value
        return this
    }

    getSelective = () => {
        return this.requestOptions.reply_markup.selective
    }

    setShowAlert = (value = true) => {
        this.requestOptions.show_alert = value
        return this
    }

    getShowAlert = () => {
        return this.requestOptions.show_alert
    }

    setReplyMarkup = (value) => {
        this.requestOptions.reply_markup = value
        return this
    }

    getReplyMarkup = () => {
        if (tl.isEmpty(this.requestOptions.reply_markup)) {
            this.requestOptions.reply_markup = {}
        }
        return this.requestOptions.reply_markup
    }

    /*
        For send request to telegram.
    */

    send = () => {
        return this[this.messageType]()
    }

    /*
        Private functions (not for use).
    */

    request = async (parameters) => {
        let requestOptions = {
            method: 'POST',
            protocol: 'https',
            host: 'api.telegram.org',
            port: 443,
            path: '/bot' + this.botToken + '/' + this.messageType,
            headers: {}
        }

        let body = {}
        let isFormData = false

        for (const parameter of parameters) {
            let func = parameter.replace(/([-_][a-z])/ig, ($1) => {
                return $1.toUpperCase()
                  .replace('-', '')
                  .replace('_', '')
            })
            func = 'get' + func.charAt(0).toUpperCase() + func.slice(1)
            if (!tl.isEmpty(this[func])) {
                let funcRes
                switch (func) {
                    case 'getDocument':
                        funcRes = this[func]()
                        if (funcRes instanceof stream.Readable) {
                            isFormData = true
                        }
                        break
                    case 'getReplyMarkup':
                        funcRes = this[func]()
                        if (!tl.isEmpty(funcRes)) {
                            funcRes = JSON.stringify(funcRes)
                        } else {
                            continue
                        }
                        break
                    case 'getCaption':
                        funcRes = this[func]()
                        if (!funcRes) {
                            funcRes = this.getText()
                            if (!funcRes) {
                                continue
                            }
                        }
                        break
                    default:
                        funcRes = funcRes = this[func]()
                        break
                }
                if (funcRes !== undefined) {
                    body[parameter] = funcRes
                }
            }
        }

        if (!isFormData) {
            requestOptions.headers['Content-Type'] = this.contentType
        }

        if (isFormData) {
            requestOptions.formData = {}
            for (const bodyName in body) {
                let bodyValue = body[bodyName]

                if (typeof(bodyValue) === 'string' && bodyValue.includes('/')) {
                    requestOptions.formData[bodyName] = fs.createReadStream(bodyValue)
                } else {
                    requestOptions.formData[bodyName] = bodyValue
                }
            }
        } else {
            requestOptions.body = JSON.stringify(body)
        }

        let err, data
        [err, data] = await tl.request(requestOptions)
        if (err) {
            return err
        }
        return data
    }
}

module.exports = Tgmlight

require('./Methods/answerCallbackQuery.js')
require('./Methods/editMessageText.js')
require('./Methods/sendDocument.js')
require('./Methods/sendGame.js')
require('./Methods/sendMessage.js')