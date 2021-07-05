const path = require('path')
const Tgmlight = require('../index.js')

/*
    [Example-1]:

    const tgmlight = require('tgmlight')
    let tgm = new tgmlight
    tgm
    .setBotToken('1234567890:AbCdEfGhIjKlMnOpQrStUvWxYz')
    .setChatId('9876543210')
    .setText('Hello world!')
    .setDocument(fs.createReadStream('/srv/project/file.txt'))
    .setDisableNotification()
    .sendDocument()

    
    [Example-2]:

    const tgmlight = require('tgmlight')
    let tgm = new tgmlight
    tgm.setBotToken('1234567890:AbCdEfGhIjKlMnOpQrStUvWxYz')
    tgm.setMessageType('sendDocument')
    tgm.setChatId('9876543210')
    tgm.setText('Hello world!')
    tgm.setDocument('jgieorg0433gm3gomrgdrgjwofek')
    tgm.setDisableNotification()
    tgm.send()
*/

Tgmlight.prototype.sendDocument = function() {

    let result = ''

    let parameters = [
        'chat_id', // Default: none. Required: yes. Type: Integer or String.
        'document', // Default: none. Required: yes. Type: String.
        'thumb', // Default: none. Required: no. Type: String.
        'caption', // Default: none. Required: no. Type: String.
        'parse_mode', // Default: 'Markdown'. Required: no. Type: String.
        'caption_entities', // Default: none. Required: no. Type: String.
        'disable_content_type_detection', // Default: none. Required: no. Type: String.
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