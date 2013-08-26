Readable = require('readable-stream').Readable
EventEmitter = require('events').EventEmitter

if window.addEventListener
    window.addEventListener('message', handleMessage)
else
    window.attachEvent('onmessage', handleMessage)

messages = new EventEmitter

handleMessage = (event) ->
    console.log(event)
    try
        pkg = JSON.parse(event.data)
        if typeof pkg.name isnt 'undefined'
            messages.emit(pkg.name, pkg.message)
    catch error
        # If it's not JSON it's not our problem



class LetterBox extends Readable

    constructor: (@name) ->
        super(objectMode: true)

    _read: (size) ->
        messages.on(@name, (data) =>
            if not @push(data) then messages.off(@name)
        )



module.exports = LetterBox