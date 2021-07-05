const path = require('path')
const Tgmlight = require('../index.js')

/*
    [Example-1]:

    const tgmlight = require('tgmlight')
    let tgm = new tgmlight
    tgm
    .setBotToken('1234567890:AbCdEfGhIjKlMnOpQrStUvWxYz')
    .setCallbackQueryId('98765432109876543210')
    .setUrl('https://google.com')
    .answerCallbackQuery()

    
    [Example-2]:

    const tgmlight = require('tgmlight')
    let tgm = new tgmlight
    tgm.setBotToken('1234567890:AbCdEfGhIjKlMnOpQrStUvWxYz')
    tgm.setMessageType('answerCallbackQuery')
    tgm.setCallbackQueryId('98765432109876543210')
    tgm.setText('Alert!')
    tgm.setShowAlert()
    tgm.send()
*/

Tgmlight.prototype.answerCallbackQuery = function() {

    let result = ''

    let parameters = [
        'callback_query_id', // Default: none. Required: yes. Type: String.
        'text', // Default: none. Required: no. Type: String.
        'show_alert', // Default: false. Required: no. Type: Boolean.
        'url', // Default: none. Required: no. Type: String.
        'cache_time'  // Default: 0. Required: no. Type: Integer.
    ]

    if (this.requestOptions.messageType === undefined) {
        this.setMessageType(path.basename(__filename).substr(0, path.basename(__filename).length - 3))
    }

    result = this.request(parameters)

    return result
}
