Readable = require('stream').Readable

class LetterBox extends Readable

    constructor: (@name) ->
        if window.addEventListener
            window.addEventListener('message', @handleMessage)
        else
            window.attachEvent('onmessage', @handleMessage)

    _read: (size) ->


    _handleMessage: (ev) =>
        pkg = JSON.parse(event.data)

module.exports = Letterbox