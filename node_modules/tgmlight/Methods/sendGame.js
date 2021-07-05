const path = require('path')
const Tgmlight = require('../index.js')

/*
    [Example-1]:

    const tgmlight = require('tgmlight')
    let tgm = new tgmlight
    tgm
    .setBotToken('1234567890:AbCdEfGhIjKlMnOpQrStUvWxYz')
    .setChatId('9876543210')
    .setGameShortName('gameshortname')
    .setDisableNotification()
    .addKeyboardRow([
        {text: 'Play!', callbackGame: {}},
        {text: 'Share', switchInlineQuery: ' cool bot! Join to us!'},
    ])
    .addKeyboardRow([
        {text: 'My site', url: 'https://example.com'},
    ])
    .sendGame()

    
    [Example-2]:

    const tgmlight = require('tgmlight')
    let tgm = new tgmlight
    tgm.setBotToken('1234567890:AbCdEfGhIjKlMnOpQrStUvWxYz')
    tgm.setMessageType('sendGame')
    tgm.setChatId('9876543210')
    tgm.setGameShortName('gameshortname')
    tgm.setDisableNotification()
    tgm.addKeyboardRow([
        {text: 'Play!', callbackGame: {}},
        {text: 'Share', switchInlineQuery: ' cool bot! Join to us!'},
    ])
    tgm.addKeyboardRow([
        {text: 'My site', url: 'https://example.com'},
    ])
    tgm.send()
*/

Tgmlight.prototype.sendGame = function() {

    let result = ''

    let parameters = [
        'chat_id', // Default: none. Required: yes. Type: Integer or String.
        'game_short_name', // Default: none. Required: yes. Type: String.
        'disable_notification', // Default: false. Required: no. Type: Boolean.
        'reply_to_message_id', // Default: none. Required: no. Type: Integer.
        'allow_sending_without_reply', // Default: false. Required: no. Type: Boolean.
        'reply_markup' // Default: none. Required: no. Type: InlineKeyboardMarkup or ReplyKeyboardMarkup or ReplyKeyboardRemove or ForceReply.
    ]

    if (this.requestOptions.messageType === undefined) {
        this.setMessageType(path.basename(__filename).substr(0, path.basename(__filename).length - 3))
    }

    result = this.request(parameters)

    return result
}
