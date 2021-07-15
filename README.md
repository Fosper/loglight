# loglight
Quickly and easily NodeJS module for save and report any logs.

## Installation
```bash
$ npm i loglight
```

## Quick Start
    1. Create 'log' and 'logTg' in project directory for just for test.
    2. Create test.js in project directory.
    3. Copy code below, paste to test.js, save. Run test.js

```js
const loglight = require('loglight')

let logger = new loglight({
    reportPhrases: ['global test phrase'], // Required: no (optional).
    reportHeader: 'My header for all sources.' // Required: no (optional).
})

logger.setUTC(-3) // Required: no (optional).

logger.addSource('console', {
    name: 'myConsole1', // Required: no (optional).
    reportPhrases: ['console test phrase'], // Required: no (optional).
    reportHeader: 'Custom header for console source.' // Required: no (optional).
})

logger.addSource('file', {
    name: 'myFileSource1', // Required: no (optional).
    reportPhrases: ['file test phrase'], // Required: no (optional).
    reportHeader: 'Custom header for file source.', // Required: no (optional).
    directory: __dirname + '/log' // Required: yes. Path must have existing directory for save log files in this directory.
})

logger.addSource('telegram', {
    name: 'myTelegramSource1', // Required: no (optional).
    reportPhrases: ['telegram test phrase'], // Required: no (optional).
    reportHeader: 'Custom header for telegram source.', // Required: no (optional).
    directory: __dirname + '/logTg', // Required: no. Path must have existing directory for save log files in this directory, if send was unsuccessful.
    botToken: '32145353234:HHFDkgfrsosiDOosgergjdKDFe', // Required: yes.
    channelId: '-1001593045950', // Required: yes.
    message: 'Custom message\nfor message body.' // Required: no (optional).
})

logger
.log('This log will send to all added sources,')
.log('because we use \'report\' function.')
.report()

logger.log('This log will send to all added sources too, cause this text contain \'global test phrase\',')

logger.log('This log will send to console source, cause this text contain \'console test phrase\'.')

logger.log('This log will send to file source, cause this text contain \'file test phrase\'.')

logger.log('This log will send to telegram source, cause this text contain \'telegram test phrase\'.')

logger
.log('And this log didn\'t send to any source, cause we clear all logs by \'clear\' function.')
.clear()

logger
.log('And this log didn\'t send to any source, cause we remove all sources by \'removeSource\'.')
.removeSource('myConsole1')
.removeSource('myFileSource1')
.removeSource('myTelegramSource1')
.report()
```