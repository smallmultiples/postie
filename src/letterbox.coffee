Readable = require('readable-stream/readable')
EventEmitter = require('events').EventEmitter


messages = new EventEmitter

###
Emit on the messages emitter that all LetterBoxes close over on the channel that
the message is targeted at.
###
handleMessage = (event) ->
    try
        pkg = JSON.parse(event.data)
        if pkg?._postie?
            console.log('emit message')
            messages.emit(pkg._postie.channel, pkg._postie.package)
    catch error
        # If it's not JSON it's not our problem don't handle it here.
        # Common cases where this occurs: analytics, ads.

###
We want to do this once, basically rather than having each letterbox register
their own event listener, just have one that receives and is closed over by all
the letterboxes.
###
if window.addEventListener
    window.addEventListener('message', handleMessage)
else
    window.attachEvent('onmessage', handleMessage)

###
Readable stream that when you start reading from listens to handleMessage and
then pushes anything it gets. If it tries to push and it can't, it stops
listening to the emitter.
###
class LetterBox extends Readable

    ###
    Creates a LetterBox listening to a channel.

    - `channel`: A string which is the channel name we're listening to messages
      on.
    ###
    constructor: (@channel) ->
        super(objectMode: true)

        messages.on(@channel, (data) =>
            if reading
                if not @push(data) then messages.off(@name)
        )

    ###
    Internal read function.
    ###
    _read: (size) ->
        @reading = true

module.exports = LetterBox