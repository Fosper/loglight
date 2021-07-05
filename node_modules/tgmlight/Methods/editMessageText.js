const path = require('path')
const Tgmlight = require('../index.js')

/*
    [Example-1]:

    const tgmlight = require('tgmlight')
    let tgm = new tgmlight
    tgm
    .setBotToken('1234567890:AbCdEfGhIjKlMnOpQrStUvWxYz')
    .setChatId('9876543210')
    .setMessageId(9876556789)
    .setText('Hello world again!')
    .addKeyboardRow([
        {text: 'Button-3', callbackData: 'ButtonThree'},
        {text: 'Button-2', callbackData: 'ButtonTwo'},
    ])
    .addKeyboardRow([
        {text: 'Button-1', callbackData: 'ButtonOne'},
    ])
    .editMessageText()

    
    [Example-2]:

    const tgmlight = require('tgmlight')
    let tgm = new tgmlight
    tgm.setBotToken('1234567890:AbCdEfGhIjKlMnOpQrStUvWxYz')
    tgm.setMessageType('editMessageText')
    tgm.setChatId('9876543210')
    tgm.setMessageId(9876556789)
    tgm.setText('Hello world again!')
    tgm.addKeyboardRow([
        {text: 'Button-3'},
        {text: 'Button-2'},
    ])
    tgm.addKeyboardRow([
        {text: 'Button-1'},
    ])
    tgm.send()
*/

Tgmlight.prototype.editMessageText = function() {

    let result = ''

    let parameters = [
        'chat_id', // Default: none. Required: no. Type: Integer or String. Required if inline_message_id is not specified.
        'message_id', // Default: none. Required: no. Type: Integer. Required if inline_message_id is not specified. 
        'inline_message_id', // // Default: none. Required: no. Type: String. Required if chat_id and message_id are not specified.
        'text', // Default: none. Required: yes. Type: String.
        'parse_mode', // Default: 'Markdown'. Required: no. Type: String.
        'entities', // Default: none. Required: no. Type: Array of MessageEntity.
        'disable_web_page_preview', // Default: false. Required: no. Type: Boolean.
        'reply_markup' // Default: none. Required: no. Type: InlineKeyboardMarkup or ReplyKeyboardMarkup or ReplyKeyboardRemove or ForceReply.
    ]

    if (this.requestOptions.messageType === undefined) {
        this.setMessageType(path.basename(__filename).substr(0, path.basename(__filename).length - 3))
    }

    result = this.request(parameters)

    return result
}