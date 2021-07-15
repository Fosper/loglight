# Toolslight - Simple + Fast + Safe NodeJS tools.

This package was created for simple and fast coding on the NodeJS, with the ability to to super-easy handle errors.

Also, this package uses only native nodejs modules (except `socks-proxy-agent` and `ws`).

## Table of contents
- [Install](#install)
- [Before usage methods 1/2](#before-usage-methods-12)
- [Before usage methods 2/2](#before-usage-methods-22)
- [Methods](#methods)
- [arraysMerge](#toolslightarraysMerge)
- [getDate](#toolslightgetDate)
- [getDayOfMonth](#toolslightgetDayOfMonth)
- [getDayOfWeek](#toolslightgetDayOfWeek)
- [getHash](#toolslightgetHash)
- [getHour](#toolslightgetHour)
- [getMinute](#toolslightgetMinute)
- [getMonth](#toolslightgetMonth)
- [getMyEachIPv4](#toolslightgetMyEachIPv4)
- [getMyEachIPv6](#toolslightgetMyEachIPv6)
- [getMyIPv4](#toolslightgetMyIPv4)
- [getMyIPv6](#toolslightgetMyIPv6)
- [getSecond](#toolslightgetSecond)
- [getTs](#toolslightgetTs)
- [getYear](#toolslightgetYear)
- [httpRequest](#toolslighthttpRequest)
- [isInternetAvailable](#toolslightisInternetAvailable)
- [isPathExists](#toolslightisPathExists)
- [isProxyAvailable](#toolslightisProxyAvailable)
- [jsonToObject](#toolslightjsonToObject)
- [randInt](#toolslightrandInt)
- [sleep](#toolslightsleep)
- [uniqid](#toolslightuniqid)

# Install

In console:
```bash
npm i toolslight
```

In code:
```js
const toolslight = require('toolslight')
```

# Before usage methods 1/2

## All methods return object with three keys:

* data `default: null`
* error `default: null`
* stackTrace `default: []`

When you call any method - you can easy handle errors (if they was).

### For example - call method without errors:

```js
let myCorrectObject = toolslight.jsonToObject('{"name":"Jack"}')
if (myCorrectObject.error) {
    console.log(myCorrectObject.error)
} else {
    console.log(myCorrectObject.data)
}
```

Returns object:
```js
{name: 'Jack'}
```

You can also make `console.log(myCorrectObject.stackTrace)` for show detailed log.

### For example - call method and and we make a error on purpose:

```js
let myIncorrectObject = toolslight.jsonToObject('"name":"Jack"')
if (myIncorrectObject.error) {
    console.log(myIncorrectObject.error)
} else {
    console.log(myIncorrectObject.data)
}
```

Returns object:
```js
{
    code: 'INCORRECT_OPTION_VALUE',
    message: 'toolslight.isProxyAvailable: Error: Incorrect option 'json', value: '"name":"Jack"'. This is not JSONable string.'
}
```

You can also make `console.log(myIncorrectObject.stackTrace)` for show detailed log.

# Before usage methods 2/2

When you call any method - you can select your initiator.
It's convenient to use if you have many childs from `spawn` or `fork`, and you want to know who run some method.

### For example - call method with initiator, and and we make a mistake on purpose:

```js
let myIncorrectObject2 = toolslight.jsonToObject({initiator: 'My child 3', json: '"name":"Jack"'})
if (myIncorrectObject2.error) {
    console.log(myIncorrectObject2.error)
} else {
    console.log(myIncorrectObject2.data)
}
```

Returns object:
```js
{
  code: 'INCORRECT_OPTION_VALUE',
  message: 'My child 3: toolslight.isProxyAvailable: Error: Incorrect option 'json', value: '"name":"Jack"'. This is not JSONable string.'
}
```

You can also make `console.log(myIncorrectObject2.stackTrace)` for show detailed log.

# Methods

If method return promise (you will see it in example) - you can use `await` or `then` to get result.
Don't use `catch`, cause all promises uses only `resolve`.

## toolslight.arraysMerge
Example:
```js
console.log(toolslight.arraysMerge([[123, 456], [456, 789]]).data) // Returns array: [123, 456, 789]
console.log(toolslight.arraysMerge({arrays: [[123, 456], [456, 789]], unique: false}).data) // Returns array: [123, 456, 456, 789]
```

[back to top](#table-of-contents)

## toolslight.getDate
Example:
```js
console.log(toolslight.getDate().data) // Returns string: current date in format YYYY-MM-DD HH:MM:SS
console.log(toolslight.getDate(1605468733).data) // Returns string: 2020-11-15 19:32:13
console.log(toolslight.getDate(1605468733050).data) // Returns string: 2020-11-15 19:32:13
console.log(toolslight.getDate('2020-11-15').data) // Returns string: 2020-11-15 00:00:00
console.log(toolslight.getDate({utc: -1}).data) // Returns string: current date in format YYYY-MM-DD HH:MM:SS
console.log(toolslight.getDate({date: 1605468733, utc: -1}).data) // Returns string: 2020-11-15 18:32:13
console.log(toolslight.getDate({date: 1605468733050, utc: -1}).data) // Returns string: 2020-11-15 18:32:13
console.log(toolslight.getDate({date: '2020-11-15', utc: -1}).data) // Returns string: 2020-11-14 23:00:00
```

[back to top](#table-of-contents)

## toolslight.getDayOfMonth
Example:
```js
console.log(toolslight.getDayOfMonth().data) // Returns number: current day of month
console.log(toolslight.getDayOfMonth(1605468733).data) // Returns number: 15
console.log(toolslight.getDayOfMonth(1605468733050).data) // Returns number: 15
console.log(toolslight.getDayOfMonth('2020-11-15').data) // Returns number: 15
console.log(toolslight.getDayOfMonth({utc: -1}).data) // Returns number: current day of month
console.log(toolslight.getDayOfMonth({date: 1605468733, utc: -1}).data) // Returns number: 15
console.log(toolslight.getDayOfMonth({date: 1605468733050, utc: -1}).data) // Returns number: 15
console.log(toolslight.getDayOfMonth({date: '2020-11-15', utc: -1}).data) // Returns number: 14
```

[back to top](#table-of-contents)

## toolslight.getDayOfWeek
Example:
```js
console.log(toolslight.getDayOfWeek().data) // Returns number: current day of week
console.log(toolslight.getDayOfWeek(1605468733).data) // Returns number: 7
console.log(toolslight.getDayOfWeek(1605468733050).data) // Returns number: 7
console.log(toolslight.getDayOfWeek('2020-11-15').data) // Returns number: 7
console.log(toolslight.getDayOfWeek({utc: -1}).data) // Returns number: current day of week
console.log(toolslight.getDayOfWeek({date: 1605468733, utc: -1}).data) // Returns number: 7
console.log(toolslight.getDayOfWeek({date: 1605468733050, utc: -1}).data) // Returns number: 7
console.log(toolslight.getDayOfWeek({date: '2020-11-15', utc: -1}).data) // Returns number: 6
```

[back to top](#table-of-contents)

## toolslight.getHash
Example (through await):
```js
let hash
hash = await toolslight.getHash('Hi')
console.log(hash.data) // Returns string: 3639efcd08abb273b1619e82e78c29a7df02c1051b1820e99fc395dcaa3326b8
hash = await toolslight.getHash({data: 'Hi', type: 'sha256', format: 'hex'})
console.log(hash.data) // Returns string: 3639efcd08abb273b1619e82e78c29a7df02c1051b1820e99fc395dcaa3326b8
hash = await toolslight.getHash({data: fs.createReadStream('/srv/project/file.txt'), type: 'sha256', format: 'base64'})
console.log(hash.data) // Returns string: base64 encoded file hash
```

Example (through then):
```js
toolslight.getHash('Hi').then((data) => {console.log(data.data)}) // Returns string: 3639efcd08abb273b1619e82e78c29a7df02c1051b1820e99fc395dcaa3326b8
toolslight.getHash({data: 'Hi', type: 'sha256', format: 'hex'}).then((data) => {console.log(data.data)}) // Returns string: 3639efcd08abb273b1619e82e78c29a7df02c1051b1820e99fc395dcaa3326b8
toolslight.getHash({data: fs.createReadStream('/srv/project/file.txt'), type: 'sha256', format: 'base64'}).then((data) => {console.log(data.data)}) // Returns string: base64 encoded file hash
```

[back to top](#table-of-contents)

## toolslight.getHour
Example:
```js
console.log(toolslight.getHour().data) // Returns number: current hour of day (from 0 to 23)
console.log(toolslight.getHour(1605468733).data) // Returns number: 19
console.log(toolslight.getHour(1605468733050).data) // Returns number: 19
console.log(toolslight.getHour('2020-11-15').data) // Returns number: 0
console.log(toolslight.getHour({utc: -1}).data) // Returns number: current hour of day (from 0 to 23)
console.log(toolslight.getHour({date: 1605468733, utc: -1}).data) // Returns number: 18
console.log(toolslight.getHour({date: 1605468733050, utc: -1}).data) // Returns number: 18
console.log(toolslight.getHour({date: '2020-11-15', utc: -1}).data) // Returns number: 23
```

[back to top](#table-of-contents)

## toolslight.getMinute
Example:
```js
console.log(toolslight.getMinute().data) // Returns number: current minute of hour (from 0 to 59)
console.log(toolslight.getMinute(1605468733).data) // Returns number: 32
console.log(toolslight.getMinute(1605468733050).data) // Returns number: 32
console.log(toolslight.getMinute('2020-11-15').data) // Returns number: 0
console.log(toolslight.getMinute({utc: -1}).data) // Returns number: current minute of hour (from 0 to 59)
console.log(toolslight.getMinute({date: 1605468733, utc: -1}).data) // Returns number: 32
console.log(toolslight.getMinute({date: 1605468733050, utc: -1}).data) // Returns number: 32
console.log(toolslight.getMinute({date: '2020-11-15', utc: -1}).data) // Returns number: 0
```

[back to top](#table-of-contents)

## toolslight.getMonth
Example:
```js
console.log(toolslight.getMonth().data) // Returns number: current month (from 1 to 12)
console.log(toolslight.getMonth(1605468733).data) // Returns number: 11
console.log(toolslight.getMonth(1605468733050).data) // Returns number: 11
console.log(toolslight.getMonth('2020-11-15').data) // Returns number: 11
console.log(toolslight.getMonth({utc: -1}).data) // Returns number: current month (from 1 to 12)
console.log(toolslight.getMonth({date: 1605468733, utc: -1}).data) // Returns number: 11
console.log(toolslight.getMonth({date: 1605468733050, utc: -1}).data) // Returns number: 11
console.log(toolslight.getMonth({date: '2020-11-15', utc: -1}).data) // Returns number: 11
```

[back to top](#table-of-contents)

## toolslight.getMyEachIPv4
Example:
```js
console.log(toolslight.getMyEachIPv4().data) // Returns array: array of strings IPv4 for all network interfaces
console.log(toolslight.getMyEachIPv4('ens3').data) // Returns array: array of strings IPv4 for network interface 'ens3'
console.log(toolslight.getMyEachIPv4(['ens3', 'lo']).data) // Returns array: array of strings IPv4 for network interface 'ens3' and 'lo'
```

Description:
Use `console.log(require('os').networkInterfaces())` if you want to show all your network interfaces.

[back to top](#table-of-contents)

## toolslight.getMyEachIPv6
Example:
```js
console.log(toolslight.getMyEachIPv6().data) // Returns array: array of strings IPv6 for all network interfaces
console.log(toolslight.getMyEachIPv6('ens3').data) // Returns array: array of strings IPv6 for network interface 'ens3'
console.log(toolslight.getMyEachIPv6(['ens3', 'lo']).data) // Returns array: array of strings IPv6 for network interface 'ens3' and 'lo'
```

Description:
Use `console.log(require('os').networkInterfaces())` if you want to show all your network interfaces.

[back to top](#table-of-contents)

## toolslight.getMyIPv4
Example:
```js
console.log(toolslight.getMyIPv4().data) // Returns string: last finded IPv4 for all network interfaces
console.log(toolslight.getMyIPv4('ens3').data) // Returns string: last finded IPv4 for network interface 'ens3'
console.log(toolslight.getMyIPv4(['ens3', 'lo']).data) // Returns string: last finded IPv4 for network interface 'ens3' and 'lo'
```

Description:
Use `console.log(require('os').networkInterfaces())` if you want to show all your network interfaces.

[back to top](#table-of-contents)

## toolslight.getMyIPv6
Example:
```js
console.log(toolslight.getMyIPv6().data) // Returns string: last finded IPv6 for all network interfaces
console.log(toolslight.getMyIPv6('ens3').data) // Returns string: last finded IPv6 for network interface 'ens3'
console.log(toolslight.getMyIPv6(['ens3', 'lo']).data) // Returns string: last finded IPv6 for network interface 'ens3' and 'lo'
```

Description:
Use `console.log(require('os').networkInterfaces())` if you want to show all your network interfaces.

[back to top](#table-of-contents)

## toolslight.getSecond
Example:
```js
console.log(toolslight.getSecond().data) // Returns number: current second of minute (from 0 to 59)
console.log(toolslight.getSecond(1605468733).data) // Returns number: 13
console.log(toolslight.getSecond(1605468733050).data) // Returns number: 13
console.log(toolslight.getSecond('2020-11-15').data) // Returns number: 0
console.log(toolslight.getSecond({utc: -1}).data) // Returns number: current second of minute (from 0 to 59)
console.log(toolslight.getSecond({date: 1605468733, utc: -1}).data) // Returns number: 13
console.log(toolslight.getSecond({date: 1605468733050, utc: -1}).data) // Returns number: 13
console.log(toolslight.getSecond({date: '2020-11-15', utc: -1}).data) // Returns number: 0
```

[back to top](#table-of-contents)

## toolslight.getTs
Example:
```js
console.log(toolslight.getTs().data) // Returns number: current timestamp (13 digits)
console.log(toolslight.getTs(1605468733).data) // Returns number: 1605468733000
console.log(toolslight.getTs(1605468733050).data) // Returns number: 1605468733050
console.log(toolslight.getTs('2020-11-15').data) // Returns number: 1605398400000
console.log(toolslight.getTs({utc: -1}).data) // Returns number: current timestamp (13 digits)
console.log(toolslight.getTs({date: 1605468733, utc: -1}).data) // Returns number: 1605468733000
console.log(toolslight.getTs({date: 1605468733050, utc: -1}).data) // Returns number: 1605468733050
console.log(toolslight.getTs({date: '2020-11-15', utc: -1}).data) // Returns number: 1605398400000
```

[back to top](#table-of-contents)

## toolslight.getYear
Example:
```js
console.log(toolslight.getYear().data) // Returns number: current year
console.log(toolslight.getYear(1605468733).data) // Returns number: 2020
console.log(toolslight.getYear(1605468733050).data) // Returns number: 2020
console.log(toolslight.getYear('2020-11-15').data) // Returns number: 2020
console.log(toolslight.getYear({utc: -1}).data) // Returns number: current year
console.log(toolslight.getYear({date: 1605468733, utc: -1}).data) // Returns number: 2020
console.log(toolslight.getYear({date: 1605468733050, utc: -1}).data) // Returns number: 2020
console.log(toolslight.getYear({date: '2020-11-15', utc: -1}).data) // Returns number: 2020
```

[back to top](#table-of-contents)

## toolslight.httpRequest
Example (through await):
```js
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
```

Example (through then):
```js
toolslight.httpRequest({
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
}).then((result) => {console.log(Buffer.from(result.data.response.body, 'binary').toString())}) // Returns string: response body.
```

[back to top](#table-of-contents)

## toolslight.isInternetAvailable
Example (through await):
```js
let isInternetAvailable = await toolslight.isInternetAvailable()
console.log(isInternetAvailable.data) // Returns boolean: is have internet connection
```

Example (through then):
```js
toolslight.isInternetAvailable().then((result) => {console.log(result.data)}) // Returns boolean: is have internet connection
```

[back to top](#table-of-contents)

## toolslight.isPathExists
Example:
```js
console.log(toolslight.isPathExists('/srv/project/file.txt').data) // Returns boolean: is path (directory or file) exists
console.log(toolslight.isPathExists({initiator: 'Parent', file: '/srv/project/file.txt'}).data) // Returns boolean: is path (directory or file) exists
```

[back to top](#table-of-contents)

## toolslight.isProxyAvailable
Example (through await):
```js
let isProxyAvailable = await toolslight.isProxyAvailable({
    protocol: 'https', // Default: 'https'. Can be 'http' or 'https' or 'socks'.
    host: '127.0.0.1', // Default '127.0.0.1'. Proxy host.
    port: 3000, // Default 3000. Proxy port.
    username: 'myUsername', // Default ''. Proxy username. Don't set, if not need.
    password: 'myPassword', // Default ''. Proxy password. Don't set, if not need.
    endpointProtocol: 'https', // Default: 'https'. Can be 'http' or 'https'.
    timeout: 2000 // Default 2000. Timeout in milliseconds.
})
console.log(isProxyAvailable.data) // Returns boolean: is proxy available
```

Example (through then):
```js
toolslight.isProxyAvailable({
    protocol: 'https', // Default: 'https'. Can be 'http' or 'https' or 'socks'.
    host: '127.0.0.1', // Default '127.0.0.1'. Proxy host.
    port: 3000, // Default 3000. Proxy port.
    username: 'myUsername', // Default ''. Proxy username. Don't set, if not need.
    password: 'myPassword', // Default ''. Proxy password. Don't set, if not need.
    endpointProtocol: 'https', // Default: 'https'. Can be 'http' or 'https'.
    timeout: 2000 // Default 2000. Timeout in milliseconds.
}).then((result) => {console.log(result.data)}) // Returns boolean: is proxy available
```

[back to top](#table-of-contents)

## toolslight.jsonToObject
Example:
```js
console.log(toolslight.jsonToObject('{"name":"Jack"}').data) // Returns object: { name: 'Jack' }
```

[back to top](#table-of-contents)

## toolslight.randInt
Example:
```js
console.log(toolslight.randInt().data) // Returns number: from 0 to 1
console.log(toolslight.randInt({from: 1, to: 10}).data) // Returns number: from 1 to 10 (includes 1 and 10)
```

## toolslight.sleep
    Example (through await):
```js
await toolslight.sleep(2000)
console.log('Message after 2 second.')
```

Example (through then):
```js
toolslight.sleep(2000).then(() => {console.log('Message after 2 second.')})
```

[back to top](#table-of-contents)

## toolslight.uniqid
Example:
```js
console.log(toolslight.uniqid().data) // Returns string: random 13 characters with 'a-z' and '0-9'
console.log(toolslight.uniqid(20).data) // Returns string: random 20 characters with 'a-z' and '0-9'
console.log(toolslight.uniqid({
    characterCount: 13,
    letterCase: 'mixed', // Default: 'lower'. Can be 'lower', 'upper', 'mixed'.
    lettersLib: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
    numbersLib: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
    specialLib: ['!', '@', '#', '$', '%', '&', '*', '(', ')', '-', '_', '+', ':', ',', '.', ';', '[', ']', '{', '}', '<', '>'],
    customLib: [],
    lettersEnable: true,
    numbersEnable: true,
    specialEnable: false,
    customEnable: false
}).data) // Returns string: random 13 characters with 'a-z' and '0-9' and 'A-Z'
```

[back to top](#table-of-contents)